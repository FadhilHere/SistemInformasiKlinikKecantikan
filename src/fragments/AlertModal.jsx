import React from 'react'

const VARIANT_STYLES = {
  success: {
    iconBg: 'bg-green-100',
    iconText: 'text-green-600',
    button: 'bg-primary hover:bg-primary-dark text-white'
  },
  error: {
    iconBg: 'bg-red-100',
    iconText: 'text-red-600',
    button: 'bg-red-600 hover:bg-red-700 text-white'
  },
  warning: {
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-600',
    button: 'bg-amber-500 hover:bg-amber-600 text-white'
  },
  info: {
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
    button: 'bg-blue-600 hover:bg-blue-700 text-white'
  }
}

const AlertModal = ({
  isOpen,
  title,
  message,
  variant = 'info',
  confirmLabel = 'OK',
  onClose
}) => {
  if (!isOpen) return null

  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.info

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden m-4 p-8 flex flex-col items-center text-center">
        <div className={`w-16 h-16 rounded-full ${styles.iconBg} flex items-center justify-center mb-4 ${styles.iconText}`}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {variant === 'success' ? (
              <path d="M20 6L9 17l-5-5"></path>
            ) : variant === 'warning' ? (
              <>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </>
            ) : variant === 'error' ? (
              <>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </>
            ) : (
              <>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </>
            )}
          </svg>
        </div>

        {title && <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>}
        {message && <p className="text-sm text-gray-600 mb-6">{message}</p>}

        <button
          onClick={onClose}
          className={`min-w-[120px] py-3 px-6 rounded-lg font-medium transition-colors ${styles.button}`}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  )
}

export default AlertModal
