import { expect, test } from "@playwright/test";
import { placeholderFormattedCssCode, placeholderTailwindCode } from "../src/placeholders";

test.describe("Tailwind to CSS Conversion Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
  });

  test.beforeEach(async ({ page }) => {
    // Wait for monaco to load
    await page.waitForSelector(".monaco-editor");
  });

  test(`Initial placeholders are loading`, async ({ page }) => {
    const inputArea = page.getByTestId("tailwind-editor").nth(0);
    const inputText = await inputArea.innerText();
    expect(normalizeString(inputText)).toBe(normalizeString(placeholderTailwindCode));

    const outputArea = page.getByTestId("css-editor").nth(0);
    const outputText = await outputArea.innerText();
    expect(normalizeString(outputText)).toBe(normalizeString(placeholderFormattedCssCode));
  });

  [
    {
      tailwind: "sm:bg-blue-500",
      expected: `@media (min-width: 640px) {
                  .sm\\:bg-blue-500 {
                    --tw-bg-opacity: 1;
                    background-color: rgb(59 130 246 / var(--tw-bg-opacity));
                  }
                }`,
    },
    {
      tailwind: "hover:bg-green-500",
      expected: `.hover\\:bg-green-500:hover {
                    --tw-bg-opacity: 1;
                    background-color: rgb(34 197 94 / var(--tw-bg-opacity));
                  }`,
    },
    {
      tailwind: "focus:ring-2 focus:ring-blue-500",
      expected: `.focus\\:ring-2:focus {
                  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
                  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
                  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
                }

                .focus\\:ring-blue-500:focus {
                  --tw-ring-opacity: 1;
                  --tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity));
                }`,
    },
    {
      tailwind: "dark:hover:bg-black",
      expected: `@media (prefers-color-scheme: dark) {
                  .dark\\:hover\\:bg-black:hover {
                    --tw-bg-opacity: 1;
                    background-color: rgb(0 0 0 / var(--tw-bg-opacity));
                  }
                }`,
    },
    {
      tailwind: "xl:text-6xl md:text-3xl",
      expected: `@media (min-width: 768px) {
                  .md\\:text-3xl {
                    font-size: 1.875rem;
                    line-height: 2.25rem;
                  }
                }

                @media (min-width: 1280px) {
                  .xl\\:text-6xl {
                    font-size: 3.75rem;
                    line-height: 1;
                  }
                }`,
    },
    {
      tailwind: "text-red-300",
      expected: `.text-red-300 {
                    --tw-text-opacity: 1;
                    color: rgb(252 165 165 / var(--tw-text-opacity));
                  }`,
    },
    {
      tailwind: "md:bg-red-300 md:bg-red-500 bg-red-300 lg:bg-blue-600",
      expected: `.bg-red-300 {
                    --tw-bg-opacity: 1;
                    background-color: rgb(252 165 165 / var(--tw-bg-opacity));
                  }

                  @media (min-width: 768px) {
                    .md\\:bg-red-300 {
                      --tw-bg-opacity: 1;
                      background-color: rgb(252 165 165 / var(--tw-bg-opacity));
                    }

                    .md\\:bg-red-500 {
                      --tw-bg-opacity: 1;
                      background-color: rgb(239 68 68 / var(--tw-bg-opacity));
                    }
                  }

                  @media (min-width: 1024px) {
                    .lg\\:bg-blue-600 {
                      --tw-bg-opacity: 1;
                      background-color: rgb(37 99 235 / var(--tw-bg-opacity));
                    }
                  }`,
    },
  ].forEach(({ tailwind, expected }) =>
    test(`CSS output is generated correctly for ${tailwind}`, async ({ page }) => {
      // Enter tailwind classes
      const inputArea = page.getByTestId("tailwind-editor").nth(0);
      await inputArea.click();
      await page.keyboard.press("ControlOrMeta+KeyA");
      await page.keyboard.type(tailwind);

      // Wait for conversion to complete
      await page.waitForTimeout(500);

      // Check the output
      const outputArea = page.getByTestId("css-editor").nth(0);
      const cssOutput = await outputArea.innerText();
      expect(normalizeString(cssOutput)).toBe(normalizeString(expected));
    }),
  );
});

// Normalisation removes whitespaces and newlines
const normalizeString = (str: string) => str.replace(/\s+/g, "");
