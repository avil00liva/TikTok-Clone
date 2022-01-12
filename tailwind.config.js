module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
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
