import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { HiMenu, HiX } from 'react-icons/hi';
import { MdHome, MdTour, MdLocalTaxi, MdEmail, MdLibraryBooks } from 'react-icons/md';
import LanguageSwitcher from '../LanguageSwitcher';
import { useBrand } from '../../contexts/BrandContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { brandSettings } = useBrand();

  return (
    <header className="sticky top-0 z-50 overflow-visible border-b border-white/30 bg-white/30 shadow-[0_8px_32px_rgba(8,42,62,.15)] backdrop-blur-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.50)', backdropFilter: 'blur(12px)' }}>
      <div className="section-shell flex items-center justify-between py-4 pl-[7.25rem] sm:pl-[7.75rem] lg:pl-8">
        <Link to="/#top" className="group flex items-center gap-3">
          <div className="menu-logo-icon fixed left-4 top-2 flex h-[6.125rem] w-[6.125rem] items-center justify-center rounded-full bg-gradient-to-br from-white/80 to-cyan-50/60 shadow-[0_0_30px_rgba(251,146,60,0.95),0_0_60px_rgba(251,146,60,0.6),0_0_100px_rgba(251,146,60,0.3)] ring-1 ring-white/40 overflow-hidden backdrop-blur-md sm:left-6 lg:left-[max(2rem,calc((100vw-80rem)/2+2rem))]">
            {brandSettings.brandicon ? (
              <img src={brandSettings.brandicon} alt="Logo" className="h-full w-full object-cover" />
            ) : (
              <img src="/competitor-logo.svg" alt="Logo" className="h-[5.25rem] w-[5.25rem]" />
            )}
          </div>
          <h1 className="hidden text-2xl font-bold text-slate-900 transition group-hover:text-teal-700 sm:block sm:ml-[7.5rem] lg:ml-[8rem] relative">
            <span className="relative z-10">{brandSettings.brandName}</span>
            <span className="absolute inset-0 -top-1 -left-2 -right-2 -bottom-1 bg-gradient-to-r from-orange-300/30 via-orange-400/20 to-amber-300/30 rounded-lg blur-sm opacity-60 group-hover:opacity-80 transition-opacity duration-300"></span>
          </h1>
        </Link>

        <button
          className="grid h-11 w-11 place-items-center rounded-full bg-white/60 text-slate-800 ring-1 ring-white/50 backdrop-blur-md hover:bg-white/80 transition md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <HiX className="h-8 w-8" /> : <HiMenu className="h-8 w-8" />}
        </button>

        <nav
          className={`${isMenuOpen ? 'flex' : 'hidden'} absolute left-3 right-3 top-[calc(100%+10px)] flex-col gap-3 rounded-[28px] border border-white/40 bg-white/30 px-6 py-6 shadow-[0_16px_48px_rgba(8,42,62,.16)] backdrop-blur-xl md:static md:flex md:flex-row md:items-center md:gap-3 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
        >
          <Link to="/#top" onClick={() => setIsMenuOpen(false)} className="nav-link-pill">
            <MdHome />
            <FormattedMessage id="nav.home" />
          </Link>
          <Link to="/tours#top" onClick={() => setIsMenuOpen(false)} className="nav-link-pill">
            <MdTour />
            <FormattedMessage id="nav.tours" />
          </Link>
          <Link to="/transport#top" onClick={() => setIsMenuOpen(false)} className="nav-link-pill">
            <MdLocalTaxi />
            <FormattedMessage id="nav.transport" defaultMessage="Transport" />
          </Link>
          <Link to="/blog#top" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 rounded-full px-3 py-2 font-semibold text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-700">
            <MdLibraryBooks />
            <FormattedMessage id="nav.blog" defaultMessage="Blog" />
          </Link>
          <Link to="/contact#top" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 rounded-full px-3 py-2 font-semibold text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-700">
            <MdEmail />
            <FormattedMessage id="nav.contact" />
          </Link>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
};

export default Header;
