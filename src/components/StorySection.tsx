import React, { useEffect, useState, useRef } from 'react';

interface StorySectionProps {
  id: string;
  title: string;
  emoji: string;
  timeframe?: string;
  description: string;
  narrative: string;
  imageUrl?: string;
  vimeoUrl?: string;
  mood?: string;
  isAlternate?: boolean;
  themeName?: string;
}

const StorySection: React.FC<StorySectionProps> = ({
  id,
  title,
  emoji,
  timeframe,
  description,
  narrative,
  imageUrl,
  vimeoUrl,
  mood,
  isAlternate = false,
  themeName,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const isTikTok = vimeoUrl?.includes('tiktok.com');
  const tiktokVideoId = isTikTok ? vimeoUrl?.match(/video\/(\d+)/)?.[1] || vimeoUrl?.split('/').pop()?.split('?')[0] : '';

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const handleChange = () => setIsMobile(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener?.('change', handleChange);

    if (isTikTok && isInView && !document.getElementById('tiktok-embed-script')) {
      const script = document.createElement('script');
      script.id = 'tiktok-embed-script';
      script.src = 'https://www.tiktok.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
    }

    return () => mediaQuery.removeEventListener?.('change', handleChange);
  }, [isTikTok, isInView]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setHasLoaded(true);
        } else {
          setIsInView(false);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Attempt to pause/resume the video natively via postMessage when scrolling in/out of view
    if (!hasLoaded || !sectionRef.current) return;

    // The iframe might be native (Vimeo) or injected by TikTok embed.js
    const iframe = sectionRef.current.querySelector('iframe');
    if (!iframe || !iframe.contentWindow) return;

    try {
      if (isInView) {
        if (isTikTok) {
          iframe.contentWindow.postMessage({ 'x-tiktok-player': true, type: 'play' }, '*');
        } else {
          iframe.contentWindow.postMessage(JSON.stringify({ method: 'play' }), '*');
        }
      } else {
        if (isTikTok) {
          iframe.contentWindow.postMessage({ 'x-tiktok-player': true, type: 'pause' }, '*');
        } else {
          iframe.contentWindow.postMessage(JSON.stringify({ method: 'pause' }), '*');
        }
      }
    } catch (e) {
      // Ignore cross-origin errors if any
    }
  }, [isInView, hasLoaded, isTikTok]);

  const getVimeoAutoplayUrl = (url: string) => {
    if (!url) return '';
    if (isTikTok) return url; // TikTok handles its own URLs
    
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('autoplay', '1');
      urlObj.searchParams.set('loop', '1');
      urlObj.searchParams.set('muted', '1');
      urlObj.searchParams.set('background', '1'); // specific to vimeo to remove UI
      return urlObj.toString();
    } catch (e) {
      // If it's not a valid URL yet or missing protocol, just return original
      return url;
    }
  };

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`home-section relative overflow-hidden px-4 py-24 sm:py-28 md:px-8 lg:py-32 ${
        themeName ? themeName : isAlternate ? 'cove-section' : 'shore-section'
      }`}
    >
      {/* Decorative SVG Background Elements */}
      <div className="absolute top-0 left-10 w-32 h-32 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="none" className="animate-pulse">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" className="text-pink-400"/>
          <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="1" className="text-rose-300"/>
          <circle cx="50" cy="50" r="10" fill="currentColor" className="text-pink-200"/>
        </svg>
      </div>
      
      <div className="absolute bottom-10 right-10 w-40 h-40 opacity-8 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="none">
          <path d="M50 10 L60 35 L85 35 L65 50 L75 75 L50 60 L25 75 L35 50 L15 35 L40 35 Z" 
                stroke="currentColor" strokeWidth="1.5" className="text-cyan-400" fill="currentColor" fillOpacity="0.1"/>
        </svg>
      </div>
      
      <div
        className={`parallax-wash ${isAlternate ? 'parallax-wash-left' : 'parallax-wash-right'}`}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header with emoji and title */}
        <div className={`mb-10 text-center sm:mb-12 ${isAlternate ? 'md:text-right' : 'md:text-left'}`}>
          {emoji && (
            <div className={`section-icon mb-5 ${isAlternate ? 'md:ml-auto md:mr-0' : 'md:mr-auto md:ml-0'}`}>
              {emoji}
            </div>
          )}
          {title && (
            <h2 className="scribble-title-bg mb-3 text-3xl font-bold leading-tight text-slate-950 sm:text-4xl md:text-5xl heading-feminine">
              {title}
            </h2>
          )}
          {/* Thick stylish underline with gradient */}
          <div className="w-full px-4 md:px-8 mt-5 mb-5">
            <div className={`w-full h-5 rounded-full bg-gradient-to-r ${
              isAlternate 
                ? 'from-transparent via-pink-300 to-rose-400' 
                : 'from-rose-400 via-pink-300 to-transparent'
            } shadow-lg`} />
          </div>
          {timeframe && (
            <p className="text-base font-semibold italic text-teal-800 sm:text-lg">
              {timeframe}
            </p>
          )}
        </div>

        {/* Main content grid */}
        <div className={`grid items-center gap-12 ${imageUrl || vimeoUrl ? 'md:grid-cols-2 lg:gap-20' : 'md:grid-cols-1'}`}>
          {/* Text content */}
          <div className={(imageUrl || vimeoUrl) && isAlternate ? 'md:order-2' : 'md:order-1'}>
            {/* Description */}
            {description && (
              <div className="story-copy-card mb-6">
                <p className="whitespace-pre-wrap text-base leading-8 text-slate-700 sm:text-lg text-elegant">
                  {description}
                </p>
              </div>
            )}

            {/* Narrative */}
            {narrative && (
              <div className="prose prose-lg max-w-none">
                <p className="text-base italic leading-8 text-slate-600 md:text-lg text-elegant">
                  {narrative}
                </p>
              </div>
            )}

            {/* Mood badge with enhanced styling */}
            {mood && (
              <div className="mt-8 flex flex-wrap gap-2.5">
                {mood.split(', ').filter(Boolean).map((m, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-gradient-to-r from-pink-50 to-rose-50 px-5 py-2.5 text-sm font-semibold text-pink-900 shadow-md ring-1 ring-pink-200 transition-all hover:-translate-y-1 hover:shadow-lg hover:from-pink-100 hover:to-rose-100"
                  >
                    {m}
                  </span>
                ))}
              </div>
            )}

            {/* Video (if we also have an image, video goes here below the text) */}
            {vimeoUrl && imageUrl && (
              <div className="mt-8 story-media-frame flex justify-center w-full">
                <div className="absolute -inset-2 rounded-[20px] bg-gradient-to-r from-pink-300 via-rose-200 to-cyan-300 opacity-70 blur-xl transition duration-700 group-hover:opacity-100" />
                {isTikTok ? (
                  hasLoaded ? (
                    <div className="relative z-10 w-full overflow-hidden rounded-[18px]">
                      <blockquote
                        className="tiktok-embed"
                        cite={vimeoUrl}
                        data-video-id={tiktokVideoId}
                        style={{ maxWidth: "605px", minWidth: "325px", margin: "0 auto" }}
                      >
                        <section></section>
                      </blockquote>
                    </div>
                  ) : (
                    <div className="relative w-full aspect-video rounded-[18px] bg-gradient-to-br from-pink-50 to-cyan-50 flex items-center justify-center text-slate-400">Loading TikTok...</div>
                  )
                ) : (
                  <iframe
                    src={isInView ? getVimeoAutoplayUrl(vimeoUrl) : vimeoUrl}
                    className="relative w-full aspect-video rounded-[18px] shadow-2xl"
                    frameBorder="0"
                    allowFullScreen
                  />
                )}
              </div>
            )}
          </div>

          {/* Media Column (Image or Video if no image) */}
          {(imageUrl || (!imageUrl && vimeoUrl)) && (
            <div className={`${isAlternate ? 'md:order-1' : 'md:order-2'} ${id === 'decision' ? 'md:mt-12' : ''}`}>
              <div className={`story-media-frame group mb-10 md:mb-0 ${id === 'afternoon_post' ? 'mt-12 md:mt-0' : ''}`}>
                <div className="absolute -inset-3 rounded-[30px] bg-gradient-to-r from-pink-300 via-rose-200 to-cyan-300 opacity-70 blur-xl transition duration-700 group-hover:opacity-100 sm:rounded-[34px]" />
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={title || 'Story image'}
                    className="mt-6 relative h-[22rem] w-full rounded-[24px] object-cover shadow-2xl transition-transform duration-500 sm:h-96 sm:rounded-[28px] md:h-[520px] group-hover:scale-105"
                  />
                ) : isTikTok ? (
                  hasLoaded ? (
                    <div className="relative mt-6 z-10 flex justify-center w-full overflow-hidden rounded-[24px]">
                      <blockquote
                        className="tiktok-embed"
                        cite={vimeoUrl}
                        data-video-id={tiktokVideoId}
                        style={{ maxWidth: "605px", minWidth: "325px", margin: "0 auto" }}
                      >
                        <section></section>
                      </blockquote>
                    </div>
                  ) : (
                     <div className="mt-6 relative h-[22rem] w-full rounded-[24px] bg-gradient-to-br from-pink-50 to-cyan-50 flex items-center justify-center text-slate-400 sm:h-96 md:h-[520px]">Loading TikTok...</div>
                  )
                ) : (
                  <iframe
                    src={isInView ? getVimeoAutoplayUrl(vimeoUrl) : vimeoUrl}
                    className="mt-6 relative h-[22rem] w-full rounded-[24px] shadow-2xl transition-transform duration-500 sm:h-96 sm:rounded-[28px] md:h-[520px] group-hover:scale-105"
                    frameBorder="0"
                    allowFullScreen
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Elegant Tropical Wave Separator with Canadian Touch */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center pb-6 opacity-30 text-pink-400 pointer-events-none">
        <svg width="140" height="28" viewBox="0 0 140 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 14C35 14 35 0 70 0C105 0 105 14 140 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M0 28C35 28 35 14 70 14C105 14 105 28 140 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
          <circle cx="20" cy="8" r="2" fill="currentColor" opacity="0.4"/>
          <circle cx="120" cy="6" r="1.5" fill="currentColor" opacity="0.5"/>
        </svg>
      </div>
    </section>
  );
};

export default StorySection;
