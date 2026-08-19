import Building from "./Building";
import Road from "./Road";
import Cover from "./Cover";
import SpawnZone from "./SpawnZone";

export default function CityMap() {
  return (
    <group>

      {/* Ground */}
      <mesh
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
        receiveShadow
      >
        <planeGeometry
          args={[90, 90]}
        />

        <meshStandardMaterial
          color="#090d16"
          roughness={0.85}
          metalness={0.1}
        />
      </mesh>

      {/* Main roads */}
      <Road
        position={[0, 0.02, 0]}
        size={[90, 8]}
      />

      <Road
        position={[0, 0.025, -20]}
        size={[90, 7]}
      />

      <Road
        position={[0, 0.03, 20]}
        size={[90, 7]}
      />

      <Road
        position={[0, 0.035, 0]}
        size={[7, 90]}
        rotation={Math.PI / 2}
      />

      {/* Downtown buildings */}
      <Building
        position={[-15, 4, -12]}
        size={[10, 8, 10]}
      />

      <Building
        position={[15, 5, -12]}
        size={[9, 10, 9]}
      />

      <Building
        position={[-15, 3, 12]}
        size={[11, 6, 10]}
      />

      <Building
        position={[15, 4, 12]}
        size={[10, 8, 10]}
      />

      {/* Central tower */}
      <Building
        position={[0, 6, -32]}
        size={[14, 12, 10]}
      />

      {/* Industrial buildings */}
      <Building
        position={[-30, 3, -2]}
        size={[9, 6, 14]}
      />

      <Building
        position={[30, 3, -2]}
        size={[9, 6, 14]}
      />

      {/* Cover */}
      <Cover position={[-6, 0.7, 8]} />

      <Cover position={[6, 0.7, 8]} />

      <Cover position={[-8, 0.7, -7]} />

      <Cover position={[8, 0.7, -7]} />

      <Cover position={[-25, 0.7, 18]} />

      <Cover position={[25, 0.7, 18]} />

      {/* Enemy zones */}
      <SpawnZone position={[-28, 0.1, -28]} />

      <SpawnZone position={[28, 0.1, -28]} />

      <SpawnZone position={[28, 0.1, 28]} />

      {/* Street lights */}
      <StreetLight position={[-5, 0, -10]} />
      <StreetLight position={[5, 0, -10]} />

      <StreetLight position={[-5, 0, 10]} />
      <StreetLight position={[5, 0, 10]} />

    </group>
  );
}

function StreetLight({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>

      <mesh
        position={[0, 2.5, 0]}
      >
        <cylinderGeometry
          args={[0.06, 0.06, 5, 8]}
        />

        <meshStandardMaterial
          color="#222936"
        />
      </mesh>

      <pointLight
        position={[0, 5, 0]}
        color="#ffcc66"
        intensity={8}
        distance={10}
      />

      <mesh
        position={[0, 5, 0]}
      >
        <sphereGeometry
          args={[0.12, 12, 12]}
        />

        <meshStandardMaterial
          color="#fff2b0"
          emissive="#ffaa33"
          emissiveIntensity={8}
        />
      </mesh>

    </group>
  );
}