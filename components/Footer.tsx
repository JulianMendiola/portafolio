export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
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
    </footer>
  );
}
