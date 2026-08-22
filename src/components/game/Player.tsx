import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Player() {
  const playerRef = useRef<THREE.Group>(null);

  const cameraTarget = useRef(
    new THREE.Vector3()
  );

  const keys = useRef<Record<string, boolean>>({});

  const { camera } = useThree();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keys.current[event.key.toLowerCase()] = true;
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keys.current[event.key.toLowerCase()] = false;
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    window.addEventListener(
      "keyup",
      handleKeyUp
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      window.removeEventListener(
        "keyup",
        handleKeyUp
      );
    };
  }, []);

  useFrame((_, delta) => {
    if (!playerRef.current) return;

    const player = playerRef.current;

    const direction = new THREE.Vector3();

    if (keys.current["w"]) {
      direction.z -= 1;
    }

    if (keys.current["s"]) {
      direction.z += 1;
    }

    if (keys.current["a"]) {
      direction.x -= 1;
    }

    if (keys.current["d"]) {
      direction.x += 1;
    }

    const moving =
      direction.lengthSq() > 0;

    if (moving) {
      direction.normalize();

      const sprinting =
        keys.current["shift"];

      const speed = sprinting ? 9 : 5;

      player.position.x +=
        direction.x * speed * delta;

      player.position.z +=
        direction.z * speed * delta;

      // Rotate character toward movement
      const targetRotation =
        Math.atan2(
          direction.x,
          direction.z
        );

      player.rotation.y = THREE.MathUtils.lerp(
        player.rotation.y,
        targetRotation,
        0.15
      );
    }

    // Map boundaries
    player.position.x =
      THREE.MathUtils.clamp(
        player.position.x,
        -38,
        38
      );

    player.position.z =
      THREE.MathUtils.clamp(
        player.position.z,
        -38,
        38
      );

    /*
     * Third-person camera
     */

    const cameraOffset =
      new THREE.Vector3(
        0,
        6,
        10
      );

    cameraOffset.applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      player.rotation.y
    );

    const desiredCamera =
      player.position
        .clone()
        .add(cameraOffset);

    camera.position.lerp(
      desiredCamera,
      0.08
    );

    cameraTarget.current.lerp(
      player.position
        .clone()
        .add(
          new THREE.Vector3(
            0,
            1.5,
            0
          )
        ),
      0.12
    );

    camera.lookAt(
      cameraTarget.current
    );
  });

  return (
    <group
      ref={playerRef}
      position={[0, 1, 15]}
    >
      {/* Body */}
      <mesh castShadow>
        <capsuleGeometry
          args={[0.45, 1.1, 8, 16]}
        />

        <meshStandardMaterial
          color="#202a3c"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Chest armor */}
      <mesh
        position={[0, 0.2, -0.35]}
        castShadow
      >
        <boxGeometry
          args={[0.7, 0.8, 0.25]}
        />

        <meshStandardMaterial
          color="#101827"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Head */}
      <mesh
        position={[0, 1.15, 0]}
        castShadow
      >
        <sphereGeometry
          args={[0.32, 24, 24]}
        />

        <meshStandardMaterial
          color="#c7d0dc"
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>

      {/* Helmet */}
      <mesh
        position={[0, 1.35, 0]}
        castShadow
      >
        <sphereGeometry
          args={[
            0.36,
            24,
            16,
            0,
            Math.PI * 2,
            0,
            Math.PI / 2,
          ]}
        />

        <meshStandardMaterial
          color="#080c15"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Visor */}
      <mesh
        position={[0, 1.18, -0.28]}
      >
        <boxGeometry
          args={[0.45, 0.16, 0.04]}
        />

        <meshStandardMaterial
          color="#00eaff"
          emissive="#00eaff"
          emissiveIntensity={5}
        />
      </mesh>

      {/* Weapon */}
     {/* Weapon */}
<group
  position={[0.55, 0.25, -0.45]}
  rotation={[-0.1, 0, -0.15]}
>
  {/* Main gun body */}
  <mesh castShadow>
    <boxGeometry args={[0.16, 0.16, 1.5]} />
    <meshStandardMaterial
      color="#05070b"
      metalness={1}
      roughness={0.15}
    />
  </mesh>

  {/* Barrel */}
  <mesh
    position={[0, 0, -0.85]}
    rotation={[Math.PI / 2, 0, 0]}
    castShadow
  >
    <cylinderGeometry
      args={[0.055, 0.055, 0.4, 12]}
    />
    <meshStandardMaterial
      color="#111111"
      metalness={1}
      roughness={0.15}
    />
  </mesh>

  {/* Grip */}
  <mesh
    position={[0, -0.25, 0.25]}
    rotation={[-0.3, 0, 0]}
    castShadow
  >
    <boxGeometry args={[0.13, 0.45, 0.18]} />
    <meshStandardMaterial
      color="#090b10"
      metalness={0.8}
      roughness={0.25}
    />
  </mesh>

  {/* Energy/core detail */}
  <mesh position={[0, 0, -0.15]}>
    <boxGeometry args={[0.19, 0.19, 0.35]} />
    <meshStandardMaterial
      color="#00aacc"
      emissive="#00eaff"
      emissiveIntensity={2}
      metalness={0.8}
      roughness={0.2}
    />
  </mesh>
</group>

      {/* Player glow */}
      <pointLight
        color="#00d9ff"
        intensity={5}
        distance={4}
      />
    </group>
  );
}