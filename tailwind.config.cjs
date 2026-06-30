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
      },
      fontFamily: {
        heading: ['Cinzel', 'Raleway', 'serif'],
        body: ['Raleway', 'Montserrat', 'sans-serif'],
        accent: ['Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        'caribbean-sunset': 'linear-gradient(135deg, #8B4513 0%, #A0522D 28%, #CD853F 55%, #FF8C42 85%, #FFD700 100%)',
        'caribbean-ocean': 'linear-gradient(145deg, #004E64 0%, #006994 32%, #008793 62%, #40E0D0 100%)',
        'western-leather': 'linear-gradient(135deg, #8B4513, #A0522D)',
        'tropical-glow': 'conic-gradient(from 60deg, rgba(255, 107, 74, 0.7), rgba(244, 196, 48, 0.6), rgba(64, 224, 208, 0.55), rgba(0, 105, 148, 0.5), rgba(255, 107, 74, 0.7))',
      },
      boxShadow: {
        'caribbean': '0 28px 72px rgba(139, 69, 19, 0.18), 0 8px 20px rgba(255, 107, 74, 0.1)',
        'western': '0 24px 64px rgba(139, 69, 19, 0.16), 0 8px 20px rgba(255, 107, 74, 0.1)',
        'tropical': '0 32px 80px rgba(139, 69, 19, 0.18), 0 8px 24px rgba(255, 107, 74, 0.12)',
        'glow-coral': '0 0 60px rgba(255, 107, 74, 0.3)',
        'glow-gold': '0 0 80px rgba(244, 196, 48, 0.25)',
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '20px',
        '3xl': '28px',
      },
      animation: {
        'rotate-wash': 'rotateWash 30s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
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
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}