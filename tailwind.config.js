/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "sui-blue": "#4F46E5",
        "sui-dark": "#1F2937",
        "sui-gray": "#6B7280",
        "sui-light": "#F9FAFB",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
