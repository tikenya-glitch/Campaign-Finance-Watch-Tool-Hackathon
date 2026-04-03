/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      xs:  '400px',
      sm:  '640px',
      md:  '768px',
      lg:  '1024px',
      xl:  '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        surface: {
          DEFAULT: 'var(--surface)',
          card:    'var(--surface-card)',
          border:  'var(--surface-border)',
          hover:   'var(--surface-hover)',
        },
        accent: {
          blue:   '#4f8ef7',
          orange: '#f97316',
          red:    '#ef4444',
          green:  '#22c55e',
          yellow: '#eab308',
          purple: '#a855f7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
