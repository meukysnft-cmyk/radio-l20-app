export function YouTubeEmbed({ videoId, title }: { videoId: string; title?: string }) {
  if (!videoId) return null

  return (
    <div className="youtube-embed">
      <div className="youtube-embed-wrapper">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`}
          title={title || 'YouTube Live'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  )
}
