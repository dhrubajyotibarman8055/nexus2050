import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function Rings({ reduce }: { reduce: boolean }) {
  const group = useRef<THREE.Group>(null);
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  const c = useRef<THREE.Mesh>(null);

  useFrame((state, dt) => {
    if (!group.current) return;
    const { x, y } = state.pointer;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.35, 0.05);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y * 0.25, 0.05);
    if (reduce) return;
    if (a.current) a.current.rotation.z += dt * 0.25;
    if (b.current) b.current.rotation.z -= dt * 0.18;
    if (c.current) c.current.rotation.y += dt * 0.3;
  });

  return (
    <group ref={group}>
      <mesh ref={a} rotation={[Math.PI / 2.6, 0, 0]}>
        <torusGeometry args={[2.6, 0.008, 8, 160]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.8} />
      </mesh>
      <mesh ref={b} rotation={[Math.PI / 2.1, 0.5, 0]}>
        <torusGeometry args={[3.1, 0.006, 8, 160]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.8} />
      </mesh>
      <mesh ref={c} rotation={[0.3, 0, 0.6]}>
        <torusGeometry args={[3.6, 0.004, 8, 6]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.35} />
      </mesh>
      <Float speed={1.6} rotationIntensity={1.4} floatIntensity={1.5}>
        <mesh position={[-3.2, 1.6, 0.5]}>
          <icosahedronGeometry args={[0.28, 0]} />
          <meshBasicMaterial color="#00f0ff" wireframe />
        </mesh>
      </Float>
      <Float speed={1.2} rotationIntensity={2} floatIntensity={2}>
        <mesh position={[3.3, -1.5, 0.8]}>
          <octahedronGeometry args={[0.36, 0]} />
          <meshBasicMaterial color="#8b5cf6" wireframe />
        </mesh>
      </Float>
      <Float speed={2} rotationIntensity={2} floatIntensity={1}>
        <mesh position={[2.8, 2.2, -0.4]}>
          <tetrahedronGeometry args={[0.22, 0]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      </Float>
    </group>
  );
}

function Particles({ count, reduce }: { count: number; reduce: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2 + Math.random() * 5;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(ph) * Math.cos(th);
      arr[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      arr[i * 3 + 2] = r * Math.cos(ph) - 1;
    }
    return arr;
  }, [count]);

  useFrame((state, dt) => {
    if (!ref.current) return;
    if (!reduce) ref.current.rotation.y += dt * 0.04;
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, state.pointer.y * 0.12, 0.04);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#00f0ff" size={0.035} sizeAttenuation transparent opacity={0.75} depthWrite={false} />
    </points>
  );
}

export default function HeroScene({ reduce, mobile }: { reduce: boolean; mobile: boolean }) {
  return (
    <Canvas
      dpr={[1, mobile ? 1.25 : 1.75]}
      camera={{ position: [0, 0, 7], fov: 50 }}
      gl={{ alpha: true, antialias: !mobile, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
      aria-hidden
    >
      <Rings reduce={reduce} />
      <Particles count={mobile ? 350 : 900} reduce={reduce} />
    </Canvas>
  );
}
