#!/usr/bin/env deno run -A

import postcss from "npm:postcss@8.4.32";
import tailwindcss from "npm:tailwindcss@3.4.0";
import autoprefixer from "npm:autoprefixer@10.4.16";

const css = await Deno.readTextFile("./static/styles.css");

const result = await postcss([
  tailwindcss({
    content: [
      "./routes/**/*.{ts,tsx}",
      "./islands/**/*.{ts,tsx}",
      "./components/**/*.{ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
          },
          antko: {
            blue: {
              50: '#f0f9ff',
              100: '#e0f2fe',
              200: '#bae6fd',
              300: '#7dd3fc',
              400: '#38bdf8',
              500: '#0ea5e9',
              600: '#0284c7',
              700: '#0369a1',
              800: '#075985',
              900: '#0c4a6e',
            },
            green: {
              50: '#f0fdf4',
              100: '#dcfce7',
              200: '#bbf7d0',
              300: '#86efac',
              400: '#4ade80',
              500: '#22c55e',
              600: '#16a34a',
              700: '#15803d',
              800: '#166534',
              900: '#14532d',
            },
            purple: {
              50: '#faf5ff',
              100: '#f3e8ff',
              200: '#e9d5ff',
              300: '#d8b4fe',
              400: '#c084fc',
              500: '#a855f7',
              600: '#9333ea',
              700: '#7c3aed',
              800: '#6b21a8',
              900: '#581c87',
            },
          },
        },
        fontFamily: {
          sans: ['Inter', 'ui-sans-serif', 'system-ui'],
          display: ['Lexend', 'ui-sans-serif', 'system-ui'],
        },
        boxShadow: {
          'antko': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
          'antko-lg': '0 20px 60px -10px rgba(0, 0, 0, 0.15)',
        },
        backgroundImage: {
          'gradient-antko': 'linear-gradient(135deg, #0ea5e9 0%, #22c55e 50%, #a855f7 100%)',
          'gradient-blue': 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
          'gradient-green': 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          'gradient-purple': 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
        },
        animation: {
          'fade-in': 'fadeIn 0.5s ease-in-out',
          'slide-up': 'slideUp 0.3s ease-out',
          'bounce-subtle': 'bounceSubtle 2s infinite',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          slideUp: {
            '0%': { transform: 'translateY(20px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          bounceSubtle: {
            '0%, 100%': { transform: 'translateY(-5%)' },
            '50%': { transform: 'translateY(0)' },
          },
        },
      },
    },
    plugins: [],
  }),
  autoprefixer,
]).process(css, { from: undefined });

await Deno.writeTextFile("./static/styles.css", result.css);
console.log("✅ CSS compiled successfully!");