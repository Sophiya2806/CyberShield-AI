/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-bg': '#050816',
        'cyber-primary': '#22C55E',
        'cyber-critical': '#EF4444',
        'cyber-warning': '#F59E0B',
        'cyber-blue': '#3B82F6'
      }
    },
  },
  plugins: [],
}
