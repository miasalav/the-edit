// ============================================================
// The Edit — Tailwind Config
// Brand palette defined here — never use arbitrary hex values
// in components. Always use these named tokens.
// ============================================================

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ── Brand colours ────────────────────────────────────────
      colors: {
        // Backgrounds
        cream: '#FAFAF8',         // page background
        'cream-dark': '#F2EDE8',  // card backgrounds, code blocks

        // Text
        ink: '#1A1612',           // primary text
        muted: '#8C8680',         // secondary text, captions

        // Accent
        terracotta: '#C4622D',    // CTAs, links, highlights
        'terracotta-light': '#E8836A', // hover state
        'terracotta-dark': '#9E4D22',  // active / pressed state

        // Borders & dividers
        border: '#E8E2DA',        // subtle borders
        'border-strong': '#C8C0B8', // more visible borders

        // Feedback
        success: '#2D6A4F',       // pros, positive states
        'success-bg': '#F0FAF4',

        // Neutral grays (for skeletons, disabled states)
        gray: {
          50: '#FAFAF9',
          100: '#F4F0EC',
          200: '#E8E2DA',
          300: '#D4CCC4',
          400: '#B0A89F',
          500: '#8C8680',
          600: '#6B6560',
          700: '#4A4542',
          800: '#2E2B28',
          900: '#1A1612',
        },
      },

      // ── Typography ───────────────────────────────────────────
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },

      // ── Layout ───────────────────────────────────────────────
      maxWidth: {
        site: '1280px',
        prose: '680px',    // comfortable reading width for guides
      },

      // ── Spacing additions ─────────────────────────────────────
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },

      // ── Animations ───────────────────────────────────────────
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease forwards',
      },
    },
  },
  plugins: [],
}

export default config
