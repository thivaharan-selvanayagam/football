"use client";

import React, { useState, useEffect } from "react";

interface TestimonialItem {
  id: number;
  quote: string;
  name: string;
  role: string;
  avatar: string;
}

export default function Testimonials() {
  const testimonials: TestimonialItem[] = [
    {
      id: 1,
      quote: "Exceptional value for money. The feature set rivals enterprise solutions at a fraction of the cost. Perfect for our startup's budget and needs.",
      name: "David Kim",
      role: "Startup Founder",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: 2,
      quote: "This platform has completely transformed how we manage our projects. The intuitive interface and powerful features have increased our productivity by 40%.",
      name: "Sarah Chen",
      role: "Product Manager",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: 3,
      quote: "Outstanding customer support and seamless integration. Our team was up and running in minutes, not hours. Highly recommend to any growing business.",
      name: "Marcus Johnson",
      role: "Tech Lead",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: 4,
      quote: "The print quality on these physical cards blew me away. The colors are incredibly vibrant, and the textured finish gives it a truly premium collectible feel.",
      name: "Alex Mercer",
      role: "Sports Enthusiast",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: 5,
      quote: "Ordered a custom card as a birthday gift for my son and his face completely lit up! The background removal on the photo was flawless. Will absolutely buy again.",
      name: "Elena Rostova",
      role: "Verified Parent",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  // Smooth automatic tracking interval cycle loops
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000); // Transitions to the next slide every 5 seconds
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="w-full bg-[#121212] text-white py-20 px-6 sm:px-12 md:px-24 flex flex-col items-center justify-center">
      
      {/* HEADER INTRO WRAPPER */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Hear from our clients
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base font-medium max-w-md mx-auto leading-relaxed">
          Don't just take our word for it. See what our amazing customers have to say about their experience.
        </p>
      </div>

      {/* DYNAMIC SCROLL/GRID WORKSPACE */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Displays a shifting window of 3 cards based on the activeIndex */}
        {[0, 1, 2].map((offset) => {
          const targetIndex = (activeIndex + offset) % testimonials.length;
          const t = testimonials[targetIndex];

          return (
            <div 
              key={t.id} 
              className={`bg-[#181818]/40 border rounded-2xl p-8 flex flex-col justify-between h-[340px] transition-all duration-500 relative ${
                offset === 0 
                  ? "border-neutral-400 shadow-[0_10px_30px_rgba(255,255,255,0.03)] opacity-100 scale-100" 
                  : "border-neutral-800/80 opacity-60 scale-[0.98]"
              }`}
            >
              
              {/* Top Row: Quote SVG Bracket Icon and Text block */}
              <div className="space-y-4">
                <div className="w-8 h-8 rounded-lg bg-[#222] border border-neutral-800 flex items-center justify-center">
                  <svg className="w-4 h-4 text-neutral-400 fill-current" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-neutral-300 text-[14px] leading-relaxed font-medium italic tracking-wide line-clamp-6">
                  "{t.quote}"
                </p>
              </div>

              {/* Bottom Row: Separator Border & User Meta profiles panel */}
              <div className="pt-6 border-t border-neutral-900 flex items-center gap-4">
                <div className="relative">
                  <img 
                    src={t.avatar} 
                    alt={t.name} 
                    className="w-12 h-12 rounded-full object-cover filter grayscale"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-white rounded-full border-2 border-[#121212]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white tracking-wide">{t.name}</h4>
                  <p className="text-xs text-neutral-500 font-semibold mt-0.5">{t.role}</p>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* SLIDER CONTROLLER NAVIGATION INDICATORS */}
      <div className="flex items-center gap-2.5">
        {testimonials.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeIndex === index ? "w-6 bg-white" : "w-2 bg-neutral-700 hover:bg-neutral-500"
            }`}
            aria-label={`Go to slider panel frame number ${index + 1}`}
          />
        ))}
      </div>

    </section>
  );
}