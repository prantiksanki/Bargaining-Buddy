/** @type {import('tailwindcss').Config} */
export default {
  // Specifies the files Tailwind should scan for class names
  content: [
    "./index.html",// Main HTML entry point
    "./src/**/*.{js,ts,jsx,tsx}",// All JS/TS/React files in the src folder
  ],
  theme: {
    // Use `extend` to add custom styles without overriding the default Tailwind theme
    extend: {
      // You can add custom colors, spacing, fonts, etc. here
    },
  },
  // Array of Tailwind CSS plugins to use (e.g., forms, typography, aspect-ratio)
  plugins: [],
}

