const ResultCard = ({ title, beforeImage, afterImage }) => {
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
           />
        </div>
        <div className="relative flex-1">
           <span className="absolute right-2 top-2 rounded bg-black/50 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">After</span>
           <img 
            src={afterImage} 
            alt={`${title} sesudah`} 
            className="h-40 w-full object-cover"
            loading="lazy"
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
