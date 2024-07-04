export const extractTailwindTheme = (rawConfig: string) => {
  if (!rawConfig.includes("{") || !rawConfig.includes("}")) {
    return null;
  }

  const findTextBetweenCurlyBrackets = (text: string, startingFrom: number) => {
    const bracketStart = text.indexOf("{", startingFrom);
    if (bracketStart !== -1) {
      let brackedNestingLevel = 0;
      let brackedEnd = bracketStart;

      // Loop through the string starting from the opening bracket
      for (let i = bracketStart; i < text.length; i++) {
        if (text[i] === "{") {
          brackedNestingLevel++;
        } else if (text[i] === "}") {
          brackedNestingLevel--;
        }

        // If bracketLevel reaches zero, we've found the corresponding closing bracket
        if (brackedNestingLevel === 0) {
          brackedEnd = i;
          break;
        }
      }

      // Only return text if it has found a corresponding closing bracket
      if (brackedNestingLevel === 0) {
        return text.substring(bracketStart, brackedEnd + 1);
      }
    }
  };

  // Check for theme object after theme key
  const themeIndex = rawConfig.indexOf("theme");
  if (themeIndex !== -1) {
    const theme = findTextBetweenCurlyBrackets(rawConfig, themeIndex);
    if (theme) {
      return theme;
    }
  }

  // Check if rawConfig is the theme object itself
  if (rawConfig.trimStart().startsWith("{")) {
    const theme = findTextBetweenCurlyBrackets(rawConfig, 0);
    if (theme) {
      return theme;
    }
  }

  // Check if rawConfig is the contents of the theme object
  const theme = findTextBetweenCurlyBrackets(`{${rawConfig}}`, 0);
  if (theme) {
    return theme;
  }

  return null;
};
