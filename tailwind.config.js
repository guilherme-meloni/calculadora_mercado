/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{svelte,js}'],
  theme: {
    extend: {
      colors: {
        'bg-main': '#FFF8F5',
        'surface': '#FFFFFF',
        'brand-primary': '#DE6B87',
        'brand-primary-hover': '#C2546E',
        'brand-secondary': '#FDF2F4',
        'text-main': '#4A3B3D',
        'text-muted': '#988488',
        'border-soft': '#F0E5E7',
        'success': '#8BB981',
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '32px',
      },
      boxShadow: {
        soft: '0 4px 20px rgba(222, 107, 135, 0.06)',
      },
    },
  },
  plugins: [],
}
