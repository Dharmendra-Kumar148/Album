/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",                // Tailwind will scan your main HTML file
    "./src/**/*.{js,jsx}",         // Tailwind will scan all JS and JSX files in src/
  ],
  theme: {
    extend: {},                    // You can customize or extend Tailwind’s default theme here
  },
  plugins: [],                     // You can add official or custom Tailwind plugins here
}
