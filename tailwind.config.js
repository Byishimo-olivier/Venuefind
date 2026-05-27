/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Elegant Eco Luxe Palette
        'primary': '#1B4332',      // Deep Green
        'primary-light': '#74C69D', // Soft Green
        'accent': '#C6A969',        // Gold Accent
        'bg-beige': '#F5F3EF',      // Beige Background
        'bg-cream': '#FAF9F6',      // Cream
        'text': '#2D2D2D',          // Text
      },
    },
  },
  plugins: [],
}
