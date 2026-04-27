export const Colors = {
  // Surfaces
  background: '#131313',
  surfaceContainerLowest: '#0e0e0e',
  surfaceContainerLow: '#1c1b1b',
  surfaceContainer: '#201f1f',
  surfaceContainerHigh: '#2a2a2a',
  surfaceContainerHighest: '#353534',
  surfaceBright: '#393939',
  // Text
  onSurface: '#e5e2e1',
  onSurfaceVariant: '#b9cbbd',
  onBackground: '#e5e2e1',
  // Primary (Emerald Green)
  primary: '#00f5a0',
  onPrimary: '#003921',
  primaryDim: '#00e293',
  // Secondary
  secondary: '#c1c7d1',
  secondaryContainer: '#414750',
  // Accent
  techBlue: '#007AFF',
  // Borders
  outline: '#849588',
  outlineVariant: '#3b4a40',
  border: '#2C2C2E',
  // Feedback
  error: '#ffb4ab',
  errorContainer: '#93000a',
  success: '#00f5a0',
};

export const Spacing = {
  base: 4,
  xs: 8,
  sm: 12,
  md: 20,
  lg: 32,
  xl: 48,
  gutter: 16,
  margin: 24,
};

export const Radius = {
  sm: 2,
  DEFAULT: 4,
  md: 6,
  lg: 8,
  xl: 12,
  full: 9999,
};

// Space Grotesk for numbers/data, Inter for UI text
// Falls back to system fonts until custom fonts are linked
export const FontFamily = {
  display: 'SpaceGrotesk-SemiBold',
  mono: 'SpaceGrotesk-Medium',
  monoRegular: 'SpaceGrotesk-Regular',
  ui: 'Inter-Regular',
  uiMedium: 'Inter-Medium',
  uiSemiBold: 'Inter-SemiBold',
};

export const Typography = {
  displayNum: {
    fontSize: 48,
    fontWeight: '600' as const,
    lineHeight: 53,
    letterSpacing: -0.96,
  },
  h1: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
    letterSpacing: -0.24,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  bodyReg: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodySm: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  dataLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    letterSpacing: 0.6,
  },
  inputText: {
    fontSize: 20,
    fontWeight: '400' as const,
    lineHeight: 28,
  },
};
