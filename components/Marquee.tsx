const ITEMS = [
  "TallerPro",
  "Orion",
  "TradingBot",
  "Next.js",
  "React Three Fiber",
  "Claude AI",
  "Python",
  "Supabase",
];

/* Cinta tipográfica infinita: texto outline gigante, estilo award-site. */
export default function Marquee() {
  return (
    <div className="relative py-7 border-y border-white/5 overflow-hidden select-none">
      <div className="flex whitespace-nowrap w-max animate-marquee">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span
            key={i}
            className="flex items-center text-3xl md:text-5xl font-bold uppercase tracking-tight text-transparent"
            style={{ WebkitTextStroke: "1px rgba(255,255,255,0.16)" }}
          >
            {item}
            <span
              className="text-violet-500/50 text-xl md:text-2xl px-6 md:px-8"
              style={{ WebkitTextStroke: "0" }}
            >
              ✦
            </span>
          </span>
        ))}
      </div>
      {/* fundido en los bordes */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#07070f] to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#07070f] to-transparent pointer-events-none" />
    </div>
  );
}
