/**
 * MOOVE Design System
 * Single source of truth for all design tokens
 * 
 * Usage: Import and use these constants in all components for consistency.
 * This ensures visual consistency across the entire application.
 */

// =============================================================================
// COLORS
// =============================================================================
export const colors = {
  // Primary Brand
  primary: "#308FAB",
  primaryDark: "#217E9A",
  primaryLight: "#429FBA",
  primary50: "rgba(48, 143, 171, 0.05)",
  primary100: "rgba(48, 143, 171, 0.1)",
  primary200: "rgba(48, 143, 171, 0.2)",
  
  // Text Colors (using Tailwind classes)
  text: {
    primary: "text-slate-900",
    secondary: "text-slate-600",
    muted: "text-slate-500",
    disabled: "text-slate-400",
    inverse: "text-white",
    link: "text-[#308FAB]",
  },
  
  // Background Colors
  bg: {
    primary: "bg-white",
    secondary: "bg-slate-50",
    muted: "bg-slate-100",
    inverse: "bg-slate-900",
    hover: "hover:bg-slate-50",
  },
  
  // Border Colors
  border: {
    default: "border-slate-200",
    light: "border-slate-100",
    focus: "border-[#308FAB]",
  },
  
  // Status Colors
  status: {
    success: "bg-green-100 text-green-700",
    successSolid: "bg-green-500 text-white",
    error: "bg-red-100 text-red-700",
    errorSolid: "bg-red-500 text-white",
    warning: "bg-amber-100 text-amber-700",
    warningSolid: "bg-amber-500 text-white",
    info: "bg-blue-100 text-blue-700",
    infoSolid: "bg-blue-500 text-white",
    neutral: "bg-slate-100 text-slate-600",
  },
};

// =============================================================================
// TYPOGRAPHY
// =============================================================================
export const typography = {
  // Display (Hero text)
  display: "text-3xl font-bold text-slate-900",
  
  // Headings
  h1: "text-2xl font-semibold text-slate-900",
  h2: "text-xl font-semibold text-slate-900",
  h3: "text-lg font-semibold text-slate-900",
  h4: "text-base font-semibold text-slate-900",
  
  // Body Text
  body: "text-base text-slate-700",
  bodySmall: "text-sm text-slate-600",
  bodyXs: "text-xs text-slate-500",
  
  // Labels
  label: "text-sm font-medium text-slate-700",
  labelMuted: "text-sm font-medium text-slate-500",
  labelXs: "text-xs font-medium text-slate-500 uppercase tracking-wider",
  
  // Helper & Error text
  helper: "text-xs text-slate-500",
  error: "text-sm text-red-500",
  
  // Links
  link: "text-sm font-medium text-[#308FAB] hover:text-[#217E9A] transition-colors",
};

// =============================================================================
// SPACING
// =============================================================================
export const spacing = {
  // Page padding
  page: {
    x: "px-4 md:px-6",
    y: "py-6",
    full: "p-4 md:p-6",
  },
  
  // Section spacing
  section: {
    sm: "space-y-4",
    md: "space-y-6",
    lg: "space-y-8",
  },
  
  // Component spacing
  gap: {
    xs: "gap-2",
    sm: "gap-3",
    md: "gap-4",
    lg: "gap-6",
  },
  
  // Form spacing
  form: {
    gap: "space-y-5",
    fieldGap: "mb-2",
  },
  
  // Card padding
  card: {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  },
  
  // Table
  table: {
    cell: "px-4 py-4",
    header: "px-4 py-3",
  },
};

// =============================================================================
// BORDER RADIUS
// =============================================================================
export const radius = {
  sm: "rounded-md",      // 6px - Small elements
  md: "rounded-lg",      // 8px - Buttons, inputs
  lg: "rounded-xl",      // 12px - Cards
  xl: "rounded-2xl",     // 16px - Large cards, modals
  full: "rounded-full",  // Pills, avatars
};

// =============================================================================
// SHADOWS
// =============================================================================
export const shadows = {
  none: "shadow-none",
  xs: "shadow-xs",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  card: "shadow-[0px_4px_20px_rgba(0,0,0,0.05)]",
  button: "shadow-[0px_4px_20px_rgba(59,152,179,0.3)]",
};

// =============================================================================
// FORM ELEMENTS
// =============================================================================
export const forms = {
  // Input base styles
  input: `w-full px-4 py-3 ${radius.md} border ${colors.border.default} text-sm text-slate-900 placeholder-slate-400 bg-white
    focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] transition-colors`,
  
  // Input states
  inputError: "border-red-300 focus:ring-red-200 focus:border-red-400",
  inputDisabled: "bg-slate-50 cursor-not-allowed opacity-60",
  inputReadonly: "bg-slate-50 cursor-default",
  
  // Select
  select: `w-full px-4 py-3 ${radius.md} border ${colors.border.default} text-sm text-slate-900 bg-white appearance-none cursor-pointer
    focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] transition-colors`,
  
  // Textarea
  textarea: `w-full px-4 py-3 ${radius.md} border ${colors.border.default} text-sm text-slate-900 placeholder-slate-400 bg-white resize-none
    focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] transition-colors`,
  
  // Checkbox & Radio
  checkbox: "w-4 h-4 rounded border-slate-300 text-[#308FAB] focus:ring-[#308FAB] focus:ring-offset-0",
  radio: "w-4 h-4 border-slate-300 text-[#308FAB] focus:ring-[#308FAB] focus:ring-offset-0",
  
  // Labels
  label: "block text-sm font-medium text-slate-700 mb-2",
  labelRequired: "text-red-500 ml-0.5",
};

