interface RoadProps {
  position: [number, number, number];
  size: [number, number];
  rotation?: number;
}

export default function Road({
  position,
  size,
  rotation = 0,
}: RoadProps) {
  return (
    <group
      position={position}
      rotation={[0, rotation, 0]}
    >

      <mesh
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
        receiveShadow
      >
        <planeGeometry
          args={size}
        />

        <meshStandardMaterial
          color="#11151e"
          roughness={0.9}
        />
      </mesh>

      {/* Center road markings */}

      {Array.from({
        length: 12,
      }).map((_, index) => (
        <mesh
          key={index}
          position={[
            -size[0] / 2 +
              4 +
              index * 8,
            0.03,
            0,
          ]}
          rotation={[
            -Math.PI / 2,
            0,
            0,
          ]}
        >
          <planeGeometry
            args={[3, 0.12]}
          />

          <meshBasicMaterial
            color="#ffd54a"
          />
        </mesh>
      ))}

    </group>
  );
}