import Game from "./components/game/Game";
//import {HUD} from "./components/ui/HUD";
import "./index.css";
import HUD from "./components/ui/Hud";

function App() {
  return (
    <div className="game-container">
      <Game />
      <HUD/>
    </div>
  );
}

export default App;