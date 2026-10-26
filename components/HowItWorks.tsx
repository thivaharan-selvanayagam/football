"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface StepItem {
  id: number;
  stepNumber: string;
  title: string;
  desc: string;
  points: string[];
  icon: React.ReactNode;
}

export default function HowItWorks() {
  const router = useRouter();

  const steps: StepItem[] = [
    {
      id: 1,
      stepNumber: "STEP 01",
      title: "Take or Upload Your Photo",
      desc: "Use any smartphone photo or upload from your gallery. Our AI will enhance and optimize it for the best card quality.",
      points: [
        "High-resolution photos work best (1080p or higher)",
        "Clear, well-lit shots produce amazing results",
        "Action shots, portraits, and team photos all work great",
        "Our AI automatically removes backgrounds and enhances quality",
      ],
      icon: (
        <svg className="w-5 h-5 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      id: 2,
      stepNumber: "STEP 02",
      title: "Customise Your Card",
      desc: "Add personal stats, choose your favourite team colours, and make it uniquely yours with our easy-to-use editor.",
      points: [
        "Add custom player name and stats",
        "Choose from 10+ professional card designs",
        "Select team colours and logos",
        "Preview in real-time before ordering",
      ],
      icon: (
        <svg className="w-5 h-5 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      id: 3,
      stepNumber: "STEP 03",
      title: "Professional Editing",
      desc: "Our expert designers perfect your card with professional editing, ensuring it looks amazing before printing.",
      points: [
        "Professional photo editing and enhancement",
        "Color correction and lighting optimization",
        "Background removal and replacement",
        "Quality check and approval process",
      ],
      icon: (
        <svg className="w-5 h-5 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      id: 4,
      stepNumber: "STEP 04",
      title: "Premium Printing",
      desc: "Printed on premium card stock with professional finishes that rival official trading cards.",
      points: [
        "PVC",
        "Gloss or matte finish options",
        "Rounded corners for authentic feel",
        "Scratch-resistant coating",
      ],
      icon: (
        <svg className="w-5 h-5 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="w-full bg-neutral-50 text-neutral-900 py-20 px-6 sm:px-12 md:px-16 flex flex-col items-center justify-center border-t border-neutral-200/80">
      
      {/* HEADER SECTION */}
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
        <span className="inline-block bg-[#2d2d2d] text-white text-[11px] font-bold px-3 py-1 rounded-md tracking-wide">
          How it works
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-900 tracking-tight leading-tight">
          From signup to success in 4 steps
        </h2>
        <p className="text-neutral-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-medium">
          A streamlined process that gets your custom card designed, perfected, and delivered fast.
        </p>
      </div>

      {/* TIMELINE GRID CONTAINER */}
      <div className="w-full max-w-7xl mx-auto relative mb-16">
        
        {/* Horizontal line connector behind icons (Desktop only) */}
        <div className="absolute top-7 left-[12%] right-[12%] h-px bg-neutral-200 z-0 hidden md:block" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10 items-stretch">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col h-full">
              
              {/* Node Icon Header */}
              <div className="flex flex-col items-center mb-5">
                <div className="w-14 h-14 bg-white rounded-full border border-neutral-200 flex items-center justify-center shadow-sm mb-3">
                  {step.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-200/60 px-3 py-0.5 rounded-full">
                  {step.stepNumber}
                </span>
              </div>

              {/* Uniform White Card Box with Auto Alignment */}
              <div className="flex-1 bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-sm flex flex-col justify-between hover:border-neutral-300 transition duration-300">
                
                {/* Upper Text Block */}
                <div>
                  <h3 className="font-black text-lg text-neutral-900 tracking-tight text-center mb-3 min-h-[44px] flex items-center justify-center">
                    {step.title}
                  </h3>
                  <p className="text-neutral-500 text-xs leading-relaxed font-medium text-center min-h-[64px] flex items-start justify-center">
                    {step.desc}
                  </p>
                </div>

                {/* Lower Bullet Points Block (Cleanly Pushed to the Bottom) */}
                <div className="pt-4 border-t border-neutral-100 mt-4 min-h-[140px] flex flex-col justify-start">
                  <ul className="space-y-2 text-left w-full text-[11px] font-medium text-neutral-600">
                    {step.points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-neutral-900 font-bold leading-none mt-1 shrink-0">•</span>
                        <span className="leading-snug">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM BUTTONS */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <Link
          href="/cards"
          className="bg-[#232323] hover:bg-black text-white px-7 py-3.5 rounded-xl text-sm font-bold tracking-wide transition shadow-md"
        >
          Get started free
        </Link>
        <button
          type="button"
          onClick={() => router.push("/faq")}
          className="bg-white hover:bg-neutral-100 text-neutral-800 font-bold px-7 py-3.5 rounded-xl text-sm border border-neutral-200 transition tracking-wide shadow-sm"
        >
          See How It Works
        </button>
      </div>

    </section>
  );
}