import { AppExplanationPopover } from "./app-explanation-popover";

export const Header = () => {
  return (
    <header className="flex justify-between gap-2">
      <h1 className="text-xl font-extrabold text-purple-400">
        <a href="/">Tailwind to CSS</a>
      </h1>
      <AppExplanationPopover />
    </header>
  );
};
