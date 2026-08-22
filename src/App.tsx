import { useState } from "react";
import Game from "./components/game/Game";
import HUD from "./components/ui/Hud";
import "./index.css";

export default function App() {
  const [health, setHealth] = useState(100);

  return (
    <div className="game-container">
      <Game health={health} setHealth={setHealth} />
      <HUD health={health} />
    </div>
  );
}