module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#2563EB", soft: "#EFF4FF" },
        ink: "#101828",
        muted: "#667085",
        line: "#EAECF0",
        danger: { DEFAULT: "#D92D20", soft: "#FEF3F2" },
      },
      fontFamily: {
        sans: ["Figtree_400Regular"],
        medium: ["Figtree_500Medium"],
        semibold: ["Figtree_600SemiBold"],
        bold: ["Figtree_700Bold"],
      },
    },
  },
  plugins: [],
};
