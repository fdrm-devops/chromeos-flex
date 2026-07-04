import { useAtom } from "jotai";
import AppWindow from "./AppWindow";
import { Shelf } from "../layout/Shelf/Shelf";
import { openedAppsAtom } from "@/atoms/app";
import { brightnessAtom, nightLightAtom, glassmorphicAtom, darkModeAtom } from "@/atoms/system";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

function Desktop() {
  const [openedApps, _] = useAtom(openedAppsAtom);
  const [brightness] = useAtom(brightnessAtom);
  const [nightLight] = useAtom(nightLightAtom);
  const [glassmorphic] = useAtom(glassmorphicAtom);
  const [darkMode] = useAtom(darkModeAtom);

  useEffect(() => {
    console.log("opend", openedApps);
  }, [openedApps]);

  // Sync dark class with document.documentElement on change or reload
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Apply filters globally to document.documentElement to affect portals too
  useEffect(() => {
    const filters = [
      brightness !== 100 ? `brightness(${brightness / 100})` : "",
      nightLight ? "sepia(0.35) saturate(1.2)" : "",
    ]
      .filter(Boolean)
      .join(" ");

    document.documentElement.style.filter = filters || "";
    document.documentElement.style.transition = "filter 0.4s ease";
  }, [brightness, nightLight]);

  return (
    <div
      className="w-screen h-screen bg-cover bg-center bg-[url('../src/assets/images/wallpapers/The_Lonely_Rock.jpg')]"
    >
      <div className="grid grid-rows-[1fr_48px] h-full">
        <div className="size-full">
          {openedApps.length > 0 &&
            openedApps
              .filter((app) => app.isMinimized == false)
              .map((app) => (
                <AppWindow
                  key={app.id}
                  app={app}
                  render={app.render}
                ></AppWindow>
              ))}
        </div>
        <div className={cn(
          "z-10 transition-all duration-300",
          glassmorphic
            ? "bg-background/60 backdrop-blur-md border-t border-white/10 dark:border-white/5"
            : "bg-background",
          openedApps.some((app) => app.isFullScreen && !app.isMinimized) ? "rounded-t-none" : "rounded-t-3xl"
        )}>
          <Shelf></Shelf>
        </div>
      </div>
    </div>
  );
}

export default Desktop;

