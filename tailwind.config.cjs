/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        greenish: {
          DEFAULT: '#4a4740',
          dark: '#37342f'
        },
        maccha: '#769171',
        greenlite: '#F7F8F7'
      }
    }
  },
  plugins: []
}
