import { extendTheme, defineStyleConfig } from '@chakra-ui/react';

// New adventurous color palette - Tropical Sunset & Caribbean Adventure
const colors = {
  brand: {
    50: '#fff8f0',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316', // Primary orange
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  ocean: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Ocean blue
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  palm: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Palm green
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  coral: {
    50: '#fff1f2',
    100: '#ffe4e6',
    200: '#fecdd3',
    300: '#fda4af',
    400: '#fb7185',
    500: '#f43f5e', // Coral pink
    600: '#e11d48',
    700: '#be123c',
    800: '#9f1239',
    900: '#881337',
  },
  sand: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308', // Sand gold
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
  },
  sunset: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
};

// Typography with new Google Fonts
const fonts = {
  heading: '"Playfair Display", "Georgia", serif',
  body: '"Inter", "system-ui", sans-serif',
  mono: '"JetBrains Mono", monospace',
};

// Font sizes for adventurous feel
const fontSizes = {
  xs: '0.75rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
  '6xl': '3.75rem',
  '7xl': '4.5rem',
  '8xl': '6rem',
};

// Spacing - generous and adventurous
const spacing = {
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
};

// Border radius for modern adventurous look
const radii = {
  none: '0',
  sm: '0.25rem',
  base: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
  '4xl': '2.5rem',
  full: '9999px',
};

// Shadows with depth
const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  outline: '0 0 0 2px var(--chakra-colors-brand-500)',
};

// Component styles
const components = {
  Button: defineStyleConfig({
    baseStyle: {
      fontWeight: 'bold',
      borderRadius: 'xl',
      _hover: {
        transform: 'translateY(-2px)',
        shadow: 'xl',
      },
      _active: {
        transform: 'translateY(0)',
      },
    },
    variants: {
      solid: (props: any) => ({
        bg: `${props.colorScheme || 'brand'}.500`,
        color: 'white',
        _hover: {
          bg: `${props.colorScheme || 'brand'}.600`,
        },
      }),
      outline: {
        border: '2px solid',
        borderColor: 'brand.500',
        color: 'brand.500',
        _hover: {
          bg: 'brand.500',
          color: 'white',
        },
      },
      ghost: {
        _hover: {
          bg: 'brand.100',
        },
      },
      gradient: {
        bgGradient: 'linear(to-r, brand.500, coral.500)',
        color: 'white',
        _hover: {
          bgGradient: 'linear(to-r, brand.600, coral.600)',
        },
      },
    },
    defaultProps: {
      colorScheme: 'brand',
    },
  }),
  Heading: {
    baseStyle: {
      fontFamily: 'heading',
      fontWeight: '700',
      letterSpacing: 'tight',
    },
  },
  Text: {
    baseStyle: {
      fontFamily: 'body',
      lineHeight: 'tall',
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: '2xl',
        overflow: 'hidden',
        shadow: 'lg',
        bg: 'white',
      },
      header: {
        px: 6,
        py: 4,
      },
      body: {
        px: 6,
        py: 4,
      },
    },
  },
  Link: {
    baseStyle: {
      color: 'brand.600',
      textDecoration: 'none',
      transition: 'all 0.2s',
      _hover: {
        color: 'coral.500',
        textDecoration: 'underline',
      },
    },
  },
};

// Theme config
const config = {
  initialColorMode: 'light' as const,
  useSystemColorMode: false,
};

export const theme = extendTheme({
  colors,
  fonts,
  fontSizes,
  spacing,
  radii,
  shadows,
  styles: {
    global: {
      body: {
        fontFamily: 'body',
        color: 'gray.800',
        bg: 'brand.50',
      },
    },
  },
  components,
  config,
});
