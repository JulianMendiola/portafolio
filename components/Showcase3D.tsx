"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/* ---------------------------------------------------------------------------
 * Recorrido: la cámara viaja entre 3 estaciones (una por proyecto) separadas
 * STATION_GAP unidades en X. stationCoord mapea el progreso de scroll [0,1]
 * a una coordenada continua de estación [0,2] con pausas en cada una.
 * ------------------------------------------------------------------------- */

const STATION_GAP = 14;

function smoothstep(x: number) {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
}

function stationCoord(p: number) {
  return (
    smoothstep((p - 0.26) / 0.14) + smoothstep((p - 0.6) / 0.14)
  );
}

function CameraRig({ progress }: { progress: MotionValue<number> }) {
  useFrame(({ camera, clock }) => {
    const p = progress.get();
    const s = stationCoord(p);
    const f = s <= 1 ? s : s - 1; // fase del viaje dentro del segmento actual
    const lift = Math.sin(f * Math.PI);
    const t = clock.elapsedTime;

    camera.position.x = s * STATION_GAP + Math.sin(t * 0.3) * 0.15;
    camera.position.y = 1.1 + lift * 1.5 + Math.sin(t * 0.5) * 0.08;
    camera.position.z = 7.5 - lift * 2.2;
    camera.lookAt(s * STATION_GAP, 0.2, 0);
  });
  return null;
}

/* --------------------------- Estación 01: TallerPro ----------------------- */

function Gear({
  radius = 1.5,
  teeth = 10,
  color,
  emissive,
}: {
  radius?: number;
  teeth?: number;
  color: string;
  emissive: string;
}) {
  return (
    <group>
      <mesh>
        <torusGeometry args={[radius, radius * 0.28, 16, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.25}
          metalness={0.85}
          roughness={0.3}
        />
      </mesh>
      {Array.from({ length: teeth }).map((_, i) => {
        const a = (i / teeth) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(a) * radius * 1.3,
              Math.sin(a) * radius * 1.3,
              0,
            ]}
            rotation={[0, 0, a]}
          >
            <boxGeometry args={[radius * 0.38, radius * 0.24, radius * 0.26]} />
            <meshStandardMaterial
              color={color}
              metalness={0.85}
              roughness={0.35}
            />
          </mesh>
        );
      })}
      <mesh>
        <cylinderGeometry args={[radius * 0.3, radius * 0.3, radius * 0.4, 24]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.25} />
      </mesh>
    </group>
  );
}

function TallerStation() {
  const main = useRef<THREE.Group>(null);
  const small = useRef<THREE.Group>(null);
  const bolts = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (main.current) main.current.rotation.z = t * 0.25;
    if (small.current) small.current.rotation.z = -t * 0.45 + 0.3;
    if (bolts.current) bolts.current.rotation.z = -t * 0.08;
  });

  return (
    <group>
      <group ref={main} rotation={[0.15, -0.25, 0]}>
        <Gear color="#7c5cf0" emissive="#8b5cf6" />
      </group>
      <group ref={small} position={[2.6, 1.8, -0.5]} scale={0.5} rotation={[0.15, -0.25, 0]}>
        <Gear color="#5b48b8" emissive="#8b5cf6" teeth={8} />
      </group>
      <group ref={bolts}>
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 3.4, Math.sin(a) * 3.4, -0.8]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <cylinderGeometry args={[0.15, 0.15, 0.12, 6]} />
              <meshStandardMaterial
                color="#6d5bd0"
                metalness={0.9}
                roughness={0.3}
              />
            </mesh>
          );
        })}
      </group>
      <pointLight position={[2, 3, 3]} intensity={50} distance={14} color="#8b5cf6" />
      <Sparkles count={40} scale={[9, 5, 5]} size={2} speed={0.3} color="#a78bfa" />
    </group>
  );
}

/* ----------------------------- Estación 02: Orion ------------------------- */

