// tailwind.config.js
const {heroui} = require("@beweco/aurora-ui");
const { themeColors } = require("@beweco/aurora-ui");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@beweco/aurora-ui/dist/**/*.{js,ts,jsx,tsx}",
		"./node_modules/@beweco/aurora-ui/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
		extend: {
			screens: {
				xs: "320px",
				sm: "640px",
				md: "768px",
				lg: "1024px",
				xl: "1280px",
				"2xl": "1536px",
			},
			// Animación personalizada para gradiente animado
			keyframes: {
				gradient: {
					"0%": { backgroundPosition: "0% 50%" },
					"50%": { backgroundPosition: "100% 50%" },
					"100%": { backgroundPosition: "0% 50%" },
				},
			},
			animation: {
				gradient: "gradient 10s ease infinite",
			},
			backgroundSize: {
				"gradient-animated": "400% 400%",
			},
		},
	},
  darkMode: "class",
  plugins: [
		heroui({ themes: themeColors }),
	],
};