/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        medical: {
          cyan: '#06b6d4',
          teal: '#14b8a6',
          emerald: '#10b981',
          dark: '#030305',
          panel: '#09090b',
          surface: '#18181b',
          gray: '#27272a'
        }
      },
      animation: {
        'glitch': 'glitch 1s linear infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow 3s ease-in-out infinite',
      },
      boxShadow: {
        'neon-cyan': '0 0 10px rgba(6, 182, 212, 0.4), 0 0 40px rgba(6, 182, 212, 0.2)',
        'neon-teal': '0 0 10px rgba(20, 184, 166, 0.4), 0 0 40px rgba(20, 184, 166, 0.2)',
        'neon-emerald': '0 0 10px rgba(16, 185, 129, 0.4), 0 0 40px rgba(16, 185, 129, 0.2)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        'glass-glow': '0 8px 32px 0 rgba(6, 182, 212, 0.15)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
      }
    },
  },
  plugins: [],
}
