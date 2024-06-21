import { expect, test } from "@playwright/test";

test.describe("Tailwind to CSS Conversion Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
  });

  test("Default Tailwind input is present and correct", async ({ page }) => {
    const textarea = page.locator("textarea:first-of-type");
    await expect(textarea).toHaveValue("bg-red-100 sm:bg-orange-500 lg:bg-red-900");
  });

  [
    {
      tailwind: "sm:bg-blue-500",
      expected: `@media (min-width: 640px) {
  .sm\\:bg-blue-500 { --tw-bg-opacity: 1; background-color: rgb(59 130 246 / var(--tw-bg-opacity)); }
}
`,
    },
    {
      tailwind: "hover:bg-green-500",
      expected: `.hover\\:bg-green-500:hover { --tw-bg-opacity: 1; background-color: rgb(34 197 94 / var(--tw-bg-opacity)); }
`,
    },
    {
      tailwind: "lg:translate-x-1/2 focus:ring-2 focus:ring-blue-500",
      expected: `.focus\\:ring-2:focus { --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color); --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color); box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000); }
.focus\\:ring-blue-500:focus { --tw-ring-opacity: 1; --tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity)); }
`,
    },
    {
      tailwind: "dark:hover:bg-black",
      expected: `@media (prefers-color-scheme: dark) {
  .dark\\:hover\\:bg-black:hover { --tw-bg-opacity: 1; background-color: rgb(0 0 0 / var(--tw-bg-opacity)); }
}
`,
    },
    {
      tailwind: "xl:text-6xl md:text-3xl",
      expected: `@media (min-width: 768px) {
  .md\\:text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
}
@media (min-width: 1280px) {
  .xl\\:text-6xl { font-size: 3.75rem; line-height: 1; }
}
`,
    },
    {
      tailwind: "text-red-300",
      expected: `.text-red-300 { --tw-text-opacity: 1; color: rgb(252 165 165 / var(--tw-text-opacity)); }
`,
    },
    {
      tailwind: "md:bg-red-300 md:bg-red-500 bg-red-300 lg:bg-blue-600",
      expected: `.bg-red-300 { --tw-bg-opacity: 1; background-color: rgb(252 165 165 / var(--tw-bg-opacity)); }
@media (min-width: 768px) {
  .md\\:bg-red-300 { --tw-bg-opacity: 1; background-color: rgb(252 165 165 / var(--tw-bg-opacity)); }
  .md\\:bg-red-500 { --tw-bg-opacity: 1; background-color: rgb(239 68 68 / var(--tw-bg-opacity)); }
}
@media (min-width: 1024px) {
  .lg\\:bg-blue-600 { --tw-bg-opacity: 1; background-color: rgb(37 99 235 / var(--tw-bg-opacity)); }
}
`,
    },
  ].forEach(({ tailwind, expected }) =>
    test(`CSS output is generated correctly for ${tailwind}`, async ({ page }) => {
      const inputArea = page.locator("textarea:first-of-type");
      const outputArea = page.locator("textarea:last-of-type");

      await inputArea.fill(tailwind);
      await page.waitForFunction(
        () => document.querySelector("textarea:last-of-type")?.textContent !== "",
        null,
        { timeout: 2000 },
      );

      const cssOutput = await outputArea.evaluate((node) => "value" in node && node.value);
      expect(cssOutput).toContain(expected);
    }),
  );
});
