"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface StepItem {
  id: number;
  title: string;
  desc: string;
  duration?: string;
  icon: React.ReactNode;
}

export default function HowItWorks() {
  // ✨ FIX: Hook initialized correctly inside the functional component body
  const router = useRouter();

  const steps: StepItem[] = [
    {
      id: 1,
      title: "Pick Your Card",
      desc: "Choose from 50+ EAFC 26, EAFC 25 and Club card designs. Find one you love.",
      icon: (
        <svg className="w-5 h-5 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Make it Yours",
      desc: "Upload your photo, add your name, club, position and stats. We remove the background for you.",
      icon: (
        <svg className="w-5 h-5 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Preview & Approve",
      desc: "We send you a stunning edited preview. Once you approve, we bring it to life.",
      duration: "5 min",
      icon: (
        <svg className="w-5 h-5 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0x" />
        </svg>
      )
    },
    {
      id: 4,
      title: "Fast Delivery",
      desc: "Printed on premium materials and shipped within 24-48 hours to your door.",
      duration: "5 min",
      icon: (
        <svg className="w-5 h-5 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1zm0 0h5l4 2v-5l-4-1h-5m-6 3a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
      )
    }
  ];

  return (
    <section className="w-full bg-white text-neutral-900 py-20 px-6 sm:px-12 md:px-24 flex flex-col items-center justify-center border-t border-neutral-100">
      
      {/* HEADER SECTION PANEL */}
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-16 md:mb-20">
        <span className="inline-block bg-[#2d2d2d] text-white text-[11px] font-bold px-3 py-1 rounded-md tracking-wide">
          How it works
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-900 tracking-tight">
          From signup to success in 4 steps
        </h2>
        <p className="text-neutral-500 text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed font-medium">
          A streamlined onboarding process that gets you up and running fast, without sacrificing depth or flexibility.
        </p>
      </div>

      {/* HORIZONTAL CONNECTING CONNECT TIMELINE STEP FLOW GRID */}
      <div className="w-full max-w-6xl mx-auto relative mb-16">
        
        {/* Horizontal background vector axis line tracker (Desktop Only) */}
        <div className="absolute top-7 left-[12%] right-[12%] h-px bg-neutral-200 z-0 hidden md:block" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6 relative z-10">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center text-center space-y-4 px-2">
              
              {/* Circular Anchor Badge Node Wrapper */}
              <div className="w-14 h-14 bg-white rounded-full border border-neutral-200 flex items-center justify-center shadow-sm hover:border-neutral-400/60 transition duration-300">
                {step.icon}
              </div>

              {/* Title Descriptive Header */}
              <h3 className="font-black text-lg text-neutral-900 tracking-tight pt-1">
                {step.title}
              </h3>

              {/* Information Body Paragraph Copy */}
              <p className="text-neutral-500 text-sm leading-relaxed font-medium max-w-xs md:max-w-none">
                {step.desc}
              </p>

              {/* Optional dynamic execution runtime duration metadata pills */}
              {step.duration && (
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1.5 bg-neutral-50 border border-neutral-200/80 rounded-full px-2.5 py-0.5 text-[10px] text-neutral-500 font-bold tracking-wide">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {step.duration}
                  </span>
                </div>
              )}

            </div>
          ))}
        </div>
      </div>

      {/* STEP BOTTOM ACTIONS FOOTER ROW */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Link
          href="/cards"
          className="bg-[#232323] hover:bg-black text-white px-6 py-3.5 rounded-xl text-sm font-bold tracking-wide transition shadow-md"
        >
          Get started free
        </Link>
        <button
          type="button"
          onClick={() => {
            router.push("/faq"); 
          }}
          className="bg-white hover:bg-neutral-50 text-neutral-800 font-bold px-6 py-3.5 rounded-xl text-sm border border-neutral-200 transition tracking-wide"
        >
          See How It Works
        </button>
      </div>

    </section>
  );
}