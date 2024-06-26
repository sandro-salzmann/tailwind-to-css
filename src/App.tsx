import Editor, { OnChange } from "@monaco-editor/react";
import { useQuery } from "@tanstack/react-query";
import { editor } from "monaco-editor";
import { useState } from "react";
import { AutoformattedEditor } from "./components/autoformatted-editor";
import { convertTailwindToCss } from "./convert-tailwind-to-css";
import { placeholderTailwindCode } from "./placeholder-conversion";

export const App = () => {
  const [tailwindCode, setTailwindCode] = useState(placeholderTailwindCode);
  const { data: css } = useQuery({
    queryFn: async () => await convertTailwindToCss({ tailwindClasses: tailwindCode }),
    queryKey: ["tailwind-to-css-conversion", tailwindCode],
  });

  const handleTailwindCodeChange: OnChange = (value = "") => {
    setTailwindCode(value);
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
        <div className="border py-4 px-[6px] rounded-lg" data-testid="tailwind-editor">
          <Editor
            value={tailwindCode}
            onChange={handleTailwindCodeChange}
            options={editorOptions}
          />
        </div>
        <div className="border py-4 px-[6px] rounded-lg" data-testid="css-editor">
          <AutoformattedEditor language="css" value={css} options={editorOptions} />
        </div>
      </div>
    </div>
  );
};
