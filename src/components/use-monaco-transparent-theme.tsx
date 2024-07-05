import { useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";

export const useMonacoTransparentTheme = () => {
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme("transparent-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#FFFFFF00",
        },
      });
      monaco.editor.setTheme("transparent-dark");
    }
  }, [monaco]);
};
