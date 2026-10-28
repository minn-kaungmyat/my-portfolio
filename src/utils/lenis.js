// Shared handle to the global Lenis smooth-scroll instance so components
// (modals, navbar) can pause / resume / drive it without prop drilling.
let instance = null;

export const setLenis = (lenis) => {
  instance = lenis;
};

export const getLenis = () => instance;
