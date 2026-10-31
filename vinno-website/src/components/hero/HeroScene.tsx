"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Globe() {
  const group = useRef<THREE.Group>(null);
  const positions = useMemo(() => {
    const count = 72;
    const array = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const y = 1 - (index / (count - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = Math.PI * (3 - Math.sqrt(5)) * index;
      array[index * 3] = Math.cos(theta) * radius * 1.35;
      array[index * 3 + 1] = y * 1.35;
      array[index * 3 + 2] = Math.sin(theta) * radius * 1.35;
    }
    return array;
  }, []);

  const points = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [positions]);

  const links = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const segments: number[] = [];
    for (let index = 0; index < 28; index += 1) {
      const start = index;
      const end = (index * 11) % 72;
      segments.push(positions[start * 3], positions[start * 3 + 1], positions[start * 3 + 2], positions[end * 3], positions[end * 3 + 1], positions[end * 3 + 2]);
    }
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(segments, 3));
    return geometry;
  }, [positions]);

  const helix = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const segments: number[] = [];
    const steps = 48;
    for (let index = 0; index < steps; index += 1) {
      const t0 = (index / steps) * Math.PI * 6;
      const t1 = ((index + 1) / steps) * Math.PI * 6;
      const y0 = (index / steps) * 1.7 - 0.85;
      const y1 = ((index + 1) / steps) * 1.7 - 0.85;
      segments.push(Math.cos(t0) * 0.22, y0, Math.sin(t0) * 0.22, Math.cos(t1) * 0.22, y1, Math.sin(t1) * 0.22);
      segments.push(Math.cos(t0 + Math.PI) * 0.22, y0, Math.sin(t0 + Math.PI) * 0.22, Math.cos(t1 + Math.PI) * 0.22, y1, Math.sin(t1 + Math.PI) * 0.22);
    }
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(segments, 3));
    return geometry;
  }, []);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.08;
  });

  return (
    <group rotation={[0.35, 0.2, 0]}>
      <group ref={group}>
        <mesh>
          <sphereGeometry args={[1.35, 40, 28]} />
          <meshBasicMaterial color="#46C8E8" wireframe transparent opacity={0.16} />
        </mesh>
        <points geometry={points}>
          <pointsMaterial color="#67E0D1" size={0.035} sizeAttenuation transparent opacity={0.9} />
        </points>
        <lineSegments geometry={links}>
          <lineBasicMaterial color="#7A9FE8" transparent opacity={0.38} />
        </lineSegments>
      </group>
      <lineSegments geometry={helix} position={[2.05, 0.1, 0]} scale={0.85}>
        <lineBasicMaterial color="#46C8E8" transparent opacity={0.55} />
      </lineSegments>
    </group>
  );
}

export function HeroScene({ frameloop }: { frameloop: "always" | "never" }) {
  return (
    <Canvas camera={{ position: [0, 0, 4.4], fov: 35 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} frameloop={frameloop}>
      <Globe />
    </Canvas>
  );
}
