/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#edf7f1',
          100: '#d7ece0',
          200: '#b4ddc5',
          300: '#86c6a2',
          400: '#53a87c',
          500: '#2e8c5f',
          600: '#1e714a',
          700: '#185e3b', // primary brand green
          800: '#144c31',
          900: '#103e28',
          950: '#082316',
        },
        saffron: {
          50: '#fff9ed',
          100: '#fff1d4',
          200: '#ffe0a8',
          300: '#ffca71',
          400: '#ffab38',
          500: '#f98d10',
          600: '#e88a1a', // brand saffron
          700: '#bf5d09',
          800: '#98490f',
          900: '#7b3e10',
        },
        sage: {
          50: '#f6f9f7',
          100: '#eaf1ec',
          200: '#d6e4da',
          300: '#b6d0bd',
          400: '#90b59b',
          500: '#719a7d',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 12px rgba(24, 94, 59, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 12px 28px rgba(24, 94, 59, 0.1), 0 4px 10px rgba(0, 0, 0, 0.04)',
        'sheet': '0 -10px 40px rgba(15, 45, 30, 0.16)',
        'nav': '0 -2px 16px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
