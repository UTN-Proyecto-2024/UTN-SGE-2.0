"use client";

import React, { useState, useRef, useEffect } from "react";
import { Controller, type Control, type Path, type FieldValues } from "react-hook-form";
import { DayPicker } from "react-day-picker";
import { format, isBefore, startOfToday } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/components/utils";
import { Calendar } from "lucide-react";

import "react-day-picker/dist/style.css";

interface CustomDatePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  disabledDays?: number[];
  className?: string;
}

export default function CustomDatePicker<T extends FieldValues>({
  control,
  name,
  label,
  disabledDays = [],
  className,
}: CustomDatePickerProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const today = startOfToday();

  const isDateDisabled = (date: Date) => {
    return isBefore(date, today) || disabledDays.includes(date.getDay());
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selectedDate = value ? new Date(value) : undefined;

        return (
          <div className={cn("flex flex-col", className)}>
            {label && (
              <label htmlFor={name} className="mb-3 text-sm">
                {label}
              </label>
            )}
            <div className="relative w-full" ref={calendarRef}>
              <div
                className={cn(
                  "flex items-center justify-between",
                  "shadow-none outline-none transition-colors focus:!ring-0",
                  "focus:border-input-active hover:border-input-hover rounded-md border border-input bg-input px-4 py-[9px] focus:rounded-md",
                  "cursor-pointer",
                )}
                onClick={() => setIsOpen(!isOpen)}
              >
                <input
                  value={selectedDate ? format(selectedDate, "dd/MM/yyyy") : ""}
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    if (!isNaN(date.getTime())) {
                      onChange(format(date, "yyyy-MM-dd"));
                    }
                  }}
                  placeholder="Seleccione o ingrese fecha"
                  className="w-full bg-transparent outline-none"
                  readOnly
                />
                <Calendar className="h-5 cursor-pointer" />
              </div>
              {isOpen && (
                <div className="absolute z-10 mt-1 rounded-md bg-white shadow-lg">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      onChange(date ? format(date, "yyyy-MM-dd") : undefined);
                      setIsOpen(false);
                    }}
                    disabled={isDateDisabled}
                    locale={es}
                    className="p-3"
                    classNames={{
                      day_selected: "bg-primary text-primary-foreground",
                      day_disabled: "text-muted-foreground opacity-50",
                      day_outside: "text-muted-foreground opacity-50",
                      day_today: "font-bold",
                    }}
                  />
                </div>
              )}
            </div>
            {error && <span className={cn("ml-1 mt-2 block text-xs text-danger")}>{error.message}</span>}
          </div>
        );
      }}
    />
  );
}
