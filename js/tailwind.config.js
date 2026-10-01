// Tailwind configuration tailored for Dark Luxury Cinematic Portfolio
if (typeof tailwind !== 'undefined') {
  tailwind.config = {
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          brand: {
            bg: '#080808',
            surface: '#111111',
            card: '#181818',
            elevated: '#222222',
            border: 'rgba(255, 255, 255, 0.10)',
            glass: 'rgba(255, 255, 255, 0.06)',
            text: '#F5F5F5',
            muted: '#A0A0A0',
            accent: '#F28C28',
            accentHover: '#FFB347',
          },
          dark: {
            950: '#080808',
            900: '#111111',
            800: '#181818',
            700: '#222222',
            600: '#2d2d2d',
            500: '#404040',
          },
          accent: {
            DEFAULT: '#F28C28',
            light: '#FFB347',
            dark: '#D97314',
            glow: 'rgba(242, 140, 40, 0.35)',
          }
        },
        fontFamily: {
          space: ['"Space Grotesk"', 'sans-serif'],
          manrope: ['"Manrope"', 'sans-serif'],
          editorial: ['"Cormorant Garamond"', 'serif'],
          inter: ['"Inter"', 'sans-serif'],
        },
        letterSpacing: {
          widest2: '0.25em',
          widest3: '0.35em',
        },
        animation: {
          'float': 'floatSlow 6s ease-in-out infinite',
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }
      }
    }
  };
}
