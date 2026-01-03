/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#f7f5ed',
        primary: {
          DEFAULT: '#53c41a',
          dark: '#2f7f00'
        },
        brand: '#1b1b1b'
      },
      fontFamily: {
        sans: ['Poppins', 'Segoe UI', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        card: '0 30px 60px rgba(146, 146, 146, 0.2)',
        navbar: '0 6px 18px rgba(0, 0, 0, 0.06)',
        button: '0 8px 14px rgba(83, 196, 26, 0.3)'
      }
    }
  },
  plugins: []
}
