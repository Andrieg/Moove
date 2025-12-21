"use client";

import React from "react";
import { tables, typography } from "./design-system";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export default function Table<T extends { id: string }>({ 
  columns, 
  data, 
  onRowClick, 
  emptyMessage = "No data available" 
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className={`${tables.emptyState} ${typography.bodySmall} text-slate-500`}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={tables.wrapper}>
      <table className={tables.table}>
        <thead>
          <tr className={tables.headerRow}>
            {columns.map((col) => (
              <th 
                key={col.key} 
                className={tables.headerCell}
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr 
              key={item.id} 
              onClick={() => onRowClick?.(item)} 
              className={`${tables.bodyRow} ${onRowClick ? tables.bodyRowClickable : ""}`}
            >
              {columns.map((col) => (
                <td key={col.key} className={tables.bodyCell}>
                  {col.render ? col.render(item) : (item as Record<string, unknown>)[col.key] as React.ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
