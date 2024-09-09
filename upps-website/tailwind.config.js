/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        uppsyellow: "#f4b312",
        uppsdarkblue: "#29176d"
      }

    },
  },
  plugins: [],
}

