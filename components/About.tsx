"use client";

import { Zap, Brain, Users, Rocket } from "lucide-react";
import Reveal from "./Reveal";

const values = [
  {
    icon: <Brain size={18} />,
    title: "IA como herramienta",
    desc: "No escondo que uso IA, lo uso como diferencial. Me permite construir más rápido y mejor.",
  },
  {
    icon: <Rocket size={18} />,
    title: "De idea a producto",
    desc: "Entiendo el lado del negocio, no solo el técnico. Construyo para que funcione.",
  },
  {
    icon: <Zap size={18} />,
    title: "Velocidad real",
    desc: "Valido rápido, itero rápido. Sin análisis infinitos — construyo y aprendo.",
  },
  {
    icon: <Users size={18} />,
    title: "Foco en el usuario",
    desc: "Cada decisión técnica sirve al usuario final. El código es el medio, no el fin.",
  },
];

export default function About() {
  return (
    <section id="about" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <Reveal>
            <p className="text-sm text-cyan-400 font-medium tracking-widest uppercase mb-3">
              Quién soy
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Sobre mí
            </h2>

            <div className="space-y-4 text-white/60 text-lg leading-relaxed">
              <p>
                Soy <strong className="text-white">Julian Mendiola</strong>,
                desarrollador y emprendedor tech de Argentina. Construyo
                productos digitales que resuelven problemas reales de negocios.
              </p>
              <p>
                Mi proyecto actual es{" "}
                <strong className="text-violet-400">TallerPro</strong>, un
                sistema de gestión para talleres mecánicos que nació de
                identificar un problema concreto en el mercado.
              </p>
              <p>
                Uso inteligencia artificial no solo para escribir código, sino
                como parte del proceso creativo, de diseño y de toma de
                decisiones. Eso es mi diferencial.
              </p>
            </div>

            <div className="mt-8 flex gap-4">
              <a
                href="#contact"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Trabajemos juntos
              </a>
              <a
                href="#projects"
                className="px-6 py-3 rounded-full border border-white/20 text-white/70 text-sm font-medium hover:border-white/40 hover:text-white transition-all"
              >
                Ver proyectos
              </a>
            </div>
          </Reveal>

          {/* Values grid */}
          <div className="grid grid-cols-2 gap-4">
            {values.map((v, idx) => (
              <Reveal
                key={v.title}
                delay={0.15 + idx * 0.1}
                className="p-5 rounded-2xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center text-violet-400 mb-3">
                  {v.icon}
                </div>
                <h3 className="text-white font-semibold text-sm mb-1.5">
                  {v.title}
                </h3>
                <p className="text-white/45 text-xs leading-relaxed">{v.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
