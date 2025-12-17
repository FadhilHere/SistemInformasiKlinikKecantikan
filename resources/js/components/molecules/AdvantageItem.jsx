const AdvantageItem = ({ icon, title, description }) => {
  return (
    <article className="flex flex-col gap-2 rounded-3xl bg-white p-6 text-center shadow-card">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-brand">{title}</h3>
      <p className="text-sm text-brand/70">{description}</p>
    </article>
  )
}

export default AdvantageItem
