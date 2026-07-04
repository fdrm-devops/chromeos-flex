import { atomWithStorage } from "jotai/utils";

// Volume: 0-100
export const volumeAtom = atomWithStorage<number>('chromeos_sys_volume', 50);

// Brightness: 10-100 (min 10 so screen never goes fully black)
export const brightnessAtom = atomWithStorage<number>('chromeos_sys_brightness', 100);

// Night Light (warm filter)
export const nightLightAtom = atomWithStorage<boolean>('chromeos_sys_night_light', false);

// Dark mode
export const darkModeAtom = atomWithStorage<boolean>('chromeos_sys_dark_mode', false);

// Wi-Fi
export const wifiEnabledAtom = atomWithStorage<boolean>('chromeos_sys_wifi_enabled', true);
export const wifiNetworkAtom = atomWithStorage<string>('chromeos_sys_wifi_network', "Starlink");

// Bluetooth
export const bluetoothEnabledAtom = atomWithStorage<boolean>('chromeos_sys_bluetooth_enabled', true);

// Do Not Disturb
export const dndEnabledAtom = atomWithStorage<boolean>('chromeos_sys_dnd_enabled', false);

// Glassmorphism UI effect
export const glassmorphicAtom = atomWithStorage<boolean>('chromeos_sys_glassmorphic', true);

