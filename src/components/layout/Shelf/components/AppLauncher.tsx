import { ReactComponent as GoogleLogo } from "@/assets/images/apps/google.svg";
import { ReactComponent as Trapezoid } from "@/assets/shapes/trapezoid.svg";
import { Input } from "@/components/ui/input";
import { STAR_MENU_APPS, STAR_MENU_DEFAULT_APPS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { openedAppsAtom } from "@/atoms/app";
import { useAtom } from "jotai";
import { Browser } from "@/components/apps/Browser";

const AppLauncher = () => {
  const [searchText, setSearchText] = useState("");
  const [searchTextValue] = useDebounce(searchText, 300);

  const [_, setOpenedApps] = useAtom(openedAppsAtom);

  const openApp = (newApp) => {
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

  return (
    <div className="size-full flex flex-col overflow-hidden relative">

      {/* 1. SEARCH BAR HEADER */}
      <div className="flex items-center w-full pl-0 pr-4 py-3 border-b border-foreground/10 shrink-0 relative gap-2 h-14">
        {/* Trapezoid indicator menempel mutlak di paling kiri kontainer luar */}
        <div className="absolute left-0 top-0 bottom-1 flex items-center justify-center w-3 pl-1">
          <Trapezoid className={cn(searchTextValue && "invisible", "w-1 h-5 text-amber-500")} />
        </div>

        {/* Google Logo - Margin left disesuaikan agar pas di sebelah garis */}
        <div className="ml-4 flex items-center justify-center shrink-0">
          <GoogleLogo className="size-5" />
        </div>

        {/* Input Field */}
        <Input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="flex-1 p-0 px-2 border-0 outline-0 ring-0 focus-visible:ring-0 shadow-none placeholder:text-foreground/50 bg-transparent text-sm"
          type="text"
          placeholder="Search your shortcuts, files, apps and more..."
        />

        {/* Lens & Gemini Icons */}
        <div className="flex items-center gap-3 pr-1 shrink-0">
          <div className="p-1 rounded-full flex items-center justify-center">
            <img src="/images/apps/lens.png" alt="Google Lens" className="size-5 object-contain" />
          </div>
          <div className="p-1 rounded-full flex items-center justify-center">
            <img src="/images/apps/gemini.png" alt="Gemini" className="size-5 object-contain" />
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      {searchTextValue.length > 0 ? (
        // Tampilan Hasil Search (Full Scrollable)
        <div className="flex-1 w-full pt-3 pb-6 overflow-y-auto scrollbar-none">
          <motion.div initial={{ translateY: 20, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} className="flex flex-col">
            <span className="text-foreground/60 text-xs font-medium px-6 pb-2">Apps</span>
            {STAR_MENU_DEFAULT_APPS.map((app, index) => (
              <div
                key={app.name + index}
                className="flex justify-start m-0 p-0 cursor-grab active:cursor-grabbing"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("application/json", JSON.stringify({ id: app.id }));
                }}
              >
                <Button
                  onClick={() => openApp(app)}
                  variant={"ghost"}
                  className={cn(
                    index === 0 && "bg-foreground/5",
                    "flex items-center justify-start p-0 rounded-none h-11 w-full font-medium hover:bg-foreground/5"
                  )}
                >
                  <div className={cn(index === 0 && "border-l-2 border-amber-500", "flex items-center justify-start px-6 py-1.5 w-full h-full")}>
                    <img src={app.icon} className="size-5" alt="" />
                    <span className="text-foreground/90 font-normal text-xs px-3">{app.name}</span>
                  </div>
                </Button>
              </div>
            ))}
          </motion.div>
        </div>
      ) : (
        // Tampilan Default Menu Utama
        <div className="flex-1 flex flex-col overflow-hidden">
          <Accordion type="single" collapsible className="w-full shrink-0 px-6 pt-2">
            <AccordionItem value="item-1" className="border-b-0">
              <AccordionTrigger className="text-foreground/70 text-xs font-medium hover:no-underline py-2">
                Continue where you left off
              </AccordionTrigger>
              <AccordionContent asChild>
                {/* Bagian Pintasan Atas (Fixed, tidak ikut ter-scroll) */}
                <div className="grid grid-cols-5 gap-y-6 border-b py-4 border-foreground/10 w-full justify-items-center">
                  {STAR_MENU_DEFAULT_APPS.slice(0, 5).map((app, index) => (
                    <div
                      key={app.name + index}
                      className="w-full flex justify-center cursor-grab active:cursor-grabbing"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("application/json", JSON.stringify({ id: app.id }));
                      }}
                    >
                      <Button
                        onClick={() => openApp(app)}
                        variant={"ghost"}
                        className="flex flex-col items-center p-0 h-auto w-16 font-medium hover:bg-transparent group"
                      >
                        <div className="p-1 rounded-full group-hover:bg-foreground/5 transition-colors">
                          <img src={app.icon} className="size-10 object-contain" alt={app.name} />
                        </div>
                        <span className="text-foreground/80 font-normal text-[11px] mt-1.5 text-center truncate w-full px-1">
                          {app.name}
                        </span>
                      </Button>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Hanya Grid Utama "All Apps" di bawah yang dipasang ScrollArea */}
          <div className="flex-1 w-full px-6 pb-6 overflow-y-auto scrollbar-none">
            <motion.div
              transition={{ duration: 0.25, ease: "easeInOut" }}
              initial={{ translateY: 15, opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              className="pt-2"
            >
              <div className="grid grid-cols-5 gap-y-7 w-full justify-items-center">
                {STAR_MENU_APPS.map((app, index) => (
                  <div
                    key={app.name + index}
                    className="w-full flex justify-center cursor-grab active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("application/json", JSON.stringify({ id: app.id }));
                    }}
                  >
                    <Button
                      onClick={() => openApp(app)}
                      variant={"ghost"}
                      className="flex flex-col items-center p-0 h-auto w-16 font-medium hover:bg-transparent group"
                    >
                      <div className="p-1 rounded-full group-hover:bg-foreground/5 transition-colors">
                        <img src={app.icon} className="size-10 object-contain" alt={app.name} />
                      </div>
                      <span className="text-foreground/80 font-normal text-[11px] mt-1.5 text-center truncate w-full px-1">
                        {app.name}
                      </span>
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppLauncher;