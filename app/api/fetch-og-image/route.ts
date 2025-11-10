import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const url = searchParams.get('url')

    if (!url) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 })
    }

    // Fetch the webpage
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DOGGIT/1.0; +https://doggit.app)'
      }
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch URL' }, { status: 500 })
    }

    const html = await response.text()

    // Extract og:image using regex
    const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i)
    const ogImageContent = ogImageMatch ? ogImageMatch[1] : null

    // If no og:image with property, try name attribute
    const ogImageNameMatch = html.match(/<meta[^>]*name=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i)
    const ogImageName = ogImageNameMatch ? ogImageNameMatch[1] : null

    // Try twitter:image as fallback
    const twitterImageMatch = html.match(/<meta[^>]*(?:property|name)=["']twitter:image["'][^>]*content=["']([^"']+)["'][^>]*>/i)
    const twitterImage = twitterImageMatch ? twitterImageMatch[1] : null

    const imageUrl = ogImageContent || ogImageName || twitterImage

    // Extract tags/keywords
    const keywordsMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["'][^>]*>/i)
    const keywords = keywordsMatch ? keywordsMatch[1] : null

    // Try article:tag (multiple tags possible)
    const articleTagMatches = html.matchAll(/<meta[^>]*property=["']article:tag["'][^>]*content=["']([^"']+)["'][^>]*>/gi)
    const articleTags = Array.from(articleTagMatches, m => m[1])

    // Try news_keywords as fallback
    const newsKeywordsMatch = html.match(/<meta[^>]*name=["']news_keywords["'][^>]*content=["']([^"']+)["'][^>]*>/i)
    const newsKeywords = newsKeywordsMatch ? newsKeywordsMatch[1] : null

    // Combine all tags
    let tags: string[] = []

    if (articleTags.length > 0) {
      tags = articleTags
    } else if (keywords) {
      // Split by comma and clean up
      tags = keywords.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    } else if (newsKeywords) {
      tags = newsKeywords.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    }

    // Extract publication date
    const articlePublishedMatch = html.match(/<meta[^>]*property=["']article:published_time["'][^>]*content=["']([^"']+)["'][^>]*>/i)
    const articlePublished = articlePublishedMatch ? articlePublishedMatch[1] : null

    const publishedTimeMatch = html.match(/<meta[^>]*property=["']og:published_time["'][^>]*content=["']([^"']+)["'][^>]*>/i)
    const publishedTime = publishedTimeMatch ? publishedTimeMatch[1] : null

    const datePublishedMatch = html.match(/<meta[^>]*(?:property|name)=["']datePublished["'][^>]*content=["']([^"']+)["'][^>]*>/i)
    const datePublished = datePublishedMatch ? datePublishedMatch[1] : null

    const publishDateMatch = html.match(/<meta[^>]*name=["']publish_date["'][^>]*content=["']([^"']+)["'][^>]*>/i)
    const publishDate = publishDateMatch ? publishDateMatch[1] : null

    // Get the first available date
    const rawDate = articlePublished || publishedTime || datePublished || publishDate

    // Parse and format date to YYYY-MM-DD
    let formattedDate: string | null = null
    if (rawDate) {
      try {
        const date = new Date(rawDate)
        if (!isNaN(date.getTime())) {
          formattedDate = date.toISOString().split('T')[0]
        }
      } catch (error) {
        console.error('Error parsing date:', error)
      }
    }

    return NextResponse.json({
      imageUrl: imageUrl || null,
      tags: tags.length > 0 ? tags : null,
      publishedDate: formattedDate
    })
  } catch (error) {
    console.error('Error fetching OG image:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
