/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#3b82f6", // blue-500
          dark: "#1e3a8a",
        },
        background: {
          light: "#ffffff",
          dark: "#0f172a", // slate-900
        },
        sidebar: {
          light: "#f8fafc", // slate-50
          dark: "#1e293b",  // slate-800
        },
      }
    }
  },
  plugins: []
}

