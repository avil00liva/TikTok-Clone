module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  mode: 'jit',
  theme: {
    screens: {
      'quini': '490px',
      'tablet': '640px',
      'laptop': '1024px',
      'desktop': '1280px',
    },
    extend: {
      animation: {
        'spin-add': 'spin 1s linear infinite',
      },
      keyframes: {
        spin:{
          from: {
              transform: "rotate(0deg)"
          },
          to: {
              transform: "rotate(360deg)"
          }
        }
    }
    },
  },
  plugins: [],
}
