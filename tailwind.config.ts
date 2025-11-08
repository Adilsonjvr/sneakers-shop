import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Inter', 'sans-serif'],
        body: ['var(--font-body)', 'Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#C1121F',
          muted: '#F25F5C',
          accent: '#FFC857',
        },
      },
      boxShadow: {
        card: '0 15px 35px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
