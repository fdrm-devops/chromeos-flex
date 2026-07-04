import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useAtom } from "jotai";
import {
  volumeAtom,
  brightnessAtom,
  nightLightAtom,
  darkModeAtom,
  wifiEnabledAtom,
  wifiNetworkAtom,
  bluetoothEnabledAtom,
  dndEnabledAtom,
  glassmorphicAtom,
} from "@/atoms/system";

const SystemTray = () => {
  const [volume, setVolume] = useAtom(volumeAtom);
  const [brightness, setBrightness] = useAtom(brightnessAtom);
  const [nightLight, setNightLight] = useAtom(nightLightAtom);
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);
  const [wifiEnabled, setWifiEnabled] = useAtom(wifiEnabledAtom);
  const [wifiNetwork] = useAtom(wifiNetworkAtom);
  const [bluetoothEnabled, setBluetoothEnabled] = useAtom(bluetoothEnabledAtom);
  const [dndEnabled, setDndEnabled] = useAtom(dndEnabledAtom);
  const [glassmorphic, setGlassmorphic] = useAtom(glassmorphicAtom);

  return (
    <div className="flex flex-col w-[21.5rem]">
      <div className="grid grid-cols-4 gap-2 w-full text-zinc-800 dark:text-neutral-200">
        {/* Wi-Fi */}
        <Button
          onClick={() => setWifiEnabled(!wifiEnabled)}
          className={cn(
            "col-span-2 shadow-none gap-2 px-4 rounded-2xl h-[3.8rem] w-full flex items-center justify-start font-normal cursor-pointer transition-colors",
            wifiEnabled
              ? "bg-[#fbb991] text-zinc-900 hover:bg-[#fbb991]/90"
              : "bg-[#f7eeef] text-zinc-800 dark:bg-white/10 dark:text-white hover:bg-[#f7eeef]/95 dark:hover:bg-white/15"
          )}
        >
          <div className="flex flex-1 items-center gap-3">
            <span className="icon text-xl">
              {wifiEnabled ? "signal_wifi_4_bar" : "wifi_off"}
            </span>
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-sm font-semibold leading-tight">
                {wifiEnabled ? wifiNetwork : "Wi-Fi"}
              </span>
              <span className="text-xs leading-tight font-medium opacity-80">
                {wifiEnabled ? "Connected" : "Off"}
              </span>
            </div>
          </div>
          {wifiEnabled && (
            <span className="icon text-xl">chevron_right</span>
          )}
        </Button>

        {/* Screen Capture */}
        <Button className="col-span-1 whitespace-normal shadow-none gap-1 rounded-2xl h-[3.8rem] w-full bg-[#f7eeef] text-zinc-800 dark:bg-white/10 dark:text-white hover:bg-[#f7eeef]/95 dark:hover:bg-white/15 flex flex-col items-center justify-center font-normal cursor-pointer">
          <span className="icon text-xl font-semibold">square_dot</span>
          <span className="text-[11px] font-medium leading-tight text-center">Screen Capture</span>
        </Button>

        {/* Do Not Disturb */}
        <Button
          onClick={() => setDndEnabled(!dndEnabled)}
          className={cn(
            "col-span-1 whitespace-normal shadow-none gap-1 rounded-2xl h-[3.8rem] w-full flex flex-col items-center justify-center font-normal cursor-pointer transition-colors",
            dndEnabled
              ? "bg-[#fbb991] text-zinc-900 hover:bg-[#fbb991]/90"
              : "bg-[#f7eeef] text-zinc-800 dark:bg-white/10 dark:text-white hover:bg-[#f7eeef]/95 dark:hover:bg-white/15"
          )}
        >
          <span className="icon text-xl font-semibold">
            {dndEnabled ? "do_not_disturb_on" : "do_not_disturb_off"}
          </span>
          <span className="text-[11px] font-medium leading-tight text-center">
            {dndEnabled ? "DND On" : "Do Not Disturb"}
          </span>
        </Button>

        {/* Bluetooth */}
        <Button
          onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
          className={cn(
            "col-span-2 shadow-none gap-2 px-4 rounded-2xl h-[3.8rem] w-full flex items-center justify-start font-normal cursor-pointer transition-colors",
            bluetoothEnabled
              ? "bg-[#fbb991] text-zinc-900 hover:bg-[#fbb991]/90"
              : "bg-[#f7eeef] text-zinc-800 dark:bg-white/10 dark:text-white hover:bg-[#f7eeef]/95 dark:hover:bg-white/15"
          )}
        >
          <div className="flex flex-1 items-center gap-3">
            <span className="icon text-xl font-semibold">
              {bluetoothEnabled ? "bluetooth" : "bluetooth_disabled"}
            </span>
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-sm font-semibold leading-tight">Bluetooth</span>
              <span className="text-xs leading-tight font-medium opacity-80">
                {bluetoothEnabled ? "On" : "Off"}
              </span>
            </div>
          </div>
          {bluetoothEnabled && (
            <span className="icon text-xl font-semibold">chevron_right</span>
          )}
        </Button>

        {/* Night Light */}
        <Button
          onClick={() => setNightLight(!nightLight)}
          className={cn(
            "col-span-1 whitespace-normal shadow-none gap-1 rounded-2xl h-[3.8rem] w-full flex flex-col items-center justify-center font-normal cursor-pointer transition-colors",
            nightLight
              ? "bg-[#fbb991] text-zinc-900 hover:bg-[#fbb991]/90"
              : "bg-[#f7eeef] text-zinc-800 dark:bg-white/10 dark:text-white hover:bg-[#f7eeef]/95 dark:hover:bg-white/15"
          )}
        >
          <span className="icon text-xl font-semibold">
            {nightLight ? "nightlight" : "nightlight"}
          </span>
          <span className="text-[11px] font-medium leading-tight text-center">
            Night Light
          </span>
        </Button>

        {/* Dark Mode */}
        <Button
          onClick={() => {
            setDarkMode(!darkMode);
            document.documentElement.classList.toggle("dark", !darkMode);
          }}
          className={cn(
            "col-span-1 whitespace-normal shadow-none gap-1 rounded-2xl h-[3.8rem] w-full flex flex-col items-center justify-center font-normal cursor-pointer transition-colors",
            darkMode
              ? "bg-[#fbb991] text-zinc-900 hover:bg-[#fbb991]/90"
              : "bg-[#f7eeef] text-zinc-800 dark:bg-white/10 dark:text-white hover:bg-[#f7eeef]/95 dark:hover:bg-white/15"
          )}
        >
          <span className="icon text-xl font-semibold">
            {darkMode ? "dark_mode" : "light_mode"}
          </span>
          <span className="text-[11px] font-medium leading-tight text-center">
            {darkMode ? "Dark" : "Light"}
          </span>
        </Button>

        {/* Cast Screen */}
        <Button className="col-span-2 shadow-none gap-2 px-4 rounded-2xl h-[3.8rem] w-full bg-[#f7eeef] text-zinc-800 dark:bg-white/10 dark:text-white hover:bg-[#f7eeef]/95 dark:hover:bg-white/15 flex items-center justify-start font-normal cursor-pointer">
          <div className="flex flex-1 items-center gap-3">
            <span className="icon text-xl font-semibold">cast</span>
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-sm font-semibold leading-tight">Cast Screen</span>
              <span className="text-xs leading-tight opacity-75">No devices</span>
            </div>
          </div>
          <span className="icon text-xl font-semibold">chevron_right</span>
        </Button>

        {/* Glassmorphism Toggle */}
        <Button
          onClick={() => setGlassmorphic(!glassmorphic)}
          className={cn(
            "col-span-2 shadow-none gap-2 px-4 rounded-2xl h-[3.8rem] w-full flex items-center justify-start font-normal cursor-pointer transition-colors",
            glassmorphic
              ? "bg-[#fbb991] text-zinc-900 hover:bg-[#fbb991]/90"
              : "bg-[#f7eeef] text-zinc-800 dark:bg-white/10 dark:text-white hover:bg-[#f7eeef]/95 dark:hover:bg-white/15"
          )}
        >
          <div className="flex flex-1 items-center gap-3">
            <span className="icon text-xl font-semibold">blur_on</span>
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-sm font-semibold leading-tight">Glass Effect</span>
              <span className="text-xs leading-tight opacity-80">
                {glassmorphic ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        </Button>

        {/* --- VOLUME SLIDER --- */}
        <div className="col-span-4 flex items-center justify-between mt-4 w-full">
          <div className="relative flex items-center w-full max-w-[15rem] h-8">
            <span
              className={cn(
                "absolute left-2.5 icon text-xl z-20 pointer-events-none select-none",
                volume <= 1
                  ? "text-zinc-500 dark:text-neutral-400"
                  : "text-zinc-900"
              )}
              style={{ fontVariationSettings: "'FILL' 1, 'wght' 700, 'opsz' 48" }}
            >
              {volume <= 1 ? "volume_off" : "volume_up"}
            </span>

            <Slider
              value={[volume]}
              max={100}
              step={1}
              min={0}
              onValueChange={([val]) => setVolume(val)}
              className={cn(
                "w-full z-10",
                "[&_[data-slot='slider-track']]:bg-transparent",
                "[&_[data-slot='slider-track']]:data-[orientation=horizontal]:h-8",
                "[&_[data-slot='slider-range']]:rounded-full",
                "[&_[data-slot='slider-range']]:min-w-8",

                volume <= 1
                  ? "[&_[data-slot='slider-range']]:bg-zinc-300 dark:[&_[data-slot='slider-range']]:bg-zinc-600"
                  : "[&_[data-slot='slider-range']]:bg-[#fbb991]",

                "[&_[data-slot='slider-thumb']]:invisible"
              )}
            />

            <div
              className={cn(
                "absolute h-[4px] rounded-full w-full z-0 transition-colors",
                volume <= 1
                  ? "bg-[#d1c0b8] dark:bg-zinc-700"
                  : "bg-[#f5edeb] dark:bg-white/10"
              )}
            ></div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button className="bg-[#f7eeef] text-zinc-800 dark:bg-white/10 dark:text-white hover:bg-[#f7eeef]/90 dark:hover:bg-white/15 rounded-full px-2 shadow-none size-9 flex items-center justify-center" variant={"secondary"} size={"icon"}>
              <span className="icon text-xl icon-weight-600">subtitles_off</span>
            </Button>
            <Button className="text-zinc-800 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5" variant={"ghost"} size={"icon"}>
              <span className="icon text-xl icon-weight-600">chevron_right</span>
            </Button>
          </div>
        </div>

        {/* --- BRIGHTNESS SLIDER --- */}
        <div className="col-span-4 flex items-center justify-between w-full">
          <div className="relative flex items-center w-full max-w-[15rem] h-8">
            <span
              className={cn(
                "absolute left-2.5 icon text-xl z-20 pointer-events-none select-none",
                brightness <= 10
                  ? "text-zinc-500 dark:text-neutral-400"
                  : "text-zinc-900"
              )}
              style={{ fontVariationSettings: "'wght' 700, 'opsz' 48" }}
            >
              brightness_7
            </span>

            <Slider
              value={[brightness]}
              max={100}
              step={1}
              min={10}
              onValueChange={([val]) => setBrightness(val)}
              className={cn(
                "w-full z-10",
                "[&_[data-slot='slider-track']]:bg-transparent",
                "[&_[data-slot='slider-track']]:data-[orientation=horizontal]:h-8",
                "[&_[data-slot='slider-range']]:rounded-full",
                "[&_[data-slot='slider-range']]:min-w-8",

                brightness <= 10
                  ? "[&_[data-slot='slider-range']]:bg-zinc-300 dark:[&_[data-slot='slider-range']]:bg-zinc-600"
                  : "[&_[data-slot='slider-range']]:bg-[#fbb991]",

                "[&_[data-slot='slider-thumb']]:invisible"
              )}
            />

            <div
              className={cn(
                "absolute h-[4px] rounded-full w-full z-0 transition-colors",
                brightness <= 10
                  ? "bg-[#d1c0b8] dark:bg-zinc-700"
                  : "bg-[#f5edeb] dark:bg-white/10"
              )}
            ></div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={() => setNightLight(!nightLight)}
              className={cn(
                "rounded-full px-2 transition-colors shadow-none size-9 flex items-center justify-center",
                nightLight
                  ? "bg-[#fbb991] text-zinc-900 hover:bg-[#fbb991]/90"
                  : "bg-[#f7eeef] text-zinc-800 dark:bg-white/10 dark:text-white hover:bg-[#f7eeef]/90 dark:hover:bg-white/15"
              )}
              variant={"secondary"}
              size={"icon"}
            >
              <span className="icon text-xl icon-weight-600">contrast_rtl_off</span>
            </Button>
            <Button className="text-zinc-800 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5" variant={"ghost"} size={"icon"}>
              <span className="icon text-xl icon-weight-600">chevron_right</span>
            </Button>
          </div>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="col-span-4 flex items-center justify-between gap-2 mt-4 text-zinc-700 dark:text-neutral-300">
          <div>
            <Button
              className="bg-[#f7eeef] text-zinc-800 dark:bg-white/10 dark:text-white hover:bg-[#f7eeef]/90 dark:hover:bg-white/15 rounded-full px-2 py-1.5 shadow-none size-fit flex items-center"
              variant={"secondary"}
            >
              <span className="icon text-xl mr-1" style={{ fontVariationSettings: "'wght' 700, 'opsz' 48" }}>
                mode_off_on
              </span>
              <span className="icon text-xl" style={{ fontVariationSettings: "'wght' 700, 'opsz' 48" }}>
                keyboard_arrow_down
              </span>
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold opacity-85">92% - 11:50 left</span>
            <Button className="bg-[#f7eeef] text-zinc-800 dark:bg-white/10 dark:text-white hover:bg-[#f7eeef]/90 dark:hover:bg-white/15 rounded-full px-2 shadow-none size-9 flex items-center justify-center" variant={"secondary"} size={"icon"}>
              <span className="icon text-[20px] icon-weight-600 icon-rounded">settings</span>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SystemTray;