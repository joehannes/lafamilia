import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { MdAdminPanelSettings } from 'react-icons/md';
import { FaInstagram, FaTiktok, FaFacebook, FaYoutube, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { useBrand } from '../../contexts/BrandContext';
import { getSocialMediaData, SocialMediaAccount } from '../../services/socialMediaService';

const platformIcons: Record<string, React.ReactNode> = {
  instagram: <FaInstagram className="w-5 h-5" />,
  tiktok: <FaTiktok className="w-5 h-5" />,
  facebook: <FaFacebook className="w-5 h-5" />,
  youtube: <FaYoutube className="w-5 h-5" />,
  twitter: <FaTwitter className="w-5 h-5" />,
  linkedin: <FaLinkedin className="w-5 h-5" />
};

const Footer = () => {
  const { brandSettings } = useBrand();
  const [socialAccounts, setSocialAccounts] = useState<SocialMediaAccount[]>([]);

  useEffect(() => {
    const loadSocialAccounts = async () => {
      const data = await getSocialMediaData();
      setSocialAccounts(data.accounts.filter((a: SocialMediaAccount) => a.enabled));
    };
    loadSocialAccounts();
  }, []);

  return (
    <footer className="relative overflow-hidden border-t border-white/20 bg-gradient-to-br from-[#18324a] via-[#224e62] to-[#4d5b6d] py-16 text-slate-100 shadow-[inset_0_0_80px_rgba(0,0,0,0.22)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(240,199,109,.14),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(241,108,138,.12),transparent_34%),radial-gradient(circle_at_50%_50%,rgba(88,183,200,.12),transparent_60%)]" />
      <div className="section-shell relative z-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-white/10 to-cyan-50/10 flex items-center justify-center ring-1 ring-white/20 backdrop-blur-md shadow-lg overflow-hidden">
                {brandSettings.brandicon ? (
                  <img src={brandSettings.brandicon} alt="Logo" className="h-full w-full object-cover" />
                ) : (
                  <img src="/competitor-logo.svg" alt="Logo" className="h-10 w-10" />
                )}
              </div>
              <h3 className="text-2xl font-bold text-white">{brandSettings.brandName}</h3>
            </div>
            <p className="max-w-md text-slate-200/95">
              <FormattedMessage id="footer.description" />
            </p>
            
            {/* Social Media Icons */}
            {socialAccounts.length > 0 && (
              <div className="mt-8 flex gap-3">
                {socialAccounts.map((account) => (
                  <a
                    key={account.platform}
                    href={account.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-12 w-12 place-items-center rounded-full bg-white/12 text-white transition hover:scale-110 hover:bg-white/90 hover:text-teal-700 shadow-[0_8px_20px_rgba(0,0,0,.2)]"
                    title={`Follow on ${account.platform}`}
                  >
                    {platformIcons[account.platform]}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">
              <FormattedMessage id="footer.quickLinks" />
            </h4>
            <ul className="space-y-2 text-slate-100/90">
              <li><Link to="/#top" className="text-slate-100 hover:text-amber-200"><FormattedMessage id="footer.home" /></Link></li>
              <li><Link to="/tours#top" className="text-slate-100 hover:text-amber-200"><FormattedMessage id="footer.tours" /></Link></li>
              <li><Link to="/transport#top" className="text-slate-100 hover:text-amber-200"><FormattedMessage id="footer.transport" defaultMessage="Transport" /></Link></li>
              <li><Link to="/contact#top" className="text-slate-100 hover:text-amber-200"><FormattedMessage id="footer.contact" /></Link></li>
              <li>
                <Link to="/admin" className="inline-flex items-center gap-1 text-slate-100 hover:text-amber-200">
                  <MdAdminPanelSettings />
                  <FormattedMessage id="footer.admin" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Accounts Info */}
          {socialAccounts.length > 0 && (
            <div>
              <h4 className="mb-4 text-lg font-semibold text-white">Follow Us</h4>
              <div className="space-y-2 text-sm text-white/[.78]">
                {socialAccounts.map((account) => (
                  <div key={account.platform} className="flex items-center gap-2">
                    <span className="text-amber-200">{platformIcons[account.platform]}</span>
                    <a
                      href={account.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="capitalize transition-colors hover:text-amber-200"
                    >
                      {account.platform} @{account.username}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 border-t border-white/15 pt-6 text-sm text-slate-100/80">
          <FormattedMessage id="footer.copyright" values={{ year: new Date().getFullYear() }} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