function OrionStation() {
  const planet = useRef<THREE.Mesh>(null);
  const rings = useRef<THREE.Group>(null);
  const moon = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (planet.current) planet.current.rotation.y = t * 0.15;
    if (rings.current) rings.current.rotation.z = t * 0.05;
    if (moon.current) {
      moon.current.position.x = Math.cos(t * 0.4) * 2.7;
      moon.current.position.z = Math.sin(t * 0.4) * 2.7;
      moon.current.position.y = Math.sin(t * 0.4) * 0.5;
    }
  });

  return (
    <group position={[STATION_GAP, 0, 0]}>
      <mesh ref={planet}>
        <sphereGeometry args={[1.4, 48, 48]} />
        <meshStandardMaterial
          color="#0b3a4a"
          emissive="#06b6d4"
          emissiveIntensity={0.35}
          metalness={0.3}
          roughness={0.55}
        />
      </mesh>
      <group ref={rings} rotation={[1.25, 0.2, 0]}>
        <mesh>
          <torusGeometry args={[2.2, 0.045, 8, 80]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={0.8}
            transparent
            opacity={0.75}
          />
        </mesh>
        <mesh>
          <torusGeometry args={[2.7, 0.02, 8, 80]} />
          <meshStandardMaterial
            color="#67e8f9"
            emissive="#67e8f9"
            emissiveIntensity={0.6}
            transparent
            opacity={0.45}
          />
        </mesh>
      </group>
      <mesh ref={moon}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial
          color="#a5f3fc"
          emissive="#67e8f9"
          emissiveIntensity={0.7}
        />
      </mesh>
      <pointLight position={[2, 3, 4]} intensity={55} distance={15} color="#06b6d4" />
      <Sparkles count={60} scale={[10, 6, 6]} size={2.5} speed={0.25} color="#67e8f9" />
    </group>
  );
}

/* --------------------------- Estación 03: TradingBot ---------------------- */

// Serie con tendencia alcista y pullbacks: [apertura, cierre] por vela
const CANDLES: [number, number][] = [
  [0.2, 0.7], [0.7, 1.15], [1.15, 0.9], [0.9, 1.55], [1.55, 1.3],
  [1.3, 1.95], [1.95, 2.35], [2.35, 2.0], [2.0, 2.6], [2.6, 2.4],
  [2.4, 3.0], [3.0, 3.45], [3.45, 3.2], [3.2, 3.8],
];

