import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        sand: '#F4F1EA',
        ink: '#1C1917',
        clay: '#7C6A5A',
        sage: { DEFAULT: '#5A6B5D', dark: '#3F4E42', light: '#8CA08F' },
        cream: '#FBFAF6',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
