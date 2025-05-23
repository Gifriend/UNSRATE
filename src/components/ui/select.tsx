import { useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import React from "react";

export function Select({
  value,
  onValueChange,
  children,
  placeholder,
  className = "",
}: {
  value?: string;
  onValueChange: (val: string) => void;
  children: React.ReactNode;
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={clsx("relative", className)}>
      <button
        type="button"
        className="flex items-center justify-between w-full border rounded-md px-3 py-2 bg-white text-sm text-gray-700"
        onClick={() => setOpen(!open)}
      >
        <span>{value || placeholder || "Select an option"}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg">
          {React.Children.map(children, (child) =>
            React.isValidElement(child)
              ? React.cloneElement(child as React.ReactElement<any>, {
                  onSelect: (val: string) => {
                    onValueChange(val);
                    setOpen(false);
                  },
                })
              : child
          )}
        </div>
      )}
    </div>
  );
}

export function SelectTrigger({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={clsx("w-full", className)}>{children}</div>;
}

export function SelectContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="py-1">{children}</div>;
}

export function SelectItem({
  value,
  children,
  onSelect,
}: {
  value: string;
  children: React.ReactNode;
  onSelect?: (val: string) => void;
}) {
  return (
    <div
      onClick={() => onSelect?.(value)}
      className="px-4 py-2 text-sm text-black hover:bg-gray-100 cursor-pointer border-t"
    >
      {children}
    </div>
  );
}

export function SelectValue({
  placeholder,
}: {
  placeholder?: string;
}) {
  return <span className="text-xs ml-3">{placeholder || "Select an option"}</span>;
}
