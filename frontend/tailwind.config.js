/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],  // 👈 This is correct
  theme: {
    extend: {
      animation: {
        'float-slow': 'float 10s ease-in-out infinite',
        'pulse-strong': 'pulseScale 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(50px, 50px)' },
        },
        pulseScale: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.7' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
