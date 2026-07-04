import { atom } from "jotai";

type Theme = "light" | "dark";

export const themeAtom = atom<Theme>("light");

export const themeWithStorageAtom = atom(
  (get) => get(themeAtom),
  (_, set, newTheme: Theme) => {
    set(themeAtom, newTheme);
    localStorage.setItem("theme", newTheme);
  }
);

export const initializeThemeAtom = atom(
  null,
  (_, set) => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      set(themeAtom, savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      set(themeAtom, "dark");
    }
  }
);