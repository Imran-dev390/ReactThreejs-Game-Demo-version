import { useState } from "react";
import Game from "./components/game/Game";
import HUD from "./components/ui/Hud";
import "./index.css";

export default function App() {
  const [health, setHealth] = useState(100);
  const [ammo, setAmmo] = useState(30);

  return (
    <div className="game-container">
      <Game
        health={health}
        setHealth={setHealth}
        ammo={ammo}
        setAmmo={setAmmo}
      />

      <HUD
        health={health}
        ammo={ammo}
      />
    </div>
  );
}