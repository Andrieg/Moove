"use client";

import { forwardRef } from "react";
import { forms, typography } from "./design-system";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = "", rows = 3, ...props }, ref) => {
    const textareaClasses = [
      forms.textarea,
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
        <textarea
          ref={ref}
          rows={rows}
          className={textareaClasses}
          {...props}
        />
        {error && <p className={`${typography.error} mt-1`}>{error}</p>}
        {helperText && !error && <p className={`${typography.helper} mt-1`}>{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
