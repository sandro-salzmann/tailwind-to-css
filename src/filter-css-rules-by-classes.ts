import { CustomCSSRule } from "./convert-tailwind-to-css";

export const filterCssRulesByClasses = (
  cssRules: CustomCSSRule[],
  classes: string[],
): CustomCSSRule[] => {
  const selectorMatchesAnyClasses = (selector: string, classes: string[]): boolean => {
    const escapedSelector = selector.replaceAll("\\:", ":");
    const classRegexes = classes.map((cls) => new RegExp(`\\.\\b${cls}\\b`, "g"));
    return classRegexes.some((regex) => regex.test(escapedSelector));
  };

  const filterRules = (rules: CustomCSSRule[]): CustomCSSRule[] => {
    return rules.reduce((acc: CustomCSSRule[], rule: CustomCSSRule) => {
      if (rule.type === "style") {
        if (selectorMatchesAnyClasses(rule.selectorText, classes)) {
          acc.push(rule);
        }
      } else if (rule.type === "other") {
        const fileredCssRules = filterRules(rule.cssRules);
        if (fileredCssRules.length > 0) {
          acc.push({ ...rule, cssRules: fileredCssRules });
        }
      }
      return acc;
    }, []);
  };

  return filterRules(cssRules);
};
