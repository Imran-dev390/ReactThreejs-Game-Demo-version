interface CoverProps {
  position: [number, number, number];
}

export default function Cover({
  position,
}: CoverProps) {
  return (
    <group position={position}>

      {/* Concrete barrier */}
      <mesh castShadow>
        <boxGeometry
          args={[4, 1.4, 0.8]}
        />

        <meshStandardMaterial
          color="#454b55"
          roughness={0.9}
        />
      </mesh>

      {/* Neon strip */}
      <mesh
        position={[0, 0.45, -0.41]}
      >
        <boxGeometry
          args={[3.2, 0.08, 0.03]}
        />

        <meshStandardMaterial
          color="#00eaff"
          emissive="#00eaff"
          emissiveIntensity={4}
        />
      </mesh>

    </group>
  );
}