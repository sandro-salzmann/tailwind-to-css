import { describe, it, expect } from "vitest";
import { filterCssRulesByClasses } from "./filter-css-rules-by-classes";

describe("filterCssRulesByClasses", () => {
  it("finds a class in simple styles", () => {
    const cssRules = [
      {
        type: "style" as const,
        selectorText: ".test",
        cssText: "color: red",
      },
    ];

    const classes = ["test"];
    const expected = [
      {
        type: "style" as const,
        selectorText: ".test",
        cssText: "color: red",
      },
    ];

    const result = filterCssRulesByClasses(cssRules, classes);
    expect(result).toEqual(expected);
  });

  it("returns empty array if class is not found", () => {
    const cssRules = [
      {
        type: "style" as const,
        selectorText: ".not-test",
        cssText: "color: blue",
      },
    ];

    const classes = ["test"];
    const result = filterCssRulesByClasses(cssRules, classes);
    expect(result).toEqual([]);
  });

  it("finds a class inside a media query", () => {
    const cssRules = [
      {
        type: "other" as const,
        cssText: "@media (max-width: 600px)",
        cssRules: [
          {
            type: "style" as const,
            selectorText: ".test",
            cssText: "color: red",
          },
        ],
      },
    ];

    const classes = ["test"];
    const expected = [
      {
        type: "other" as const,
        cssText: "@media (max-width: 600px)",
        cssRules: [
          {
            type: "style" as const,
            selectorText: ".test",
            cssText: "color: red",
          },
        ],
      },
    ];

    const result = filterCssRulesByClasses(cssRules, classes);
    expect(result).toEqual(expected);
  });

  it("handles nested media queries", () => {
    const cssRules = [
      {
        type: "other" as const,
        cssText: "@media (max-width: 1000px)",
        cssRules: [
          {
            type: "other" as const,
            cssText: "@media (orientation: landscape)",
            cssRules: [
              {
                type: "style" as const,
                selectorText: ".test",
                cssText: "color: green",
              },
              {
                type: "style" as const,
                selectorText: ".test2",
                cssText: "color: blue",
              },
            ],
          },
          {
            type: "style" as const,
            selectorText: ".test3",
            cssText: "color: purple",
          },
        ],
      },
    ];

    const classes = ["test"];
    const expected = [
      {
        type: "other" as const,
        cssText: "@media (max-width: 1000px)",
        cssRules: [
          {
            type: "other" as const,
            cssText: "@media (orientation: landscape)",
            cssRules: [
              {
                type: "style" as const,
                selectorText: ".test",
                cssText: "color: green",
              },
            ],
          },
        ],
      },
    ];

    const result = filterCssRulesByClasses(cssRules, classes);
    expect(result).toEqual(expected);
  });
});
