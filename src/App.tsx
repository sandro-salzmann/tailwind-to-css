import Editor, { OnChange } from "@monaco-editor/react";
import { useQuery } from "@tanstack/react-query";
import JSON5 from "json5";
import { editor } from "monaco-editor";
import { useState } from "react";
import backgroundUrl from "./background.svg";
import { AutoformattedEditor } from "./components/autoformatted-editor";
import { EditorHeader } from "./components/editor-header";
import { Footer } from "./components/footer";
import { Header } from "./components/header/header";
import { LoadingSpinner } from "./components/loading-spinner";
import { useMonacoTransparentTheme } from "./components/use-monaco-transparent-theme";
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

  useMonacoTransparentTheme();

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
    automaticLayout: true,
  };

  return (
    <div
      className="p-4 md:p-8 w-dvw h-dvh bg-center bg-cover"
      style={{ backgroundImage: `url("${backgroundUrl}")` }}
    >
      <div className="max-w-7xl flex flex-col gap-8 h-full mx-auto">
        <Header />
        <div className="grow h-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-full flex flex-col gap-4">
            <div className="h-48 flex flex-col gap-2">
              <EditorHeader>Tailwind Code</EditorHeader>
              <div
                className="grow border border-white/10 py-4 px-[6px] rounded-lg"
                data-testid="tailwind-editor"
              >
                <Editor
                  value={tailwindCode}
                  onChange={handleTailwindCodeChange}
                  options={editorOptions}
                  loading={<LoadingSpinner />}
                />
              </div>
            </div>
            <div className="grow flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <EditorHeader>tailwind.config</EditorHeader>
                {hasTailwindConfigError && (
                  <span className="px-4 py-2 font-semibold rounded-lg text-red-900 bg-red-100 animate-pulse">
                    Config error
                  </span>
                )}
              </div>
              <div
                className={`h-full border border-white/10 py-4 px-[6px] rounded-lg 
                          ${hasTailwindConfigError && "border-red-900"}`}
              >
                <Editor
                  onChange={handleThemeChange}
                  options={editorOptions}
                  defaultValue={placeholderTailwindConfig}
                  loading={<LoadingSpinner />}
                />
              </div>
            </div>
          </div>
          <div className="h-full flex flex-col gap-2">
            <EditorHeader>Generated CSS</EditorHeader>
            <div
              className="h-full grow border border-white/10 py-4 px-[6px] rounded-lg"
              data-testid="css-editor"
            >
              <AutoformattedEditor language="css" value={css} options={editorOptions} />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};
