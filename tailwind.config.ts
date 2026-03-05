import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'ios-blue': '#007AFF',
        'ios-blue-dark': '#0A84FF',
        'ios-gray': '#8E8E93',
        'ios-gray-2': '#AEAEB2',
        'ios-gray-3': '#C7C7CC',
        'ios-gray-4': '#D1D1D6',
        'ios-gray-5': '#E5E5EA',
        'ios-gray-6': '#F2F2F7',
        'ios-red': '#FF3B30',
        'ios-red-dark': '#FF453A',
        'ios-green': '#34C759',
        'ios-green-dark': '#30D158',
        'ios-orange': '#FF9500',
        'ios-yellow': '#FFCC00',
        'ios-purple': '#AF52DE',
        'ios-background': '#F2F2F7',
        'ios-background-dark': '#000000',
        'ios-surface': '#FFFFFF',
        'ios-surface-dark': '#1C1C1E',
        'ios-surface-2': '#F2F2F7',
        'ios-surface-2-dark': '#2C2C2E',
        'ios-surface-3': '#FFFFFF',
        'ios-surface-3-dark': '#3A3A3C',
        'ios-label': '#000000',
        'ios-label-dark': '#FFFFFF',
        'ios-secondary-label': '#3C3C43',
        'ios-tertiary-label': '#3C3C4399',
        'ios-separator': '#3C3C4349',
      },
      fontFamily: {
        sf: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      borderRadius: {
        ios: '10px',
        'ios-sm': '8px',
        'ios-lg': '16px',
        'ios-xl': '20px',
        'ios-2xl': '28px',
      },
      boxShadow: {
        ios: '0 2px 10px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)',
        'ios-md': '0 4px 16px rgba(0, 0, 0, 0.10), 0 2px 6px rgba(0, 0, 0, 0.06)',
        'ios-lg': '0 8px 30px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.08)',
        'ios-dark': '0 2px 10px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0, 0, 0, 0.3)',
        'ios-dark-md': '0 4px 16px rgba(0, 0, 0, 0.5), 0 2px 6px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.15s ease-out',
        spin: 'spin 1s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
