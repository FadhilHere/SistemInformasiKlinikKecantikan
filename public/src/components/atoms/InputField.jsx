import { useId, useState } from 'react'
import EyeIcon from './icons/EyeIcon'

const InputField = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  allowToggle = false
}) => {
  const id = useId()
  const [isVisible, setIsVisible] = useState(false)
  const resolvedType = allowToggle ? (isVisible ? 'text' : 'password') : type

  return (
    <label
      className="flex flex-col gap-2 text-[15px] font-medium text-brand/80"
      htmlFor={id}
    >
      <span>{label}</span>
      <div className="relative">
        <input
          id={id}
          className="w-full rounded-2xl border-2 border-brand px-4 py-3 text-base text-brand placeholder:text-brand/40 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
          type={resolvedType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
        />

        {allowToggle && (
          <button
            type="button"
            onClick={() => setIsVisible((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brand/40 transition hover:text-brand/70"
            aria-label={isVisible ? 'Sembunyikan password' : 'Tampilkan password'}
          >
            <EyeIcon open={isVisible} />
          </button>
        )}
      </div>
    </label>
  )
}

export default InputField
