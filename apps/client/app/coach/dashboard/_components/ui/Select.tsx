"use client";

import { forwardRef } from "react";
import { forms, typography, icons } from "./design-system";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, placeholder, className = "", ...props }, ref) => {
    const selectClasses = [
      forms.select,
      error ? forms.inputError : "",
      props.disabled ? forms.inputDisabled : "",
      "pr-10",
      className,
    ].filter(Boolean).join(" ");

    return (
      <div>
        {label && (
          <label className={forms.label}>
            {label}
            {props.required && <span className={forms.labelRequired}>*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={selectClasses}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <svg
            className={`absolute right-3 top-1/2 -translate-y-1/2 ${icons.sizes.md} text-slate-400 pointer-events-none`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {error && <p className={`${typography.error} mt-1`}>{error}</p>}
        {helperText && !error && <p className={`${typography.helper} mt-1`}>{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
