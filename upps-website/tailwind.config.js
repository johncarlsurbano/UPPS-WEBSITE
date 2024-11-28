/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yellow: "#f4b312",
        navy: "#29176d",
        uppslink: "#0066FF",
        gray:"#E0E0E0",
        green:"#2A8302",
        darkblue:"#29176d",
        uppsyellow: "#f4b312",
        uppsdarkblue: "#29176d"
      }

    },
  },
  plugins: [],
}

