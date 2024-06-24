import { filterCssRulesByClasses } from "./filter-css-rules-by-classes";
import { stringifyCssRules } from "./stringify-css-rules";
import { waitForAnimationFrame } from "./utils/wait-for-animation-frame";

interface CustomCSSBaseRule {
  cssText: string;
}

export interface CustomCSSStyleRule extends CustomCSSBaseRule {
  type: "style";
  selectorText: string;
}

export interface CustomCSSOtherRule extends CustomCSSBaseRule {
  type: "other";
  cssRules: CustomCSSRule[];
}

export type CustomCSSRule = CustomCSSStyleRule | CustomCSSOtherRule;

export const convertTailwindToCss = async ({ tailwindClasses }: { tailwindClasses: string }) => {
  const tempElement = document.createElement("div");
  tempElement.className = tailwindClasses;
  document.body.appendChild(tempElement);

  // Wait for Tailwind playground from CDN to inject the new CSS into the DOM
  await waitForAnimationFrame();

  // Find the new CSS rules from the Tailwind stylesheet and convert them to custom CSS rules
  const stylesheets = Array.from(document.styleSheets);
  const tailwindStylesheet = import.meta.env.DEV
    ? stylesheets[0]
    : stylesheets[stylesheets.length - 1];
  const convertCSSRuleListToCustomCSSRules = (cssRules: CSSRuleList): CustomCSSRule[] => {
    return (
      Array.from(cssRules)
        .map((rule) => {
          if (rule.constructor.name === "CSSStyleRule") {
            const typedRule = rule as CSSStyleRule;
            return {
              type: "style" as const,
              selectorText: typedRule.selectorText,
              cssText: typedRule.cssText,
            } satisfies CustomCSSStyleRule;
          } else if (rule.constructor.name === "CSSMediaRule") {
            const typedRule = rule as CSSMediaRule;
            return {
              type: "other" as const,
              cssRules: convertCSSRuleListToCustomCSSRules(typedRule.cssRules),
              cssText: typedRule.cssText,
            } satisfies CustomCSSOtherRule;
          }
        })
        .filter((x) => !!x)
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        .map((x) => x!)
    );
  };
  const customCssRules = convertCSSRuleListToCustomCSSRules(tailwindStylesheet.cssRules);

  // Filter out rules not relevant for the given tailwind classes
  const matchingCssRules = filterCssRulesByClasses(
    customCssRules,
    Array.from(tempElement.classList),
  );

  return stringifyCssRules(matchingCssRules);
};
