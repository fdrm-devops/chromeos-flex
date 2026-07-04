import { LockIcon, EyeIcon, ChevronDown, ArrowRight, Power, LogOut, Wifi, Battery } from "lucide-react";

export function LockScreen() {
  return (
    <div className="w-screen h-screen bg-cover bg-[url('../src/assets/images/wallpapers/chromeos_wallpaper1.webp')]">
      <div className="backdrop-blur-sm bg-slate-800/90 w-screen h-screen">
        <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
          {/* Main login container */}
          <div className="flex flex-col items-center justify-center">
            {/* Profile picture */}
            <div className="mb-4 h-20 w-20 overflow-hidden rounded-full bg-orange-200">
              <div className="flex h-full w-full items-center justify-center">
                <div className="h-14 w-14 bg-[url('/placeholder.svg?height=56&width=56')] bg-contain bg-center bg-no-repeat"></div>
              </div>
            </div>

            {/* Username */}
            <div className="mb-6 flex items-center text-white">
              <span className="text-xl font-light">Kent Duke</span>
              <ChevronDown className="ml-1 h-5 w-5" />
            </div>

            {/* Password input */}
            <div className="relative mb-8 flex items-center">
              <div className="flex h-10 w-64 items-center rounded-md border border-white/30 bg-white/10 px-3 text-white backdrop-blur-sm">
                <LockIcon className="mr-2 h-4 w-4 text-white/70" />
                <input
                  type="password"
                  placeholder="Password"
                  className="flex-1 bg-transparent text-sm font-light outline-none placeholder:text-white/70"
                />
                <EyeIcon className="h-4 w-4 text-white/70" />
              </div>
              <button className="ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm">
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Bottom controls */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4">
            <div className="flex space-x-4">
              <button className="flex items-center rounded-full bg-white/10 px-3 py-2 text-sm text-white backdrop-blur-sm">
                <Power className="mr-2 h-4 w-4" />
                <span>Shut down</span>
              </button>
              <button className="flex items-center rounded-full bg-white/10 px-3 py-2 text-sm text-white backdrop-blur-sm">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </button>
            </div>

            <div className="flex items-center space-x-3 text-white">
              <Wifi className="h-5 w-5" />
              <Battery className="h-5 w-5" />
              <span className="text-sm">5:13</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
