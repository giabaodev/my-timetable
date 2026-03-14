'use client';

import { format } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import * as React from 'react';
import type { PropsSingle } from 'react-day-picker';

import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InputDatePickerProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'type'
> {
  /** Controlled date value */
  value?: Date;
  /** Called when user selects or clears a date */
  onChange?: (date: Date | undefined) => void;
  /** Format string passed to date-fns `format()`. Default: "PPP" → "April 29, 2025" */
  dateFormat?: string;
  /** Placeholder text shown when no date is selected */
  placeholder?: string;
  /** Allow the user to clear the selected date via an ✕ button */
  clearable?: boolean;
  /** Extra props forwarded directly to the shadcn <Calendar> (react-day-picker) */
  calendarProps?: Partial<Omit<PropsSingle, 'mode' | 'selected' | 'onSelect'>>;
  /** Alignment of the popover relative to the trigger */
  align?: 'start' | 'center' | 'end';
}

// ─── Component ───────────────────────────────────────────────────────────────

const InputDatePicker = React.forwardRef<HTMLInputElement, InputDatePickerProps>(
  (
    {
      value,
      onChange,
      dateFormat = 'MM/dd/yyyy',
      placeholder = 'Pick a date',
      calendarProps,
      align = 'start',
      disabled,
      className,
      id,
      name,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);

    // Hidden native input keeps form libraries (RHF, Formik) happy
    const hiddenInputRef = React.useRef<HTMLInputElement>(null);

    // Merge forwarded ref with internal ref
    React.useImperativeHandle(ref, () => hiddenInputRef.current!);

    const handleSelect = (date: Date | undefined) => {
      onChange?.(date);
      if (date) setOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation(); // don't re-open the popover
      onChange?.(undefined);
    };

    const formatted = value ? format(value, dateFormat) : '';

    return (
      <>
        {/* Hidden input — carries value/name for native forms & RHF registration */}
        <input
          ref={hiddenInputRef}
          type="hidden"
          id={id}
          name={name}
          value={formatted}
          onBlur={onBlur}
          disabled={disabled}
          {...rest}
        />

        <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
          <PopoverTrigger asChild>
            {/* Outer wrapper mimics shadcn <Input> exactly */}
            <div
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-disabled={disabled}
              tabIndex={disabled ? -1 : 0}
              className={cn(
                // shadcn Input base styles
                'flex h-8 w-full items-center rounded-md border border-input bg-background px-2.5 py-1 text-sm ring-offset-background',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'cursor-pointer select-none',
                disabled && 'cursor-not-allowed opacity-50',
                className
              )}
            >
              {/* Date text or placeholder */}
              <span className={cn('text-base flex-1 truncate', !value && 'text-muted-foreground')}>
                {value ? formatted : placeholder}
              </span>

              {/* Calendar icon */}
              <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            </div>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align={align}>
            <Calendar mode="single" selected={value} onSelect={handleSelect} {...calendarProps} />
          </PopoverContent>
        </Popover>
      </>
    );
  }
);

InputDatePicker.displayName = 'InputDatePicker';

export { InputDatePicker };
