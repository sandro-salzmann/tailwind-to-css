import { CustomCSSRule } from "./convert-tailwind-to-css";
import { matchTailwindSelectorWithClass } from "./match-tailwind-selector-with-class";

export const filterCssRulesByClasses = (
  cssRules: CustomCSSRule[],
  classes: string[],
): CustomCSSRule[] => {
  const filterRules = (rules: CustomCSSRule[]): CustomCSSRule[] => {
    return rules.reduce((acc: CustomCSSRule[], rule: CustomCSSRule) => {
      if (rule.type === "style") {
        if (
          classes.some((userClass) => matchTailwindSelectorWithClass(userClass, rule.selectorText))
        ) {
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