// =============================================================================
// BUTTONS
// =============================================================================
export const buttons = {
  // Base
  base: `font-semibold ${radius.md} transition-all duration-200 inline-flex items-center justify-center gap-2 
    disabled:opacity-50 disabled:cursor-not-allowed`,
  
  // Sizes
  sizes: {
    xs: "px-2.5 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  },
  
  // Variants
  variants: {
    primary: `text-white ${shadows.sm} hover:opacity-90 active:opacity-80`,
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300",
    outline: `border ${colors.border.default} text-slate-700 hover:bg-slate-50 bg-white active:bg-slate-100`,
    ghost: "text-slate-600 hover:bg-slate-100 active:bg-slate-200",
    danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
    link: "text-[#308FAB] hover:text-[#217E9A] underline-offset-4 hover:underline p-0",
  },
};

// =============================================================================
// CARDS & CONTAINERS
// =============================================================================
export const cards = {
  base: `bg-white ${radius.lg} ${shadows.sm} border ${colors.border.default}`,
  hover: `${shadows.md} transition-shadow`,
  interactive: `cursor-pointer hover:${shadows.md} transition-shadow`,
};

// =============================================================================
// TABLES
// =============================================================================
export const tables = {
  wrapper: "overflow-x-auto",
  table: "w-full",
  headerRow: `border-b ${colors.border.default}`,
  headerCell: `text-left ${spacing.table.header} ${typography.labelXs}`,
  bodyRow: `border-b ${colors.border.light} hover:bg-slate-50 transition-colors`,
  bodyRowClickable: "cursor-pointer",
  bodyCell: `${spacing.table.cell} ${typography.bodySmall}`,
  emptyState: "text-center py-16",
};

// =============================================================================
// BADGES
// =============================================================================
export const badges = {
  base: `inline-flex px-3 py-1 text-xs font-medium ${radius.full}`,
  variants: {
    success: colors.status.success,
    warning: colors.status.warning,
    error: colors.status.error,
    info: colors.status.info,
    neutral: colors.status.neutral,
    // Semantic variants for specific use cases
    active: colors.status.success,
    inactive: colors.status.neutral,
    scheduled: colors.status.info,
    completed: colors.status.neutral,
    started: colors.status.success,
    published: colors.status.success,
    draft: colors.status.neutral,
  },
};

// =============================================================================
// LOADING STATES
// =============================================================================
export const loading = {
  spinner: `animate-spin ${radius.full} border-b-2 border-[#308FAB]`,
  spinnerSizes: {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  },
  skeleton: `bg-slate-200 animate-pulse ${radius.md}`,
};

// =============================================================================
// ICONS
// =============================================================================
export const icons = {
  button: `p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 ${radius.md} transition-colors`,
  buttonDanger: `p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 ${radius.md} transition-colors`,
  sizes: {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  },
};

// =============================================================================
// MODALS & OVERLAYS
// =============================================================================
export const modals = {
  overlay: "fixed inset-0 bg-black/50 backdrop-blur-sm",
  container: `bg-white ${radius.lg} ${shadows.lg}`,
  header: `flex items-center justify-between px-6 py-4 border-b ${colors.border.default}`,
  body: "p-6",
  footer: `flex items-center justify-end gap-3 px-6 py-4 border-t ${colors.border.default}`,
  sizes: {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-4xl",
  },
};

// =============================================================================
// PAGE LAYOUT
// =============================================================================
export const layout = {
  // Page container
  container: "max-w-6xl mx-auto",
  containerWide: "max-w-7xl mx-auto",
  
  // Page header
  pageHeader: "flex flex-wrap items-center justify-between gap-4 mb-6",
  pageTitle: typography.h1,
  
  // Section
  section: `${spacing.section.md}`,
};

// =============================================================================
// TRANSITIONS
// =============================================================================
export const transitions = {
  fast: "transition-all duration-150",
  base: "transition-all duration-200",
  slow: "transition-all duration-300",
};

// =============================================================================
// FOCUS STYLES
// =============================================================================
export const focus = {
  ring: "focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]",
  visible: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#308FAB]/20",
};

// =============================================================================
// UTILITY CLASSES
// =============================================================================
export const utils = {
  // Flex utilities
  flexCenter: "flex items-center justify-center",
  flexBetween: "flex items-center justify-between",
  flexStart: "flex items-center justify-start",
  flexEnd: "flex items-center justify-end",
  
  // Text utilities
  truncate: "truncate",
  lineClamp2: "line-clamp-2",
  lineClamp3: "line-clamp-3",
  
  // Visibility
  srOnly: "sr-only",
};
