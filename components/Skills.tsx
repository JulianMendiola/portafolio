"use client";

const skillGroups = [
  {
    category: "Frontend",
    color: "from-violet-500 to-purple-500",
    skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    category: "Backend",
    color: "from-cyan-500 to-blue-500",
    skills: ["Node.js", "Prisma", "PostgreSQL", "REST APIs", "Supabase"],
  },
  {
    category: "IA & Herramientas",
    color: "from-pink-500 to-rose-500",
    skills: ["Claude AI", "OpenAI API", "Claude Code", "Cursor", "v0"],
  },
  {
    category: "Producto & Negocio",
    color: "from-amber-500 to-orange-500",
    skills: [
      "Product thinking",
      "MVP design",
      "Vercel",
      "Git / GitHub",
      "UX básico",
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm text-pink-400 font-medium tracking-widest uppercase mb-3">
            Mi stack
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Tecnologías
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Las herramientas que uso para construir productos rápido y bien.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillGroups.map((group) => (
            <div
              key={group.category}
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 hover:bg-white/[0.05] transition-colors"
            >
              <div
                className={`inline-block text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${group.color} text-white mb-5`}
              >
                {group.category}
              </div>
              <ul className="space-y-2.5">
                {group.skills.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-sm">
                    <span
                      className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${group.color} flex-shrink-0`}
                    />
                    <span className="text-white/70">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* AI callout */}
        <div className="mt-10 p-6 rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 text-center">
          <p className="text-white/80 text-base">
            <span className="font-bold text-white">
              IA integrada en todo el proceso
            </span>{" "}
            — desde el diseño hasta el deploy. No es un truco, es parte de cómo
            trabajo.
          </p>
        </div>
      </div>
    </section>
  );
}
