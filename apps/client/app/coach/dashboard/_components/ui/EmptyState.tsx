"use client";

import { typography } from "./design-system";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4">
      {icon && (
        <div className="w-16 h-16 mx-auto text-slate-300 mb-4 flex items-center justify-center">
          {icon}
        </div>
      )}
      <h3 className={`${typography.h3} mb-2`}>{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
