"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Stars,
  Sparkles,
  Trail,
  Line,
  Instances,
  Instance,
  Text,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
} from "@react-three/postprocessing";
import * as THREE from "three";

/* ---------------------------------------------------------------------------
 * Recorrido: la cámara viaja entre 3 estaciones (una por proyecto) separadas
 * STATION_GAP unidades en X. stationCoord mapea el progreso de scroll [0,1]
 * a una coordenada continua de estación [0,2] con pausas en cada una.
 * Durante el viaje se activa el "modo warp": FOV abierto, roll de cámara,
 * líneas de velocidad y portales de anillos.
 * ------------------------------------------------------------------------- */

const STATION_GAP = 14;

function smoothstep(x: number) {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
}

function stationCoord(p: number) {
  return smoothstep((p - 0.26) / 0.14) + smoothstep((p - 0.6) / 0.14);
}

// intensidad del warp: 0 en estaciones, 1 en pleno viaje
function warpAmount(p: number) {
  const s = stationCoord(p);
  const f = s <= 1 ? s : s - 1;
  return Math.sin(f * Math.PI);
}

function CameraRig({ progress }: { progress: MotionValue<number> }) {
  useFrame(({ camera, clock, pointer }) => {
    const p = progress.get();
    const s = stationCoord(p);
    const f = s <= 1 ? s : s - 1;
    const travel = Math.sin(f * Math.PI);
    const t = clock.elapsedTime;
    // plano final: la cámara se retira y revela las tres estaciones juntas
    const reveal = smoothstep((p - 0.84) / 0.13);

    const shake = travel * 0.07;
    const baseX =
      s * STATION_GAP +
      Math.sin(t * 0.3) * 0.15 +
      pointer.x * 0.5 +
      Math.sin(t * 13.7) * shake;
    const baseY =
      1.1 +
      travel * 1.5 +
      Math.sin(t * 0.5) * 0.08 +
      pointer.y * 0.35 +
      Math.sin(t * 17.3) * shake;
    const baseZ = 7.5 - travel * 2.4;

    camera.position.x = THREE.MathUtils.lerp(baseX, STATION_GAP, reveal);
    camera.position.y = THREE.MathUtils.lerp(baseY, 6, reveal);
    camera.position.z = THREE.MathUtils.lerp(baseZ, 26, reveal);
    camera.lookAt(
      THREE.MathUtils.lerp(s * STATION_GAP, STATION_GAP, reveal),
      THREE.MathUtils.lerp(0.2, 0.8, reveal),
      0
    );

    // roll de banking durante el viaje + golpe de FOV estilo hipervelocidad
    camera.rotateZ(travel * 0.3 * Math.sin(f * Math.PI * 2));
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = 50 + travel * 22 + reveal * 10;
    cam.updateProjectionMatrix();
  });
  return null;
}

/* ------------------------- Warp: líneas de velocidad ---------------------- */

