"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import { 
  Search, 
  ArrowLeft,
  Wifi,
  Bluetooth,
  Smartphone,
  User,
  Laptop,
  Palette,
  Shield,
  Grid,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { 
  brightnessAtom, 
  nightLightAtom, 
  darkModeAtom, 
  glassmorphicAtom,
  wifiEnabledAtom,
  wifiNetworkAtom,
  bluetoothEnabledAtom
} from "@/atoms/system";

export default function Settings() {
  const [activeTab, setActiveTab] = useState<string>("Device");
  const [searchQuery, setSearchQuery] = useState("");

  // Atoms
  const [brightness, setBrightness] = useAtom(brightnessAtom);
  const [nightLight, setNightLight] = useAtom(nightLightAtom);
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);
  const [glassmorphic, setGlassmorphic] = useAtom(glassmorphicAtom);
  const [wifiEnabled, setWifiEnabled] = useAtom(wifiEnabledAtom);
  const [wifiNetwork] = useAtom(wifiNetworkAtom);
  const [bluetoothEnabled, setBluetoothEnabled] = useAtom(bluetoothEnabledAtom);

  const tabs = [
    { id: "Network", name: "Network", icon: Wifi, subtext: wifiEnabled ? wifiNetwork : "Off" },
    { id: "Bluetooth", name: "Bluetooth", icon: Bluetooth, subtext: bluetoothEnabled ? "On" : "Off" },
    { id: "Connected", name: "Connected devices", icon: Smartphone, subtext: "Connected to Google Pixel 10 Pr..." },
    { id: "Accounts", name: "Accounts", icon: User, subtext: "2 accounts" },
    { id: "Device", name: "Device", icon: Laptop, subtext: "Keyboard, touchpad, print" },
    { id: "Wallpaper", name: "Wallpaper and style", icon: Palette, subtext: "Dark theme, screen saver" },
    { id: "Privacy", name: "Privacy and security", icon: Shield, subtext: "Lock screen, controls" },
    { id: "Apps", name: "Apps", icon: Grid, subtext: "Notifications, permissions" }
  ];

  return (
    <div className="w-full flex flex-col h-full bg-[#ffece5] dark:bg-[#1a1a1c] text-[#4e2a00] dark:text-neutral-200 select-none overflow-hidden rounded-b-lg">
      
      {/* 1. TOP HEADER WITH SEARCH */}
      <div className="h-14 flex items-center justify-between px-6 shrink-0 bg-[#ffece5] dark:bg-[#1a1a1c] border-b border-foreground/5 dark:border-white/5">
        <div className="text-[15.5px] font-bold text-[#8d3b00] dark:text-[#fbb991] tracking-wide pl-2">Settings</div>
        
        {/* Search Capsule */}
        <div className="relative flex items-center bg-white dark:bg-zinc-800 rounded-full px-4 py-2.5 w-[420px] shadow-sm">
          <Search className="size-4.5 text-zinc-500 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search settings"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-[12.5px] outline-none w-full text-zinc-800 dark:text-neutral-200 placeholder:text-zinc-400"
          />
        </div>
        <div className="w-16" /> {/* spacer for visual symmetry */}
      </div>

      {/* 2. SIDEBAR AND CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar */}
        <div className="w-[280px] shrink-0 bg-[#ffece5] dark:bg-[#202124]/20 py-2 pl-4 pr-3 overflow-y-auto scrollbar-none">
          <div className="flex flex-col gap-1">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-4 px-4 h-10 w-full rounded-full text-left transition-all duration-200 cursor-pointer",
                    isActive
                      ? "bg-[oklch(0.49_0.11_66.55)] text-white shadow-sm"
                      : "hover:bg-foreground/5 text-[#5c3e21] dark:text-neutral-300"
                  )}
                >
                  <TabIcon className={cn("size-5.5 shrink-0", isActive ? "text-white dark:text-zinc-950" : "text-[#8d3b00] dark:text-neutral-400")} />
                  <div className="flex flex-col min-w-0">
                    <span className={cn("text-[12.5px] truncate leading-snug font-medium", isActive ? "text-white dark:text-zinc-950" : "text-zinc-900 dark:text-neutral-200")}>
                      {tab.name}
                    </span>
                    <span className={cn("text-[12.5px] truncate leading-none mt-0.5 font-normal", isActive ? "text-white/80 dark:text-zinc-900/70" : "text-zinc-500 dark:text-neutral-400")}>
                      {tab.subtext}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content Panel - Matches 100% the Screenshot Layout */}
        <div className="flex-1 bg-[#ffece5] dark:bg-[#1a1a1c] p-3 pl-1 pr-3 pb-3 overflow-hidden flex flex-col">
          
          <div className="size-full bg-white dark:bg-[#202124] rounded-[16px] p-6 overflow-y-auto scrollbar-none flex flex-col gap-6 shadow-sm text-zinc-800 dark:text-neutral-200">
            
            {/* DEVICE (DISPLAY) PANEL */}
            {activeTab === "Device" && (
              <div className="flex flex-col gap-5">
                
                {/* Back & Category Title */}
                <div className="flex items-center gap-3 text-[#8d3b00] dark:text-[#fbb991]">
                  <button className="p-1 hover:bg-foreground/5 rounded-full cursor-pointer transition-colors">
                    <ArrowLeft className="size-4.5" />
                  </button>
                  <span className="text-sm font-semibold tracking-wide">Display</span>
                </div>

                {/* Section 1: Built-in display */}
                <div className="bg-[#fdf8f5] dark:bg-[#2c2c2e] border border-[#ffece5]/20 dark:border-white/5 rounded-[16px] p-6 flex flex-col gap-6">
                  <div className="text-[12px] font-bold text-zinc-900 dark:text-neutral-200">Built-in display</div>
                  
                  {/* Slider: Brightness */}
                  <div className="grid grid-cols-12 items-center gap-4 pl-4">
                    <div className="col-span-6 flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-neutral-300">
                      <span>Display brightness</span>
                    </div>
                    <div className="col-span-6 flex items-center gap-4">
                      <Slider
                        value={[brightness]}
                        min={10}
                        max={100}
                        step={1}
                        onValueChange={([val]) => setBrightness(val)}
                        className="flex-1 cursor-pointer [&_[data-slot='slider-range']]:bg-[#8d3b00] dark:[&_[data-slot='slider-range']]:bg-[#fbb991] [&_[data-slot='slider-thumb']]:bg-[#8d3b00] dark:[&_[data-slot='slider-thumb']]:bg-[#fbb991] [&_[data-slot='slider-thumb']]:border-none [&_[data-slot='slider-thumb']]:size-3.5 [&_[data-slot='slider-track']]:bg-zinc-200 dark:[&_[data-slot='slider-track']]:bg-zinc-700 [&_[data-slot='slider-track']]:h-[3px]"
                      />
                    </div>
                  </div>

                  {/* Slider: Display and text size */}
                  <div className="grid grid-cols-12 items-center gap-4 pl-4">
                    <div className="col-span-6 flex flex-col text-xs font-semibold text-zinc-700 dark:text-neutral-300 pr-4">
                      <span>Display and text size</span>
                      <span className="text-[10px] text-zinc-500 font-medium leading-relaxed mt-0.5">
                        Make items on your screen, including text, smaller or larger.<br />Looks like 1182 x 665
                      </span>
                    </div>
                    <div className="col-span-6 flex flex-col gap-2 relative pt-2">
                      <Slider
                        value={[50]}
                        min={10}
                        max={100}
                        step={10}
                        className="flex-1 cursor-pointer [&_[data-slot='slider-range']]:bg-[#8d3b00] dark:[&_[data-slot='slider-range']]:bg-[#fbb991] [&_[data-slot='slider-thumb']]:bg-[#8d3b00] dark:[&_[data-slot='slider-thumb']]:bg-[#fbb991] [&_[data-slot='slider-thumb']]:border-none [&_[data-slot='slider-thumb']]:size-3.5 [&_[data-slot='slider-track']]:bg-zinc-200 dark:[&_[data-slot='slider-track']]:bg-zinc-700 [&_[data-slot='slider-track']]:h-[3px]"
                      />
                      <div className="flex justify-between text-[9px] font-bold text-zinc-400 px-0.5 mt-1">
                        <span>Small</span>
                        <span>Large</span>
                      </div>
                    </div>
                  </div>

                  {/* Dropdown: Orientation */}
                  <div className="grid grid-cols-12 items-center gap-4 pl-4 text-xs font-semibold text-zinc-700 dark:text-neutral-300">
                    <span className="col-span-8">Orientation</span>
                    <button className="col-span-4 flex items-center justify-between bg-[#fbeee6] dark:bg-zinc-800 text-zinc-800 dark:text-neutral-200 px-4 py-1.5 rounded-[8px] text-[11px] shadow-sm hover:bg-[#fbeee6]/80 dark:hover:bg-zinc-800/80 cursor-pointer border border-[#ffece5]/10">
                      <span>0° (Default)</span>
                      <ChevronDown className="size-3.5 text-zinc-500" />
                    </button>
                  </div>

                </div>

                {/* Section 2: Night Light */}
                <div className="bg-[#fdf8f5] dark:bg-[#2c2c2e] border border-[#ffece5]/20 dark:border-white/5 rounded-[16px] p-6 flex flex-col gap-6">
                  
                  {/* Night Light Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[12px] font-bold text-zinc-800 dark:text-neutral-200">Night Light</span>
                      <span className="text-[10px] text-zinc-500 font-semibold leading-relaxed">
                        Make it easier to look at your screen or read in dim light
                      </span>
                    </div>
                    <Switch
                      checked={nightLight}
                      onCheckedChange={setNightLight}
                      className="cursor-pointer data-[state=checked]:bg-[#8d3b00] dark:data-[state=checked]:bg-[#fbb991]"
                    />
                  </div>

                  {/* Dropdown: Schedule */}
                  <div className="grid grid-cols-12 items-center gap-4 pl-4 text-xs font-semibold text-zinc-700 dark:text-neutral-300">
                    <span className="col-span-8">Schedule</span>
                    <button className="col-span-4 flex items-center justify-between bg-[#fbeee6] dark:bg-zinc-800 text-zinc-800 dark:text-neutral-200 px-4 py-1.5 rounded-[8px] text-[11px] shadow-sm hover:bg-[#fbeee6]/80 dark:hover:bg-zinc-800/80 cursor-pointer border border-[#ffece5]/10">
                      <span>Never</span>
                      <ChevronDown className="size-3.5 text-zinc-500" />
                    </button>
                  </div>

                </div>

              </div>
            )}

            {/* NETWORK PANEL */}
            {activeTab === "Network" && (
              <div className="flex flex-col gap-5">
                <span className="text-sm font-semibold text-[#8d3b00] dark:text-[#fbb991]">Network</span>
                <div className="bg-[#fdf8f5] dark:bg-[#2c2c2e] border border-[#ffece5]/20 dark:border-white/5 rounded-[16px] p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold">Wi-Fi</span>
                      <span className="text-[10px] text-zinc-500">{wifiEnabled ? `Connected to ${wifiNetwork}` : "Off"}</span>
                    </div>
                    <Switch
                      checked={wifiEnabled}
                      onCheckedChange={setWifiEnabled}
                      className="cursor-pointer data-[state=checked]:bg-[#8d3b00] dark:data-[state=checked]:bg-[#fbb991]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* BLUETOOTH PANEL */}
            {activeTab === "Bluetooth" && (
              <div className="flex flex-col gap-5">
                <span className="text-sm font-semibold text-[#8d3b00] dark:text-[#fbb991]">Bluetooth</span>
                <div className="bg-[#fdf8f5] dark:bg-[#2c2c2e] border border-[#ffece5]/20 dark:border-white/5 rounded-[16px] p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold">Bluetooth</span>
                      <span className="text-[10px] text-zinc-500">{bluetoothEnabled ? "On" : "Off"}</span>
                    </div>
                    <Switch
                      checked={bluetoothEnabled}
                      onCheckedChange={setBluetoothEnabled}
                      className="cursor-pointer data-[state=checked]:bg-[#8d3b00] dark:data-[state=checked]:bg-[#fbb991]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* WALLPAPER AND STYLE PANEL */}
            {activeTab === "Wallpaper" && (
              <div className="flex flex-col gap-5">
                <span className="text-sm font-semibold text-[#8d3b00] dark:text-[#fbb991]">Wallpaper and style</span>
                
                <div className="bg-[#fdf8f5] dark:bg-[#2c2c2e] border border-[#ffece5]/20 dark:border-white/5 rounded-[16px] p-6 flex flex-col gap-6">
                  
                  {/* Toggle Dark Mode */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold">Dark theme</span>
                      <span className="text-[10px] text-zinc-500">Enable dark theme class across the system</span>
                    </div>
                    <Switch
                      checked={darkMode}
                      onCheckedChange={(checked) => {
                        setDarkMode(checked);
                        document.documentElement.classList.toggle("dark", checked);
                      }}
                      className="cursor-pointer data-[state=checked]:bg-[#8d3b00] dark:data-[state=checked]:bg-[#fbb991]"
                    />
                  </div>

                  <div className="h-[1px] bg-foreground/5 dark:bg-white/5" />

                  {/* Toggle Glassmorphism */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold">Glassmorphic Effects</span>
                      <span className="text-[10px] text-zinc-500">Enable glass transparency on taskbar and windows</span>
                    </div>
                    <Switch
                      checked={glassmorphic}
                      onCheckedChange={setGlassmorphic}
                      className="cursor-pointer data-[state=checked]:bg-[#8d3b00] dark:data-[state=checked]:bg-[#fbb991]"
                    />
                  </div>

                </div>
              </div>
            )}

            {/* FALLBACK INFO PANEL */}
            {["Connected", "Accounts", "Privacy", "Apps"].includes(activeTab) && (
              <div className="flex flex-col gap-5">
                <span className="text-sm font-semibold text-[#8d3b00] dark:text-[#fbb991]">{activeTab}</span>
                <div className="bg-[#fdf8f5] dark:bg-[#2c2c2e] border border-[#ffece5]/20 dark:border-white/5 rounded-[16px] p-6 flex items-center justify-center text-xs text-zinc-400 dark:text-neutral-500 shadow-sm h-36">
                  No configurations settings for this section inside simulation model.
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
