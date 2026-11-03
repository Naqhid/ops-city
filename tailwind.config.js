/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#10233f',
        navy: '#142a4a',
        sky: '#4d9cf6',
        mint: '#2bb673',
        lavender: '#f4f2fb'
      },
      boxShadow: {
        soft: '0 12px 35px rgba(20,42,74,.08)'
      }
    }
  },
  plugins: []
}