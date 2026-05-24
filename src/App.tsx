import React, { useState, useEffect, useRef } from 'react';
import { navigate } from './router';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Document, Page, pdfjs } from 'react-pdf';

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import {
  Play,
  FileText,
  ShieldCheck,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Info,
  ArrowRight,
  Mail,
  Phone,
  Globe,
  Check,
  X
} from 'lucide-react';

// --- Components ---

const VideoModal = ({ isOpen, onClose, videoId }: { isOpen: boolean; onClose: () => void; videoId: string }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="YouTube video player"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Header = () => (
  <header className="fixed top-0 left-0 w-full z-50 py-2 md:py-3 bg-brand-blue shadow-xl border-b border-brand-gold/20">
    <div className="max-w-[1536px] mx-auto px-6 sm:px-12 lg:px-20 xl:px-24 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 md:gap-8">
          <a href="/" className="block">
            <img 
              src="/Hill Road Pictures Wordmark white transparent.png" 
              alt="Hill Road Pictures" 
              className="h-10 md:h-[58px] w-auto opacity-90 hover:opacity-100 transition-opacity"
              referrerPolicy="no-referrer"
            />
          </a>
          <nav className="hidden lg:flex items-center gap-6">
            <a href="#landscape" className="text-white/80 hover:text-brand-gold text-xs font-bold uppercase tracking-widest transition-colors">The Market</a>
            <a href="#story" className="text-white/80 hover:text-brand-gold text-xs font-bold uppercase tracking-widest transition-colors">The Story</a>
            <a href="#offering" className="text-white/80 hover:text-brand-gold text-xs font-bold uppercase tracking-widest transition-colors">The Offering</a>
            <a href="#deck" className="text-white/80 hover:text-brand-gold text-xs font-bold uppercase tracking-widest transition-colors">The Deck</a>
            <a href="#team" className="text-white/80 hover:text-brand-gold text-xs font-bold uppercase tracking-widest transition-colors">The Team</a>
            <a href="#faq" className="text-white/80 hover:text-brand-gold text-xs font-bold uppercase tracking-widest transition-colors">FAQ</a>
          </nav>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <a href="/" className="block">
            <img 
              src="/SITCO Primary Wordmark single line white transparent v2.png" 
              alt="SITCO" 
              className="h-5 md:h-10 w-auto hover:opacity-80 transition-opacity"
              referrerPolicy="no-referrer"
            />
          </a>
          <span className="text-brand-gold text-[7px] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] mt-0.5 md:mt-1">An R-Rated Comedy</span>
        </div>
      </div>
      {/* Mobile Nav */}
      <nav className="flex lg:hidden items-center gap-4 overflow-x-auto no-scrollbar py-1 border-t border-white/10">
        <a href="#landscape" className="text-white/70 hover:text-brand-gold text-[10px] font-bold uppercase tracking-widest transition-colors whitespace-nowrap">The Market</a>
        <a href="#story" className="text-white/70 hover:text-brand-gold text-[10px] font-bold uppercase tracking-widest transition-colors whitespace-nowrap">The Story</a>
        <a href="#offering" className="text-white/70 hover:text-brand-gold text-[10px] font-bold uppercase tracking-widest transition-colors whitespace-nowrap">The Offering</a>
        <a href="#deck" className="text-white/70 hover:text-brand-gold text-[10px] font-bold uppercase tracking-widest transition-colors whitespace-nowrap">The Deck</a>
        <a href="#team" className="text-white/70 hover:text-brand-gold text-[10px] font-bold uppercase tracking-widest transition-colors whitespace-nowrap">The Team</a>
        <a href="#faq" className="text-white/70 hover:text-brand-gold text-[10px] font-bold uppercase tracking-widest transition-colors whitespace-nowrap">FAQ</a>
      </nav>
    </div>
  </header>
);

const Hero = ({ onWatchVideo }: { onWatchVideo: (id: string) => void }) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center pt-28 md:pt-28 pb-12 overflow-hidden">
      <div className="max-w-[1536px] mx-auto px-6 sm:px-12 lg:px-20 xl:px-24 w-full relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-8 xl:gap-16 items-center mb-16">
          
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left lg:col-span-12 xl:col-span-5"
          >
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-brand-red text-white text-xs md:text-sm font-black px-4 py-1.5 uppercase tracking-widest leading-none shadow-sm rounded">Reg D Accredited Investor Offering</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-sans font-black text-brand-red uppercase tracking-tight mb-4 leading-[1.1]">
              INVEST IN <span className="text-brand-blue">"SO, <span className="italic tracking-wide">I'M</span> THE CRAZY ONE?"</span>
            </h1>
            <div className="text-left text-base md:text-lg text-gray-700 leading-relaxed mb-6 max-w-2xl space-y-4 font-sans">
              <p className="font-sans text-base md:text-lg text-gray-800 leading-relaxed font-normal">
                Get your front-row seat to the new era of <strong className="font-extrabold text-brand-blue">creator-led cinema</strong>. Join us in producing the funniest R-rated comedy of the decade — with an ensemble cast of internet stars and mainstream actors commanding <strong className="font-extrabold text-brand-blue">200M+ followers</strong>, locking in a passionate fanbase before the camera rolls.
              </p>
              <p className="font-serif italic text-gray-600 text-sm md:text-base">
                Early investors are eligible for downside protection via a first lien on GA tax credits, plus uncapped upside through our pioneering ownership model.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 md:mb-12">
              <a 
                href="/invest" 
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/invest');
                }}
                className="w-full sm:w-auto bg-brand-red text-white px-6 md:px-8 py-3 md:py-4 text-lg md:text-xl font-display uppercase tracking-wider hover:bg-red-700 transition-colors flex items-center justify-center gap-2 group shadow-lg"
              >
                Invest Now
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
              </a>
              <button 
                onClick={() => onWatchVideo('0rtorNlIbyk')}
                className="w-full sm:w-auto bg-white text-brand-blue border-2 border-brand-blue px-6 md:px-8 py-3 md:py-4 text-lg md:text-xl font-display uppercase tracking-wider hover:bg-brand-blue hover:text-white transition-all flex items-center justify-center gap-2 group shadow-lg"
              >
                Watch Trailer
                <Play className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Right: Filmmakers Video */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:col-span-7 mt-2 md:mt-4 lg:mt-16"
            id="filmmakers"
          >
            {/* Scribble Label */}
            <div className="absolute -top-10 md:-top-13 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0 z-20 pointer-events-none rotate-[-2deg]">
              <span className="scribble text-brand-blue text-xl md:text-3xl whitespace-nowrap">Meet the filmmakers</span>
              <svg className="w-6 h-8 md:w-8 md:h-10 text-brand-red -mt-0.5" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4 Q 26 18, 18 36" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <path d="M12 28 L 18 36 L 24 28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div className="relative rounded-lg overflow-hidden border-8 border-white shadow-2xl rotate-1 bg-black aspect-video max-w-lg lg:max-w-xl mx-auto">
              <iframe
                src="https://www.youtube.com/embed/OcWFe1GnEP8"
                title="Meet the filmmakers"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Styled Pitch Callout under the video */}
            <div className="mt-4 md:mt-6 mb-6 md:mb-12 relative bg-amber-50/70 border-l-4 border-brand-red p-5 rounded-r-xl shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-sans font-black text-brand-red uppercase tracking-wider text-xs">THE PITCH</span>
                <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></span>
              </div>
              <p className="font-sans text-xs sm:text-sm text-gray-800 leading-relaxed italic font-normal">
                After Dutch and his buddies get caught cheating, he breaks into a couples therapist&apos;s office and poses as a counselor to try and save their skins. He accidentally builds the hottest practice in town &mdash; until their girlfriends find out.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom: Scattered Thumbnails */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12"
        >
          {/* Trailer Thumbnail */}
          <button 
            onClick={() => onWatchVideo('0rtorNlIbyk')}
            className="relative group block z-10 hover:z-50 md:rotate-3 text-left w-full"
          >
            <div className="absolute -top-10 md:-top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0 z-20 pointer-events-none rotate-[-2deg]">
              <span className="scribble text-brand-blue text-xl md:text-3xl whitespace-nowrap">Watch the AI-powered trailer</span>
              <svg className="w-6 h-8 md:w-8 md:h-10 text-brand-red -mt-0.5" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4 Q 26 18, 18 36" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <path d="M12 28 L 18 36 L 24 28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="bg-white p-2 pb-8 shadow-lg rounded-sm border border-gray-200 transform transition-transform group-hover:scale-105 group-hover:shadow-2xl relative">
              <div className="relative aspect-video bg-black overflow-hidden rounded-sm">
                 <img src="/poster-horizontal.png" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" alt="Trailer" />
                 <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
                   <Play className="w-12 h-12 text-white drop-shadow-lg transform group-hover:scale-110 transition-transform" />
                 </div>
              </div>
            </div>
          </button>

          {/* Founder Thumbnail */}
          <button 
            onClick={() => onWatchVideo('v2HNpdwWyls')}
            className="relative group block z-20 hover:z-50 md:-rotate-2 mt-8 md:mt-0 text-left w-full"
          >
            <div className="absolute -top-10 md:-top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0 z-20 pointer-events-none rotate-[1deg]">
              <span className="scribble text-brand-blue text-xl md:text-3xl whitespace-nowrap">Hear it from the writer!</span>
              <svg className="w-6 h-8 md:w-8 md:h-10 text-brand-red -mt-0.5" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4 Q 26 18, 18 36" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <path d="M12 28 L 18 36 L 24 28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="bg-white p-2 pb-8 shadow-lg rounded-sm border border-gray-200 transform transition-transform group-hover:scale-105 group-hover:shadow-2xl relative">
              <div className="relative aspect-video bg-black overflow-hidden rounded-sm">
                 <img src="/Frank The Writer Video Thumbnail.png" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" alt="Founder" />
                 <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
                   <Play className="w-12 h-12 text-white drop-shadow-lg transform group-hover:scale-110 transition-transform" />
                 </div>
              </div>
            </div>
          </button>

          {/* Deck Thumbnail */}
          <a href="#deck" className="relative group block z-30 hover:z-50 md:rotate-2 mt-8 md:mt-0">
            <div className="absolute -top-10 md:-top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0 z-20 pointer-events-none rotate-[-1deg]">
              <span className="scribble text-brand-blue text-xl md:text-3xl whitespace-nowrap">Check out the loaded investor deck</span>
              <svg className="w-6 h-8 md:w-8 md:h-10 text-brand-red -mt-0.5" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4 Q 26 18, 18 36" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <path d="M12 28 L 18 36 L 24 28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="bg-white p-2 pb-8 shadow-lg rounded-sm border border-gray-200 transform transition-transform group-hover:scale-105 group-hover:shadow-2xl relative">
              <div className="relative aspect-video bg-black overflow-hidden rounded-sm">
                 <img src="/3 30 26 SITCO Investor Deck.svg" className="w-full h-full object-cover object-top opacity-70 group-hover:opacity-100 transition-opacity" alt="Investor Deck" />
                 <FileText className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-white drop-shadow-lg" />
              </div>
            </div>
          </a>
        </motion.div>

      </div>
    </div>
  );
};

