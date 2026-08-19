export default function HUD() {
  return (
    <div className="hud">

      <div className="mission">
        <small>MISSION 01</small>

        <strong>INFILTRATION</strong>

        <p>Reach the enemy compound</p>
      </div>

      <div className="crosshair">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="weapon">
        <div>
          <small>VX-45</small>

          <strong>30</strong>

          <span> / 120</span>
        </div>

        <div className="ammo-bar">
          <i />
        </div>
      </div>

      <div className="health">
        <div className="health-label">
          HEALTH
        </div>

        <div className="health-bar">
          <div />
        </div>

        <strong>100</strong>
      </div>

      <div className="controls">
        <div>
          <span>W A S D</span> MOVE
        </div>

        <div>
          <span>SHIFT</span> SPRINT
        </div>

        <div>
          <span>SPACE</span> JUMP
        </div>

        <div>
          <span>LMB</span> FIRE
        </div>
      </div>

    </div>
  );
}