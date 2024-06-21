import { ChangeEventHandler, useState } from "react";
import { convertTailwindToCss } from "./convert-tailwind-to-css";

export const App = () => {
  const [css, setCss] = useState("");

  const onTailwindInputChange: ChangeEventHandler<HTMLTextAreaElement> = async (e) => {
    const css = await convertTailwindToCss({
      tailwindClasses: e.target.value,
    });
    setCss(css);
  };

  return (
    <div className="h-screen grid grid-cols-1 lg:grid-cols-2 p-8 gap-4">
      <textarea
        className="border p-4 rounded-lg"
        defaultValue="bg-red-100 sm:bg-orange-500 lg:bg-red-900"
        onChange={onTailwindInputChange}
        placeholder="Enter Tailwind classes here..."
      />
      <textarea
        className="border p-4 rounded-lg"
        value={css}
        readOnly
        placeholder="CSS output will appear here..."
      />
    </div>
  );
};
