"use client";
import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./Select";

interface Option {
  value: string;
  label: string;
}

interface SelectWrapperProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: Option[];
  placeholder?: string;
}

export const SelectWrapper: React.FC<SelectWrapperProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
}) => {
  return (
    <div className="flex flex-col space-y-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <Select value={value} onValueChange={(val) => onChange?.(val)}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