const TheHook = () => (
  <section className="py-16 md:py-24 bg-brand-blue text-white relative z-20">
    <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 xl:px-24">
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-6xl font-display text-brand-gold mb-6">BRINGING BACK THE R-RATED COMEDY</h2>
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-12">
          The major studios have shifted focus away from the mid-budget, R-rated comedies that defined a generation. We are stepping into this underserved market to deliver the unapologetic, high-energy entertainment that audiences are actively seeking.
        </p>
        <p className="text-xl md:text-2xl font-bold text-white leading-relaxed mb-12">
          Theatrical Power. Digital Dominance.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
        <div>
          <div className="text-4xl md:text-5xl font-display text-brand-gold mb-2">$245M</div>
          <p className="text-sm md:text-base text-gray-400 uppercase tracking-widest font-bold">Combined Box Office from our core creative team</p>
        </div>
        <div>
          <div className="text-4xl md:text-5xl font-display text-brand-gold mb-2">$565k</div>
          <p className="text-sm md:text-base text-gray-400 uppercase tracking-widest font-bold">Raised in 2 weeks</p>
        </div>
        <div>
          <div className="text-4xl md:text-5xl font-display text-brand-gold mb-2">200M</div>
          <p className="text-sm md:text-base text-gray-400 uppercase tracking-widest font-bold">Social media following of our cast</p>
        </div>
      </div>
    </div>
  </section>
);

