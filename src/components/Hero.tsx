import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { useBrand } from '../contexts/BrandContext';

interface HeroProps {
  backgroundImage: string;
  backgroundVideo?: string;
}

const Hero: React.FC<HeroProps> = ({ backgroundImage, backgroundVideo }) => {
  const { brandSettings } = useBrand();

  return (
    <section
      className="relative isolate overflow-hidden bg-slate-950 z-20 shadow-[0_40_100px_-20px_rgba(0,0,0,0.8)]"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {backgroundVideo && (
        <video
          className="absolute inset-0 -z-20 h-full w-full scale-110 object-cover opacity-75"
          src={backgroundVideo}
          autoPlay
          muted
          loop
          playsInline
          poster={backgroundImage}
          aria-hidden="true"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(6,33,50,.62),rgba(10,97,117,.32)_46%,rgba(237,163,79,.22))]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,.18),transparent_22%),radial-gradient(circle_at_88%_80%,rgba(20,184,166,.18),transparent_30%)]" />

      <div className="section-shell flex min-h-[86vh] items-center py-24 md:py-28">
        <div className="hero-glass max-w-3xl p-7 md:p-12 bg-white/50 backdrop-blur-md" style={{ backgroundColor: 'rgba(255, 253, 240, 0.50)', backdropFilter: 'blur(12px)' }}>
          <p className="mb-4 text-sm font-bold uppercase text-teal-900">
            Bavaro · Punta Cana · Dominican Republic
          </p>
          <h1 className="mb-5 text-5xl font-bold leading-tight text-slate-950 md:text-7xl">
            <FormattedMessage id="hero.title" values={{ brand: brandSettings.brandName }} />
          </h1>
          <p className="mb-8 max-w-2xl text-lg leading-8 text-slate-800 md:text-xl">
            <FormattedMessage id="hero.subtitle" />
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/tours#top" className="tropical-button">
              <FormattedMessage id="hero.cta" />
            </Link>
            <Link to="/transport#top" className="tropical-button-outline">
              <FormattedMessage id="nav.transport" defaultMessage="Transport" />
            </Link>
            <Link to="/contact#top" className="tropical-button-outline">
              <FormattedMessage id="contact.title" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
