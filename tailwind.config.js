/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'navy-dark': '#0B1437',
        'navy-card': '#111C44',
        'navy-light': '#1A2332',
        'electric-blue': '#0075FF',
        'cyan-accent': '#4FD1C5',
        'text-primary-dark': '#FFFFFF',
        'text-secondary-dark': '#A0AEC0',
        'text-primary-light': '#2D3748',
        'text-secondary-light': '#718096',
        'success': '#48BB78',
        'error': '#F56565',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


