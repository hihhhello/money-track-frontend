/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      padding: {
        4.5: '18px',
      },
      fontSize: {
        '4.5xl': '40px',
      },
      colors: {
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
        'lime-green': '#D7FE63',
        main: {
          dark: '#2B2C3B',
          white: '#F4F4F8',
          blue: '#4160EA',
          orange: '#CF623C',
        },
      },
      borderRadius: {
        '4xl': '20px',
        '5xl': '24px',
      },
      boxShadow: {
        'md-top':
          '0 -4px 6px -1px rgb(0, 0, 0, 0.1), 0 -2px 4px -2px rgb(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
  darkMode: 'class',
};
