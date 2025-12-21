"use client";

import { forwardRef } from "react";
import { forms, typography } from "./design-system";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", ...props }, ref) => {
    const inputClasses = [
      forms.input,
      error ? forms.inputError : "",
      props.disabled ? forms.inputDisabled : "",
      props.readOnly ? forms.inputReadonly : "",
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
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
        {error && <p className={`${typography.error} mt-1`}>{error}</p>}
        {helperText && !error && <p className={`${typography.helper} mt-1`}>{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
