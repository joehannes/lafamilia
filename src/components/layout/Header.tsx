import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { HiMenu, HiX } from "react-icons/hi";
import {
  MdHome,
  MdTour,
  MdLocalTaxi,
  MdEmail,
  MdLibraryBooks,
} from "react-icons/md";
import LanguageSwitcher from "../LanguageSwitcher";
import { useBrand } from "../../contexts/BrandContext";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { brandSettings } = useBrand();

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-[rgba(255,250,244,0.92)] shadow-[0_10px_40px_rgba(24,50,74,0.12)] backdrop-blur-2xl">
      <div className="section-shell flex items-center justify-between py-3 lg:py-4">
        <Link
          to="/#top"
          className="group flex items-center gap-3"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="menu-logo-icon fixed left-3 top-2 flex h-[5.5rem] w-[5.5rem] items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-white/90 to-rose-50/80 shadow-[0_16px_40px_rgba(241,108,138,0.22)] backdrop-blur-md sm:left-6 lg:left-[max(2rem,calc((100vw-80rem)/2+2rem))]">
            {brandSettings.brandicon ? (
              <img
                src={brandSettings.brandicon}
                alt="Logo"
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src="/competitor-logo.svg"
                alt="Logo"
                className="h-[4.2rem] w-[4.2rem]"
              />
            )}
          </div>
          <div className="ml-[5.3rem] flex flex-col sm:ml-[6.6rem] lg:ml-[7rem]">
            <h1 className="text-lg font-semibold text-slate-900 transition group-hover:text-rose-600 sm:text-xl">
              {brandSettings.brandName}
            </h1>
            <p className="hidden text-sm text-slate-500 sm:block">
              Curated island escapes
            </p>
          </div>
        </Link>

        <button
          className="grid h-11 w-11 place-items-center rounded-full bg-white/80 text-slate-800 ring-1 ring-white/70 shadow-sm transition hover:bg-white md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? (
            <HiX className="h-7 w-7" />
          ) : (
            <HiMenu className="h-7 w-7" />
          )}
        </button>

        <nav
          className={`${isMenuOpen ? "flex" : "hidden"} absolute left-3 right-3 top-[calc(100%+10px)] flex-col gap-2 rounded-[28px] border border-white/70 bg-[rgba(255,250,244,0.96)] px-4 py-4 shadow-[0_16px_48px_rgba(24,50,74,0.16)] backdrop-blur-xl md:static md:flex md:flex-row md:items-center md:gap-2 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
        >
          <Link
            to="/#top"
            onClick={() => setIsMenuOpen(false)}
            className="nav-link-pill"
          >
            <MdHome />
            <FormattedMessage id="nav.home" />
          </Link>
          <Link
            to="/tours#top"
            onClick={() => setIsMenuOpen(false)}
            className="nav-link-pill"
          >
            <MdTour />
            <FormattedMessage id="nav.tours" />
          </Link>
          <Link
            to="/transport#top"
            onClick={() => setIsMenuOpen(false)}
            className="nav-link-pill"
          >
            <MdLocalTaxi />
            <FormattedMessage id="nav.transport" defaultMessage="Transport" />
          </Link>
          <Link
            to="/blog#top"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-2 rounded-full px-3 py-2 font-semibold text-slate-700 transition hover:bg-rose-50 hover:text-rose-700"
          >
            <MdLibraryBooks />
            <FormattedMessage id="nav.blog" defaultMessage="Blog" />
          </Link>
          <Link
            to="/contact#top"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-2 rounded-full px-3 py-2 font-semibold text-slate-700 transition hover:bg-rose-50 hover:text-rose-700"
          >
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
