/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#0F1115',
        anthracite: '#181B20',
        charcoal: '#22262E',
        ocd: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F26513', // Orange exact du logo OCD
          600: '#DC5309',
          700: '#B84106',
        },
        gold: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FB923C',
          400: '#F26513',
          500: '#EA580C',
          600: '#C2410C',
          700: '#9A3412',
        }
      },
      fontFamily: {
        serif: ['"Montserrat"', 'sans-serif'],
        display: ['"Montserrat"', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F26513 0%, #DC5309 100%)',
      }
    },
  },
  plugins: [],
}
