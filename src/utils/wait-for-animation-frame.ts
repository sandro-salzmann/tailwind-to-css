export function waitForAnimationFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      resolve(1);
    });
  });
}
