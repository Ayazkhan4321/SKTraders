/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rzp: {
          blue: '#2b64f6',
          blueHover: '#1d4ed8',
          blueLight: '#eff6ff',
          blueSoft: '#dbeafe',
          dark: '#0f172a',
          slate: '#334155',
          muted: '#64748b',
          border: '#e2e8f0',
          bgLight: '#f8fafc',
        },
        signify: {
          green: '#00e676',
          greenHover: '#00c853',
          dark: '#0f172a',
          slate: '#334155',
          lightBg: '#f8fafc',
          border: '#e5e7eb',
        },
        brand: {
          navy: '#071A33',
          navyDark: '#040F1F',
          blue: '#00e676',
          blueHover: '#00c853',
          gold: '#00e676',
          goldGlow: 'rgba(0, 230, 118, 0.25)',
          charcoal: '#15191F',
          charcoalLight: '#1E242D',
          slate: '#8F9CAE',
          lightBg: '#F8FAFC',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s infinite ease-in-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.4, transform: 'scale(1)' },
          '50%': { opacity: 0.8, transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
