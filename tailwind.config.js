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
          50: '#E2F3DD',
          100: '#d7ece0',
          200: '#b4ddc5',
          300: '#86c6a2',
          400: '#53a87c',
          500: '#3AAA48',
          600: '#1e714a',
          700: '#13824F',
          800: '#0C6B44', // primary CTA green
          900: '#0A5A39', // deep forest green
          950: '#063E27',
        },
        lime: {
          DEFAULT: '#A5D63B',
          light: '#C4EC5B',
        },
        ink: {
          DEFAULT: '#16261E',
          2: '#4F6057',
          muted: '#76857D',
        },
        line: '#E3ECE0',
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
        sans: ['"Plus Jakarta Sans"', '"Noto Sans Devanagari"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', '"Noto Sans Devanagari"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 6px 20px rgba(16, 60, 38, 0.07), 0 1px 2px rgba(16, 40, 25, 0.05)',
        'card-hover': '0 12px 28px rgba(16, 60, 38, 0.12), 0 4px 10px rgba(0, 0, 0, 0.04)',
        'sheet': '0 -10px 40px rgba(10, 60, 35, 0.2)',
        'nav': '0 10px 30px rgba(16, 60, 38, 0.12), 0 2px 6px rgba(16, 40, 25, 0.06)',
      },
      spacing: {
        '22': '5.5rem',
      }
    },
  },
  plugins: [],
}