const MarketLandscape = () => (
  <section id="landscape" className="py-16 md:py-24 bg-white relative z-20 border-b border-border">
    <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 xl:px-24">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-4xl md:text-7xl font-display text-brand-red mb-4 uppercase">THE MARKET LANDSCAPE</h2>
        <p className="text-base md:text-xl text-text-muted font-medium uppercase tracking-widest">The Golden Age is Ripe for a Comeback</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div className="space-y-8">
          <div>
            <h3 className="text-2xl md:text-3xl font-display text-brand-blue mb-4">The Audience Gap</h3>
            <p className="text-base md:text-lg text-text-muted leading-relaxed">
              Studio output in the R-rated comedy genre collapsed by over 60% since the "golden age" of comedy ended ~2015. But audiences didn't stop wanting these films; the traditional studio model just stopped working for mid-budget comedies.
            </p>
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-display text-brand-blue mb-4">Lean Budgets Outperform</h3>
            <p className="text-base md:text-lg text-text-muted leading-relaxed">
              Films with built-in audience hooks, budgets under $25M, and ensemble casts of recognizable talent routinely generate the highest ROI multiples in the genre.
            </p>
          </div>
        </div>
        
        <div className="flex justify-center">
          <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 text-center shadow-sm max-w-xs w-full">
            <div className="text-5xl md:text-6xl font-display text-brand-red mb-2">4-8x</div>
            <div className="text-sm font-bold uppercase tracking-widest text-text-muted">Typical ROI Multiple</div>
            <div className="text-xs text-gray-400 mt-1">(Lean-Budget Comedy Comps)</div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h3 className="text-2xl md:text-3xl font-display text-brand-blue mb-8 text-center uppercase tracking-tight">Total Gross Revenue of Box Office Hits in This Category</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { title: "The Hangover", gross: "$469M", year: "2009" },
            { title: "Beverly Hills Cop", gross: "$316M", year: "1984" },
            { title: "Neighbors", gross: "$271M", year: "2014" },
            { title: "American Pie", gross: "$235M", year: "1999" },
            { title: "Bad Moms", gross: "$184M", year: "2016" },
            { title: "Superbad", gross: "$170M", year: "2007" },
            { title: "Animal House", gross: "$141M", year: "1978" },
            { title: "Girls Trip", gross: "$140M", year: "2017" },
          ].map((comp, i) => (
            <div key={i} className="bg-white p-6 shadow-md rounded-lg border border-border text-center flex flex-col justify-center transform transition-transform hover:-translate-y-1">
              <div className="text-[10px] font-bold uppercase tracking-widest text-black mb-2">{comp.title} ({comp.year})</div>
              <div className="text-3xl font-display text-brand-red leading-none">{comp.gross}</div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center text-[10px] text-gray-400 uppercase tracking-widest">
          Source: Box Office Mojo, SITCO R-Rated Comedy Analysis (March 2026). Includes Domestic, Foreign, and Home Video.
        </div>
      </div>
    </div>
  </section>
);

const TheStory = ({ onWatchTrailer, onWatchFrank }: { onWatchTrailer: () => void; onWatchFrank: () => void }) => (
  <section id="story" className="py-24 bg-brand-blue text-white relative z-20 border-b border-brand-gold/20">
    <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 xl:px-24">
      <div className="flex justify-center mb-6" id="story-logo-container">
        <img 
          src="/sitco-lawn-chair.jpg" 
          alt="SITCO Lawn Chair" 
          className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 border-brand-gold p-1 bg-brand-blue/40 shadow-2xl object-cover hover:scale-105 transition-transform duration-300"
          id="story-logo"
        />
      </div>
      <h2 className="text-6xl md:text-8xl font-display text-brand-gold mb-8 text-center">THE STORY</h2>
      <p className="text-center text-xl md:text-2xl font-display text-white mb-8 uppercase tracking-widest">A <span className="italic">crazy</span> funny script that will <span className="text-brand-red">offend everyone</span></p>
      
      <div className="max-w-4xl mx-auto text-center mb-16">
        <p className="text-base md:text-lg text-gray-200 leading-relaxed font-sans">
          <strong className="text-brand-gold font-black tracking-wider uppercase">Meet Dutch Swithin:</strong> He does more than just tell women they're crazy when their boyfriend is obviously fooling around. He's here to speak his mind and say every taboo about you he can think of — no matter your race, color, or creed. But as his unfiltered insult-spewing inadvertently turns into decent advice, he's forced to prescribe himself a strong dose of self-reflection to make things right with his ex-wife before she moves across the world.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Frank Video */}
        <div className="space-y-6">
          <button 
            onClick={onWatchFrank}
            className="w-full relative aspect-video bg-black rounded-lg border-8 border-white shadow-2xl overflow-hidden group"
          >
            <img src="/Frank The Writer Video Thumbnail.png" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" alt="Frank" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 bg-brand-red rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                <Play className="w-10 h-10 text-white fill-white" />
              </div>
              <span className="text-white font-display text-2xl uppercase tracking-widest drop-shadow-lg text-center px-4">Hear it from the writer</span>
            </div>
          </button>
          <p className="text-center font-sans text-white/70 text-xs md:text-sm tracking-wide">
            Frank helps us <span className="italic">find</span> <span className="text-brand-gold font-black uppercase tracking-widest ml-2">THE PLOT</span>
          </p>
        </div>

        {/* Trailer Video */}
        <div className="space-y-6">
          <button 
            onClick={onWatchTrailer}
            className="w-full relative aspect-video bg-black rounded-lg border-8 border-white shadow-2xl overflow-hidden group"
          >
            <img src="/poster-horizontal.png" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" alt="Trailer" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 bg-brand-red rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                <Play className="w-10 h-10 text-white fill-white" />
              </div>
              <span className="text-white font-display text-2xl uppercase tracking-widest drop-shadow-lg">Watch Trailer</span>
            </div>
          </button>
          <p className="text-center font-sans text-white/70 text-xs md:text-sm tracking-wide">
            You'll <span className="italic">lose your mind</span> over <span className="text-brand-gold font-black uppercase tracking-widest ml-2">THE CONCEPT TRAILER</span>
          </p>
        </div>
      </div>
    </div>
  </section>
);

const TheOffering = () => (
  <section id="offering" className="tailored-section">
    <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 xl:px-24 font-sans">
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-7xl font-display text-brand-blue mb-4">THE OFFERING</h2>
        <p className="text-xl text-text-muted font-medium uppercase tracking-widest">Clarifying Agreement for Sharing the Haul (CASH)</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
        <div>
          <h3 className="text-3xl font-display text-brand-red mb-6 uppercase tracking-tight">The CASH Instrument</h3>
          <p className="text-lg text-text-muted mb-8 leading-relaxed">
            Inspired by Silicon Valley's "SAFE" agreements, our CASH instrument is a pioneering security designed specifically for film. It prioritizes investor protection while maximizing participation in the film's global success.
          </p>
          <div className="grid gap-4">
            <div className="bg-white p-6 rounded-xl border border-brand-blue/10 shadow-sm flex gap-4">
              <div className="bg-brand-red/10 p-3 rounded-lg h-fit">
                <ShieldCheck className="w-6 h-6 text-brand-red" />
              </div>
              <div>
                <h4 className="font-black text-brand-blue uppercase tracking-widest text-sm mb-1">Downside Protection</h4>
                <p className="text-sm text-text-muted">Early investors hold a first lien on expected Georgia Tax Credits (up to 30% of the production budget, based on availability).</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-brand-blue/10 shadow-sm flex gap-4">
              <div className="bg-brand-red/10 p-3 rounded-lg h-fit">
                <TrendingUp className="w-6 h-6 text-brand-red" />
              </div>
              <div>
                <h4 className="font-black text-brand-blue uppercase tracking-widest text-sm mb-1">Preferred Returns</h4>
                <p className="text-sm text-text-muted">Early investors receive a 20% preferred return and a 10% discount upon conversion into Membership Units.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Infographic Visual */}
        <div className="bg-brand-blue rounded-2xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden border border-brand-gold/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <h3 className="text-2xl font-display text-brand-gold mb-8 text-center uppercase tracking-widest">Ownership Democratized</h3>
          <div className="flex flex-col gap-6 relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full border-4 border-brand-gold flex items-center justify-center text-2xl font-black text-brand-gold shrink-0 bg-brand-gold/5">33%</div>
              <div>
                <h4 className="font-display text-brand-gold uppercase tracking-wider">Investors</h4>
                <p className="text-xs text-white/60 uppercase tracking-widest">The Financial Partners</p>
              </div>
            </div>
            <div className="w-px h-8 bg-brand-gold/20 ml-10"></div>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full border-4 border-brand-gold flex items-center justify-center text-2xl font-black text-brand-gold shrink-0 bg-brand-gold/5">33%</div>
              <div>
                <h4 className="font-display text-brand-gold uppercase tracking-wider">Producers</h4>
                <p className="text-xs text-white/60 uppercase tracking-widest">The Creative Execution</p>
              </div>
            </div>
            <div className="w-px h-8 bg-brand-gold/20 ml-10"></div>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full border-4 border-brand-gold flex items-center justify-center text-2xl font-black text-brand-gold shrink-0 bg-brand-gold/5">33%</div>
              <div>
                <h4 className="font-display text-brand-gold uppercase tracking-wider">Cast</h4>
                <p className="text-xs text-white/60 uppercase tracking-widest">The Built-in Audience</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-24">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h3 className="text-4xl md:text-5xl font-display text-brand-blue mb-3">Investment Tiers</h3>
          <p className="text-sm md:text-base text-text-muted font-bold uppercase tracking-wider">
            $5,000 Membership Units with 10% Reg CF discount and tiered investor benefits. Member Unit economics apply to every tier.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* OPENING SCENE */}
          <div className="bg-brand-blue rounded-2xl border border-brand-gold/15 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-brand-gold/45 shadow-lg group relative">
            <div 
              className="bg-cover bg-center h-48 relative flex items-end p-5 bg-[#0B1F3B]"
              style={{ backgroundImage: "url('https://coopsimms.com/notes/samplecfcards/images/opening-scene.jpg')" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blue via-brand-blue/35 to-transparent z-0"></div>
              <div className="relative z-10 w-full mt-auto">
                <span className="block w-8 h-0.5 rounded bg-[#e7d8b4] mb-2"></span>
                <div className="font-display text-2xl lg:text-3xl uppercase tracking-wider text-white">Opening Scene</div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="font-sans text-2xl md:text-3xl font-black text-white">$5,000</span>
                  <span className="text-[10px] font-extrabold tracking-wider text-[#e7d8b4] uppercase bg-white/10 px-2 py-0.5 rounded border border-white/15">1 Unit</span>
                </div>
              </div>
            </div>
            <div className="p-5 flex-grow flex flex-col justify-between text-white font-sans">
              <div>
                <p className="font-sans uppercase tracking-[0.08em] text-sm font-black text-[#e7d8b4] mb-4">Entry-Level Participation</p>
                
                <ul className="space-y-4 text-sm text-white">
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#e7d8b4] shrink-0 mt-0.5" />
                    <span className="leading-snug text-white/90">
                      <strong className="font-bold">Investor updates</strong>: stay informed on production milestones, financial reporting, and key announcements throughout the film's journey
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="mt-4">
                  <a 
                    href="/invest" 
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/invest');
                    }}
                    className="w-full py-3.5 px-4 text-center text-sm font-sans uppercase tracking-wider bg-[#e7d8b4] hover:bg-[#ebdcb4] text-[#0B1F3B] hover:scale-[1.02] active:scale-[0.98] transition-all font-extrabold rounded-xl block shadow-md"
                  >
                    Reserve your spot
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* SPOTLIGHT */}
          <div className="bg-brand-blue rounded-2xl border border-brand-gold/15 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-brand-gold/45 shadow-lg group relative">
            <div 
              className="bg-cover bg-center h-48 relative flex items-end p-5 bg-[#0B1F3B]"
              style={{ backgroundImage: "url('https://coopsimms.com/notes/samplecfcards/images/spotlight.jpg')" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blue via-brand-blue/35 to-transparent z-0"></div>
              <div className="relative z-10 w-full mt-auto">
                <span className="block w-8 h-0.5 rounded bg-[#6f9fd8] mb-2"></span>
                <div className="font-display text-2xl lg:text-3xl uppercase tracking-wider text-white">Spotlight</div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="font-sans text-2xl md:text-3xl font-black text-white">$10,000+</span>
                  <span className="text-[10px] font-extrabold tracking-wider text-[#6f9fd8] uppercase bg-white/10 px-2 py-0.5 rounded border border-white/15">2+ Units</span>
                </div>
              </div>
            </div>
            <div className="p-5 flex-grow flex flex-col justify-between text-white font-sans">
              <div>
                <p className="font-sans uppercase tracking-[0.08em] text-sm font-black text-[#6f9fd8] mb-4">Core Participation &amp; Screening Access</p>
                
                <div className="flex items-center gap-2.5 font-normal text-white bg-white/10 px-3 py-2 rounded-xl border border-white/10 text-sm italic mb-4">
                  <span>Everything in Opening Scene, plus:</span>
                </div>
 
                <ul className="space-y-4 text-sm text-white font-sans">
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#6f9fd8] shrink-0 mt-0.5" />
                    <span className="leading-snug text-white/90">
                      <strong className="font-bold">Private screening for you and a guest</strong>: an exclusive pre-release viewing experience before the general public
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="mt-4">
                  <a 
                    href="/invest" 
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/invest');
                    }}
                    className="w-full py-3.5 px-4 text-center text-sm font-sans uppercase tracking-wider bg-[#6f9fd8] hover:bg-[#7fafe8] text-[#0B1F3B] hover:scale-[1.02] active:scale-[0.98] transition-all font-extrabold rounded-xl block shadow-md"
                  >
                    Reserve your spot
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* MARQUEE */}
          <div className="bg-brand-blue rounded-2xl border border-brand-gold/15 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-brand-gold/45 shadow-lg group relative">
            <div 
              className="bg-cover bg-center h-48 relative flex items-end p-5 bg-[#0B1F3B]"
              style={{ backgroundImage: "url('https://coopsimms.com/notes/samplecfcards/images/marquee.jpg')" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blue via-brand-blue/35 to-transparent z-0"></div>
              <div className="relative z-10 w-full mt-auto">
                <span className="block w-8 h-0.5 rounded bg-brand-red mb-2"></span>
                <div className="font-display text-2xl lg:text-3xl uppercase tracking-wider text-white">Marquee</div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="font-sans text-2xl md:text-3xl font-black text-white">$30,000+</span>
                  <span className="text-[10px] font-extrabold tracking-wider text-brand-red uppercase bg-white/10 px-2 py-0.5 rounded border border-white/15">6+ Units</span>
                </div>
              </div>
            </div>
            <div className="p-5 flex-grow flex flex-col justify-between text-white font-sans">
              <div>
                <p className="font-sans uppercase tracking-[0.08em] text-sm font-black text-brand-red mb-4">Premium Access</p>
                
                <div className="flex items-center gap-2.5 font-normal text-white bg-white/10 px-3 py-2 rounded-xl border border-white/10 text-sm italic mb-4">
                  <span>Everything in Spotlight, plus:</span>
                </div>
 
                <ul className="space-y-4 text-sm text-white font-sans">
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <span className="leading-snug text-white/90">
                      <strong className="font-bold">Memorabilia bundle</strong>: signed poster, commemorative item, and a copy of the original script
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <span className="leading-snug text-white/90">
                      <strong className="font-bold">Marquee bundle</strong>: premiere invitation, ticket access, and a special thanks acknowledgment
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="bg-brand-red/10 border-l-4 border-brand-red p-3.5 rounded-r-xl my-4 text-left">
                  <div className="font-sans text-base tracking-wider text-brand-red uppercase font-extrabold leading-snug">Associate Producer Credit</div>
                  <div className="text-[10px] text-white/65 mt-0.5">Reg D 506(c) Investor Recognition</div>
                </div>
                <div className="mt-4">
                  <a 
                    href="/invest" 
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/invest');
                    }}
                    className="w-full py-3.5 px-4 text-center text-sm font-sans uppercase tracking-wider bg-brand-red hover:bg-red-700 text-white hover:scale-[1.02] active:scale-[0.98] transition-all font-extrabold rounded-xl block shadow-lg"
                  >
                    Become a Producer
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* PREMIERE */}
          <div className="bg-brand-blue rounded-2xl border border-brand-gold/15 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-brand-gold/45 shadow-lg group relative">
            <div 
              className="bg-cover bg-center h-48 relative flex items-end p-5 bg-[#0B1F3B]"
              style={{ backgroundImage: "url('https://coopsimms.com/notes/samplecfcards/images/premiere.jpg')" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blue via-brand-blue/35 to-transparent z-0"></div>
              <div className="relative z-10 w-full mt-auto">
                <span className="block w-8 h-0.5 rounded bg-brand-gold mb-2"></span>
                <div className="font-display text-2xl lg:text-3xl uppercase tracking-wider text-white">Premiere</div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="font-sans text-2xl md:text-3xl font-black text-white">$100,000+</span>
                  <span className="text-[10px] font-extrabold tracking-wider text-brand-gold uppercase bg-white/10 px-2 py-0.5 rounded border border-white/15">20+ Units</span>
                </div>
              </div>
            </div>
            <div className="p-5 flex-grow flex flex-col justify-between text-white font-sans">
              <div>
                <p className="font-sans uppercase tracking-[0.08em] text-sm font-black text-brand-gold mb-4">Highest Recognition &amp; Access</p>
                
                <div className="flex items-center gap-2.5 font-normal text-white bg-white/10 px-3 py-2 rounded-xl border border-white/10 text-sm italic mb-4">
                  <span>Everything in Marquee, plus:</span>
                </div>
 
                <ul className="space-y-4 text-sm text-white font-sans">
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                    <span className="leading-snug text-white/90">
                      <strong className="font-bold">Premiere on-set bundle</strong>: an exclusive set visit, private producer event, and invitation to the festival or launch premiere
                    </span>
                  </li>
                  <li className="flex items-start gap-3 font-sans">
                    <Check className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                    <span className="leading-snug text-white/90">
                      <strong className="font-bold">A speaking role in the film</strong>: for you, a friend, a family member, or anyone you choose
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="bg-brand-gold/10 border-l-4 border-brand-gold p-3.5 rounded-r-xl my-4 text-left">
                  <div className="font-sans text-base tracking-wider text-brand-gold uppercase font-extrabold leading-snug">Executive Producer Credit</div>
                  <div className="text-[10px] text-white/65 mt-0.5">Reg D 506(c) Investor Recognition</div>
                </div>
                <div className="mt-4">
                  <a 
                    href="/invest" 
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/invest');
                    }}
                    className="w-full py-3.5 px-4 text-center text-sm font-sans uppercase tracking-wider bg-brand-gold hover:bg-brand-gold/80 text-black hover:scale-[1.02] active:scale-[0.98] transition-all font-extrabold rounded-xl block shadow-md"
                  >
                    Become a Producer
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Member Unit Economics info box */}
        <div className="mt-12 p-6 rounded-2xl border border-[#C8A24A]/20 bg-[#0B1F3B] hover:border-[#C8A24A]/30 transition-all text-sm leading-relaxed max-w-4xl mx-auto shadow-md">
          <p className="text-white/90">
            <strong className="text-brand-gold font-bold mr-1.5 tracking-wider uppercase text-xs">Member Unit Economics — Included for Every Tier:</strong>
            Repayment of invested capital; 20% preferred return; 10% discounted Membership Units in the next qualified Reg CF offering; priority access to designated incentive proceeds subject to availability and prior allocations; upside participation; pro rata rights; priority / first-priority allocation rights if limited; MFN economic terms protection.
          </p>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] md:text-xs text-text-muted italic max-w-4xl mx-auto leading-relaxed">
            * Investor Benefit bundles are courtesy benefits only and are subject to the offering documents, investment tier, availability, scheduling, production realities, legal requirements, and production approval where applicable.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const TheDeck = () => {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [containerWidth, setContainerWidth] = useState<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setContainerWidth(entries[0].contentRect.width);
      }
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  const next = () => setPageNumber(p => Math.min(numPages || 1, p + 1));
  const prev = () => setPageNumber(p => Math.max(1, p - 1));

  return (
    <section id="deck" className="py-24 bg-brand-blue text-white border-t border-brand-gold/20">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 xl:px-24">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-7xl font-display text-brand-gold mb-4">INVESTOR DECK</h2>
        </div>
        
        <div className="relative p-2 md:p-4 max-w-4xl mx-auto">
          
          <div className="w-full bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden flex flex-col">
            {/* PDF Viewer */}
            <div ref={containerRef} className="w-full bg-gray-100 p-2 md:p-8 min-h-[250px] md:min-h-[400px] relative group flex justify-center items-center">
              <div className="relative shadow-2xl">
                <Document
                  file="/4 10 26 Movie Investor Deck - Shareable.pdf"
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={
                    <div className="flex flex-col items-center justify-center h-64 w-full min-w-[280px] md:min-w-[600px] bg-gray-50 rounded-lg">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mb-4"></div>
                      <p className="text-gray-400 font-display text-xs uppercase tracking-widest">Loading Deck...</p>
                    </div>
                  }
                  error={<div className="text-brand-red py-20 font-display tracking-widest uppercase text-center bg-gray-50 w-full rounded-lg">Failed to load PDF.</div>}
                >
                  <Page 
                    pageNumber={pageNumber} 
                    width={containerWidth ? Math.min(containerWidth - (window.innerWidth < 768 ? 16 : 64), 1000) : undefined}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="max-w-full h-auto"
                  />
                </Document>

                {/* Desktop Overlay Arrows - Hidden on mobile */}
                <button 
                  onClick={prev} 
                  disabled={pageNumber <= 1} 
                  className="hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 z-10 p-3 bg-white hover:bg-brand-gold hover:text-white border border-gray-200 rounded-full shadow-xl disabled:opacity-0 transition-all text-brand-blue hover:scale-110 active:scale-95"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>

                <button 
                  onClick={next} 
                  disabled={pageNumber >= (numPages || 1)} 
                  className="hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 z-10 p-3 bg-white hover:bg-brand-gold hover:text-white border border-gray-200 rounded-full shadow-xl disabled:opacity-0 transition-all text-brand-blue hover:scale-110 active:scale-95"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </div>
            </div>

            {/* Mobile & Desktop Control Bar */}
            <div className="bg-white border-t border-gray-200 px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button 
                  onClick={prev} 
                  disabled={pageNumber <= 1}
                  className="md:hidden p-2 bg-gray-100 rounded-lg text-brand-blue disabled:opacity-30"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="bg-brand-blue/5 text-brand-blue px-4 py-1.5 rounded-full text-sm font-mono font-bold border border-brand-blue/10">
                  PAGE {pageNumber} <span className="opacity-30 mx-1">/</span> {numPages || '--'}
                </div>
                <button 
                  onClick={next} 
                  disabled={pageNumber >= (numPages || 1)}
                  className="md:hidden p-2 bg-gray-100 rounded-lg text-brand-blue disabled:opacity-30"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <a 
                  href="/4 10 26 Movie Investor Deck - Shareable.pdf" 
                  download
                  className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-red-700 transition-colors shadow-sm"
                >
                  <FileText className="w-4 h-4" />
                  Download PDF
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const TheTeam = () => {
  const [selectedMember, setSelectedMember] = useState<number | null>(null);

  const team = [
    {
      name: "Frank Peluso",
      title: "Writer / Director",
      image: "/Frank Peluso Jr IMDb.png",
      bio: (
        <span>
          Frank is a filmmaker who has written and directed over 160 commercials and a dozen documentaries. Coming out of the ICM agent trainee program, Frank trained in Hollywood for 20 years under writer/directors David Ayer (Training Day) and Nick Cassavetes (The Other Woman). Frank and Nick made several films together including The Notebook, My Sister's Keeper, God Is a Bullet, and Alpha Dog, which Frank produced. Cassavetes then produced Frank's feature film debut as director (Red Handed, starring Michael Madsen) in 2019. Recently, Frank wrote and produced the feature documentary Sandy Powell: Dressing the Part, featuring Academy Award winners Julianne Moore and Cate Blanchett. The film won best documentary at the Burbank Film Festival in September 2025. Frank studied film directing at UCLA. He received a BA in English from Pepperdine University. He lives in Savannah, Georgia, with his wife and three children.
        </span>
      )
    },
    {
      name: "Bob Vanech",
      title: "Producer",
      image: "/Screenshot 2026-04-02 at 12.09.30 AM.png",
      bio: (
        <span>
          Bob Vanech is an entrepreneur and executive producer with extensive experience in equity crowdfunding, venture capital, and scaling digital media companies. He was the founding CFO and Chairman of Zealot Networks, where he led more than $100 million in fundraising and helped build one of the early multi-platform digital media aggregators. He later served as founding CFO and Head of Revenue at Trebel Music, driving capital formation, strategic partnerships, and revenue growth for the global music platform. Across his career, Bob has structured and executed complex financing strategies and growth initiatives, bringing disciplined financial leadership and deep media operating experience to &ldquo;So, <span className="italic tracking-wide">I&rsquo;m</span> the Crazy One?&rdquo; as it advances its equity crowdfunding campaign and broader market strategy.
        </span>
      )
    },
    {
      name: "Chad Seymour",
      title: "Chief Marketing Officer",
      image: "/Chad headshot (1).jpeg",
      bio: (
        <span>
          Chad Seymour brings more than two decades of brand, media, and audience-building experience to &ldquo;So, <span className="italic tracking-wide">I&rsquo;m</span> the Crazy One?&rdquo;, helping shape the film&rsquo;s positioning, partnerships, and crowdfund strategy. A seasoned marketing executive and agency founder, Chad has led integrated campaigns for global brands and high-growth ventures across entertainment, consumer goods, and digital media. He previously served as Chief Marketing Officer of Zealot Networks and co-founded Wide Open Spaces, advising companies and creators on how to define and own differentiated market space. Earlier in his career, he held leadership roles at Neighbor Agency, TBWA\\Chiat Day, Merkley + Partners, Procter & Gamble, and Diageo, working on brands such as Visa, BMW Motorcycles, and California Pizza Kitchen. His background in storytelling, emerging platforms, and growth strategy supports the film&rsquo;s mission to build an engaged community and convert that momentum into a successful crowdfund.
        </span>
      )
    },
    {
      name: "Kim LaFleur",
      title: "Head of Equity Crowdfunding",
      image: "/Kim.jpeg",
      bio: (
        <span>
          Kim LaFleur leads equity crowdfunding for &ldquo;So, <span className="italic tracking-wide">I&rsquo;m</span> the Crazy One?&rdquo;, bringing more than 20 years of experience across fintech, digital platforms, and capital formation. He previously co-founded and served as CTO of a FINRA-registered Regulation Crowdfunding platform, where she built the underlying technology, compliance infrastructure, and investor experience that enabled companies to raise capital from everyday investors under the JOBS Act. Throughout her career, she has focused on translating complex regulatory and technical frameworks into scalable, user-friendly systems that drive participation and trust. On the film, she oversees the structure, execution, and optimization of the equity crowdfunding campaign, aligning platform mechanics, investor communications, and growth strategy to maximize participation and long-term community ownership.
        </span>
      )
    }
  ];

  return (
    <section id="team" className="tailored-section border-b-0 py-12 md:py-16">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 xl:px-24">
        <h2 className="text-5xl md:text-7xl font-display text-brand-blue mb-12 text-center">THE TEAM</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <div key={i} className="flex flex-col items-center text-center group cursor-pointer" onClick={() => setSelectedMember(i)}>
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg overflow-hidden mb-6 border-4 border-white shadow-xl group-hover:border-brand-gold transition-colors duration-500 relative">
                 <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-brand-gold/0 group-hover:bg-brand-gold/20 transition-colors flex items-center justify-center">
                   <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8" />
                 </div>
              </div>
              <div className="text-xl md:text-2xl font-display text-brand-blue mb-1 uppercase tracking-wide leading-tight group-hover:text-brand-gold transition-colors">{member.name}</div>
              <div className="text-[10px] md:text-xs text-brand-red font-bold uppercase tracking-widest mb-4 group-hover:text-brand-gold transition-colors">{member.title}</div>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {selectedMember !== null && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedMember(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden relative"
                onClick={e => e.stopPropagation()}
              >
                <button 
                  onClick={() => setSelectedMember(null)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-brand-gold transition-colors z-10"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-64 md:h-auto">
                    <img 
                      src={team[selectedMember].image} 
                      alt={team[selectedMember].name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-8 md:p-10">
                    <div className="text-3xl font-display text-brand-blue mb-2 uppercase">{team[selectedMember].name}</div>
                    <div className="text-sm text-brand-red font-bold uppercase tracking-widest mb-4">{team[selectedMember].title}</div>
                    {team[selectedMember].name === "Frank Peluso" && (
                      <a 
                        href="https://www.imdb.com/name/nm1611501/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-brand-blue hover:text-brand-gold transition-colors mb-6 text-xs font-bold uppercase tracking-widest"
                      >
                        <Globe className="w-4 h-4" /> View IMDB Profile
                      </a>
                    )}
                    <div className="text-text-muted text-sm leading-relaxed max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                      {team[selectedMember].bio}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is the minimum investment?",
      answer: "For this offering, the minimum investment starts at $5,000 (Opening Scene tier). This secures your early position in our capital structure."
    },
    {
      question: "How does the Georgia tax credit work?",
      answer: "Georgia offers a 30% transferable tax credit for film production. Our CASH instrument provides investors a first lien on these expected credits (estimated at $1.5M), providing significant downside protection compared to traditional film investments. The benefit of the Georgia tax credit is subject to availability on a first-come, first-served basis."
    },
    {
      question: "When do we expect to shoot?",
      answer: "Pre-production is slated for Q3 2026, with principal photography scheduled to begin in September 2026 on location in Savannah, Georgia."
    },
    {
      question: "What makes the casting strategy unique?",
      answer: "We have 'inverted the pyramid' by casting 30+ content creators with a combined reach of 200M+ followers first. This strategy builds the audience and distribution demand before we even cast the lead roles, ensuring a built-in market before we roll camera."
    },
    {
      question: "How does the 33/33/33 ownership model work?",
      answer: "We have democratized ownership to align all partners: 1/3 of the film is owned by the investors, 1/3 by the producers/filmmakers, and 1/3 by cast. This ensures that the people promoting the movie have a real stake in its financial success."
    },
    {
      question: "What are the primary risks of film investing?",
      answer: "Like any early-stage venture, risks include execution (completing production) and monetization (audience reception). We mitigate these through a lean budget mirroring high-ROI genre comps, built-in creator audiences, and tax credit protection."
    },
    {
      question: "How will the crowdfunded Community Round happen and how can I help?",
      answer: (
        <>
          Following this private Accredited round, we will launch a $5M Regulation Crowdfunding (RegCF) 'Community Round' in June. This allows non-accredited fans and the general public to own a piece of the film. You can help by <a href="/invest" onClick={(e) => { e.preventDefault(); navigate('/invest'); }} className="text-brand-red font-bold hover:underline">joining our mailing list</a> and sharing the project with your community.
        </>
      )
    }
  ];

  return (
    <section id="faq" className="py-24 bg-background relative z-20">
      <div className="max-w-[1100px] mx-auto px-6 sm:px-12 lg:px-20 xl:px-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-display text-brand-blue mb-4">FAQ</h2>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors group"
              >
                <span className="text-lg md:text-xl font-bold text-brand-blue group-hover:text-brand-red transition-colors">{faq.question}</span>
                <div className={`transform transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`}>
                  <ChevronRight className="w-6 h-6 text-brand-red rotate-90" />
                </div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-text-muted leading-relaxed border-t border-gray-50 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-brand-blue text-white py-20 border-t border-brand-gold/30">
    <div className="max-w-[1536px] mx-auto px-6 sm:px-12 lg:px-20 xl:px-24">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
        <div className="md:col-span-4 space-y-10">
          <a href="/" className="block">
            <img 
              src="/Hill Road Pictures Wordmark white transparent.png" 
              alt="Hill Road Pictures" 
              className="h-[58px] w-auto opacity-80 hover:opacity-100 transition-opacity"
              referrerPolicy="no-referrer"
            />
          </a>
          <div className="flex flex-col items-start">
            <a href="/" className="block">
              <img 
                src="/SITCO Primary Wordmark single line white transparent v2.png" 
                alt="SITCO" 
                className="h-10 w-auto hover:opacity-80 transition-opacity"
                referrerPolicy="no-referrer"
              />
            </a>
            <span className="text-brand-gold text-[10px] font-bold uppercase tracking-[0.3em] mt-1">An R-Rated Comedy</span>
          </div>
        </div>
        
        <div className="md:col-span-3">
          <h4 className="text-xl font-display text-brand-gold mb-6 uppercase tracking-widest">Contact</h4>
          <div className="space-y-4">
            <a href="mailto:finance@hillroadpictures.com" className="flex items-center gap-3 text-gray-400 hover:text-brand-gold transition-colors text-sm">
              <Mail className="w-4 h-4" /> finance@hillroadpictures.com
            </a>
          </div>
        </div>

        <div className="md:col-span-5">
          <h4 className="text-xl font-display text-brand-gold mb-6 uppercase tracking-widest">Legal Disclosure</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            This offering is being made under Rule 506(c) of Regulation D. Only accredited investors as defined by the SEC are eligible to participate. Investing in independent film involves significant risk, including the potential loss of your entire investment. Past performance of the production team is not a guarantee of future results.
          </p>
        </div>
      </div>
      
      <div className="border-t border-white/10 pt-8 text-center text-[10px] text-gray-500 uppercase tracking-[0.2em]">
        &copy; 2026 Hill Road Pictures. All Rights Reserved. Private Placement.
      </div>
    </div>
  </footer>
);

const StickyFooter = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 w-full bg-white/98 backdrop-blur-xl border-t border-brand-gold/20 z-50 p-4 md:p-6 shadow-[0_-15px_50px_rgba(0,0,0,0.15)]"
        >
          <div className="max-w-[1536px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 md:gap-12 px-6 sm:px-12 lg:px-20 xl:px-24 w-full">
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between mb-3 gap-2">
                <div className="flex flex-row items-center gap-3 sm:gap-6">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-sm bg-brand-red shadow-sm"></div>
                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-brand-blue/70">Raised</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-sm bg-brand-blue shadow-sm"></div>
                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-brand-blue/70">Committed</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-0.5 sm:flex-row sm:items-baseline sm:gap-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400">Total</span>
                    <span className="text-lg sm:text-2xl font-display text-brand-gold leading-none"> $810,000</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400">Goal</span>
                    <span className="text-sm sm:text-xl font-display text-gray-400 leading-none">$2,000,000</span>
                  </div>
                </div>
              </div>
              <div className="progress-bar-bg flex w-full relative">
                <div className="progress-bar-fill" style={{ width: '39.25%' }}>
                  <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                </div>
                <div className="progress-bar-committed" style={{ width: '1.25%' }}></div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 w-full sm:w-auto shrink-0">
              <a 
                href="/invest" 
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/invest');
                }}
                className="w-full sm:w-auto bg-brand-red text-white px-10 py-4 text-xl font-display uppercase tracking-wider hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl group"
              >
                Invest Now
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState('');

  const openVideo = (id: string) => {
    setActiveVideoId(id);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background selection:bg-brand-red selection:text-white overflow-x-hidden">
      <Header />
      <Hero onWatchVideo={openVideo} />
      <TheHook />
      <MarketLandscape />
      <TheStory onWatchTrailer={() => openVideo('0rtorNlIbyk')} onWatchFrank={() => openVideo('v2HNpdwWyls')} />
      <TheOffering />
      <TheDeck />
      <TheTeam />
      <FAQ />
      <Footer />
      <StickyFooter />

      <VideoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        videoId={activeVideoId} 
      />
    </div>
  );
}


