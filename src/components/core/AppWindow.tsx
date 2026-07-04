import DraggableWrapper from "../common/dragble-wrapper";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { ReactComponent as CloseIcon } from "@/assets/icons/CloseIcon.svg";
import { ReactComponent as MaximizeIcon } from "@/assets/icons/MaximizeIcon.svg";
import { ReactComponent as MinimizeIcon } from "@/assets/icons/MinimizeIcon.svg";
import { ReactComponent as UnmaximizeIcon } from "@/assets/icons/UnmaximizeIcon.svg";
import { motion } from "motion/react";
import { openedAppsAtom, browserTabsAtom, activeTabIdAtom } from "@/atoms/app";
import { glassmorphicAtom } from "@/atoms/system";
import { useAtom } from "jotai";
import { Plus, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const AppWindow = ({ app, render }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(app.isMinimized);
  const [openedApps, setOpenedApps] = useAtom(openedAppsAtom);

  const [tabs, setTabs] = useAtom(browserTabsAtom);
  const [activeTabId, setActiveTabId] = useAtom(activeTabIdAtom);
  const [glassmorphic] = useAtom(glassmorphicAtom);

  const x = (window.innerWidth - 750) / 2; // Made wider for browser experience
  const y = (window.innerHeight - 550) / 2 - 20;

  useEffect(() => {
    setOpenedApps((prev) => {
      const index = prev.findIndex((item) => item.id === app.id);
      if (index === -1) return prev;
      const updated = [...prev];
      updated[index] = { ...updated[index], isMinimized: isMinimized }; // merge fields
      return updated;
    });
  }, [isMinimized]);

  useEffect(() => {
    setOpenedApps((prev) => {
      const index = prev.findIndex((item) => item.id === app.id);
      if (index === -1) return prev;
      const updated = [...prev];
      updated[index] = { ...updated[index], isFullScreen: isFullScreen };
      return updated;
    });
  }, [isFullScreen]);

  const closeApp = () => {
    setOpenedApps(openedApps.filter(item => item.id != app.id));
  };

  const handleAddTab = () => {
    const newId = Date.now();
    const newTab = {
      id: newId,
      title: "New Tab",
      url: "https://www.google.com/webhp?igu=1"
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
  };

  const handleCloseTab = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const newTabs = tabs.filter((t) => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  const getFaviconFromUrl = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      if (hostname === "localhost") return "/images/apps/chrome.svg";
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
    } catch {
      return "/images/apps/chrome.svg";
    }
  };

  const getTitleFromUrl = (url: string) => {
    try {
      if (url.includes("google.com/webhp")) return "Google";
      const hostname = new URL(url).hostname;
      if (hostname === "localhost") return "ChromeOS React";
      const domain = hostname.replace("www.", "").split(".")[0];
      return domain.charAt(0).toUpperCase() + domain.slice(1);
    } catch {
      return "New Tab";
    }
  };

  const isChromeApp = app.name === "Chrome";

  const chromeHeader = (
    <div
      className={cn(
        "flex flex-row items-center justify-between w-full h-[36px] px-2 select-none shrink-0 transition-colors",
        glassmorphic
          ? "bg-[#ffdbc1]/70 dark:bg-[#202124]/75 backdrop-blur-md"
          : "bg-[#ffdbc1] dark:bg-[#202124]"
      )}
    >
      {/* 1. Left: Tab search v & Tabs list */}
      <div className="flex items-end h-full overflow-hidden flex-1 pr-4">
        {/* Tab Search Chevron — card style like system tray */}
        <div className="h-[26px] w-[26px] flex items-center justify-center bg-white dark:bg-[#35363a] text-foreground/70 dark:text-neutral-300 hover:bg-white/80 dark:hover:bg-[#404144] rounded-lg cursor-pointer mb-[5px] mr-[6px] transition-colors">
          <ChevronDown className="size-4" />
        </div>

        {/* Tab Items */}
        <div className="flex items-end flex-1 h-full overflow-x-auto overflow-y-hidden scrollbar-none gap-[2px]">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={cn(
                  "group h-[30px] px-3 flex items-center gap-2 text-xs rounded-t-lg relative transition-all cursor-pointer w-[220px] min-w-[220px] shrink-0",
                  isActive
                    ? "bg-white dark:bg-[#35363a] text-zinc-800 dark:text-neutral-100 font-medium z-10"
                    : "text-zinc-600 dark:text-neutral-400 hover:bg-white/30 dark:hover:bg-[#35363a]/30"
                )}
              >
                {/* Favicon */}
                <img
                  src={getFaviconFromUrl(tab.url)}
                  alt=""
                  className="size-4 object-contain rounded-sm"
                  onError={(e) => {
                    e.currentTarget.src = "/images/apps/chrome.svg";
                  }}
                />

                {/* Title */}
                <span className="truncate flex-1 select-none">
                  {tab.title || getTitleFromUrl(tab.url)}
                </span>

                {/* Close tab */}
                {tabs.length > 1 && (
                  <button
                    onClick={(e) => handleCloseTab(tab.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-[2px] rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-all text-zinc-500 dark:text-neutral-300 cursor-pointer flex items-center justify-center"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Add Tab Button */}
          <button
            onClick={handleAddTab}
            className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-zinc-600 dark:text-neutral-400 hover:text-zinc-800 dark:hover:text-neutral-200 cursor-pointer ml-1 mb-1"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      {/* 2. Right: Window controls */}
      <div className="flex items-center h-full shrink-0 select-none">
        <button
          onClick={() => setIsMinimized(true)}
          className="w-8 h-8 rounded-md flex items-center justify-center text-zinc-700 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
        >
          <MinimizeIcon className="w-[10px] h-[10px]" />
        </button>
        <button
          onClick={() => setIsFullScreen(!isFullScreen)}
          className="w-8 h-8 rounded-md flex items-center justify-center text-zinc-700 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
        >
          {isFullScreen ? (
            <UnmaximizeIcon className="w-[10px] h-[10px]" />
          ) : (
            <MaximizeIcon className="w-[10px] h-[10px]" />
          )}
        </button>
        <button
          onClick={closeApp}
          className="w-8 h-8 rounded-md flex items-center justify-center text-zinc-700 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
        >
          <CloseIcon className="w-[10px] h-[10px]" />
        </button>
      </div>
    </div>
  );

  const nonChromeHeader = (
    <div
      className={cn(
        "flex flex-row items-center justify-between w-full h-[36px] px-3 select-none shrink-0 border-b border-foreground/5 dark:border-white/5 transition-colors",
        glassmorphic
          ? "bg-[#ffdbc1]/70 dark:bg-[#202124]/75 backdrop-blur-md"
          : "bg-[#ffdbc1] dark:bg-[#202124]"
      )}
    >
      {/* Left: Empty spacer */}
      <div className="flex-1 min-w-0 h-full" />

      {/* Right: Window controls */}
      <div className="flex items-center h-full shrink-0 select-none">
        <button
          onClick={() => setIsMinimized(true)}
          className="w-8 h-8 rounded-md flex items-center justify-center text-zinc-700 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
        >
          <MinimizeIcon className="w-[10px] h-[10px]" />
        </button>
        <button
          onClick={() => setIsFullScreen(!isFullScreen)}
          className="w-8 h-8 rounded-md flex items-center justify-center text-zinc-700 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
        >
          {isFullScreen ? (
            <UnmaximizeIcon className="w-[10px] h-[10px]" />
          ) : (
            <MaximizeIcon className="w-[10px] h-[10px]" />
          )}
        </button>
        <button
          onClick={closeApp}
          className="w-8 h-8 rounded-md flex items-center justify-center text-zinc-700 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
        >
          <CloseIcon className="w-[10px] h-[10px]" />
        </button>
      </div>
    </div>
  );

  const customHeader = isChromeApp ? chromeHeader : nonChromeHeader;

  return (
    <motion.div
      className="size-full"
      style={{ transformOrigin: "center center" }}
      initial={{ transform: "scale(0)", opacity: 0 }}
      animate={{ transform: "scale(1)", opacity: 1 }}
    >
      <DraggableWrapper
        defaultPosition={{ x: x, y: y }}
        className={cn(
          isFullScreen ? "rounded-none" : "rounded-lg",
          "border-0 p-0 transition-all duration-300",
          glassmorphic
            ? "!bg-white/70 dark:!bg-[#1c1c1e]/80 backdrop-blur-lg border border-white/10 dark:border-white/5"
            : ""
        )}
        title={app.name}
        width="min-w-fit"
        height="min-h-96"
        fullScreenWidth="100%"
        fullScreenHeight="100%"
        customWidth={app.defaultSize?.width ?? (isChromeApp ? 750 : 530)}
        customHeight={app.defaultSize?.height ?? 550}
        onFullScreenChange={setIsFullScreen}
        onMinimizeChange={setIsMinimized}
        externalFullScreen={isFullScreen}
        externalMinimized={isMinimized}
        headerContent={customHeader}
        closeButton={
          <Button onClick={closeApp} variant={"ghost"} size={"icon"} className="rounded-md p-0 size-fit">
            <CloseIcon className="text-foreground" />
          </Button>
        }
        maximizeButton={
          <Button variant={"ghost"} size={"icon"} className="rounded-md p-0 size-fit">
            {isFullScreen ? (
              <UnmaximizeIcon className="text-foreground" />
            ) : (
              <MaximizeIcon className="text-foreground" />
            )}
          </Button>
        }
        minimizeButton={
          <Button variant={"ghost"} size={"icon"} className="rounded-md p-0 size-fit">
            <MinimizeIcon className="text-foreground" />
          </Button>
        }
      >
        {render}
      </DraggableWrapper>
    </motion.div>
  );
};

export default AppWindow;
