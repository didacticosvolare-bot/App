// Design System - Theme Configuration
// Professional, accessible, mobile-first

export const theme = {
  // COLOR PALETTE
  colors: {
    // Primary - Based on Salsa (maintained for brand)
    primary: {
      50: '#F0F4EE',
      100: '#E1E9DD',
      200: '#C3D3BB',
      300: '#A5BD99',
      400: '#87A777',
      500: '#4A6741', // Main primary
      600: '#3D5535',
      700: '#304428',
      800: '#23331C',
      900: '#161F10',
    },

    // Secondary - Professional blue
    secondary: {
      50: '#EFF6FF',
      100: '#DEE9FF',
      200: '#BDD7FE',
      300: '#9CC5FD',
      400: '#7BB3FB',
      500: '#2563EB', // Main secondary
      600: '#1D4ED8',
      700: '#1E40AF',
      800: '#1E3A8A',
      900: '#172554',
    },

    // Success - Green
    success: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      200: '#BBF7D0',
      300: '#86EFAC',
      400: '#4ADE80',
      500: '#10B981', // Main success
      600: '#059669',
      700: '#047857',
      800: '#065F46',
      900: '#064E3B',
    },

    // Warning - Amber
    warning: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B', // Main warning
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
    },

    // Error - Red
    error: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      200: '#FECACA',
      300: '#FCA5A5',
      400: '#F87171',
      500: '#EF4444', // Main error
      600: '#DC2626',
      700: '#B91C1C',
      800: '#991B1B',
      900: '#7F1D1D',
    },

    // Neutral - Grays
    neutral: {
      0: '#FFFFFF',
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },

    // Semantic aliases
    background: '#FFFFFF',
    surface: '#F9FAFB',
    border: '#E5E7EB',
    text: {
      primary: '#111827',
      secondary: '#4B5563',
      tertiary: '#9CA3AF',
      inverse: '#FFFFFF',
    },
  },

  // SPACING SYSTEM (4px base)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '48px',
    '4xl': '64px',
  },

  // TYPOGRAPHY
  typography: {
    fontFamily: {
      base: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      mono: '"Fira Code", "Courier New", monospace',
    },

    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
      '5xl': '48px',
    },

    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },

    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // BORDER RADIUS
  borderRadius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  // SHADOWS
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },

  // TRANSITIONS
  transitions: {
    fast: '150ms ease-in-out',
    base: '200ms ease-in-out',
    slow: '300ms ease-in-out',
  },

  // BREAKPOINTS (Mobile-first)
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-INDEX SCALE
  zIndex: {
    hide: -1,
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    backdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
}

export type Theme = typeof theme
