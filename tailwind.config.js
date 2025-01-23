/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{svelte,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in'
      },
      keyframes: () => ({
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        }
      }),
      fontSize: {
        '10xl': ['9.5rem', '1'],
        '11xl': ['10rem', '1'],
        '12xl': ['12rem', '1'],
        '13xl': ['14rem', '1']
      }
    }
  },
  plugins: []
}
