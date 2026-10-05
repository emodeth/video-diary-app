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
        "sans-medium": ["Figtree_500Medium"],
        "sans-semibold": ["Figtree_600SemiBold"],
        "sans-bold": ["Figtree_700Bold"],
      },
      fontSize: {
        display: ["36px", { lineHeight: "42px" }],
        "title-lg": ["32px", { lineHeight: "38px" }],
        title: ["30px", { lineHeight: "36px" }],
        heading: ["21px", { lineHeight: "28px" }],
        nav: ["19px", { lineHeight: "24px" }],
        lead: ["18px", { lineHeight: "26px" }],
        row: ["18px", { lineHeight: "24px" }],
        button: ["18px", { lineHeight: "24px" }],
        body: ["17px", { lineHeight: "25px" }],
        secondary: ["16px", { lineHeight: "22px" }],
        hint: ["15px", { lineHeight: "21px" }],
        meta: ["14px", { lineHeight: "20px" }],
        chip: ["13px", { lineHeight: "16px" }],
      },
    },
  },
  plugins: [],
};
