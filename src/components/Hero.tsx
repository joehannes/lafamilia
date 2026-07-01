import React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { useBrand } from "../contexts/BrandContext";

interface HeroProps {
  backgroundImage: string;
  backgroundVideo?: string;
}

const Hero: React.FC<HeroProps> = ({ backgroundImage, backgroundVideo }) => {
  const { brandSettings } = useBrand();

  return (
    <section
      className="relative isolate z-20 overflow-hidden bg-deep-ocean shadow-[0_40px_100px_-20px_rgba(24,50,74,0.7)]"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
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
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(24,50,74,.72),rgba(88,183,200,.35)_46%,rgba(241,108,138,.25))]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(255,255,255,.22),transparent_22%),radial-gradient(circle_at_90%_82%,rgba(240,199,109,.22),transparent_28%)]" />

      <div className="section-shell flex min-h-[88vh] items-center py-24 md:py-28">
        <div
          className="hero-glass max-w-3xl p-8 md:p-12"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-white/70">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            Stylish, easy planning · local concierge care
          </div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-slate-700">
            Bavaro · Punta Cana · Dominican Republic
          </p>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
            <FormattedMessage
              id="hero.title"
              values={{ brand: brandSettings.brandName }}
            />
          </h1>
          <p className="mb-8 max-w-2xl text-lg leading-8 text-slate-700 md:text-xl">
            <FormattedMessage id="hero.subtitle" />
          </p>
          <div className="flex flex-wrap gap-3">
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
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm text-slate-700 shadow-sm">
              <div className="font-semibold text-slate-900">24/7</div>
              <div>support</div>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm text-slate-700 shadow-sm">
              <div className="font-semibold text-slate-900">Luxury</div>
              <div>small-group flow</div>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm text-slate-700 shadow-sm">
              <div className="font-semibold text-slate-900">Easy</div>
              <div>booking in minutes</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
