"use client";

import React from "react";

interface FeatureItem {
  id: number;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

export default function WhyChooseUs() {
  const features: FeatureItem[] = [
    {
      id: 1,
      title: "Built To Last",
      desc: "Printed on thick, premium materials that look and feel elite.",
      icon: (
        <svg className="w-4 h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Actionable Analytics",
      desc: "Go beyond vanity metrics. Track real business impact with custom dashboards, cohort analysis, and automated reporting delivered weekly.",
      icon: (
        <svg className="w-4 h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2zm12 0v-11a2 2 0 00-2-2h-2a2 2 0 00-2 2v11a2 2 0 002 2h2a2 2 0 002-2z" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Fully Personalised",
      desc: "Your face, your name, your stats — we handle all the design work seamlessly.",
      icon: (
        <svg className="w-4 h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    },
    {
      id: 4,
      title: "Seamless Integrations",
      desc: "Connect with 200+ tools your team already uses. Two-click setup with Slack, HubSpot, Salesforce, and every major platform.",
      icon: (
        <svg className="w-4 h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 6H16" />
        </svg>
      )
    },
    {
      id: 5,
      title: "Global Edge Network",
      desc: "Serve users in 190+ countries with localized content delivery. Auto-scaling infrastructure handles traffic spikes easily.",
      icon: (
        <svg className="w-4 h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9h18" />
        </svg>
      )
    },
    {
      id: 6,
      title: "AI-Powered Automation",
      desc: "Let intelligent workflows handle the repetitive work. From lead scoring to content optimization, AI keeps your pipeline moving 24/7.",
      icon: (
        <svg className="w-4 h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  return (
    <section className="w-full bg-white text-neutral-950 py-20 px-6 sm:px-12 md:px-24">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-12 md:gap-20 items-start">
        
        {/* LEFT COLUMN: STICKY SHOWCASE IMAGE & VIDEO DISPLAY */}
        <div className="w-full md:sticky md:top-24 space-y-8">
          <div className="space-y-3">
            <span className="inline-block bg-[#232323] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
              Service
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 leading-tight">
              Why Choose SAS Sports
            </h2>
            <p className="text-neutral-500 text-sm sm:text-base font-medium">
              Canada&apos;s favorite Soccer Cards provider
            </p>
          </div>

          {/* Video / Image Asset Container Panel */}
          <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-100 shadow-sm relative">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              {/* Change 'why-choose-us.mp4' to your actual file filename sitting in public folder */}
              <source src="/art.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* RIGHT COLUMN: SCROLLABLE LIST OF CARDS */}
        <div className="w-full space-y-4 md:pt-4">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="w-full border border-neutral-100 bg-white p-6 rounded-2xl flex items-start gap-5 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:border-neutral-200/80 transition-all duration-300"
            >
              {/* Dynamic Badge Minimalist Icon Frame Container */}
              <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center shrink-0 mt-0.5">
                {feature.icon}
              </div>

              {/* Text Layout blocks info items */}
              <div className="space-y-1.5">
                <h3 className="font-black text-base text-neutral-900 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}