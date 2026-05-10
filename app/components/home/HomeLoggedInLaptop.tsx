"use client";

import Link from "next/link";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import { Center, Resize } from "@react-three/drei";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import * as THREE from "three";
import type { Group, Mesh } from "three";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

const MODEL_URL = "/Laptop%20Model.obj";

/** Kąt (stopnie) między ścianami, powyżej którego rysowana jest krawędź — filtruje „szum” triangulacji. */
const EDGE_THRESHOLD_DEG = 28;

const invisibleSurfaceMat = new THREE.MeshBasicMaterial({
  opacity: 0,
  transparent: true,
  depthWrite: false,
});

function applyWhiteEdgesOnly(root: THREE.Object3D) {
  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh || !mesh.geometry) return;

    const edgesGeom = new THREE.EdgesGeometry(mesh.geometry, EDGE_THRESHOLD_DEG);
    const lines = new THREE.LineSegments(
      edgesGeom,
      new THREE.LineBasicMaterial({ color: 0xffffff }),
    );
    mesh.add(lines);

    if (Array.isArray(mesh.material)) {
      mesh.material = mesh.material.map(() => invisibleSurfaceMat.clone());
    } else {
      mesh.material = invisibleSurfaceMat.clone();
    }
  });
}

function LoadingPlaceholder() {
  const groupRef = useRef<Group>(null);
  const edgeGeo = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(0.45, 0.45, 0.45), 18),
    [],
  );
  useFrame((_, delta) => {
    const g = groupRef.current;
    if (g) g.rotation.y += delta * 0.9;
    if (g) g.rotation.x += delta * 0.25;
  });
  return (
    <group ref={groupRef}>
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial color="#ffffff" />
      </lineSegments>
    </group>
  );
}

function RotatingLaptopModel() {
  const pivotRef = useRef<Group>(null);
  const rawObj = useLoader(OBJLoader, MODEL_URL);

  const model = useMemo(() => {
    const root = rawObj.clone(true);
    applyWhiteEdgesOnly(root);
    return root;
  }, [rawObj]);

  useFrame((_, delta) => {
    const pivot = pivotRef.current;
    if (pivot) pivot.rotation.y += delta * 0.42;
  });

  return (
    <group ref={pivotRef}>
      <Resize precise={false}>
        <Center>
          <primitive object={model} dispose={null} />
        </Center>
      </Resize>
    </group>
  );
}

type Props = {
  dictionary: Dictionary;
  locale: Locale;
};

export function HomeLoggedInLaptop({ dictionary, locale }: Props) {
  const copy = dictionary.home;

  return (
    <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/75 p-7 shadow-[0_24px_70px_-38px_rgba(37,99,235,0.5)] backdrop-blur-xl">
      <p className="mb-2 text-xs font-medium tracking-[0.18em] text-blue-300/80 uppercase">
        {copy.loggedInPanelTag}
      </p>
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">{copy.loggedInTitle}</h1>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{copy.loggedInSubtitle}</p>
      <div className="relative mt-6 h-[min(42vh,320px)] w-full min-h-[220px] overflow-hidden rounded-xl bg-zinc-950/60">
        <Canvas
          gl={{ alpha: true, antialias: true }}
          className="h-full w-full touch-none"
          camera={{ position: [0, 0.12, 2.35], fov: 42 }}
        >
          <Suspense fallback={<LoadingPlaceholder />}>
            <RotatingLaptopModel />
          </Suspense>
        </Canvas>
      </div>
      <Link
        href={`/${locale}/dashboard`}
        className={cn(
          buttonVariants({ variant: "default", size: "lg" }),
          "mt-6 h-11 w-full cursor-pointer bg-blue-500 text-zinc-950 hover:bg-blue-400",
        )}
      >
        {copy.loggedInDashboardCta}
      </Link>
    </div>
  );
}
