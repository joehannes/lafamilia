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
      className="relative isolate overflow-hidden bg-deep-ocean z-20 shadow-[0_40_100px_-20px_rgba(3,4,94,0.8)]"
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
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(3,4,94,.65),rgba(0,180,216,.35)_46%,rgba(252,163,17,.25))]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,.2),transparent_22%),radial-gradient(circle_at_88%_80%,rgba(0,180,216,.2),transparent_30%)]" />

      <div className="section-shell flex min-h-[86vh] items-center py-24 md:py-28">
        <div className="hero-glass max-w-3xl p-8 md:p-12" style={{ backgroundColor: 'rgba(255, 255, 255, 0.65)', backdropFilter: 'blur(16px)' }}>
          <p className="mb-4 text-sm font-bold uppercase text-deep-ocean tracking-wider">
            Bavaro · Punta Cana · Dominican Republic
          </p>
          <h1 className="mb-6 text-5xl font-bold leading-tight text-deep-ocean md:text-7xl">
            <FormattedMessage id="hero.title" values={{ brand: brandSettings.brandName }} />
          </h1>
          <p className="mb-8 max-w-2xl text-lg leading-8 text-slate-700 md:text-xl">
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
