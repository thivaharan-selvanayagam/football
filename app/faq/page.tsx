export default function AboutPage() {
  return (
    <section className="w-full min-h-screen bg-neutral-50 text-neutral-900 py-16 px-6 sm:px-12 md:px-24">
      <div className="w-full max-w-3xl mx-auto">
        {/* ⚽ ABOUT US STORY SECTION */}
        <div className="text-center space-y-4">
          <div>
            <span className="inline-block bg-[#2d2d2d] text-white text-[11px] font-bold px-3 py-1 rounded-md tracking-wide uppercase">
              Our Story
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-900 tracking-tight leading-none">
            About SAS Sports
          </h1>
          <p className="text-neutral-500 text-sm sm:text-base font-medium max-w-xl mx-auto">
            Born from a lifelong obsession with the beautiful game.
          </p>

          <div className="bg-white rounded-2xl border border-neutral-200/80 p-8 sm:p-10 shadow-sm text-left space-y-5 mt-6">
            <p className="text-neutral-600 text-sm sm:text-base md:text-lg leading-relaxed font-medium">
              We are three brothers who live and breathe the beautiful game. If we’re not outside playing or training, having fun, you’ll find us glued to the TV watching a game or battling it out on the PS5 playing FC. Soccer isn&apos;t just a sport to us, it’s how we are growing up, around the game, and it has brought us much joy.
            </p>
            <p className="text-neutral-600 text-sm sm:text-base md:text-lg leading-relaxed font-medium">
              We launched this business to take that lifelong obsession and build something all three of us can be proud of, creating a way to support our own growth while giving back to the community. Thanks for backing our vision, supporting our business, and being a part of this journey with us.
            </p>

            <div className="pt-4 flex items-center gap-3 border-t border-neutral-100">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
                Arun, Shiva &amp; Seyon
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
