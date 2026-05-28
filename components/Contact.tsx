"use client";

import { useState } from "react";
import { Send, Mail, Code2, Briefcase, MessageCircle } from "lucide-react";

const socials = [
  {
    icon: <Mail size={18} />,
    label: "Email",
    href: "mailto:julianmendiola3@gmail.com",
    value: "julianmendiola3@gmail.com",
  },
  {
    icon: <Code2 size={18} />,
    label: "GitHub",
    href: "https://github.com/JulianMendiola",
    value: "github.com/JulianMendiola",
  },
  {
    icon: <Briefcase size={18} />,
    label: "LinkedIn",
    href: "https://linkedin.com/in/julian-mendiola-151418239",
    value: "linkedin.com/in/julian-mendiola-151418239",
  },
  {
    icon: <MessageCircle size={18} />,
    label: "WhatsApp",
    href: "https://wa.me/",
    value: "Escribime por WhatsApp",
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Contacto desde portafolio — ${form.name}`);
    const body = encodeURIComponent(
      `Hola Julian,\n\nSoy ${form.name} (${form.email}).\n\n${form.message}`
    );
    window.open(`mailto:julianmendiola3@gmail.com?subject=${subject}&body=${body}`);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  }

  return (
    <section id="contact" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm text-emerald-400 font-medium tracking-widest uppercase mb-3">
            Hablemos
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contacto
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            ¿Tenés un proyecto en mente o querés contratarme? Escribime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white/[0.03] border border-white/8 rounded-2xl p-8"
          >
            <div>
              <label className="block text-sm text-white/60 mb-1.5">
                Nombre
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Tu nombre"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1.5">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="tu@email.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1.5">
                Mensaje
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Contame de tu proyecto o idea..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              {sent ? "¡Mensaje enviado!" : (<><Send size={15} /> Enviar mensaje</>)}
            </button>
          </form>

          {/* Socials */}
          <div className="flex flex-col justify-center gap-4">
            <p className="text-white/60 text-base mb-2">
              También podés encontrarme en:
            </p>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/15 transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center text-violet-400 flex-shrink-0">
                  {s.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                    {s.label}
                  </p>
                  <p className="text-xs text-white/40">{s.value}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
