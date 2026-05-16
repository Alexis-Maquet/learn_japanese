/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        japan: {
          red: '#DC143C',
          dark: '#0d1117',
          card: '#161b22',
          border: '#30363d',
          accent: '#e94560',
          muted: '#8b949e',
        },
      },
      fontFamily: {
        japanese: ['"Noto Sans JP"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

