/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          DEFAULT: '#C85C3D',
          50: '#F9E4DE',
          100: '#F5D3CA',
          200: '#EDB2A2',
          300: '#E5917A',
          400: '#DD7052',
          500: '#C85C3D',
          600: '#A04831',
          700: '#783525',
          800: '#502319',
          900: '#28110D'
        }
      }
    },
  },
  plugins: [],
}