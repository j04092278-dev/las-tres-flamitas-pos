/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'flamita-red': '#F51515',
        'flamita-dark-red': '#AB1211',
        'flamita-bg': '#0E0E0E',
        'flamita-card': '#1A1A1A',
        'flamita-border': '#2A2A2A',
      },
      fontFamily: {
        titles: ['Bitter', 'serif'],
        subtitles: ['"Baloo Thambi 2"', 'cursive'],
      },
    },
  },
  plugins: [],
};