/**
 * Checks if a given tailwindClass (e.g. "bg-red-400") matches a given tailwindSelector (e.g. ".bg-red-400")
 */
export const matchTailwindSelectorWithClass = (
  tailwindClass: string,
  tailwindSelector: string,
): boolean => {
  // Remove the leading dot from the tailwindClass to prepare it for comparison
  const cleanTailwindSelector = tailwindSelector.slice(1);

  // Split by ':' to compare pseudo-classes
  const tailwindClasses = tailwindClass.split(":");
  const tailwindSelectors = cleanTailwindSelector.split(":");

  // Check if every corresponding part of the split classes matches while
  // ignoring trailing parts in the selector added by tailwinds generator
  return tailwindClasses.every((cls, index) => cls === tailwindSelectors[index]);
};
