import { createClient } from '@/lib/supabase/client'

export interface Video {
  id: string
  title: string
  description: string
  instructor: string
  duration: string
  category: string
  level: string
  thumbnail_url?: string
  video_url?: string
  created_at: string
  updated_at: string
  is_featured: boolean
  view_count: number
  sort_order: number
}

export interface VideoUpload {
  title: string
  description: string
  instructor: string
  category: string
  level: string
  is_featured?: boolean
  sort_order?: number
}

class AdminService {
  private supabase = createClient()

  // Check if current user is admin (DEMO MODE - any authenticated user is admin)
  async isAdmin(): Promise<boolean> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) return false
    
    // DEMO: Allow any authenticated user to be admin
    return true
    
    // Production check:
    // return user.email === 'admin@doggit.app' || 
    //        user.user_metadata?.role === 'admin'
  }

  // Get all videos
  async getVideos(): Promise<Video[]> {
    const { data, error } = await this.supabase
      .from('videos')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching videos:', error)
      throw error
    }

    return data || []
  }

  // Get single video
  async getVideo(id: string): Promise<Video | null> {
    const { data, error } = await this.supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching video:', error)
      return null
    }

    return data
  }

  // Create new video
  async createVideo(videoData: VideoUpload): Promise<Video | null> {
    const isAdminUser = await this.isAdmin()
    if (!isAdminUser) {
      throw new Error('Unauthorized: Admin access required')
    }

    const { data: { user } } = await this.supabase.auth.getUser()
    
    const { data, error } = await this.supabase
      .from('videos')
      .insert([
        {
          ...videoData,
          created_by: user?.id,
          sort_order: videoData.sort_order || 999
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating video:', error)
      throw error
    }

    return data
  }

  // Update video
  async updateVideo(id: string, videoData: Partial<VideoUpload>): Promise<Video | null> {
    const isAdminUser = await this.isAdmin()
    if (!isAdminUser) {
      throw new Error('Unauthorized: Admin access required')
    }

    const { data, error } = await this.supabase
      .from('videos')
      .update(videoData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating video:', error)
      throw error
    }

    return data
  }

  // Delete video
  async deleteVideo(id: string): Promise<boolean> {
    const isAdminUser = await this.isAdmin()
    if (!isAdminUser) {
      throw new Error('Unauthorized: Admin access required')
    }

    // Delete associated files first
    const video = await this.getVideo(id)
    if (video) {
      if (video.video_url) {
        await this.deleteFile('videos', video.video_url)
      }
      if (video.thumbnail_url) {
        await this.deleteFile('thumbnails', video.thumbnail_url)
      }
    }

    const { error } = await this.supabase
      .from('videos')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting video:', error)
      throw error
    }

    return true
  }

  // Upload video file
  async uploadVideo(file: File, videoId: string): Promise<string | null> {
    const isAdminUser = await this.isAdmin()
    if (!isAdminUser) {
      throw new Error('Unauthorized: Admin access required')
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${videoId}.${fileExt}`
    const filePath = `videos/${fileName}`

    const { data, error } = await this.supabase.storage
      .from('videos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) {
      console.error('Error uploading video:', error)
      throw error
    }

    // Get public URL
    const { data: { publicUrl } } = this.supabase.storage
      .from('videos')
      .getPublicUrl(filePath)

    return publicUrl
  }

  // Upload thumbnail
  async uploadThumbnail(file: File, videoId: string): Promise<string | null> {
    const isAdminUser = await this.isAdmin()
    if (!isAdminUser) {
      throw new Error('Unauthorized: Admin access required')
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${videoId}.${fileExt}`
    const filePath = `thumbnails/${fileName}`

    const { data, error } = await this.supabase.storage
      .from('videos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) {
      console.error('Error uploading thumbnail:', error)
      throw error
    }

    // Get public URL
    const { data: { publicUrl } } = this.supabase.storage
      .from('videos')
      .getPublicUrl(filePath)

    return publicUrl
  }

  // Delete file from storage
  async deleteFile(bucket: string, path: string): Promise<boolean> {
    const { error } = await this.supabase.storage
      .from('videos')
      .remove([path])

    if (error) {
      console.error('Error deleting file:', error)
      return false
    }

    return true
  }

  // Get video categories
  async getCategories(): Promise<{ name: string, description: string }[]> {
    const { data, error } = await this.supabase
      .from('video_categories')
      .select('name, description')
      .order('sort_order')

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    return data || []
  }

  // Get instructors
  async getInstructors(): Promise<{ name: string, bio: string }[]> {
    const { data, error } = await this.supabase
      .from('instructors')
      .select('name, bio')
      .order('name')

    if (error) {
      console.error('Error fetching instructors:', error)
      return []
    }

    return data || []
  }

  // Update video URLs after file upload
  async updateVideoUrls(videoId: string, videoUrl?: string, thumbnailUrl?: string): Promise<boolean> {
    const updateData: any = {}
    
    if (videoUrl) updateData.video_url = videoUrl
    if (thumbnailUrl) updateData.thumbnail_url = thumbnailUrl

    if (Object.keys(updateData).length === 0) return true

    const { error } = await this.supabase
      .from('videos')
      .update(updateData)
      .eq('id', videoId)

    if (error) {
      console.error('Error updating video URLs:', error)
      return false
    }

    return true
  }

  // Track video view
  async trackVideoView(videoId: string, watchDuration?: number, completed = false): Promise<boolean> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) return false

    const { error } = await this.supabase
      .from('video_views')
      .insert([
        {
          video_id: videoId,
          user_id: user.id,
          watch_duration: watchDuration,
          completed: completed
        }
      ])

    if (error) {
      console.error('Error tracking video view:', error)
      return false
    }

    return true
  }

  // Get analytics data
  async getAnalytics(): Promise<{
    totalVideos: number
    totalViews: number
    featuredVideos: number
    totalInstructors: number
    topVideos: { title: string, view_count: number }[]
  }> {
    // Get basic stats
    const { data: videos } = await this.supabase
      .from('videos')
      .select('view_count, is_featured, instructor')

    if (!videos) {
      return {
        totalVideos: 0,
        totalViews: 0,
        featuredVideos: 0,
        totalInstructors: 0,
        topVideos: []
      }
    }

    // Get top videos
    const { data: topVideos } = await this.supabase
      .from('videos')
      .select('title, view_count')
      .order('view_count', { ascending: false })
      .limit(5)

    return {
      totalVideos: videos.length,
      totalViews: videos.reduce((sum, v) => sum + (v.view_count || 0), 0),
      featuredVideos: videos.filter(v => v.is_featured).length,
      totalInstructors: new Set(videos.map(v => v.instructor)).size,
      topVideos: topVideos || []
    }
  }
}

export const adminService = new AdminService()