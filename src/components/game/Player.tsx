import {
  useFrame,
  useThree,
} from "@react-three/fiber";

import {
  useEffect,
  useRef,
} from "react";

import * as THREE from "three";

type PlayerProps = {
  health: number;
  setHealth: React.Dispatch<
    React.SetStateAction<number>
  >;

  ammo: number;
  setAmmo: React.Dispatch<
    React.SetStateAction<number>
  >;

  playerPosition: React.MutableRefObject<
    THREE.Vector3
  >;
};

type MobileMovement = {
  x: number;
  y: number;
};

export default function Player({
  health,
  setHealth,
  ammo,
  setAmmo,
  playerPosition,
}: PlayerProps) {
  const playerRef =
    useRef<THREE.Group>(null);

  const keys =
    useRef<Record<string, boolean>>({});

  const mobileMovement =
    useRef<MobileMovement>({
      x: 0,
      y: 0,
    });

  const yaw =
    useRef(0);

  const pitch =
    useRef(-0.25);

  const muzzleFlash =
    useRef<THREE.PointLight>(null);

  const { camera, gl } =
    useThree();

  /*
   * =========================
   * KEYBOARD
   * =========================
   */

  useEffect(() => {
    const keyDown = (
      event: KeyboardEvent
    ) => {
      keys.current[
        event.key.toLowerCase()
      ] = true;
    };

    const keyUp = (
      event: KeyboardEvent
    ) => {
      keys.current[
        event.key.toLowerCase()
      ] = false;
    };

    window.addEventListener(
      "keydown",
      keyDown
    );

    window.addEventListener(
      "keyup",
      keyUp
    );

    return () => {
      window.removeEventListener(
        "keydown",
        keyDown
      );

      window.removeEventListener(
        "keyup",
        keyUp
      );
    };
  }, []);

  /*
   * =========================
   * DAMAGE TEST
   * H = DAMAGE
   * =========================
   */

  useEffect(() => {
    const damageTest = (
      event: KeyboardEvent
    ) => {
      if (
        event.key.toLowerCase() === "h"
      ) {
        setHealth((value) =>
          Math.max(
            0,
            value - 10
          )
        );
      }
    };

    window.addEventListener(
      "keydown",
      damageTest
    );

    return () => {
      window.removeEventListener(
        "keydown",
        damageTest
      );
    };
  }, [setHealth]);

  /*
   * =========================
   * MOUSE AIM
   * =========================
   */

  useEffect(() => {
    const canvas =
      gl.domElement;

    let locked = false;

    const clickCanvas = () => {
      if (
        document.pointerLockElement !==
        canvas
      ) {
        canvas.requestPointerLock?.();
      }
    };

    const pointerLockChange = () => {
      locked =
        document.pointerLockElement ===
        canvas;
    };

    const mouseMove = (
      event: MouseEvent
    ) => {
      if (!locked) return;

      yaw.current -=
        event.movementX * 0.0025;

      pitch.current -=
        event.movementY * 0.002;

      pitch.current =
        THREE.MathUtils.clamp(
          pitch.current,
          -0.9,
          0.45
        );
    };

    canvas.addEventListener(
      "click",
      clickCanvas
    );

    document.addEventListener(
      "pointerlockchange",
      pointerLockChange
    );

    document.addEventListener(
      "mousemove",
      mouseMove
    );

    return () => {
      canvas.removeEventListener(
        "click",
        clickCanvas
      );

      document.removeEventListener(
        "pointerlockchange",
        pointerLockChange
      );

      document.removeEventListener(
        "mousemove",
        mouseMove
      );
    };
  }, [gl]);

  /*
   * =========================
   * SOUND
   * =========================
   */

  const playFireSound = () => {
    try {
      const AudioContext =
        window.AudioContext ||
        (
          window as typeof window & {
            webkitAudioContext?: typeof window.AudioContext;
          }
        ).webkitAudioContext;

      if (!AudioContext) return;

      const audio =
        new AudioContext();

      const oscillator =
        audio.createOscillator();

      const gain =
        audio.createGain();

      oscillator.type = "sawtooth";

      oscillator.frequency.setValueAtTime(
        150,
        audio.currentTime
      );

      oscillator.frequency.exponentialRampToValueAtTime(
        45,
        audio.currentTime + 0.08
      );

      gain.gain.setValueAtTime(
        0.25,
        audio.currentTime
      );

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audio.currentTime + 0.1
      );

      oscillator.connect(gain);
      gain.connect(audio.destination);

      oscillator.start();
      oscillator.stop(
        audio.currentTime + 0.1
      );
    } catch {
      // audio unavailable
    }
  };

  /*
   * =========================
   * FIRE
   * =========================
   */

  const fire = () => {
    if (
      health <= 0 ||
      ammo <= 0
    ) {
      return;
    }

    setAmmo(
      (currentAmmo) =>
        Math.max(
          0,
          currentAmmo - 1
        )
    );

    playFireSound();

    if (muzzleFlash.current) {
      muzzleFlash.current.intensity = 12;

      setTimeout(() => {
        if (muzzleFlash.current) {
          muzzleFlash.current.intensity = 0;
        }
      }, 60);
    }

    window.dispatchEvent(
      new CustomEvent(
        "player-fire"
      )
    );
  };

  /*
   * =========================
   * PC FIRE
   * =========================
   */

  useEffect(() => {
    const mouseDown = (
      event: MouseEvent
    ) => {
      if (
        event.button !== 0
      ) {
        return;
      }

      /*
       * Don't fire when clicking
       * outside the canvas.
       */

      if (
        document.pointerLockElement !==
        gl.domElement
      ) {
        return;
      }

      fire();
    };

    window.addEventListener(
      "mousedown",
      mouseDown
    );

    return () => {
      window.removeEventListener(
        "mousedown",
        mouseDown
      );
    };
  });

  /*
   * =========================
   * MOBILE JOYSTICK
   * =========================
   */

  useEffect(() => {
    const joystick =
      document.querySelector(
        ".mobile-joystick"
      ) as HTMLElement | null;

    const knob =
      document.querySelector(
        ".joystick-knob"
      ) as HTMLElement | null;

    if (!joystick || !knob) {
      return;
    }

    let active = false;

    const radius = 40;

    const update = (
      x: number,
      y: number
    ) => {
      const rect =
        joystick.getBoundingClientRect();

      const centerX =
        rect.left +
        rect.width / 2;

      const centerY =
        rect.top +
        rect.height / 2;

      let dx =
        x - centerX;

      let dy =
        y - centerY;

      const distance =
        Math.sqrt(
          dx * dx +
          dy * dy
        );

      if (
        distance > radius
      ) {
        dx =
          (dx / distance) *
          radius;

        dy =
          (dy / distance) *
          radius;
      }

      mobileMovement.current.x =
        dx / radius;

      mobileMovement.current.y =
        dy / radius;

      knob.style.transform =
        `translate(${dx}px, ${dy}px)`;
    };

    const reset = () => {
      active = false;

      mobileMovement.current.x = 0;
      mobileMovement.current.y = 0;

      knob.style.transform =
        "translate(0px, 0px)";
    };

    const down = (
      event: PointerEvent
    ) => {
      active = true;

      joystick.setPointerCapture(
        event.pointerId
      );

      update(
        event.clientX,
        event.clientY
      );
    };

    const move = (
      event: PointerEvent
    ) => {
      if (!active) return;

      update(
        event.clientX,
        event.clientY
      );
    };

    joystick.addEventListener(
      "pointerdown",
      down
    );

    joystick.addEventListener(
      "pointermove",
      move
    );

    joystick.addEventListener(
      "pointerup",
      reset
    );

    joystick.addEventListener(
      "pointercancel",
      reset
    );

    return () => {
      joystick.removeEventListener(
        "pointerdown",
        down
      );

      joystick.removeEventListener(
        "pointermove",
        move
      );

      joystick.removeEventListener(
        "pointerup",
        reset
      );

      joystick.removeEventListener(
        "pointercancel",
        reset
      );
    };
  }, []);

  /*
   * =========================
   * MOBILE FIRE BUTTON
   * =========================
   */

  useEffect(() => {
    const button =
      document.querySelector(
        ".mobile-fire"
      );

    if (!button) return;

    const mobileFire = (
      event: Event
    ) => {
      event.preventDefault();
      fire();
    };

    button.addEventListener(
      "pointerdown",
      mobileFire
    );

    return () => {
      button.removeEventListener(
        "pointerdown",
        mobileFire
      );
    };
  });

  /*
   * =========================
   * MOVEMENT + CAMERA
   * =========================
   */

  useFrame((_, delta) => {
    if (!playerRef.current) {
      return;
    }

    const player =
      playerRef.current;

    if (health <= 0) {
      return;
    }

    const direction =
      new THREE.Vector3();

    /*
     * PC movement
     */

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

    /*
     * MOBILE
     */

    direction.x +=
      mobileMovement.current.x;

    direction.z +=
      mobileMovement.current.y;

    if (
      direction.lengthSq() > 0
    ) {
      direction.normalize();

      const sprint =
        keys.current["shift"];

      const speed =
        sprint ? 9 : 5;

      player.position.x +=
        direction.x *
        speed *
        delta;

      player.position.z +=
        direction.z *
        speed *
        delta;
    }

    /*
     * MAP LIMITS
     */

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
     * Shared player position
     * for enemies
     */

    playerPosition.current.copy(
      player.position
    );

    /*
     * PLAYER FACES CAMERA AIM
     */

    player.rotation.y =
      yaw.current;

    /*
     * THIRD PERSON CAMERA
     */

    const cameraDistance = 8;

    const horizontal =
      Math.cos(
        pitch.current
      ) * cameraDistance;

    const cameraOffset =
      new THREE.Vector3(
        Math.sin(yaw.current) *
          horizontal,
        5 -
          pitch.current * 3,
        Math.cos(yaw.current) *
          horizontal
      );

    const desiredCamera =
      player.position
        .clone()
        .add(cameraOffset);

    camera.position.lerp(
      desiredCamera,
      0.12
    );

    const target =
      player.position
        .clone()
        .add(
          new THREE.Vector3(
            0,
            1.3,
            0
          )
        );

    camera.lookAt(target);
  });

  return (
    <group
      ref={playerRef}
      position={[0, 1, 15]}
    >
      {/* BODY */}

      <mesh castShadow>
        <capsuleGeometry
          args={[
            0.45,
            1.1,
            8,
            16,
          ]}
        />

        <meshStandardMaterial
          color="#202a3c"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* CHEST */}

      <mesh
        position={[
          0,
          0.2,
          -0.35,
        ]}
        castShadow
      >
        <boxGeometry
          args={[
            0.7,
            0.8,
            0.25,
          ]}
        />

        <meshStandardMaterial
          color="#101827"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* HEAD */}

      <mesh
        position={[
          0,
          1.15,
          0,
        ]}
      >
        <sphereGeometry
          args={[
            0.32,
            24,
            24,
          ]}
        />

        <meshStandardMaterial
          color="#c7d0dc"
        />
      </mesh>

      {/* HELMET */}

      <mesh
        position={[
          0,
          1.35,
          0,
        ]}
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

      {/* VISOR */}

      <mesh
        position={[
          0,
          1.18,
          -0.28,
        ]}
      >
        <boxGeometry
          args={[
            0.45,
            0.16,
            0.04,
          ]}
        />

        <meshStandardMaterial
          color="#00eaff"
          emissive="#00eaff"
          emissiveIntensity={5}
        />
      </mesh>

      {/* WEAPON */}

      <group
        position={[
          0.55,
          0.25,
          -0.45,
        ]}
      >
        <mesh castShadow>
          <boxGeometry
            args={[
              0.16,
              0.16,
              1.5,
            ]}
          />

          <meshStandardMaterial
            color="#05070b"
            metalness={1}
            roughness={0.15}
          />
        </mesh>

        {/* BARREL */}

        <mesh
          position={[
            0,
            0,
            -0.85,
          ]}
          rotation={[
            Math.PI / 2,
            0,
            0,
          ]}
        >
          <cylinderGeometry
            args={[
              0.055,
              0.055,
              0.4,
              12,
            ]}
          />

          <meshStandardMaterial
            color="#111"
            metalness={1}
          />
        </mesh>

        {/* GRIP */}

        <mesh
          position={[
            0,
            -0.25,
            0.25,
          ]}
        >
          <boxGeometry
            args={[
              0.13,
              0.45,
              0.18,
            ]}
          />

          <meshStandardMaterial
            color="#090b10"
          />
        </mesh>

        {/* ENERGY CORE */}

        <mesh
          position={[
            0,
            0,
            -0.15,
          ]}
        >
          <boxGeometry
            args={[
              0.19,
              0.19,
              0.35,
            ]}
          />

          <meshStandardMaterial
            color="#00aacc"
            emissive="#00eaff"
            emissiveIntensity={3}
          />
        </mesh>

        {/* MUZZLE FLASH */}

        <pointLight
          ref={muzzleFlash}
          position={[
            0,
            0,
            -1.05,
          ]}
          color="#ffdd88"
          intensity={0}
          distance={5}
        />
      </group>

      {/* PLAYER LIGHT */}

      <pointLight
        color="#00d9ff"
        intensity={5}
        distance={4}
      />
    </group>
  );
}