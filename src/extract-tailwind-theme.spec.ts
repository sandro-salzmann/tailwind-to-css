import { describe, expect, it } from "vitest";
import { extractTailwindTheme } from "./extract-tailwind-theme";

const tailwindConfigs = [
  {
    name: "config in tailwind.config.js",
    rawConfig: `
      /** @type {import('tailwindcss').Config} */
      module.exports = {
        content: ['./src/**/*.{html,js}'],
        theme: {
          colors: {
            'blue': '#1fb6ff',
          },
          fontFamily: {
            sans: ['Graphik', 'sans-serif'],
          },
          extend: {
            spacing: {
              '9xl': '128rem',
            },
          }
        },
      }`,
    extractedConfig: `{
          colors: {
            'blue': '#1fb6ff',
          },
          fontFamily: {
            sans: ['Graphik', 'sans-serif'],
          },
          extend: {
            spacing: {
              '9xl': '128rem',
            },
          }
        }`,
  },
  {
    name: "config in tailwind.config.js ESM",
    rawConfig: `
      /** @type {import('tailwindcss').Config} */
      export default {
        content: [],
        theme: {
          extend: {},
        },
        plugins: [],
      }`,
    extractedConfig: `{
          extend: {},
        }`,
  },
  {
    name: "config in tailwind.config.ts",
    rawConfig: `
      import type { Config } from 'tailwindcss'
      export default {
        content: [],
        theme: {
          extend: {},
        },
        plugins: [],
      } satisfies Config`,
    extractedConfig: `{
          extend: {},
        }`,
  },
  {
    name: "standalone config",
    rawConfig: `{
        content: [],
        theme: {
          extend: {},
        },
        plugins: [],
      }`,
    extractedConfig: `{
          extend: {},
        }`,
  },
  {
    name: "standalone config with pre- und suffix",
    rawConfig: `my prefix {
        content: [],
        theme: {
          extend: {},
        },
        plugins: [],
      } my suffix`,
    extractedConfig: `{
          extend: {},
        }`,
  },
  {
    name: "standalone theme object with key",
    rawConfig: `theme: {
          colors: {
            'blue': '#1fb6ff',
          },
        }`,
    extractedConfig: `{
          colors: {
            'blue': '#1fb6ff',
          },
        }`,
  },
  {
    name: "standalone theme object",
    rawConfig: `{
          colors: {
            'blue': '#1fb6ff',
          },
        }`,
    extractedConfig: `{
          colors: {
            'blue': '#1fb6ff',
          },
        }`,
  },
  {
    name: "standalone theme object key-value pairs",
    rawConfig: `colors: {
            'blue': '#1fb6ff',
          },
          fontFamily: {
            sans: ['Graphik', 'sans-serif'],
          }`,
    extractedConfig: `{
          colors: {
            'blue': '#1fb6ff',
          },
          fontFamily: {
            sans: ['Graphik', 'sans-serif'],
          }
        }`,
  },
  {
    name: "invalid config 1",
    rawConfig: `'blue': '#1fb6ff'}`,
    extractedConfig: null,
  },
  {
    name: "invalid config 2",
    rawConfig: `invalid`,
    extractedConfig: null,
  },
  {
    name: "invalid config 3",
    rawConfig: `colors: {
            'blue': '#1fb6ff',
          `,
    extractedConfig: null,
  },
];

describe("extractTailwindConfig", () => {
  tailwindConfigs.forEach(({ name, rawConfig, extractedConfig }) => {
    it(`find ${name}`, () => {
      const expected = extractTailwindTheme(rawConfig);
      const normalizeRegex = /[\n, ]/g;
      expect(expected?.replace(normalizeRegex, "")).toEqual(
        extractedConfig?.replace(normalizeRegex, ""),
      );
    });
  });
});
