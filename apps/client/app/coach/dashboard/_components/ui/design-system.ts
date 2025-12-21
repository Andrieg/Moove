/**
 * MOOVE Design System
 * Unified design tokens and utility classes
 * 
 * This file defines the standard design tokens used across the application.
 * Import these constants in components to ensure consistency.
 */

// =============================================================================
// COLORS
// =============================================================================
export const colors = {
  // Primary Brand
  primary: "#308FAB",
  primaryDark: "#267a91",
  primaryLight: "#429FBA",
  
  // Neutral Text
  textPrimary: "text-slate-900",
  textSecondary: "text-slate-600",
  textMuted: "text-slate-500",
  textDisabled: "text-slate-400",
  
  // Backgrounds
  bgPrimary: "bg-white",
  bgSecondary: "bg-slate-50",
  bgMuted: "bg-slate-100",
  
  // Borders
  border: "border-slate-200",
  borderLight: "border-slate-100",
  
  // Status Colors
  success: "bg-green-100 text-green-700",
  error: "bg-red-100 text-red-700",
  warning: "bg-amber-100 text-amber-700",
  info: "bg-blue-100 text-blue-700",
};

// =============================================================================
// TYPOGRAPHY
// =============================================================================
export const typography = {
  // Headings
  h1: "text-2xl font-semibold text-slate-900",
  h2: "text-xl font-semibold text-slate-900",
  h3: "text-lg font-semibold text-slate-900",
  h4: "text-base font-semibold text-slate-900",
  
  // Body
  body: "text-sm text-slate-700",
  bodySmall: "text-xs text-slate-600",
  
  // Labels
  label: "text-sm font-medium text-slate-700",
  labelMuted: "text-sm font-medium text-slate-500",
  
  // Helper & Error text
  helper: "text-xs text-slate-500",
  error: "text-sm text-red-500",
};

// =============================================================================
// SPACING
// =============================================================================
export const spacing = {
  // Page padding
  pagePadding: "px-6 py-6",
  
  // Section spacing
  sectionGap: "space-y-6",
  
  // Form spacing
  formGap: "space-y-5",
  fieldGap: "mb-2", // Between label and input
  
  // Card padding
  cardPadding: {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  },
  
  // Table
  tableCell: "px-4 py-4",
  tableHeader: "px-4 py-3",
};

// =============================================================================
// FORM ELEMENTS
// =============================================================================
export const forms = {
  // Input base styles
  input: "w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] transition-colors",
  
  // Input states
  inputError: "border-red-300 focus:ring-red-200 focus:border-red-400",
  inputDisabled: "bg-slate-50 cursor-not-allowed opacity-60",
  inputReadonly: "bg-slate-50 cursor-default",
  
  // Select
  select: "w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] transition-colors",
  
  // Textarea
  textarea: "w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] transition-colors",
  
  // Checkbox & Radio
  checkbox: "w-4 h-4 rounded border-slate-300 text-[#308FAB] focus:ring-[#308FAB] focus:ring-offset-0",
  radio: "w-4 h-4 border-slate-300 text-[#308FAB] focus:ring-[#308FAB] focus:ring-offset-0",
};

// =============================================================================
// BUTTONS
// =============================================================================
export const buttons = {
  // Base
  base: "font-semibold rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
  
  // Sizes
  sizes: {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  },
  
  // Variants
  variants: {
    primary: "text-white shadow-sm hover:opacity-90", // bg color applied dynamically
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50 bg-white",
    ghost: "text-slate-600 hover:bg-slate-100",
    danger: "bg-red-500 text-white hover:bg-red-600",
  },
};

// =============================================================================
// CARDS & CONTAINERS
// =============================================================================
export const cards = {
  base: "bg-white rounded-xl shadow-sm border border-slate-200",
  hover: "hover:shadow-md transition-shadow",
};

// =============================================================================
// TABLES
// =============================================================================
export const tables = {
  wrapper: "overflow-x-auto",
  table: "w-full",
  headerRow: "border-b border-slate-200",
  headerCell: "text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider",
  bodyRow: "border-b border-slate-100 hover:bg-slate-50 transition-colors",
  bodyRowClickable: "cursor-pointer",
  bodyCell: "px-4 py-4 text-sm text-slate-700",
  emptyState: "text-center py-16",
};

// =============================================================================
// STATUS BADGES
// =============================================================================
export const badges = {
  base: "inline-flex px-3 py-1 text-xs font-medium rounded-full",
  variants: {
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    error: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
    neutral: "bg-slate-100 text-slate-600",
    active: "bg-green-100 text-green-700",
    inactive: "bg-slate-100 text-slate-600",
    scheduled: "bg-blue-100 text-blue-700",
    completed: "bg-slate-100 text-slate-600",
    started: "bg-green-100 text-green-700",
  },
};

// =============================================================================
// LOADING STATES
// =============================================================================
export const loading = {
  spinner: "animate-spin rounded-full border-b-2 border-[#308FAB]",
  spinnerSizes: {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  },
  skeleton: "bg-slate-200 animate-pulse rounded",
};

// =============================================================================
// ICONS
// =============================================================================
export const icons = {
  // Standard icon button
  button: "p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors",
  buttonDanger: "p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors",
};

// =============================================================================
// UTILITY CLASSES
// =============================================================================
export const utils = {
  // Flex utilities
  flexCenter: "flex items-center justify-center",
  flexBetween: "flex items-center justify-between",
  
  // Transitions
  transition: "transition-all duration-200",
  
  // Shadows
  shadowCard: "shadow-sm",
  shadowHover: "hover:shadow-md",
  
  // Focus ring
  focusRing: "focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]",
};
