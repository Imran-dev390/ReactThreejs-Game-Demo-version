interface SpawnZoneProps {
  position: [number, number, number];
}

export default function SpawnZone({
  position,
}: SpawnZoneProps) {
  return (
    <group position={position}>

      <mesh
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
      >
        <circleGeometry
          args={[3, 32]}
        />

        <meshBasicMaterial
          color="#ff1744"
          transparent
          opacity={0.12}
        />
      </mesh>

      <pointLight
        color="#ff1744"
        intensity={5}
        distance={8}
      />

      <mesh>
        <torusGeometry
          args={[2.5, 0.08, 12, 32]}
        />

        <meshStandardMaterial
          color="#ff1744"
          emissive="#ff1744"
          emissiveIntensity={4}
        />
      </mesh>

    </group>
  );
}