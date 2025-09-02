"use client"

interface VimeoPlayerProps {
  videoId: string
  title?: string
  className?: string
}

export function VimeoPlayer({ 
  videoId, 
  title = "Video",
  className = ""
}: VimeoPlayerProps) {
  return (
    <div 
      className={`relative w-full ${className}`}
      style={{ paddingTop: '56.25%' }} // 16:9 aspect ratio
    >
      <iframe
        src={`https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0&t=${Date.now()}`}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
        title={title}
      />
    </div>
  )
}