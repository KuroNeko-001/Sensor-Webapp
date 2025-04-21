export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'green-10': 'rgba(144, 253, 117, 1)',
        'green-20': 'rgba(62, 164, 37, 1)',

        'blue-10': 'rgba(246, 247, 248, 1)',
      },
      fontFamily: {
        'kanit': ['Kanit', 'sans-serif'],
      },
    },
  },
  plugins: [],
  
}