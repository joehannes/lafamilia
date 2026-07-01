module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        caribbean: {
          rum: '#8B4513',
          tobacco: '#6B5D2E',
          coral: '#FF6B4A',
          ocean: '#006994',
          turquoise: '#40E0D0',
          gold: '#F4C430',
          palm: '#2D5016',
          bronze: '#CD7F32',
          amber: '#FFBF00',
          sunset: '#FF8C42',
        },
        western: {
          leather: '#8B4513',
          saddle: '#A0522D',
          bronze: '#CD7F32',
          sand: '#C2B280',
        },
        dominican: {
          amber: '#FFBF00',
          mahogany: '#C04000',
          larimar: '#40E0D0',
        },
        tropical: {
          light: '#FFF8F0',
          cream: '#FFEFEB',
          peach: '#FFE5D9',
          coral: '#FFD4BE',
          pink: '#FFB7C5',
          lavender: '#E8D5F2',
          mint: '#D4F0E8',
          sky: '#D4E8F2',
        }
      },
      fontFamily: {
        heading: ['Playfair Display', 'Cinzel', 'Georgia', 'serif'],
        body: ['Inter', 'Raleway', 'system-ui', 'sans-serif'],
        accent: ['Montserrat', 'Poppins', 'sans-serif'],
        script: ['Dancing Script', 'cursive'],
      },
      backgroundImage: {
        'caribbean-sunset': 'linear-gradient(135deg, #8B4513 0%, #A0522D 28%, #CD853F 55%, #FF8C42 85%, #FFD700 100%)',
        'caribbean-ocean': 'linear-gradient(145deg, #004E64 0%, #006994 32%, #008793 62%, #40E0D0 100%)',
        'western-leather': 'linear-gradient(135deg, #8B4513, #A0522D)',
        'tropical-glow': 'conic-gradient(from 60deg, rgba(255, 107, 74, 0.7), rgba(244, 196, 48, 0.6), rgba(64, 224, 208, 0.55), rgba(0, 105, 148, 0.5), rgba(255, 107, 74, 0.7))',
        'tropical-paradise': 'linear-gradient(135deg, #FFF8F0 0%, #FFEFEB 25%, #FFE5D9 50%, #FFD4BE 75%, #FFB7C5 100%)',
        'ocean-breeze': 'linear-gradient(135deg, #E8F4F8 0%, #D4E8F2 35%, #D4F0E8 65%, #E8F8F0 100%)',
      },
      boxShadow: {
        'caribbean': '0 28px 72px rgba(139, 69, 19, 0.18), 0 8px 20px rgba(255, 107, 74, 0.1)',
        'western': '0 24px 64px rgba(139, 69, 19, 0.16), 0 8px 20px rgba(255, 107, 74, 0.1)',
        'tropical': '0 32px 80px rgba(139, 69, 19, 0.18), 0 8px 24px rgba(255, 107, 74, 0.12)',
        'glow-coral': '0 0 60px rgba(255, 107, 74, 0.3)',
        'glow-gold': '0 0 80px rgba(244, 196, 48, 0.25)',
        'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'medium': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'large': '0 16px 50px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        'none': '0',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '28px',
        '3xl': '36px',
        'full': '9999px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      animation: {
        'rotate-wash': 'rotateWash 30s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        rotateWash: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        shimmer: {
          from: { left: '-100%' },
          to: { left: '100%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}