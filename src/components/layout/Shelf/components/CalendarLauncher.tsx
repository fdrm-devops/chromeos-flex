import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Settings, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const CalendarLauncher = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Generasi tanggal untuk grid bulanan (7 kolom)
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const allDays = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const setToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  return (
    <div className="flex flex-col w-[300px] min-w-[300px] max-w-[300px] py-4 px-4 bg-[#f3eaeb] rounded-3xl text-neutral-800 shadow-xl border border-white/10 select-none font-sans">

      {/* 1. TOP BAR TRACK (Title & Action Buttons) */}
      <div className="flex items-center justify-between w-full mb-4 px-1 shrink-0">
        <span className="text-sm font-semibold tracking-wide text-neutral-800/90">
          Calendar
        </span>
        <div className="flex items-center gap-2">
          <Button
            onClick={setToday}
            variant="ghost"
            className="h-7 px-3 text-[11px] font-bold bg-neutral-200/60 rounded-full hover:bg-neutral-300/60 text-neutral-800 transition-all"
          >
            Today
          </Button>
          <Button
            variant="ghost"
            className="size-7 p-0 rounded-full bg-neutral-200/60 hover:bg-neutral-300/60 text-neutral-700 flex items-center justify-center"
          >
            <Settings className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* 2. CALENDAR HEADER (Month Year Text & Navigation Chevron Vertikal) */}
      <div className="flex justify-between items-center w-full pb-3 px-1 border-b border-neutral-300/40 relative">
        <span className="text-sm font-semibold text-neutral-800">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <div className="flex items-center gap-1">
          {/* Menggunakan up/down chevron vertikal khas penunjuk kalender ChromeOS */}
          <Button
            onClick={prevMonth}
            variant="ghost"
            className="size-7 p-0 hover:bg-neutral-200/60 rounded-full flex items-center justify-center"
          >
            <ChevronUp className="size-4 text-neutral-700" strokeWidth={2.5} />
          </Button>
          <Button
            onClick={nextMonth}
            variant="ghost"
            className="size-7 p-0 hover:bg-neutral-200/60 rounded-full flex items-center justify-center"
          >
            <ChevronDown className="size-4 text-neutral-700" strokeWidth={2.5} />
          </Button>
        </div>
      </div>

      {/* 3. ROW NAMA HARI (S M T W T F S) */}
      <div className="grid grid-cols-7 w-full justify-items-center mt-3 mb-1">
        {weekDays.map((day, i) => (
          <span key={i} className="text-neutral-500 font-medium text-[11px] size-8 flex items-center justify-center">
            {day}
          </span>
        ))}
      </div>

      {/* 4. GRID ANGKA TANGGALAN UTAMA (Fix 7 Kolom) */}
      <div className="grid grid-cols-7 w-full justify-items-center gap-y-1">
        {allDays.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isSameDay(day, new Date());

          return (
            <button
              key={idx}
              onClick={() => isCurrentMonth && setSelectedDate(day)}
              disabled={!isCurrentMonth}
              className={cn(
                "size-8 rounded-full text-xs transition-all flex items-center justify-center font-medium",
                // Hari di luar bulan aktif dibuat samar
                !isCurrentMonth && "text-neutral-400/20 opacity-30 pointer-events-none",
                // Hari normal dalam bulan aktif
                isCurrentMonth && !isSelected && "text-neutral-800 hover:bg-neutral-200/60",
                // Outline untuk hari ini
                isTodayDate && !isSelected && "border border-[#e5d7d1] text-neutral-900 font-bold",
                // REQ: Hari yang diselek pakai warna peach fbb991 dan tulisan hitam
                isSelected && "bg-[#fbb991] text-black font-bold shadow-sm"
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarLauncher;