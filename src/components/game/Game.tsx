import { Canvas } from "@react-three/fiber";

import Player from "./Player";
import CityMap from "./CityMap";

type GameProps = {
  health: number;
  setHealth: React.Dispatch<React.SetStateAction<number>>;
};

export default function Game({
  health,
  setHealth,
}: GameProps) {
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
      <color attach="background" args={["#050812"]} />

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
      />
    </Canvas>
  );
}