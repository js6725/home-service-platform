/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          DEFAULT: '#2563EB', // Primary Blue
          dark: '#1E40AF',    // Primary Blue Dark
          light: '#DBEAFE',   // Primary Blue Light
        },
        // Secondary colors
        secondary: {
          DEFAULT: '#0D9488', // Secondary Teal
          light: '#CCFBF1',   // Secondary Teal Light
        },
        // Neutral colors
        gray: {
          dark: '#1F2937',    // Dark Gray
          medium: '#6B7280',  // Medium Gray
          light: '#E5E7EB',   // Light Gray
          offwhite: '#F9FAFB', // Off White
        },
        // Feedback colors
        success: '#10B981',   // Success
        warning: '#F59E0B',   // Warning
        error: '#EF4444',     // Error
        info: '#3B82F6',      // Info
        // Industry-specific accent colors
        industry: {
          plumbing: '#0EA5E9', // Plumbing Blue
          hvac: '#F97316',     // HVAC Orange
          carpentry: '#854D0E', // Carpentry Brown
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display': '2.25rem',    // 36px
        'h1': '1.875rem',        // 30px
        'h2': '1.5rem',          // 24px
        'h3': '1.25rem',         // 20px
        'h4': '1.125rem',        // 18px
        'body': '1rem',          // 16px
        'small': '0.875rem',     // 14px
        'xs': '0.75rem',         // 12px
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      lineHeight: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.75',
      },
      spacing: {
        '4xs': '0.125rem',  // 2px
        '3xs': '0.25rem',   // 4px
        '2xs': '0.5rem',    // 8px
        'xs': '0.75rem',    // 12px
        'sm': '1rem',       // 16px
        'md': '1.5rem',     // 24px
        'lg': '2rem',       // 32px
        'xl': '3rem',       // 48px
        '2xl': '4rem',      // 64px
        '3xl': '6rem',      // 96px
        '4xl': '8rem',      // 128px
      },
      borderRadius: {
        'none': '0px',
        'sm': '0.25rem',    // 4px
        'md': '0.5rem',     // 8px
        'lg': '0.75rem',    // 12px
        'xl': '1rem',       // 16px
        'full': '9999px',   // For pills and avatars
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-in-out',
        'fade-out': 'fadeOut 200ms ease-in-out',
        'slide-in': 'slideIn 300ms ease-out',
        'slide-out': 'slideOut 300ms ease-in',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(10px)', opacity: '0' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}

