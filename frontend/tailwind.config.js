/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F7F5F0',
        surface: {
          DEFAULT: '#FFFFFF',
          sunken: '#EFEDE6',
          raised: '#FFFFFF',
        },
        line: '#E1DDD2',
        ink: {
          hi: '#14213D',
          mid: '#4A5568',
          lo: '#8A94A6',
        },
        indigo: {
          DEFAULT: '#1F3A8A',
          dark: '#172554',
          light: '#2B7FD1',
          soft: '#EEF2FF',
        },
        ghats: {
          DEFAULT: '#0E7C66',
          dark: '#085344',
          soft: '#E6F4F1',
        },
        terracotta: {
          DEFAULT: '#C2512D',
          dark: '#9E3E20',
          soft: '#FDF1EC',
        },
        turmeric: {
          DEFAULT: '#E8A317',
          dark: '#B87E0E',
          soft: '#FEF9E7',
        },
        crimson: {
          DEFAULT: '#C62839',
          dark: '#9E1C2B',
          soft: '#FDF2F3',
        },
        sky: {
          DEFAULT: '#2B7FD1',
          soft: '#EFF6FF',
        },
        ticker: '#0F172A',
        cong: {
          emerald: '#10B981',
          amber: '#F59E0B',
          orange: '#F97316',
          crimson: '#DC2626',
        },
      },
      fontFamily: {
        heading: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
        tamil: ['Noto Sans Tamil', 'sans-serif'],
      },
      boxShadow: {
        'atlas-sm': '0 1px 2px rgba(20, 33, 61, 0.05), 0 4px 12px rgba(20, 33, 61, 0.05)',
        'atlas': '0 1px 2px rgba(20, 33, 61, 0.06), 0 10px 28px rgba(20, 33, 61, 0.07)',
        'atlas-lg': '0 8px 30px rgba(20, 33, 61, 0.12)',
      },
      animation: {
        'pulse-subtle': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
