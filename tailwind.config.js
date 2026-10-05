module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: require("./src/theme/colors.json"),
      fontFamily: {
        sans: ["Figtree_400Regular"],
        "sans-medium": ["Figtree_500Medium"],
        "sans-semibold": ["Figtree_600SemiBold"],
        "sans-bold": ["Figtree_700Bold"],
      },
      fontSize: {
        display: ["35px", { lineHeight: "42px" }],
        "title-lg": ["32px", { lineHeight: "38px" }],
        title: ["30px", { lineHeight: "36px" }],
        "section-title": ["24px", { lineHeight: "30px" }],
        heading: ["21px", { lineHeight: "28px" }],
        nav: ["19px", { lineHeight: "24px" }],
        lead: ["18px", { lineHeight: "26px" }],
        row: ["18px", { lineHeight: "24px" }],
        button: ["18px", { lineHeight: "24px" }],
        body: ["17px", { lineHeight: "25px" }],
        secondary: ["16px", { lineHeight: "22px" }],
        hint: ["15px", { lineHeight: "21px" }],
        meta: ["14px", { lineHeight: "20px" }],
        caption: ["13px", { lineHeight: "18px" }],
        chip: ["13px", { lineHeight: "16px" }],
      },
    },
  },
  plugins: [],
};
