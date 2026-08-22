import { Canvas } from "@react-three/fiber";
//import { PerspectiveCamera } from "@react-three/drei";

import Player from "./Player";
import CityMap from "./CityMap";

export default function Game() {
  return (
    <Canvas
      shadows
      camera={{
        position: [0, 6, 12],
        fov: 60,
        near: 0.1,
        far: 200,
      }}
    >
      {/* Background */}
      <color attach="background" args={["#050812"]} />

      {/* Fog */}
      <fog
        attach="fog"
        args={["#050812", 25, 100]}
      />

      {/* Lighting */}
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

      {/* Map */}
      <CityMap />

      {/* Player */}
      <Player />
    </Canvas>
  );
}