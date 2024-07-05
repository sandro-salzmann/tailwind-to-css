import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

export const AppExplanationPopover = () => {
  return (
    <Popover>
      <PopoverButton className="text-blue-300 font-semibold underline underline-offset-4 hover:text-blue-400 transition-colors focus:outline-none">
        <h1>What??</h1>
      </PopoverButton>
      <PopoverPanel
        transition
        anchor={{ to: "bottom", gap: 4 }}
        className="-translate-x-2 md:-translate-x-6 divide-y divide-white/5 rounded-xl bg-white/5 transition duration-200 ease-in-out data-[closed]:-translate-y-1 data-[closed]:opacity-0 backdrop-blur-md"
      >
        <div className="p-4 max-w-md">
          <h3 className="font-semibold text-white text-lg">How to</h3>
          <p className="text-white/80">
            Provide your tailwind code, your theme and include the generated CSS in your CSS file.
            Now you can use tailwind without installing tailwind 🤗
          </p>
        </div>
        <div className="p-4 max-w-md">
          <h3 className="font-semibold text-white text-lg">Why???</h3>
          <p className="text-white/80">
            This is just a fun nonsense project. If you want to use tailwind, please install it
            properly. It is way cleaner this way, has proper theming support and you can also{" "}
            <a
              href="https://tailwindcss.com/docs/configuration#prefix"
              className="underline underline-offset-2 hover:text-blue-400 transition-colors"
            >
              prefix
            </a>{" "}
            it to avoid conflicts with existing styling-systems.
          </p>
        </div>
      </PopoverPanel>
    </Popover>
  );
};
