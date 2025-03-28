// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1DB954",
        "player-bg": "rgba(32, 32, 32, 0.95)",
      },
      backdropBlur: {
        player: "12px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