function WarpLines({
  progress,
  count,
}: {
  progress: MotionValue<number>;
  count: number;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        y: (Math.random() - 0.5) * 18,
        z: (Math.random() - 0.5) * 18,
        x: Math.random() * 60,
        speed: 20 + Math.random() * 30,
        len: 1.5 + Math.random() * 3,
      })),
    [count]
  );

  useFrame(({ clock, camera }) => {
    const travel = warpAmount(progress.get());
    if (mat.current) mat.current.opacity = travel * 0.85;
    if (!mesh.current) return;
    const t = clock.elapsedTime;
    seeds.forEach((sd, i) => {
      const cycle = (((sd.x - t * sd.speed) % 60) + 60) % 60;
      dummy.position.set(camera.position.x + cycle - 30, sd.y, sd.z);
      dummy.scale.set(sd.len * (1 + travel * 4), 0.025, 0.025);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh key={count} ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial
        ref={mat}
        color="#b4a5ff"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

/* -------------------- Portales de anillos entre estaciones ---------------- */

function GateRings({ x, color }: { x: number; color: string }) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.children.forEach((ring, i) => {
      ring.rotation.z = clock.elapsedTime * (0.4 + i * 0.2) * (i % 2 ? 1 : -1);
    });
  });

  // la cámara pasa por (x, ~2.4, ~5.2) en pleno viaje: los anillos la rodean
  return (
    <group ref={group} position={[x, 2.4, 5.2]} rotation={[0, Math.PI / 2, 0]}>
      {[3.0, 3.8, 4.6].map((r, i) => (
        <mesh key={i} position={[0, 0, (i - 1) * 2.2]}>
          <torusGeometry args={[r, 0.07, 6, 8]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2.4}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
    </group>
  );
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
          emissiveIntensity={0.6}
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
        <cylinderGeometry
          args={[radius * 0.3, radius * 0.3, radius * 0.4, 24]}
        />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>
    </group>
  );
}

function TallerStation() {
  const main = useRef<THREE.Group>(null);
  const small = useRef<THREE.Group>(null);
  const back = useRef<THREE.Group>(null);
  const bolts = useRef<THREE.Group>(null);
  const piston = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (main.current) main.current.rotation.z = t * 0.25;
    if (small.current) small.current.rotation.z = -t * 0.45 + 0.3;
    if (back.current) back.current.rotation.z = t * 0.18 + 1.2;
    if (bolts.current) bolts.current.rotation.z = -t * 0.08;
    if (piston.current) piston.current.position.y = -1.3 + Math.sin(t * 2.4) * 0.45;
  });

  return (
    <group>
      <group ref={main} rotation={[0.15, -0.25, 0]}>
        <Gear color="#7c5cf0" emissive="#8b5cf6" />
      </group>
      <group
        ref={small}
        position={[2.6, 1.8, -0.5]}
        scale={0.5}
        rotation={[0.15, -0.25, 0]}
      >
        <Gear color="#5b48b8" emissive="#8b5cf6" teeth={8} />
      </group>
      <group
        ref={back}
        position={[-2.9, 1.2, -2.2]}
        scale={0.8}
        rotation={[0.3, 0.4, 0]}
      >
        <Gear color="#4c3d99" emissive="#7c3aed" teeth={12} />
      </group>

      {/* pistón en tubo de vidrio */}
      <group position={[-2.7, -1.0, 0.6]}>
        <mesh>
          <cylinderGeometry args={[0.5, 0.5, 2.4, 24, 1, true]} />
          <meshStandardMaterial
            color="#a78bfa"
            transparent
            opacity={0.12}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh ref={piston} position={[0, -1.3, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.6, 24]} />
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#8b5cf6"
            emissiveIntensity={1.4}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      </group>

      <group ref={bolts}>
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 3.6, Math.sin(a) * 3.6, -0.8]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <cylinderGeometry args={[0.15, 0.15, 0.12, 6]} />
              <meshStandardMaterial
                color="#6d5bd0"
                emissive="#8b5cf6"
                emissiveIntensity={0.8}
                metalness={0.9}
                roughness={0.3}
              />
            </mesh>
          );
        })}
      </group>
      <pointLight
        position={[2, 3, 3]}
        intensity={50}
        distance={14}
        color="#8b5cf6"
      />
      <Sparkles count={50} scale={[10, 6, 6]} size={2.5} speed={0.3} color="#a78bfa" />
    </group>
  );
}

/* ----------------------------- Estación 02: Orion ------------------------- */

function AsteroidBelt({ count }: { count: number }) {
  const belt = useRef<THREE.Group>(null);
  const rocks = useMemo(
    () =>
      Array.from({ length: count }, () => {
        const a = Math.random() * Math.PI * 2;
        const r = 3.4 + Math.random() * 1.3;
        return {
          pos: [Math.cos(a) * r, (Math.random() - 0.5) * 0.55, Math.sin(a) * r] as [
            number,
            number,
            number
          ],
          scale: 0.05 + Math.random() * 0.15,
          rot: [Math.random() * Math.PI, a, 0] as [number, number, number],
        };
      }),
    [count]
  );

  useFrame(({ clock }) => {
    if (belt.current) belt.current.rotation.y = clock.elapsedTime * 0.05;
  });

  return (
    <group ref={belt} rotation={[0.45, 0, 0.15]}>
      <Instances key={count} limit={count}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#155e75"
          emissive="#0891b2"
          emissiveIntensity={0.5}
          roughness={0.7}
        />
        {rocks.map((r, i) => (
          <Instance key={i} position={r.pos} scale={r.scale} rotation={r.rot} />
        ))}
      </Instances>
    </group>
  );
}

