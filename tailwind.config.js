/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./public/shared/*.{js,ts,jsx,tsx}",
    "./public/shared/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.{js,ts,jsx,tsx}",
    "./public/Icons/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background:
          "bg-gradient-to-r from-[#C8EFF1] via-[#B3D2E9] to-[#B9E4A7]",
        menubar: "#181818",
        card: "#212121",
        "secondary-text": "#B3B3B3",
        "primary-text": "#FFFFFF",
        "gray-dark": "#273444",
        gray: "#8492a6",
        "gray-light": "#d3dce6",
        accent: "#FE214B",
      },
      animation: {
        "move-down-0": "movefrom0to1 0.2s linear infinite",
        "move-down-1": "movefrom1to2 0.2s linear infinite",
        "move-down-2": "movefrom2to3 0.2s linear infinite",
        "move-down-3": "movefrom3to4 0.2s linear infinite",
        "move-down-4": "movefrom4to5 0.2s linear infinite",
        "move-down-5": "movefrom5to6 0.2s linear infinite",
        "move-down-6": "movefrom6to7 0.2s linear infinite",
        "move-down-7": "movefrom7to8 0.2s linear infinite",
        "slow-move-down-0": "movefrom0to1 0.5s linear infinite",
        "slow-move-down-1": "movefrom1to2 0.5s linear infinite",
        "slow-move-down-2": "movefrom2to3 0.5s linear infinite",
        "slow-move-down-3": "movefrom3to4 0.5s linear infinite",
        "slow-move-down-4": "movefrom4to5 0.5s linear infinite",
        "slow-move-down-5": "movefrom5to6 0.5s linear infinite",
        "slow-move-down-6": "movefrom6to7 0.5s linear infinite",
        "slow-move-down-7": "movefrom7to8 0.5s linear infinite",
      },
      keyframes: {
        movefrom0to1: {
          "0%": { zIndex: 6 },
          "100%": { zIndex: 7, transform: "translateY(-110px) scale(0.85)" },
        },
        movefrom1to2: {
          "0%": { zIndex: 7 },
          "100%": { zIndex: 8, transform: "translateY(-90px) scale(0.9)" },
        },
        movefrom2to3: {
          "0%": { zIndex: 8 },
          "100%": { zIndex: 9, transform: "translateY(-55px) scale(0.95)" },
        },
        movefrom3to4: {
          "0%": { zIndex: 9 },
          "100%": { zIndex: 10, transform: "translateY(0px) scale(1)" },
        },
        movefrom4to5: {
          "0%": { zIndex: 10 },
          "100%": { zIndex: 9, transform: "translateY(55px) scale(0.95)" },
        },
        movefrom5to6: {
          "0%": { zIndex: 9 },
          "100%": { zIndex: 8, transform: "translateY(90px) scale(0.9)" },
        },
        movefrom6to7: {
          "0%": { zIndex: 8 },
          "100%": { zIndex: 7, transform: "translateY(110px) scale(0.85)" },
        },
        movefrom7to8: {
          "0%": { zIndex: 7 },
          "100%": { zIndex: 6, transform: "translateY(120px) scale(0.8)" },
        }
      },
    },
  },
  safelist: [
    "text-[16px]",
    "text-[20px]",
    "text-[24px]",
    "text-[32px]",
    "text-[36px]",
  ],
  plugins: [require("tailwind-scrollbar-hide")],
};
