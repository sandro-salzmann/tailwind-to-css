export const findTailwindCSSStyleSheet = () => {
  const styleTags = document.querySelectorAll("style");
  const tailwindStyleStartText = "/* ! tailwindcss v";

  for (const style of styleTags) {
    if (style.textContent?.startsWith(tailwindStyleStartText)) {
      return style.sheet;
    }
  }

  return null;
};
