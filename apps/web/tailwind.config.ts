import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"DM Sans"', 'sans-serif'],
        body: ['"Space Grotesk"', 'sans-serif']
      },
      colors: {
        ink: '#111111',
        sand: '#f5f2ed',
        citrus: '#ffb100',
        moss: '#2a9d8f'
      }
    }
  },
  plugins: []
}

export default config
