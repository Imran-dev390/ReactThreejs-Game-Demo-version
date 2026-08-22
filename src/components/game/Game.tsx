import React from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

import Player from "./Player";
import CityMap from "./CityMap";
import Enemy from "./Enemy";

type GameProps = {
  health: number;
  setHealth: React.Dispatch<React.SetStateAction<number>>;
  ammo: number;
  setAmmo: React.Dispatch<React.SetStateAction<number>>;
};


export default function Game({
  health,
  setHealth,
  ammo,
  setAmmo,
}: GameProps) {
  const playerPosition =
    React.useRef(new THREE.Vector3(0, 1, 15));

  return (
    <Canvas
      shadows
      camera={{
        position: [0, 6, 12],
        fov: 60,
        near: 0.1,
        far: 200,
      }}
      gl={{
        antialias: true,
      }}
    >
      <color
        attach="background"
        args={["#050812"]}
      />

      <fog
        attach="fog"
        args={["#050812", 25, 100]}
      />

      <ambientLight intensity={1} />

      <directionalLight
        position={[10, 20, 10]}
        intensity={3}
        castShadow
      />

      <pointLight
        position={[0, 10, 0]}
        intensity={20}
        color="#00aaff"
      />

      <CityMap />

      <Player
        health={health}
        setHealth={setHealth}
        ammo={ammo}
        setAmmo={setAmmo}
        playerPosition={playerPosition}
      />

      {/* ENEMIES */}
      <Enemy
        position={[-12, 1, -8]}
        playerPosition={playerPosition}
        setHealth={setHealth}
      />

      <Enemy
        position={[12, 1, -12]}
        playerPosition={playerPosition}
        setHealth={setHealth}
      />

      <Enemy
        position={[-20, 1, 8]}
        playerPosition={playerPosition}
        setHealth={setHealth}
      />

      <Enemy
        position={[20, 1, 5]}
        playerPosition={playerPosition}
        setHealth={setHealth}
      />
    </Canvas>
  );
}