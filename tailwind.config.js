/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#121721',
          800: '#1c2331',
          700: '#2a334a',
          600: '#3c4661',
          500: '#4e5a78',
          400: '#7d89a1',
          300: '#a2acbe',
          200: '#c7ceda',
          100: '#e9ebf0',
        },
        blue: {
          900: '#0e3e7b',
          800: '#0e4c96',
          700: '#0e5bac',
          600: '#0e6dc3',
          500: '#1a82e2',
          400: '#3998f0',
          300: '#65b0f6',
          200: '#9ecffa',
          100: '#d7eafd',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};