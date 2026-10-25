import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        felt: {
          darkest: "#050d09",
          900: "#091811",
          800: "#0d2319",
          700: "#133224",
          600: "#1b4432",
          500: "#245c43",
          accent: "#2ecc71"
        },
        gold: {
          50: "#fbf8ee",
          100: "#f5eed3",
          200: "#ecdaa7",
          300: "#e0c074",
          400: "#d6a847",
          500: "#c69229",
          DEFAULT: "#dfb461",
          bright: "#f4d078",
          dark: "#a2751f"
        },
        cardbg: {
          subtle: "rgba(18, 26, 21, 0.75)",
          solid: "#111814",
          border: "rgba(255, 255, 255, 0.09)",
          hover: "rgba(255, 255, 255, 0.14)"
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        display: ['"Cinzel"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 25px -5px rgba(223, 180, 97, 0.3)',
        'glow-green': '0 0 25px -5px rgba(46, 204, 113, 0.3)',
        'felt-inset': 'inset 0 2px 8px rgba(0, 0, 0, 0.6)',
      }
    },
  },
  plugins: [],
};

export default config;
