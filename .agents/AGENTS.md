# ChromeOS Flex Simulator Workspace Rules

This file defines the strict design system, styling guidelines, and state management practices for future coding agents working on the `chrome-os` project. All subsequent updates MUST adhere to these rules.

---

## 🎨 1. Material Design 3 & Theme Color Standards
All components must align with the current warm/peach Material You theme:
*   **Primary Accent (`--primary`)**: `#fbb991` (Peach). Used for active toggles, selected items, active volume/brightness slider fills.
*   **On Primary**: `text-zinc-900` or `text-black` (dark text) when overlaid on the primary accent.
*   **Surface Container (Headers)**:
    *   Light Mode: `#ffdbc1` (Warm Peach/Sand)
    *   Dark Mode: `#202124` (Charcoal Gray)
*   **Secondary/Inactive Button Backgrounds**:
    *   Light Mode: `#f7eeef` (Light Pink-Gray)
    *   Dark Mode: `rgba(255, 255, 255, 0.1)` (`bg-white/10`)
*   **Outline Variants (Borders/Dividers)**:
    *   Light Mode: `border-foreground/5`
    *   Dark Mode: `border-white/5`

---

## 🪟 2. App Window Layout & Header Standards
*   **Header Height**: Exactly `36px` (`h-[36px]`). Applies to the browser toolbar and all non-browser window headers.
*   **Window Controls (Minimize, Maximize, Close)**:
    *   Must be `size-8` (`h-8 w-8`) button containers.
    *   Must house exact `size-[10px]` vector icons.
    *   Close button hover color must be standard gray (`hover:bg-black/5` / `dark:hover:bg-white/10`), NOT red.
*   **Border Radius**:
    *   Normal mode: `rounded-lg` (rounded corners).
    *   Maximized/Fullscreen mode: `rounded-none` / radius 0.
    *   White corners leak prevention: The header itself must NOT contain border-radius classes. Corner rounding is handled entirely by the parent `DraggableWrapper` card overlay wrapper.

---

## 🔮 3. Glassmorphism Design System
All floating system panels and window cards must read and respect the state of `glassmorphicAtom` (`glassmorphic` boolean):
*   **When Enabled**:
    *   **Shelf (Taskbar)**: `bg-background/60 backdrop-blur-md border-t border-white/10 dark:border-white/5`
    *   **Popovers (Launcher, Calendar, SystemTray)**: `bg-background/80 backdrop-blur-md border border-white/10 dark:border-white/5`
    *   **Jendela Aplikasi Wrapper**: `!bg-white/70 dark:!bg-[#1c1c1e]/80 backdrop-blur-lg border border-white/10 dark:border-white/5`
    *   **Jendela Aplikasi Header**: `bg-[#ffdbc1]/70 dark:bg-[#202124]/75 backdrop-blur-md`
*   **When Disabled**:
    *   Fallback immediately to standard solid colors (`bg-background` or default border classes).
*   **App Body Exemption**: The client area/inner body of applications (like `Browser.tsx` iframe or settings panel) must remain **opaque** and solid for readability.

---

## 💾 4. Jotai State Persistence Standards
All configurations, layout states, history, and browser tabs must be persistent across browser refreshes using `atomWithStorage` from `jotai/utils`.
*   **React JSX Serialization Constraint**:
    *   Do NOT store React elements (`render: <Component />`) directly in Jotai persistent atoms as they fail JSON serialization.
    *   **Best Practice**: Store only serializable arrays of `id`s (e.g. `[1, 2, 3]`) or configuration parameters. Use dynamic getter/setter atoms to map these IDs back to the actual static React elements defined in constants.
*   **Dark Mode Syncing**:
    *   Ensure dark mode theme classes (`document.documentElement.classList.toggle("dark")`) are synchronized in a global `useEffect` at boot time to prevent visual flashes.

---

## 🚀 5. Boot Screen Specifications
*   The ChromeOS Flex boot screen must remain static. **No blinking or pulsing** text/logo effects.
*   Enlarged scale standard: Logo `h-[70px] md:h-[88px]`, Text Google Sans `text-[42px] md:text-[54px]`, content: "chromeOS | rexpro".
