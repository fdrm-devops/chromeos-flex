import { useState, useEffect } from "react";
import Desktop from "./components/core/Desktop";
import { cn } from "./lib/utils";

function App() {
  const [showBoot, setShowBoot] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Check if browser has booted before
    const hasBooted = localStorage.getItem("chromeos_has_booted");
    if (!hasBooted) {
      setShowBoot(true);
      
      // Start fade out animation at 9.3 seconds
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 9300);

      // Completely remove boot screen element at 10 seconds
      const bootTimer = setTimeout(() => {
        setShowBoot(false);
        localStorage.setItem("chromeos_has_booted", "true");
      }, 10000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(bootTimer);
      };
    }
  }, []);

  return (
    <>
      <Desktop />
      
      {showBoot && (
        <div
          className={cn(
            "w-screen h-screen bg-black flex items-center justify-center select-none overflow-hidden transition-opacity duration-700 ease-out z-[9999] fixed inset-0",
            isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
        >
          <div className="flex items-center gap-6">
            <img
              src="/images/apps/boot-logo.svg"
              alt="Chrome Logo"
              className="h-[70px] md:h-[88px] w-auto object-contain select-none pointer-events-none"
            />
            <span className="text-white text-[42px] md:text-[54px] font-normal tracking-wide select-none" style={{ fontFamily: "'Google Sans', sans-serif" }}>
              chromeOS | rexpro
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