function TradingStation() {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(clock.elapsedTime * 0.2) * 0.12;
    }
  });

  return (
    <group position={[STATION_GAP * 2, 0, 0]}>
      <group ref={group} position={[0, -1.6, 0]}>
        {CANDLES.map(([open, close], i) => {
          const up = close >= open;
          const body = Math.abs(close - open);
          const mid = (open + close) / 2;
          const x = (i - (CANDLES.length - 1) / 2) * 0.52;
          const color = up ? "#10b981" : "#f43f5e";
          return (
            <group key={i} position={[x, 0, 0]}>
              <mesh position={[0, mid, 0]}>
                <boxGeometry args={[0.3, Math.max(body, 0.12), 0.3]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={0.45}
                  metalness={0.4}
                  roughness={0.4}
                />
              </mesh>
              <mesh position={[0, mid, 0]}>
                <boxGeometry args={[0.05, body + 0.5, 0.05]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={0.6}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            </group>
          );
        })}
        <gridHelper
          args={[12, 20, "#f59e0b", "#27272a"]}
          position={[0, -0.05, 0]}
        />
      </group>
      <pointLight position={[0, 4, 4]} intensity={45} distance={15} color="#f59e0b" />
      <Sparkles count={45} scale={[10, 5, 5]} size={2} speed={0.3} color="#fbbf24" />
    </group>
  );
}

/* --------------------------------- Escena --------------------------------- */

function Scene({ progress }: { progress: MotionValue<number> }) {
  return (
    <>
      <fog attach="fog" args={["#07070f", 13, 40]} />
      <ambientLight intensity={0.5} />
      <Stars radius={90} depth={50} count={2500} factor={4} saturation={0} fade />
      <CameraRig progress={progress} />
      <TallerStation />
      <OrionStation />
      <TradingStation />
    </>
  );
}

/* ------------------------------ Overlays HTML ----------------------------- */

type Chapter = {
  number: string;
  title: string;
  status: string;
  description: string;
  tags: string;
  accent: string;
  chipClass: string;
  side: "left" | "right";
  range: [number, number, number, number];
};

const CHAPTERS: Chapter[] = [
  {
    number: "01",
    title: "TallerPro",
    status: "En uso",
    description:
      "Gestión completa para un taller mecánico real: órdenes de trabajo, clientes, vehículos y caja diaria.",
    tags: "Next.js · TypeScript · Supabase",
    accent: "text-violet-400",
    chipClass: "text-violet-300 bg-violet-400/10 border-violet-400/25",
    side: "left",
    range: [0, 0.05, 0.21, 0.28],
  },
  {
    number: "02",
    title: "Orion",
    status: "En construcción",
    description:
      "Inteligencia financiera con IA para el inversor argentino: mercados en vivo, señales y backtesting.",
    tags: "React · Node.js · Claude AI",
    accent: "text-cyan-400",
    chipClass: "text-cyan-300 bg-cyan-400/10 border-cyan-400/25",
    side: "right",
    range: [0.36, 0.43, 0.56, 0.62],
  },
  {
    number: "03",
    title: "TradingBot",
    status: "Activo",
    description:
      "Trading algorítmico en Python: tres estrategias, gestión de riesgo automática y dashboard propio.",
    tags: "Python · Estrategias · Paper trading",
    accent: "text-amber-400",
    chipClass: "text-amber-300 bg-amber-400/10 border-amber-400/25",
    side: "left",
    range: [0.7, 0.77, 1, 1],
  },
];

function ChapterOverlay({
  chapter,
  progress,
}: {
  chapter: Chapter;
  progress: MotionValue<number>;
}) {
  const [a, b, c, d] = chapter.range;
  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, d === 1 ? 1 : 0]);
  const x = useTransform(
    progress,
    [a, b],
    chapter.side === "left" ? [-50, 0] : [50, 0]
  );

  return (
    <motion.div
      style={{ opacity, x }}
      className={`absolute top-1/2 -translate-y-1/2 max-w-xs md:max-w-sm pointer-events-none ${
        chapter.side === "left"
          ? "left-6 md:left-20"
          : "right-6 md:right-20 text-right"
      }`}
    >
      <span
        className={`block text-7xl md:text-8xl font-bold ${chapter.accent} opacity-25 leading-none mb-2 select-none`}
      >
        {chapter.number}
      </span>
      <span
        className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border mb-3 ${chapter.chipClass}`}
      >
        {chapter.status}
      </span>
      <h3 className="text-4xl md:text-5xl font-bold text-white mb-3">
        {chapter.title}
      </h3>
      <p className="text-white/60 text-sm md:text-base leading-relaxed mb-3">
        {chapter.description}
      </p>
      <p className={`text-xs font-mono ${chapter.accent} opacity-80`}>
        {chapter.tags}
      </p>
    </motion.div>
  );
}

/* -------------------------------- Showcase -------------------------------- */

export default function Showcase3D() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  // Progreso de scroll medido a mano con rAF: useScroll de framer cachea la
  // posición de la sección y queda desfasado si el layout cambia después de
  // montar; medir por frame evita eso y cualquier pérdida de eventos scroll.
  const scrollYProgress = useMotionValue(0);

  useEffect(() => {
    setMounted(true);
    let raf = 0;
    const loop = () => {
      const el = sectionRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
        scrollYProgress.set(p);
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [scrollYProgress]);

  const hintOpacity = useTransform(scrollYProgress, [0.03, 0.1], [1, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.88, 0.96], [0, 1]);
  const railScale = scrollYProgress;

  return (
    <section ref={sectionRef} id="showcase" className="relative h-[400vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {mounted && (
          <Canvas
            camera={{ position: [0, 1.1, 7.5], fov: 50 }}
            dpr={[1, 1.75]}
            gl={{ antialias: true, alpha: true }}
            className="absolute inset-0"
          >
            <Scene progress={scrollYProgress} />
          </Canvas>
        )}

        {/* viñeta para integrar el canvas con el fondo de la página */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_55%,#07070f_100%)]" />
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#07070f] to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#07070f] to-transparent pointer-events-none" />

        {/* hint inicial */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute top-10 inset-x-0 text-center pointer-events-none"
        >
          <p className="text-sm text-violet-400 font-medium tracking-widest uppercase mb-1">
            Recorrido 3D
          </p>
          <p className="text-white/40 text-sm">
            Scrolleá para viajar entre proyectos ↓
          </p>
        </motion.div>

        {/* capítulos */}
        {CHAPTERS.map((c) => (
          <ChapterOverlay key={c.number} chapter={c} progress={scrollYProgress} />
        ))}

        {/* riel de progreso */}
        <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-0 pointer-events-none">
          <div className="relative w-px h-40 bg-white/10 overflow-hidden rounded-full">
            <motion.div
              style={{ scaleY: railScale }}
              className="absolute inset-0 origin-top bg-gradient-to-b from-violet-500 via-cyan-400 to-amber-400"
            />
          </div>
        </div>

        {/* CTA final */}
        <motion.div
          style={{ opacity: ctaOpacity }}
          className="absolute bottom-10 inset-x-0 text-center"
        >
          <a
            href="#projects"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors border border-white/10 hover:border-white/25 rounded-full px-5 py-2.5 bg-white/[0.03]"
          >
            Ver detalles de cada proyecto ↓
          </a>
        </motion.div>
      </div>
    </section>
  );
}
