import { CustomCSSRule } from "./convert-tailwind-to-css";

type MediaQueryTree = {
  rules: string[];
  children: Record<string, MediaQueryTree>;
};

export function stringifyCssRules(rules: CustomCSSRule[]): string {
  const cssRulesTree: MediaQueryTree = { rules: [], children: {} };

  function buildTreeFromRule(rule: CustomCSSRule, currentTree: MediaQueryTree) {
    if (rule.type === "style") {
      // Add simple style rules directly to the current tree node
      currentTree.rules.push(rule.cssText);
    } else if (rule.type === "other") {
      // Extract the media query text
      const mediaQueryText = rule.cssText.split("{")[0].trim();
      if (!currentTree.children[mediaQueryText]) {
        currentTree.children[mediaQueryText] = { rules: [], children: {} };
      }
      // Process inner rules of the media query
      for (const cssRule of rule.cssRules) {
        buildTreeFromRule(cssRule, currentTree.children[mediaQueryText]);
      }
    }
  }

  function buildCSSFromTree(tree: MediaQueryTree, depth = 0): string {
    let cssText = "";
    // Add rules at this level with appropriate indentation
    if (tree.rules.length > 0) {
      cssText += `${"  ".repeat(depth)}${tree.rules.join("\n" + "  ".repeat(depth))}\n`;
    }
    // Recursively add rules from child media queries
    for (const [media, subtree] of Object.entries(tree.children)) {
      cssText += `${"  ".repeat(depth)}${media} {\n`;
      cssText += buildCSSFromTree(subtree, depth + 1);
      cssText += `${"  ".repeat(depth)}}\n`;
    }
    return cssText;
  }

  // Group rules by media query in a tree structure
  for (const ruleInput of rules) {
    buildTreeFromRule(ruleInput, cssRulesTree);
  }

  // Convert the tree to a CSS string
  return buildCSSFromTree(cssRulesTree);
}
