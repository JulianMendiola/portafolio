"use client";

import { ExternalLink, Code2, Wrench, TrendingUp } from "lucide-react";

const projects = [
  {
    title: "TallerPro",
    description:
      "Sistema de gestión digital para un taller mecánico familiar. Nació de la necesidad real de pasar de papel y Excel a una plataforma centralizada: control de órdenes de trabajo, clientes, historial de vehículos y seguimiento del negocio.",
    tags: ["Next.js", "TypeScript", "Tailwind", "IA"],
    status: "En desarrollo",
    statusColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    icon: <Wrench size={20} />,
    gradient: "from-violet-500/20 via-violet-500/5 to-transparent",
    borderColor: "border-violet-500/20 hover:border-violet-500/50",
    link: "https://taller-pro-rouge.vercel.app",
    github: "https://github.com/JulianMendiola/taller-pro",
  },
  {
    title: "Orion",
    description:
      "Analista financiero potenciado por IA. Interpreta datos del mercado, genera reportes y toma el rol de un asesor financiero inteligente que te ayuda a entender y tomar mejores decisiones con tu plata.",
    tags: ["IA", "Next.js", "Finanzas", "Claude AI"],
    status: "En construcción",
    statusColor: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    icon: <TrendingUp size={20} />,
    gradient: "from-cyan-500/20 via-cyan-500/5 to-transparent",
    borderColor: "border-cyan-500/20 hover:border-cyan-500/50",
    link: "#",
    github: null,
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm text-violet-400 font-medium tracking-widest uppercase mb-3">
            Lo que construyo
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Proyectos
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Productos digitales reales, no demos. Cada proyecto resuelve un
            problema concreto.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {projects.map((p) => (
            <article
              key={p.title}
              className={`relative group rounded-2xl border ${p.borderColor} bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300 overflow-hidden flex flex-col`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${p.gradient} pointer-events-none`}
              />

              <div className="relative p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/70">
                    {p.icon}
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full border ${p.statusColor}`}
                  >
                    {p.status}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{p.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed mb-5 flex-1">
                  {p.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-white/50 border border-white/8"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/8">
                  <a
                    href={p.link}
                    className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
                  >
                    <ExternalLink size={14} />
                    Ver proyecto
                  </a>
                  {p.github && (
                    <a
                      href={p.github}
                      className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors ml-auto"
                    >
                      <Code2 size={14} />
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
