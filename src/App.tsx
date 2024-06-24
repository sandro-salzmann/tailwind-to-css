import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { convertTailwindToCss } from "./convert-tailwind-to-css";
import { placeholderCssCode, placeholderTailwindCode } from "./placeholder-conversion";

export const App = () => {
  const [tailwindCode, setTailwindCode] = useState(placeholderTailwindCode);
  const { data: css } = useQuery({
    queryFn: async () => await convertTailwindToCss({ tailwindClasses: tailwindCode }),
    queryKey: ["tailwind-to-css-conversion", tailwindCode],
  });

  return (
    <div className="h-screen grid grid-cols-1 lg:grid-cols-2 p-8 gap-4">
      <textarea
        className="border p-4 rounded-lg"
        value={tailwindCode}
        onChange={(e) => setTailwindCode(e.target.value)}
        placeholder="Enter Tailwind classes here..."
      />
      <textarea
        className="border p-4 rounded-lg"
        value={css ?? placeholderCssCode}
        readOnly
        placeholder="CSS output will appear here..."
      />
    </div>
  );
};
