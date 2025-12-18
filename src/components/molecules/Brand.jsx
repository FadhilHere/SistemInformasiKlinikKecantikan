import { Link } from 'react-router-dom'
import LogoIcon from '../atoms/LogoIcon'

const Brand = () => {
  return (
    <Link
      to="/"
      className="flex items-center gap-3 rounded-2xl border border-transparent bg-transparent px-2 py-1 text-left transition hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/60"
    >
      <LogoIcon size={52} />
      <div className="flex flex-col leading-tight">
        <span className="text-[28px] font-semibold text-brand">mische</span>
        <span className="text-[11px] tracking-[0.4em] text-brand/60">
          AESTHETIC CLINIC
        </span>
      </div>
    </Link>
  )
}

export default Brand
