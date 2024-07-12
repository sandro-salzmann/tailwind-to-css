import { describe, it, expect } from "vitest";
import { matchTailwindSelectorWithClass } from "./match-tailwind-selector-with-class";

describe("matchTailwindSelectorWithClass", () => {
  it("matches a class without state modifiers", () => {
    expect(matchTailwindSelectorWithClass("bg-red-100", ".bg-red-100")).toBe(true);
  });

  it("matches a class with state modifiers", () => {
    expect(matchTailwindSelectorWithClass("dark:hover:bg-red-100", ".dark:hover:bg-red-100")).toBe(
      true,
    );
  });

  it("does not match if user class is a prefix of the selector", () => {
    expect(matchTailwindSelectorWithClass("text", ".text-center")).toBe(false);
  });

  it("does not match if user class is a suffix of the selector", () => {
    expect(matchTailwindSelectorWithClass("text", ".center-text")).toBe(false);
  });

  it("does not match if user class list is encapsulated in the selector", () => {
    expect(matchTailwindSelectorWithClass("text", ".center-text-center")).toBe(false);
  });

  it("does not match if classes are completely different", () => {
    expect(matchTailwindSelectorWithClass("abc", ".def")).toBe(false);
  });

  it("does not match if classes differ but state modifiers are the same", () => {
    expect(matchTailwindSelectorWithClass("hover:bg-red-300", ".hover:bg-blue-100")).toBe(false);
  });

  it("does not match if the order of state modifiers differs", () => {
    expect(
      matchTailwindSelectorWithClass("hover:bg-red-100:focus", ".focus:hover:bg-red-100"),
    ).toBe(false);
  });
});
