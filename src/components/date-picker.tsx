"use client";

import React from "react";
import { Controller, type Control, type Path, type FieldValues } from "react-hook-form";
import DatePicker from "react-datepicker";
import { format, isMonday, isTuesday, isWednesday, isThursday, isFriday, isSaturday, isSunday } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/components/utils";
import { Calendar } from "lucide-react";

import "react-datepicker/dist/react-datepicker.css";

interface CustomDatePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  disabledDays?: number[]; // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
  className?: string;
}

const dayFunctions = [isSunday, isMonday, isTuesday, isWednesday, isThursday, isFriday, isSaturday];

export default function CustomDatePicker<T extends FieldValues>({
  control,
  name,
  label,
  disabledDays = [],
  className,
}: CustomDatePickerProps<T>) {
  const isDateDisabled = (date: Date) => {
    return disabledDays.some((day) => dayFunctions[day] && dayFunctions[day](date));
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className={cn("flex flex-col", className)}>
          {label && (
            <label htmlFor={name} className="mb-3 text-sm">
              {label}
            </label>
          )}
          <div className="relative w-full">
            <DatePicker
              selected={value ? new Date(value) : null}
              onChange={(date: Date | null) => {
                if (date) {
                  onChange(format(date, "yyyy-MM-dd"));
                } else {
                  onChange(null);
                }
              }}
              dateFormat="dd/MM/yyyy"
              filterDate={isDateDisabled}
              locale={es}
              customInput={
                <input
                  className={cn(
                    "max-h-[41px] min-h-[41px] w-full min-w-[90px] shadow-none outline-none transition-colors focus:!ring-0",
                    "focus:border-input-active hover:border-input-hover rounded-md border border-input bg-input px-4 py-[9px] placeholder:text-sm focus:rounded-md",
                    "disabled:!text-disabled disabled:!border-disabled disabled:focus:!border-disabled",
                    "!pr-10",
                  )}
                />
              }
            />
            <Calendar className="pointer-events-none absolute right-3 top-1/2 h-5 -translate-y-1/2 cursor-pointer" />
          </div>
          {error && <span className={cn("ml-1 mt-2 block text-xs text-danger")}>{error.message}</span>}
        </div>
      )}
    />
  );
}
