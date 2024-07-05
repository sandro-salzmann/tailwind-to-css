import { ReactNode } from "react";

interface EditorHeaderProps {
  children: ReactNode;
}

export const EditorHeader = ({ children }: EditorHeaderProps) => {
  return <h2 className="text-white font-extralight">{children}</h2>;
};
