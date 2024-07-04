export const placeholderTailwindCode = "bg-red-100 sm:bg-orange-500 lg:bg-red-900";
export const placeholderFormattedCssCode = `.bg-red-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 226 226 / var(--tw-bg-opacity));
}

@media (min-width: 640px) {
  .sm\\:bg-orange-500 {
    --tw-bg-opacity: 1;
    background-color: rgb(249 115 22 / var(--tw-bg-opacity));
  }
}

@media (min-width: 1024px) {
  .lg\\:bg-red-900 {
    --tw-bg-opacity: 1;
    background-color: rgb(127 29 29 / var(--tw-bg-opacity));
  }
}
`;

export const placeholderTailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clifford: '#da373d',
      }
    }
  },
  plugins: [],
};
`;
