const ResultCard = ({ title, beforeImage, afterImage }) => {
  return (
    <article className="rounded-3xl bg-white/10 p-4 text-center text-white">
      <div className="grid grid-cols-2 gap-3">
        <img
          src={beforeImage}
          alt={`${title} sebelum`}
          className="h-32 w-full rounded-2xl object-cover"
          loading="lazy"
        />
        <img
          src={afterImage}
          alt={`${title} sesudah`}
          className="h-32 w-full rounded-2xl object-cover"
          loading="lazy"
        />
      </div>
      <p className="mt-3 text-lg font-semibold">{title}</p>
    </article>
  )
}

export default ResultCard
