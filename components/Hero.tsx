"use client";

import React from "react";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative w-full min-h-screen bg-[#060606] text-white flex flex-col overflow-hidden select-none">
      
      {/* 1. FULLSCREEN BACKGROUND VIDEO ELEMENT */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          {/* Replace 'your-video-file.mp4' with your actual file name inside the public directory */}
          <source src="/hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Dark overlay mask layer to preserve crisp text contrast values */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      </div>

      {/* 2. MAIN HERO BODY WORKSPACE */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-center relative z-20 pb-16 pt-8 md:pt-0">
        
        {/* Dynamic Left Column Text Elements Container */}
        <div className="max-w-2xl text-left space-y-6 md:space-y-8 animate-fadeIn">
          
          {/* Dramatic Ultra-Bold Title Stack */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black font-sans tracking-tight text-white leading-[1.05] drop-shadow-md">
            Every Athlete <br />
            Deserves Their <br />
            <span className="italic font-serif font-light text-neutral-100">Own Card</span>
          </h1>

          {/* Subtext Paragraph Descriptor */}
          <p className="text-neutral-300 text-base sm:text-lg md:text-xl font-medium max-w-lg leading-relaxed drop-shadow">
            Personalized real-life soccer cards. The best gift to make any player feel like a super star.
          </p>

          {/* Primary & Secondary Twin CTA Action Buttons */}
          <div className="flex items-center gap-4 pt-2">
            <Link 
              href="/shop" 
              className="bg-white hover:bg-neutral-200 text-black font-bold px-8 py-4 rounded-xl text-sm transition shadow-lg tracking-wide"
            >
              Buy Now
            </Link>
            <Link 
              href="/about" 
              className="bg-transparent hover:bg-white/10 text-white font-bold px-8 py-4 rounded-xl text-sm border border-white/30 transition tracking-wide"
            >
              Learn More
            </Link>
          </div>
        </div>

        

      </main>

      {/* Decorative Stage Lighting Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#060606_95%)] pointer-events-none z-10 opacity-70" />
    </div>
  );
}