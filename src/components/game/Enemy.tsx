import {
  useFrame,
} from "@react-three/fiber";

import {
  useEffect,
  useRef,
} from "react";

import * as THREE from "three";

type EnemyProps = {
  position: [
    number,
    number,
    number
  ];

  playerPosition: React.MutableRefObject<
    THREE.Vector3
  >;

  setHealth: React.Dispatch<
    React.SetStateAction<number>
  >;
};

export default function Enemy({
  position,
  playerPosition,
  setHealth,
}: EnemyProps) {
  const enemyRef =
    useRef<THREE.Group>(null);

  const gunFlash =
    useRef<THREE.PointLight>(null);

  const cooldown =
    useRef(0);

  useEffect(() => {
    const audio = () => {
      try {
        const AudioContext =
          window.AudioContext ||
          (
            window as typeof window & {
              webkitAudioContext?: typeof window.AudioContext;
            }
          ).webkitAudioContext;

        if (!AudioContext) return;

        const ctx =
          new AudioContext();

        const osc =
          ctx.createOscillator();

        const gain =
          ctx.createGain();

        osc.type = "square";

        osc.frequency.setValueAtTime(
          100,
          ctx.currentTime
        );

        osc.frequency.exponentialRampToValueAtTime(
          40,
          ctx.currentTime + 0.12
        );

        gain.gain.setValueAtTime(
          0.12,
          ctx.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + 0.12
        );

        osc.connect(gain);
        gain.connect(
          ctx.destination
        );

        osc.start();
        osc.stop(
          ctx.currentTime + 0.12
        );
      } catch {
        // ignore audio errors
      }
    };

    (
      enemyRef.current as
        | THREE.Group
        | null
    );

    const interval =
      window.setInterval(() => {
        if (
          !enemyRef.current
        ) {
          return;
        }

        const distance =
          enemyRef.current.position.distanceTo(
            playerPosition.current
          );

        if (
          distance < 22
        ) {
          audio();

          setHealth(
            (current) =>
              Math.max(
                0,
                current - 5
              )
          );

          if (
            gunFlash.current
          ) {
            gunFlash.current.intensity = 10;

            setTimeout(() => {
              if (
                gunFlash.current
              ) {
                gunFlash.current.intensity = 0;
              }
            }, 70);
          }
        }
      }, 1800);

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, [
    playerPosition,
    setHealth,
  ]);

  useFrame((_, delta) => {
    if (!enemyRef.current) {
      return;
    }

    const enemy =
      enemyRef.current;

    const target =
      playerPosition.current;

    const direction =
      new THREE.Vector3()
        .subVectors(
          target,
          enemy.position
        );

    direction.y = 0;

    const distance =
      direction.length();

    if (
      distance > 5
    ) {
      direction.normalize();

      enemy.position.x +=
        direction.x *
        1.4 *
        delta;

      enemy.position.z +=
        direction.z *
        1.4 *
        delta;
    }

    const rotation =
      Math.atan2(
        direction.x,
        direction.z
      );

    enemy.rotation.y =
      THREE.MathUtils.lerp(
        enemy.rotation.y,
        rotation,
        0.08
      );

    cooldown.current -=
      delta;
  });

  return (
    <group
      ref={enemyRef}
      position={position}
    >
      {/* BODY */}

      <mesh castShadow>
        <capsuleGeometry
          args={[
            0.5,
            1.2,
            8,
            16,
          ]}
        />

        <meshStandardMaterial
          color="#541b27"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* ARMOR */}

      <mesh
        position={[
          0,
          0.2,
          -0.38,
        ]}
      >
        <boxGeometry
          args={[
            0.8,
            0.85,
            0.25,
          ]}
        />

        <meshStandardMaterial
          color="#260b12"
          metalness={0.8}
          roughness={0.25}
        />
      </mesh>

      {/* HEAD */}

      <mesh
        position={[
          0,
          1.2,
          0,
        ]}
      >
        <sphereGeometry
          args={[
            0.33,
            20,
            20,
          ]}
        />

        <meshStandardMaterial
          color="#722634"
          metalness={0.4}
        />
      </mesh>

      {/* RED VISOR */}

      <mesh
        position={[
          0,
          1.2,
          -0.29,
        ]}
      >
        <boxGeometry
          args={[
            0.46,
            0.15,
            0.04,
          ]}
        />

        <meshStandardMaterial
          color="#ff1e3c"
          emissive="#ff001f"
          emissiveIntensity={6}
        />
      </mesh>

      {/* GUN */}

      <group
        position={[
          0.55,
          0.25,
          -0.5,
        ]}
      >
        <mesh>
          <boxGeometry
            args={[
              0.18,
              0.18,
              1.4,
            ]}
          />

          <meshStandardMaterial
            color="#08080b"
            metalness={1}
          />
        </mesh>

        <mesh
          position={[
            0,
            0,
            -0.8,
          ]}
          rotation={[
            Math.PI / 2,
            0,
            0,
          ]}
        >
          <cylinderGeometry
            args={[
              0.06,
              0.06,
              0.35,
              12,
            ]}
          />

          <meshStandardMaterial
            color="#111"
          />
        </mesh>

        <pointLight
          ref={gunFlash}
          position={[
            0,
            0,
            -1,
          ]}
          color="#ff3333"
          intensity={0}
          distance={4}
        />
      </group>

      <pointLight
        color="#ff1838"
        intensity={4}
        distance={4}
      />
    </group>
  );
}