function OrionStation({ asteroids }: { asteroids: number }) {
  const planet = useRef<THREE.Mesh>(null);
  const rings = useRef<THREE.Group>(null);
  const moon = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (planet.current) planet.current.rotation.y = t * 0.15;
    if (rings.current) rings.current.rotation.z = t * 0.05;
    if (moon.current) {
      moon.current.position.x = Math.cos(t * 0.55) * 2.9;
      moon.current.position.z = Math.sin(t * 0.55) * 2.9;
      moon.current.position.y = Math.sin(t * 0.55) * 0.6;
    }
  });

  return (
    <group position={[STATION_GAP, 0, 0]}>
      <mesh ref={planet}>
        <sphereGeometry args={[1.4, 48, 48]} />
        <meshStandardMaterial
          color="#0b3a4a"
          emissive="#06b6d4"
          emissiveIntensity={0.5}
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
            emissiveIntensity={2.2}
            transparent
            opacity={0.8}
          />
        </mesh>
        <mesh>
          <torusGeometry args={[2.7, 0.02, 8, 80]} />
          <meshStandardMaterial
            color="#67e8f9"
            emissive="#67e8f9"
            emissiveIntensity={1.6}
            transparent
            opacity={0.5}
          />
        </mesh>
      </group>
      <Trail
        width={1.6}
        length={7}
        color="#67e8f9"
        attenuation={(w) => w * w}
      >
        <mesh ref={moon}>
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshStandardMaterial
            color="#a5f3fc"
            emissive="#67e8f9"
            emissiveIntensity={2.5}
          />
        </mesh>
      </Trail>
      <AsteroidBelt count={asteroids} />
      <pointLight
        position={[2, 3, 4]}
        intensity={55}
        distance={15}
        color="#06b6d4"
      />
      <Sparkles count={70} scale={[11, 7, 7]} size={2.5} speed={0.25} color="#67e8f9" />
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

const PRICE_POINTS = CANDLES.map(
  ([, close], i) =>
    new THREE.Vector3((i - (CANDLES.length - 1) / 2) * 0.52, close, 0.25)
);

function TradingStation({ progress }: { progress: MotionValue<number> }) {
  const sway = useRef<THREE.Group>(null);
  const candles = useRef<(THREE.Group | null)[]>([]);

  useFrame(({ clock }) => {
    if (sway.current) {
      sway.current.rotation.y = Math.sin(clock.elapsedTime * 0.2) * 0.12;
    }
    // las velas crecen en cascada cuando la cámara llega a la estación
    const s = stationCoord(progress.get());
    candles.current.forEach((c, i) => {
      if (!c) return;
      const grow = smoothstep((s - 1.45 - i * 0.022) / 0.3);
      c.scale.y = Math.max(grow, 0.001);
    });
  });

  return (
    <group position={[STATION_GAP * 2, 0, 0]}>
      <group ref={sway} position={[0, -1.6, 0]}>
        {CANDLES.map(([open, close], i) => {
          const up = close >= open;
          const body = Math.abs(close - open);
          const mid = (open + close) / 2;
          const x = (i - (CANDLES.length - 1) / 2) * 0.52;
          const color = up ? "#10b981" : "#f43f5e";
          return (
            <group
              key={i}
              position={[x, 0, 0]}
              ref={(el) => {
                candles.current[i] = el;
              }}
            >
              <mesh position={[0, mid, 0]}>
                <boxGeometry args={[0.3, Math.max(body, 0.12), 0.3]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={1.2}
                  metalness={0.4}
                  roughness={0.4}
                />
              </mesh>
              <mesh position={[0, mid, 0]}>
                <boxGeometry args={[0.05, body + 0.5, 0.05]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={1.8}
                  transparent
                  opacity={0.85}
                />
              </mesh>
            </group>
          );
        })}
        <Line
          points={PRICE_POINTS}
          color="#34d399"
          lineWidth={2.5}
          transparent
          opacity={0.85}
        />
        <gridHelper
          args={[12, 20, "#92600a", "#1c1c20"]}
          position={[0, -0.05, 0]}
        />
      </group>
      <pointLight
        position={[0, 4, 4]}
        intensity={45}
        distance={15}
        color="#f59e0b"
      />
      <Sparkles count={50} scale={[10, 6, 6]} size={2} speed={0.3} color="#fbbf24" />
    </group>
  );
}

/* ----------------------- Atmósfera: nebulosas y títulos ------------------- */

function useGlowTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "rgba(255,255,255,0.8)");
    g.addColorStop(0.4, "rgba(255,255,255,0.25)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }, []);
}

function Nebula({ x, color }: { x: number; color: string }) {
  const map = useGlowTexture();
  return (
    <sprite position={[x, 1.2, -7]} scale={[18, 12, 1]}>
      <spriteMaterial
        map={map}
        color={color}
        transparent
        opacity={0.22}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </sprite>
  );
}

function FloatingTitle({
  text,
  x,
  color,
}: {
  text: string;
  x: number;
  color: string;
}) {
  return (
    <Text
      position={[x, 3.2, -4.5]}
      fontSize={1.9}
      color={color}
      fillOpacity={0.13}
      letterSpacing={0.12}
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  );
}

/* --------------------------------- Escena --------------------------------- */

function Scene({
  progress,
  lite,
}: {
  progress: MotionValue<number>;
  lite: boolean;
}) {
  return (
    <>
      <fog attach="fog" args={["#07070f", 13, 55]} />
      <ambientLight intensity={0.3} />
      <Stars
        radius={90}
        depth={50}
        count={lite ? 1800 : 3000}
        factor={4}
        saturation={0}
        fade
      />
      <CameraRig progress={progress} />
      <WarpLines progress={progress} count={lite ? 70 : 140} />
      <GateRings x={STATION_GAP * 0.5} color="#22d3ee" />
      <GateRings x={STATION_GAP * 1.5} color="#fbbf24" />
      <Nebula x={0} color="#8b5cf6" />
      <Nebula x={STATION_GAP} color="#06b6d4" />
      <Nebula x={STATION_GAP * 2} color="#f59e0b" />
      <FloatingTitle text="TALLERPRO" x={0} color="#a78bfa" />
      <FloatingTitle text="ORION" x={STATION_GAP} color="#67e8f9" />
      <FloatingTitle text="TRADINGBOT" x={STATION_GAP * 2} color="#fbbf24" />
      <TallerStation />
      <OrionStation asteroids={lite ? 45 : 90} />
      <TradingStation progress={progress} />
      <EffectComposer>
        <Bloom
          intensity={1.15}
          luminanceThreshold={0.18}
          luminanceSmoothing={0.85}
          mipmapBlur
        />
        <ChromaticAberration offset={new THREE.Vector2(0.0012, 0.0006)} />
        <Noise opacity={0.04} />
      </EffectComposer>
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
    range: [0.7, 0.76, 0.8, 0.86],
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
  const opacity = useTransform(
    progress,
    [a, b, c, d],
    [0, 1, 1, d === 1 ? 1 : 0]
  );
  const x = useTransform(
    progress,
    [a, b],
    chapter.side === "left" ? [-60, 0] : [60, 0]
  );
  const filter = useTransform(
    progress,
    [a, b],
    ["blur(14px)", "blur(0px)"]
  );
  const scale = useTransform(progress, [a, b], [0.92, 1]);

  return (
    <motion.div
      style={{ opacity, x, filter, scale }}
      className={`absolute top-1/2 -translate-y-1/2 max-w-xs md:max-w-sm pointer-events-none ${
        chapter.side === "left"
          ? "left-6 md:left-20"
          : "right-6 md:right-20 text-right"
      }`}
    >
      <span
        className={`block text-7xl md:text-9xl font-bold ${chapter.accent} opacity-25 leading-none mb-2 select-none`}
      >
        {chapter.number}
      </span>
      <span
        className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border mb-3 ${chapter.chipClass}`}
      >
        {chapter.status}
      </span>
      <h3 className="text-4xl md:text-6xl font-bold text-white mb-3">
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
  const [lite, setLite] = useState(false);

  // Progreso de scroll medido a mano con rAF: useScroll de framer cachea la
  // posición de la sección y queda desfasado si el layout cambia después de
  // montar; medir por frame evita eso y cualquier pérdida de eventos scroll.
  const scrollYProgress = useMotionValue(0);

  useEffect(() => {
    setMounted(true);
    setLite(window.innerWidth < 768);
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
  const finaleOpacity = useTransform(scrollYProgress, [0.9, 0.96], [0, 1]);
  const finaleY = useTransform(scrollYProgress, [0.9, 0.98], [30, 0]);
  const railScale = scrollYProgress;
  // tinte ambiental que acompaña la estación actual
  const wash = useTransform(
    scrollYProgress,
    [0.12, 0.5, 0.88],
    ["rgba(139, 92, 246, 0.08)", "rgba(6, 182, 212, 0.08)", "rgba(245, 158, 11, 0.08)"]
  );

  return (
    <section ref={sectionRef} id="showcase" className="relative h-[450vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {mounted && (
          <Canvas
            camera={{ position: [0, 1.1, 7.5], fov: 50 }}
            dpr={lite ? [1, 1.2] : [1, 1.5]}
            gl={{ antialias: true, alpha: true }}
            className="absolute inset-0"
          >
            <Scene progress={scrollYProgress} lite={lite} />
          </Canvas>
        )}

        {/* tinte de color según estación + viñeta para integrar con la página */}
        <motion.div
          style={{ background: wash }}
          className="absolute inset-0 pointer-events-none mix-blend-screen"
        />
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
            Scrolleá para iniciar el viaje ↓
          </p>
        </motion.div>

        {/* capítulos */}
        {CHAPTERS.map((c) => (
          <ChapterOverlay
            key={c.number}
            chapter={c}
            progress={scrollYProgress}
          />
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

        {/* final: plano abierto con las tres estaciones + tagline */}
        <motion.div
          style={{ opacity: finaleOpacity, y: finaleY }}
          className="absolute bottom-12 inset-x-0 text-center px-6"
        >
          <p className="text-3xl md:text-5xl font-bold text-white mb-3">
            Tres productos reales.
          </p>
          <p className="text-white/50 text-sm md:text-base mb-7">
            Construidos con IA, resolviendo problemas concretos.
          </p>
          <a
            href="#projects"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors border border-white/15 hover:border-white/35 rounded-full px-6 py-3 bg-white/[0.04]"
          >
            Ver detalles de cada proyecto ↓
          </a>
        </motion.div>
      </div>
    </section>
  );
}
