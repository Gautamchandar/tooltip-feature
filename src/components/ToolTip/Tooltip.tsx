import React, { useEffect, useId, useRef, useState } from "react";

export type TooltipSide = "top" | "bottom" | "left" | "right";
export type TooltipVariant = "dark" | "light";
export type TooltipTrigger = "hover" | "click";

export interface TooltipProps {
  children: React.ReactNode;
  label: string;
  side?: TooltipSide;
  arrow?: boolean;
  variant?: TooltipVariant;
  trigger?: TooltipTrigger;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

const sideClasses: Record<TooltipSide, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const variantClasses: Record<TooltipVariant, string> = {
  dark: "bg-slate-900 text-white",
  light: "bg-white text-slate-900 border border-slate-200 shadow-md",
};

const arrowSideClasses: Record<TooltipVariant, Record<TooltipSide, string>> = {
  dark: {
    top: "top-full left-1/2 -translate-x-1/2 border-x-transparent border-b-transparent border-t-slate-900",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-x-transparent border-t-transparent border-b-slate-900",
    left: "left-full top-1/2 -translate-y-1/2 border-y-transparent border-r-transparent border-l-slate-900",
    right: "right-full top-1/2 -translate-y-1/2 border-y-transparent border-l-transparent border-r-slate-900",
  },
  light: {
    top: "top-full left-1/2 -translate-x-1/2 border-x-transparent border-b-transparent border-t-white",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-x-transparent border-t-transparent border-b-white",
    left: "left-full top-1/2 -translate-y-1/2 border-y-transparent border-r-transparent border-l-white",
    right: "right-full top-1/2 -translate-y-1/2 border-y-transparent border-l-transparent border-r-white",
  },
};

export function Tooltip({
  children,
  label,
  side = "top",
  arrow = false,
  variant = "dark",
  trigger = "hover",
  open: openProp,
  onOpenChange,
  disabled = false,
}: TooltipProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;
  const id = useId();
  const wrapperRef = useRef<HTMLSpanElement>(null);

  const setOpen = (value: boolean) => {
    if (!isControlled) setInternalOpen(value);
    onOpenChange?.(value);
  };

  useEffect(() => {
    if (trigger !== "click" || !open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [trigger, open]);

  const hoverHandlers =
    trigger === "hover"
      ? {
          onMouseEnter: () => setOpen(true),
          onMouseLeave: () => setOpen(false),
          onFocus: () => setOpen(true),
          onBlur: () => setOpen(false),
        }
      : {
          onClick: () => setOpen(!open),
        };

  return (
    <span ref={wrapperRef} className="relative inline-flex">
      <span
        aria-describedby={open ? id : undefined}
        tabIndex={disabled ? -1 : 0}
        className={`inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-md ${
          disabled ? "pointer-events-none opacity-60" : ""
        }`}
        {...hoverHandlers}
      >
        {children}
      </span>

      {open && (
        <span
          role="tooltip"
          id={id}
          className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium shadow-lg animate-[fadeIn_120ms_ease-out] ${variantClasses[variant]} ${sideClasses[side]}`}
        >
          {label}
          {arrow && (
            <span
              className={`absolute h-0 w-0 border-4 ${arrowSideClasses[variant][side]}`}
            />
          )}
        </span>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(2px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </span>
  );
}

export default Tooltip;