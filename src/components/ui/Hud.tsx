type HUDProps = {
  health: number;
  ammo: number;
};

export default function HUD({
  health,
  ammo,
}: HUDProps) {
  const healthColor =
    health > 60
      ? "#00ff88"
      : health > 30
      ? "#ffaa00"
      : "#ff3333";

  return (
    <div className="hud">
      {/* MISSION */}

      <div className="mission">
        <small>MISSION 01</small>

        <strong>
          INFILTRATION
        </strong>

        <p>
          Reach the enemy compound
        </p>
      </div>

      {/* CROSSHAIR */}

      <div className="crosshair">
        <span />
        <span />
        <span />
        <span />
      </div>

      {/* WEAPON */}

      <div className="weapon">
        <div>
          <small>VX-45</small>

          <strong>{ammo}</strong>

          <span> / 120</span>
        </div>

        <div className="ammo-bar">
          <i
            style={{
              width: `${Math.max(
                0,
                (ammo / 30) * 100
              )}%`,
            }}
          />
        </div>
      </div>

      {/* HEALTH */}

      <div className="health">
        <div className="health-label">
          HEALTH
        </div>

        <div className="health-bar">
          <div
            style={{
              width: `${health}%`,
              backgroundColor:
                healthColor,
            }}
          />
        </div>

        <strong>{health}</strong>
      </div>

      {/* PC CONTROLS */}

      <div className="controls">
        <div>
          <span>W A S D</span> MOVE
        </div>

        <div>
          <span>SHIFT</span> SPRINT
        </div>

        <div>
          <span>LMB</span> FIRE
        </div>

        <div>
          <span>H</span> DAMAGE TEST
        </div>
      </div>

      {/* MOBILE JOYSTICK */}

      <div className="mobile-joystick">
        <div className="joystick-ring" />

        <div className="joystick-knob" />
      </div>

      {/* MOBILE FIRE */}

      <button
        className="mobile-fire"
        type="button"
      >
        🔥
        <span>FIRE</span>
      </button>

      {/* GAME OVER */}

      {health <= 0 && (
        <div className="game-over">
          <h1>
            GAME OVER
          </h1>

          <p>
            MISSION FAILED
          </p>
        </div>
      )}
    </div>
  );
}