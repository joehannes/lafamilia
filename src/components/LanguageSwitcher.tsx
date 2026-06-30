import React from 'react';
import { useI18n } from '../contexts/I18nContext';

const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale } = useI18n();

  const selectLanguage = (lang: 'en' | 'es') => {
    if (lang !== locale) {
      setLocale(lang);
    }
  };

  return (
    <div className="language-toggle inline-flex rounded-full bg-white/95 p-1 shadow-lg ring-1 ring-slate-200/70">
      <button
        type="button"
        aria-pressed={locale === 'en'}
        onClick={() => selectLanguage('en')}
        className={`language-toggle-button ${locale === 'en' ? 'active' : ''}`}
      >
        EN
      </button>
      <button
        type="button"
        aria-pressed={locale === 'es'}
        onClick={() => selectLanguage('es')}
        className={`language-toggle-button ${locale === 'es' ? 'active' : ''}`}
      >
        ES
      </button>
    </div>
  );
};

export default LanguageSwitcher;
