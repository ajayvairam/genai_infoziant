/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#06080b',
          900: '#0b0f14',
          850: '#10151d',
          800: '#161c26',
          700: '#222c3c',
          600: '#334155',
        },
        brand: {
          neon: '#00FF87',
          green: '#10b981',
          emerald: '#059669',
          glow: 'rgba(0, 255, 135, 0.15)',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'glow-green': '0 0 20px -3px rgba(0, 255, 135, 0.25)',
        'glow-subtle': '0 0 15px -2px rgba(16, 185, 129, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
