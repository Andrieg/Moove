"use client";

import { typography, transitions, icons } from "./design-system";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
  backLink?: {
    label: string;
    onClick: () => void;
  };
  actions?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, count, backLink, actions }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {backLink && (
        <button
          onClick={backLink.onClick}
          className={`flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4 ${transitions.base}`}
        >
          <svg className={icons.sizes.sm} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className={typography.bodySmall}>{backLink.label}</span>
        </button>
      )}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className={typography.h1}>
            {title}
            {typeof count === "number" && (
              <span className="text-slate-400 font-normal ml-2">({count})</span>
            )}
          </h1>
          {subtitle && (
            <p className={`${typography.bodySmall} mt-1`}>{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}
