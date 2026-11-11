export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  screen: 20,
} as const;

export const radii = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  '2xl': 28,
  full: 9999,
} as const;

export const shadows = {
  none: {},
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  card: {
    shadowColor: '#1e2a40',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 2,
  },
} as const;

export const typography = {
  h1: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  h2: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700' as const,
  },
  h3: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  h4: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600' as const,
  },
  body: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  small: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
    letterSpacing: 0.2,
  },
  button: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
  },
} as const;
