export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 pt-24 pb-10 px-6 overflow-hidden">
      {/* glow de fondo */}
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[40rem] h-[20rem] rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* CTA tipográfico gigante */}
        <a href="#contact" className="block group mb-20">
          <p className="text-xs text-white/35 tracking-[0.3em] uppercase mb-4">
            ¿Tenés una idea?
          </p>
          <p className="text-[clamp(2.8rem,9vw,7rem)] font-bold leading-[0.95] tracking-tight bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
            Trabajemos
            <br />
            juntos&nbsp;
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-3 group-hover:-translate-y-3">
              ↗
            </span>
          </p>
        </a>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/5 pt-8">
          <span className="text-sm font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Julian Mendiola
          </span>
          <p className="text-xs text-white/30 text-center">
            Construido con Next.js + IA · {new Date().getFullYear()}
          </p>
          <a
            href="#hero"
            className="text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            Volver arriba ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
