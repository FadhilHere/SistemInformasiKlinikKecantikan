const ResultCard = ({ title, beforeImage, afterImage }) => {
  const fallbackImage =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='200'><rect width='100%25' height='100%25' fill='%23e2e8f0'/><text x='50%25' y='50%25' font-size='16' fill='%2394a3b8' text-anchor='middle' dominant-baseline='middle'>Image%20Unavailable</text></svg>"

  return (
    <article className="w-full bg-transparent">
      <div className="flex gap-1">
        <div className="relative flex-1">
          <span className="absolute left-2 top-2 rounded bg-black/50 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">Before</span>
          <img
            src={beforeImage}
            alt={`${title} sebelum`}
            className="h-40 w-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = fallbackImage
            }}
          />
        </div>
        <div className="relative flex-1">
          <span className="absolute right-2 top-2 rounded bg-black/50 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">After</span>
          <img
            src={afterImage}
            alt={`${title} sesudah`}
            className="h-40 w-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = fallbackImage
            }}
          />
        </div>
      </div>
      <div className="bg-[#8cc63f]/90 py-3 text-center text-lg font-bold text-white">
        {title}
      </div>
    </article>
  )
}

export default ResultCard
