const statusStyles = {
  active: {
    label: 'Masih Berlaku',
    ribbonGradient: 'linear-gradient(135deg, #56d12a, #1ba64c)',
    tagColor: '#56d12a'
  },
  expired: {
    label: 'Tidak Berlaku',
    ribbonGradient: 'linear-gradient(135deg, #d13c2a, #a61e1e)',
    tagColor: '#d13c2a'
  }
}

const PromoCard = ({
  title,
  description,
  status = 'active',
  expiresOn,
  image
}) => {
  const styles = statusStyles[status]
  const [ribbonLineOne, ...ribbonRest] = styles.label.split(' ')
  const ribbonLineTwo = ribbonRest.join(' ')
  return (
    <article className="relative overflow-hidden rounded-tl-[32px] rounded-br-[32px] rounded-tr-none rounded-bl-none border border-[#f0f0f0] bg-white shadow-[0_26px_48px_rgba(31,31,31,0.12)]">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="h-56 w-full object-cover"
          loading="lazy"
        />
        <div className="pointer-events-none absolute left-0 top-0 h-24 w-24 overflow-hidden rounded-tl-[32px]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: styles.ribbonGradient,
              clipPath: 'polygon(0 0, 100% 0, 0 100%)'
            }}
          />
          <span
            className="absolute left-2 top-4 -rotate-45 text-[11px] font-semibold uppercase leading-3 tracking-[0.1em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
          >
            {ribbonLineOne}
            <br />
            {ribbonLineTwo}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-4 px-6 pb-8 pt-6 text-left">
        <div>
          <h3 className="text-xl font-semibold text-brand">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-brand/80">{description}</p>
        </div>
        <div
          className="inline-flex w-fit items-center rounded-full px-6 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: styles.tagColor }}
        >
          Berlaku Hingga&nbsp;
          <span className="font-bold text-white">{expiresOn}</span>
        </div>
      </div>
    </article>
  )
}

export default PromoCard
