import Editor, { OnChange } from "@monaco-editor/react";
import { useQuery } from "@tanstack/react-query";
import JSON5 from "json5";
import { editor } from "monaco-editor";
import { useState } from "react";
import { AutoformattedEditor } from "./components/autoformatted-editor";
import { convertTailwindToCss } from "./convert-tailwind-to-css";
import { extractTailwindTheme } from "./extract-tailwind-theme";
import { placeholderTailwindCode, placeholderTailwindConfig } from "./placeholders";
import { waitForAnimationFrame } from "./utils/wait-for-animation-frame";

export const App = () => {
  const [tailwindCode, setTailwindCode] = useState(placeholderTailwindCode);
  const [hasTailwindConfigError, setHasTailwindConfigError] = useState<boolean>(false);
  const { data: css, refetch: reconvert } = useQuery({
    queryFn: async () => await convertTailwindToCss({ tailwindClasses: tailwindCode }),
    queryKey: ["tailwind-to-css-conversion", tailwindCode],
  });

  const handleTailwindCodeChange: OnChange = (value = "") => {
    setTailwindCode(value);
  };

  const handleThemeChange: OnChange = (value = "") => {
    const extractedTheme = extractTailwindTheme(value);
    if (!extractedTheme) {
      return setHasTailwindConfigError(true);
    }

    void (async () => {
      try {
        const config = JSON5.parse<unknown>(`{ theme: ${extractedTheme} }`);
        // @ts-expect-error global tailwind config
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        tailwind.config = config;
        await waitForAnimationFrame();
        void reconvert();
        setHasTailwindConfigError(false);
      } catch (error) {
        return setHasTailwindConfigError(true);
      }
    })();
  };

  const editorOptions: editor.IStandaloneEditorConstructionOptions = {
    minimap: { enabled: false },
    scrollbar: {
      vertical: "hidden",
      horizontal: "hidden",
    },
    wordWrap: "on",
    overviewRulerLanes: 0,
    hideCursorInOverviewRuler: true,
    overviewRulerBorder: false,
    lineNumbers: "off",
    folding: false,
  };

  return (
    <div className="p-8 h-screen flex flex-col">
      <header>
        <h1>Tailwind to CSS</h1>
      </header>
      <div className="grow h-full grid grid-cols-2 gap-4">
        <div className="h-full flex flex-col gap-4">
          <div className="h-48 border py-4 px-[6px] rounded-lg" data-testid="tailwind-editor">
            <Editor
              height="100%"
              value={tailwindCode}
              onChange={handleTailwindCodeChange}
              options={editorOptions}
            />
          </div>
          <div className="grow flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h2>tailwind.config</h2>
              <span
                className={`px-4 py-2 font-semibold rounded-lg
                            ${
                              hasTailwindConfigError
                                ? "text-red-900 bg-red-100"
                                : "text-green-900 bg-green-100"
                            }`}
              >
                {hasTailwindConfigError ? "Config error" : "Config ok"}
              </span>
            </div>
            <div
              className={`h-full border py-4 px-[6px] rounded-lg 
                          ${hasTailwindConfigError && "border-red-900"}`}
            >
              <Editor
                height="100%"
                onChange={handleThemeChange}
                options={editorOptions}
                defaultValue={placeholderTailwindConfig}
              />
            </div>
          </div>
        </div>
        <div className="border py-4 px-[6px] rounded-lg" data-testid="css-editor">
          <AutoformattedEditor language="css" value={css} options={editorOptions} />
        </div>
      </div>
    </div>
  );
};
