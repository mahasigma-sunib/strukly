import React, { useEffect, useRef, type RefObject } from "react";

interface DatePickerProps {
  selectedMonth: number; // 1 - 12
  selectedYear: number;
  onChange: (month: number, year: number) => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

const ITEM_HEIGHT = 40;

export default function DatePicker({
  selectedMonth,
  selectedYear,
  onChange,
}: DatePickerProps) {
  const monthRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);

  // 1. refs to store the debounce timers
  const monthTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const yearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (monthRef.current) {
      const index = selectedMonth - 1;
      monthRef.current.scrollTop = index * ITEM_HEIGHT;
    }
    if (yearRef.current) {
      const index = YEARS.indexOf(selectedYear);
      if (index !== -1) {
        yearRef.current.scrollTop = index * ITEM_HEIGHT;
      }
    }
  }, []);

  const renderColumn = (
    items: string[] | number[],
    selectedValue: string | number,
    onSelect: (index: number) => void,
    ref: React.RefObject<HTMLDivElement | null>,
    timerRef: RefObject<ReturnType<typeof setTimeout> | null> // 2. pass the specific timer ref
  ) => {
    return (
      <div className="relative flex-1 h-48 overflow-hidden group">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="h-full overflow-y-auto snap-y snap-mandatory no-scrollbar"
          // 3. SCROLL LOGIC
          onScroll={(e) => {
            const container = e.currentTarget;
            
            // clear any existing timer so we dont update while still scrolling
            if (timerRef.current) clearTimeout(timerRef.current);

            // Set a new timer to run 100ms after scrolling stops
            timerRef.current = setTimeout(() => {
              // calculate index: scrollTop / 40px
              const scrollIndex = Math.round(container.scrollTop / ITEM_HEIGHT);
              
              // ensure index is valid (0 to items.length - 1)
              const clampedIndex = Math.max(0, Math.min(scrollIndex, items.length - 1));

              // only update when value is different
              if (items[clampedIndex] !== selectedValue) {
                onSelect(clampedIndex);
              }
            }, 100); 
          }}
        >
          <div style={{ height: ITEM_HEIGHT * 2 }} />

          {items.map((item, index) => {
            const isSelected = item === selectedValue;
            return (
              <div
                key={item}
                onClick={() => {
                  onSelect(index);
                  if (ref.current) {
                    ref.current.scrollTo({
                      top: index * ITEM_HEIGHT,
                      behavior: 'smooth'
                    });
                  }
                }}
                className={`
                  h-[40px] flex items-center justify-center snap-center cursor-pointer transition-colors duration-200
                  ${isSelected ? "text-[var(--fun-color-primary)] font-bold text-lg" : "text-[var(--fun-color-text-disabled)] text-base"}
                `}
              >
                {item}
              </div>
            );
          })}
          <div style={{ height: ITEM_HEIGHT * 2 }} />
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full bg-[var(--fun-color-background)] rounded-xl overflow-hidden">
      <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 h-[40px] border-y border-[var(--fun-color-inactive)] pointer-events-none bg-[var(--fun-color-inactive)]/30 z-10" />

      <div className="flex justify-center relative z-20">
        {/* pass specific timer refs here */}
        {renderColumn(
          MONTHS, 
          MONTHS[selectedMonth - 1], 
          (index) => onChange(index + 1, selectedYear), 
          monthRef,
          monthTimerRef
        )}

        {renderColumn(
          YEARS, 
          selectedYear, 
          (index) => onChange(selectedMonth, YEARS[index]), 
          yearRef,
          yearTimerRef
        )}
      </div>
    </div>
  );
}