interface BuildingProps {
  position: [number, number, number];
  size: [number, number, number];
}

export default function Building({
  position,
  size,
}: BuildingProps) {
  return (
    <group position={position}>

      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />

        <meshStandardMaterial
          color="#121a2b"
          metalness={0.65}
          roughness={0.3}
        />
      </mesh>

      {/* Roof */}
      <mesh
        position={[
          0,
          size[1] / 2 + 0.15,
          0,
        ]}
      >
        <boxGeometry
          args={[
            size[0] + 0.3,
            0.3,
            size[2] + 0.3,
          ]}
        />

        <meshStandardMaterial
          color="#05070c"
          metalness={0.9}
        />
      </mesh>

      {/* Windows */}
      {Array.from({
        length: 4,
      }).map((_, index) => (
        <mesh
          key={index}
          position={[
            -size[0] / 2 +
              1.2 +
              index * 2,
            1,
            -size[2] / 2 - 0.03,
          ]}
        >
          <boxGeometry
            args={[0.8, 1.1, 0.05]}
          />

          <meshStandardMaterial
            color="#00c8ff"
            emissive="#0088aa"
            emissiveIntensity={2}
          />
        </mesh>
      ))}

    </group>
  );
}