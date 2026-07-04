import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useAtom } from "jotai";
import { browserTabsAtom, activeTabIdAtom } from "@/atoms/app";
import { ArrowLeft, ArrowRight, RotateCw, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export const Browser = ({ link = "", isChrome = false }) => {
  const [tabs, setTabs] = useAtom(browserTabsAtom);
  const [activeTabId] = useAtom(activeTabIdAtom);
  const [urlInput, setUrlInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const activeTab = tabs.find((t) => t.id === activeTabId);
  const currentUrl = activeTab?.url || link || "https://www.google.com/webhp?igu=1";

  useEffect(() => {
    if (!isFocused && activeTab) {
      setUrlInput(activeTab.url || "");
    }
  }, [activeTab?.url, activeTabId, isFocused]);

  const navigateTo = (url: string) => {
    let finalUrl = url.trim();
    if (!finalUrl) return;
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      // If it looks like a URL, prepend https
      if (finalUrl.includes(".") && !finalUrl.includes(" ")) {
        finalUrl = "https://" + finalUrl;
      } else {
        // Otherwise treat as a search
        finalUrl = `https://www.google.com/search?q=${encodeURIComponent(finalUrl)}&igu=1`;
      }
    }
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId ? { ...t, url: finalUrl, title: getTitleFromUrl(finalUrl) } : t
      )
    );
    setUrlInput(finalUrl);
  };

  const getTitleFromUrl = (url: string) => {
    try {
      if (url.includes("google.com/webhp") || url.includes("google.com/search")) return "Google";
      const hostname = new URL(url).hostname;
      if (hostname === "localhost") return "ChromeOS React";
      const domain = hostname.replace("www.", "").split(".")[0];
      return domain.charAt(0).toUpperCase() + domain.slice(1);
    } catch {
      return "New Tab";
    }
  };

  const getDisplayUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname + (parsed.pathname !== "/" ? parsed.pathname : "");
    } catch {
      return url;
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      navigateTo(urlInput);
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = currentUrl;
    }
  };

  // PWA mode: just iframe
  if (!isChrome) {
    return (
      <iframe
        src={link ?? "https://www.google.com/webhp?igu=1"}
        width="100%"
        height="100%"
        style={{
          display: "block",
          position: "relative",
        }}
        frameBorder="0"
        allowFullScreen
      />
    );
  }

  // Chrome mode: address bar + iframe
  return (
    <div className="flex flex-col size-full bg-white dark:bg-[#202124]">
      {/* Navigation / Address Bar */}
      <div className="flex items-center gap-1.5 px-2 py-1.5 bg-white dark:bg-[#35363a] shrink-0">
        {/* Nav buttons */}
        <div className="flex items-center gap-0">
          <button className="p-1.5 rounded-full text-foreground/35 cursor-not-allowed">
            <ArrowLeft className="size-[18px]" />
          </button>
          <button className="p-1.5 rounded-full text-foreground/35 cursor-not-allowed">
            <ArrowRight className="size-[18px]" />
          </button>
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-full text-zinc-800 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer transition-colors"
          >
            <RotateCw className="size-[16px]" />
          </button>
        </div>

        {/* URL Bar — with bookmark star inside */}
        <div
          className={cn(
            "flex-1 flex items-center bg-[#f1f3f4] dark:bg-[#202124] rounded-full pl-2 pr-3 py-1.5 transition-all gap-2",
            isFocused ? "bg-white dark:bg-[#202124] ring-2 ring-blue-500 dark:ring-blue-400 shadow-md" : ""
          )}
        >
          {!isFocused && (
            <div className="size-6 bg-white dark:bg-[#292a2d] rounded-full flex items-center justify-center shrink-0">
              <span className="icon text-[16px] text-zinc-800 dark:text-neutral-200" style={{ fontVariationSettings: "'wght' 500" }}>info</span>
            </div>
          )}
          <input
            type="text"
            value={isFocused ? urlInput : getDisplayUrl(urlInput)}
            onChange={(e) => setUrlInput(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setUrlInput(currentUrl);
            }}
            onBlur={() => {
              setIsFocused(false);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-zinc-800 dark:text-neutral-100 outline-none placeholder:text-zinc-500 dark:placeholder:text-neutral-500"
            placeholder="Search Google or type a URL"
          />
          {/* Bookmark star — inside address bar, far right */}
          <button className="p-0.5 rounded-full text-zinc-700 dark:text-neutral-300 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer shrink-0 flex items-center justify-center">
            <span className="icon text-[20px] leading-none" style={{ fontVariationSettings: "'wght' 400" }}>star</span>
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-0.5 select-none shrink-0 pr-1">
          {/* Extension puzzle icon */}
          <button className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-800 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer">
            <span className="icon text-[20px] leading-[0]" style={{ fontVariationSettings: "'wght' 400" }}>extension</span>
          </button>

          {/* Vertical divider */}
          <div className="h-4 w-[1px] bg-foreground/15 mx-1" />

          {/* Download icon */}
          <button className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-800 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer">
            <span className="icon text-[20px] leading-[0]" style={{ fontVariationSettings: "'wght' 400" }}>download</span>
          </button>

          {/* Profile User icon — replaced with Chrome logo */}
          <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer">
            <img
              src="/images/apps/chrome.svg"
              alt="Chrome Logo"
              className="size-[18px] object-contain"
            />
          </button>

          {/* More menu */}
          <button className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-800 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer">
            <MoreVertical className="size-[18px]" />
          </button>
        </div>
      </div>

      {/* Iframe Content */}
      <iframe
        ref={iframeRef}
        src={currentUrl}
        width="100%"
        className="flex-1"
        style={{
          display: "block",
          position: "relative",
          border: "none",
        }}
        allowFullScreen
      />
    </div>
  );
};