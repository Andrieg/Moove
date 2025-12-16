"use client";

import { ReactNode, useRef } from "react";
import Title from "../atoms/Title";

interface CategoryProps {
  title?: string;
  link?: string;
  onLinkClick?: () => void;
  children: ReactNode;
  withBorder?: boolean;
  subtitle?: string | ReactNode;
}

export default function Category({
  title,
  link,
  onLinkClick,
  children,
  withBorder = false,
  subtitle,
}: CategoryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section
      className={`mb-8 ${
        withBorder ? "border-b border-gray-100 pb-8" : ""
      }`}
    >
      {/* Header */}
      {(title || link) && (
        <div className="container mx-auto px-4 mb-4">
          <div className="flex justify-between items-center">
            {title && (
              <Title color="black" size="lg" weight="700">
                {title}
              </Title>
            )}
            {link && (
              <Title
                size="sm"
                weight="500"
                color="#429FBA"
                className="cursor-pointer hover:underline"
                onClick={onLinkClick}
              >
                {link}
              </Title>
            )}
          </div>
          {subtitle && (
            <div className="mt-2">
              {typeof subtitle === "string" ? (
                <p className="text-base font-medium">{subtitle}</p>
              ) : (
                subtitle
              )}
            </div>
          )}
        </div>
      )}

      {/* Scrollable Content */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="overflow-x-auto overflow-y-hidden scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div className="flex px-4">{children}</div>
        </div>
      </div>
    </section>
  );
}
