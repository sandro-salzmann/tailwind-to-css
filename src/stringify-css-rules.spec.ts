import { describe, expect, it } from "vitest";
import { CustomCSSOtherRule, CustomCSSRule, CustomCSSStyleRule } from "./convert-tailwind-to-css";
import { stringifyCssRules } from "./stringify-css-rules";

describe("stringifyCssRules", () => {
  it("should handle rules without any media queries", () => {
    const cssRules: CustomCSSRule[] = [
      {
        type: "style",
        cssText: ".text-bold { font-weight: bold; }",
      } as CustomCSSStyleRule,
    ];

    const expectedCss = ".text-bold { font-weight: bold; }\n";
    expect(stringifyCssRules(cssRules)).toBe(expectedCss);
  });

  it("should handle rules with a single media query", () => {
    const cssRules: CustomCSSRule[] = [
      {
        type: "other",
        cssText: "@media (min-width: 768px) {",
        cssRules: [
          {
            type: "style",
            cssText: ".text-sm { font-size: 12px; }",
          } as CustomCSSStyleRule,
        ],
      } as CustomCSSOtherRule,
    ];

    const expectedCss = "@media (min-width: 768px) {\n  .text-sm { font-size: 12px; }\n}\n";
    expect(stringifyCssRules(cssRules)).toBe(expectedCss);
  });

  it("should handle nested media queries correctly", () => {
    const cssRules: CustomCSSRule[] = [
      {
        type: "other",
        cssText: "@media (min-width: 768px) {",
        cssRules: [
          {
            type: "style",
            cssText: ".container { display: flex; }",
          } as CustomCSSStyleRule,
          {
            type: "other",
            cssText: "@media (orientation: landscape) {",
            cssRules: [
              {
                type: "style",
                cssText: ".item { padding: 10px; }",
              } as CustomCSSStyleRule,
            ],
          } as CustomCSSOtherRule,
        ],
      } as CustomCSSOtherRule,
    ];

    const expectedCss =
      "@media (min-width: 768px) {\n  .container { display: flex; }\n  @media (orientation: landscape) {\n    .item { padding: 10px; }\n  }\n}\n";
    expect(stringifyCssRules(cssRules)).toBe(expectedCss);
  });

  it("should handle double nested media queries correctly", () => {
    const cssRules: CustomCSSRule[] = [
      {
        type: "other",
        cssText: "@media screen and (min-width: 900px) {",
        cssRules: [
          {
            type: "style",
            cssText: ".container { display: flex; }",
          } as CustomCSSStyleRule,
          {
            type: "other",
            cssText: "@media (orientation: landscape) {",
            cssRules: [
              {
                type: "style",
                cssText: ".item { padding: 10px; }",
              } as CustomCSSStyleRule,
              {
                type: "other",
                cssText: "@media (prefers-color-scheme: dark) {",
                cssRules: [
                  {
                    type: "style",
                    cssText: ".button { background-color: black; }",
                  } as CustomCSSStyleRule,
                ],
              } as CustomCSSOtherRule,
            ],
          } as CustomCSSOtherRule,
        ],
      } as CustomCSSOtherRule,
    ];

    const expectedCss =
      "@media screen and (min-width: 900px) {\n  .container { display: flex; }\n  @media (orientation: landscape) {\n    .item { padding: 10px; }\n    @media (prefers-color-scheme: dark) {\n      .button { background-color: black; }\n    }\n  }\n}\n";
    expect(stringifyCssRules(cssRules)).toBe(expectedCss);
  });
});
