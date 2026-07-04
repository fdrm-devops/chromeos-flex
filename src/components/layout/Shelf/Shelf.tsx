import { TASKBAR_APPS, STAR_MENU_APPS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import AppLauncher from "./components/AppLauncher";
import { cn } from "@/lib/utils";
import { openedAppsAtom, shelfAppsAtom } from "@/atoms/app";
import { useAtom } from "jotai";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../ui/tooltip";
import { motion } from "motion/react";
import SystemTray from "./components/SystemTray";
import CalendarLauncher from "./components/CalendarLauncher";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { Browser } from "@/components/apps/Browser";
import { glassmorphicAtom } from "@/atoms/system";

export function Shelf() {
  const [openedApps, setOpenedApps] = useAtom(openedAppsAtom);
  const [shelfApps, setShelfApps] = useAtom(shelfAppsAtom);
  const [glassmorphic] = useAtom(glassmorphicAtom);

  // State untuk melacak popover mana saja yang sedang terbuka
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSystemTrayOpen, setIsSystemTrayOpen] = useState(false);
  // Track dragged item index
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isOver, setIsOver] = useState(false);

  // Close popovers when window loses focus (e.g., clicking inside browser iframe)
  useEffect(() => {
    const handleBlur = () => {
      setTimeout(() => {
        if (document.activeElement?.tagName === "IFRAME") {
          setIsLauncherOpen(false);
          setIsCalendarOpen(false);
          setIsSystemTrayOpen(false);
        }
      }, 100);
    };
    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, []);

  const openApp = (newApp: any) => {
    let appToOpen = { ...newApp };
    if (!appToOpen.render) {
      const link = appToOpen.link || `https://www.${appToOpen.name.toLowerCase().replace(" ", "")}.com`;
      appToOpen.render = <Browser link={link} />;
    }
    setOpenedApps((prev) => {
      const index = prev.findIndex((app) => app.id === appToOpen.id);
      if (index === -1) {
        return [...prev, appToOpen];
      } else {
        const updated = [...prev];
        updated[index] = { ...updated[index], isMinimized: false };
        return updated;
      }
    });
  };

  const handleStartMenuDrop = (e: React.DragEvent) => {
    try {
      const dataStr = e.dataTransfer.getData("application/json");
      if (!dataStr) return;
      const data = JSON.parse(dataStr);
      if (data && data.id) {
        const matchedApp = STAR_MENU_APPS.find((app) => app.id === data.id);
        if (matchedApp) {
          setShelfApps((prev) => {
            if (prev.some((app) => app.id === matchedApp.id)) {
              return prev;
            }
            const newApp = { ...matchedApp };
            if (!newApp.render) {
              const link = newApp.link || `https://www.${newApp.name.toLowerCase().replace(" ", "")}.com`;
              newApp.render = <Browser link={link} />;
            }
            return [...prev, newApp];
          });
        }
      }
    } catch (err) {
      console.error("Error handling drop on shelf", err);
    }
  };

  return (
    <div className="grid grid-cols-4 h-full w-full px-3 items-center">

      {/* 1. KIRI: GOOGLE LAUNCHER BUTTON */}
      <div className="flex items-center h-full justify-start">
        <Popover open={isLauncherOpen} onOpenChange={setIsLauncherOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"ghost"}
              className={cn(
                "h-9 w-9 p-0 rounded-full font-bold shadow-sm active:scale-95 transition-all text-base flex items-center justify-center font-sans",
                // REQ: Jika terbuka, warna berubah jadi fbb991. Jika tutup, kembali putih default.
                isLauncherOpen
                  ? "bg-[#fbb991] text-black hover:bg-[#fbb991]"
                  : "bg-white text-black hover:bg-white/90"
              )}
            >
              G
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="start"
            sideOffset={12}
            className={cn(
              glassmorphic
                ? "bg-background/80 backdrop-blur-md border-[0.5px] border-background/20"
                : "bg-background border border-foreground/10",
              "w-[440px] h-[80vh] p-0 rounded-2xl shadow-2xl overflow-hidden"
            )}
          >
            <AppLauncher />
          </PopoverContent>
        </Popover>
      </div>

      {/* 2. TENGAH: APP SHORTCUTS & APP ACTIVE INDICATORS */}
      <div
        className={cn(
          "col-span-2 flex justify-center h-full items-center space-x-3 transition-all duration-200 rounded-xl px-4",
          isOver && "bg-white/10 border-2 border-dashed border-[#fbb991] py-1 scale-105"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          // Only show dragover box if we are dragging a new app from the start menu
          if (e.dataTransfer.types.includes("application/json")) {
            setIsOver(true);
          }
        }}
        onDragLeave={() => setIsOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsOver(false);
          if (e.dataTransfer.types.includes("application/json")) {
            handleStartMenuDrop(e);
          }
        }}
      >
        <TooltipProvider>
          {shelfApps.map((app, index) => {
            const isAppOpened = openedApps.some((item) => item.id === app.id);
            const isBeingDragged = draggedIndex === index;

            return (
              <Tooltip key={app.id || app.name}>
                <TooltipTrigger asChild>
                  <div
                    draggable
                    onDragStart={(e) => {
                      setDraggedIndex(index);
                      e.dataTransfer.setData("shelf/index", index.toString());
                    }}
                    onDragEnd={() => {
                      setDraggedIndex(null);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const sourceIndexStr = e.dataTransfer.getData("shelf/index");
                      if (sourceIndexStr !== "") {
                        const sourceIndex = parseInt(sourceIndexStr, 10);
                        const targetIndex = index;
                        if (sourceIndex !== targetIndex) {
                          setShelfApps((prev) => {
                            const updated = [...prev];
                            const [movedApp] = updated.splice(sourceIndex, 1);
                            updated.splice(targetIndex, 0, movedApp);
                            return updated;
                          });
                        }
                      } else {
                        handleStartMenuDrop(e);
                      }
                    }}
                    className={cn(
                      "h-full flex flex-col items-center justify-center relative px-0.5 transition-all duration-200",
                      isBeingDragged && "opacity-40 scale-75 cursor-grabbing"
                    )}
                  >
                    <Button
                      onClick={() => openApp(app)}
                      variant={"ghost"}
                      className={cn(
                        "relative p-0 size-9 rounded-full font-medium hover:bg-transparent hover:text-foreground shadow-[0px_1px_3px_rgba(0,0,0,0.15)] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
                      )}
                    >
                      <img
                        src={app.icon}
                        alt={app.name}
                        className={cn(
                          app.iconShape === "circle"
                            ? "size-full object-contain rounded-full"
                            : "bg-white size-full p-[2px] rounded-full object-contain"
                        )}
                      />
                    </Button>

                    {/* Indikator garis/titik aktif */}
                    {isAppOpened && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute bottom-0.5 h-[2px] w-3 bg-foreground rounded-full shadow-sm"
                      />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent sideOffset={10} className="bg-black/80 text-white border-0 text-xs px-2 py-1">
                  <p>{app.name}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>

      {/* 3. KANAN: STATUS TRAY & CLOCK SYSTEM */}
      <div className="flex justify-end items-center space-x-1.5 h-full">
        {/* TANGGAL */}
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"ghost"}
              className={cn(
                "h-8 px-3 rounded-l-full rounded-r-sm text-xs font-medium transition-colors",
                // REQ: Jika kalender aktif/terbuka warna ganti fbb991
                isCalendarOpen
                  ? "bg-[#fbb991] text-black hover:bg-[#fbb991]"
                  : "bg-white/45 text-foreground hover:bg-primary/20"
              )}
            >
              {format(new Date(), 'MMM dd')}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className={cn(
              glassmorphic
                ? "bg-background/80 backdrop-blur-md border border-white/10 dark:border-white/5"
                : "bg-background border border-foreground/10",
              "rounded-3xl shadow-none mr-2 w-fit p-0"
            )}
            sideOffset={14}
          >
            <CalendarLauncher />
          </PopoverContent>
        </Popover>

        {/* WIFI & BATTERY */}
        <Popover open={isSystemTrayOpen} onOpenChange={setIsSystemTrayOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"ghost"}
              className={cn(
                "flex items-center space-x-1.5 h-8 px-3 rounded-r-full !rounded-l-3xl text-xs font-medium transition-colors",
                // REQ: Jika system tray aktif/terbuka warna ganti fbb991
                isSystemTrayOpen
                  ? "bg-[#fbb991] text-black hover:bg-[#fbb991]"
                  : "bg-white/45 text-foreground hover:bg-primary/20"
              )}
            >
              <div>{format(new Date(), 'HH:mm')}</div>
              <span className="icon text-[14px]">signal_wifi_4_bar</span>
              <BatteryChargingFullIcon sx={{ fontSize: "14px" }} />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className={cn(
              glassmorphic
                ? "bg-background/80 backdrop-blur-md border border-white/10 dark:border-white/5"
                : "bg-background border border-foreground/10",
              "rounded-3xl shadow-none mr-2 w-fit"
            )}
            sideOffset={14}
          >
            <SystemTray />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}