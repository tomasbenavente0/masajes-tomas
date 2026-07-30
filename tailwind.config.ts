import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Fondos cálidos
        sand: '#F7EFE6',
        cream: '#FDFAF6',
        // Textos
        ink: '#2B2019',
        clay: '#8A7362',
        // Color principal: terracota
        terra: {
          DEFAULT: '#C15F3C',
          dark: '#9B4526',
          light: '#E3A184',
          soft: '#F6E1D6',
        },
        // Color secundario: oliva (también lo usa el panel admin)
        sage: { DEFAULT: '#7E8763', dark: '#616A48', light: '#A8B08C' },
        honey: '#E2A455',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      // El proyecto usa font-500 / font-600 en todo el markup. Sin esto
      // Tailwind los ignora en silencio y los textos quedan sin peso.
      fontWeight: {
        400: '400',
        500: '500',
        600: '600',
        700: '700',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(43,32,25,0.06), 0 12px 32px -12px rgba(43,32,25,0.12)',
        lift: '0 8px 20px -6px rgba(43,32,25,0.12), 0 24px 48px -20px rgba(43,32,25,0.22)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both',
        float: 'float 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config
