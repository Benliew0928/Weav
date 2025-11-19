import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        foreground: '#ffffff',
        // Primary gradient colors
        'primary-start': '#7F7FFF',
        'primary-mid': '#A06CFF',
        'primary-end': '#FF88C6',
        // Secondary gradient colors
        'secondary-start': '#00E6FF',
        'secondary-mid': '#8A9EFF',
        'secondary-end': '#C2E9FB',
        // Nebula palette
        nebula: {
          purple: '#A58CFF',
          cyan: '#85E1F8',
          pink: '#FFB3C6',
          green: '#B8FFD1',
        },
      },
      borderRadius: {
        'card': '20px',
        'button': '16px',
        'chip': '10px',
      },
      fontSize: {
        'page-title': ['32px', { lineHeight: '1.2', fontWeight: '600' }],
        'section-title': ['20px', { lineHeight: '1.3', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'small': ['13px', { lineHeight: '1.4', fontWeight: '500' }],
      },
      spacing: {
        // 4px grid system
        '18': '72px', // Node diameter
        '14': '56px', // Minimum node diameter
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'unread-pulse': 'unreadPulse 1.6s ease-in-out infinite',
        'gradient-rotate': 'gradientRotate 40s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        unreadPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.06)' },
        },
        gradientRotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
export default config

