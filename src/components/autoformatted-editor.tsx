import { Editor, EditorProps, OnChange, OnMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { placeholderFormattedCssCode } from "../placeholders";
import { LoadingSpinner } from "./loading-spinner";

export const AutoformattedEditor = ({ value, options, ...props }: EditorProps) => {
  const [formattedValue, setFormattedValue] = useState(placeholderFormattedCssCode);
  const shadowEditorRef: MutableRefObject<editor.IStandaloneCodeEditor | null> = useRef(null);

  const handleShadowEditorDidMount: OnMount = (editor) => {
    shadowEditorRef.current = editor;
  };

  useEffect(() => {
    if (value === "") {
      return setFormattedValue("");
    }

    void shadowEditorRef?.current?.getAction("editor.action.formatDocument")?.run();
  }, [value, setFormattedValue]);

  const onShadowEditorChange: OnChange = (value) => {
    // Because onChange does not get triggered when the value prop changes we can assume
    // that it only gets called because of the format action and therefore we can update
    // the formatted value here
    setFormattedValue(value ?? "");
  };

  return (
    <>
      <Editor
        {...props}
        value={formattedValue}
        options={{ ...options, domReadOnly: true, readOnly: true }}
        loading={<LoadingSpinner />}
      />
      <div className="hidden">
        <Editor
          {...props}
          value={value}
          onMount={handleShadowEditorDidMount}
          options={options}
          onChange={onShadowEditorChange}
        />
      </div>
    </>
  );
};
