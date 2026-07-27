import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import "./map.css";

const ACCENTS = ["#4ade80", "#38bdf8", "#c084fc", "#f87171"];

const RING_A = [0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => ({
  angle: deg,
  radius: 42,
  color: ACCENTS[i % ACCENTS.length],
}));
const RING_B = [30, 90, 150, 210, 270, 330].map((deg, i) => ({
  angle: deg,
  radius: 28,
  color: ACCENTS[(i + 1) % ACCENTS.length],
}));
const RING_C = [45, 135, 225, 315].map((deg, i) => ({
  angle: deg,
  radius: 14,
  color: ACCENTS[(i + 2) % ACCENTS.length],
}));

function buildNodes() {
  const all = [...RING_A, ...RING_B, ...RING_C];
  return all.map((n, i) => {
    const rad = (n.angle * Math.PI) / 180;
    return {
      id: i,
      x: 50 + n.radius * Math.cos(rad), // % position, center = 50
      y: 50 + n.radius * Math.sin(rad),
      color: n.color,
      label: `DB-${String(i + 1).padStart(2, "0")}`,
    };
  });
}

// Connection graph referencing node indices (0-7 outer ring, 8-13 mid
// ring, 14-17 inner ring). Mixes ring-adjacency with cross-ring links
// so the map reads as one connected network rather than three circles.
const CONNECTIONS = [
  // outer ring
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 0],
  // mid ring
  [8, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [12, 13],
  [13, 8],
  // inner ring
  [14, 15],
  [15, 16],
  [16, 17],
  [17, 14],
  // outer -> mid
  [0, 8],
  [1, 8],
  [2, 9],
  [3, 10],
  [4, 11],
  [5, 11],
  [6, 12],
  [7, 13],
  // mid -> inner
  [8, 14],
  [9, 15],
  [10, 15],
  [11, 16],
  [12, 17],
  [13, 14],
];

const MAX_PULSES = 26;
const SPAWN_EVERY_MS = 260;
const TRAIL_COUNT = 3;
const TRAIL_GAP = 0.035;

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function NetworkMap() {
  const nodes = useMemo(() => buildNodes(), []);
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const pulsesRef = useRef([]);
  const lastSpawnRef = useRef(0);

  const [latency, setLatency] = useState(16);
  const [online] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setLatency((prev) => {
        const next = Math.round(14 + Math.random() * 8); // 14–22ms
        return next === prev ? prev + (Math.random() > 0.5 ? 1 : -1) : next;
      });
    }, 1400);
    return () => clearInterval(id);
  }, []);

  const draw = useCallback(
    (ctx, w, h, timestamp) => {
      ctx.clearRect(0, 0, w, h);

      const pos = (idx) => ({
        x: (nodes[idx].x / 100) * w,
        y: (nodes[idx].y / 100) * h,
      });

      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      CONNECTIONS.forEach(([a, b]) => {
        const pa = pos(a);
        const pb = pos(b);
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      });

      if (
        timestamp - lastSpawnRef.current > SPAWN_EVERY_MS &&
        pulsesRef.current.length < MAX_PULSES
      ) {
        lastSpawnRef.current = timestamp;
        const conn =
          CONNECTIONS[Math.floor(Math.random() * CONNECTIONS.length)];
        pulsesRef.current.push({
          conn,
          progress: 0,
          speed: 0.006 + Math.random() * 0.006,
          hue: Math.random() > 0.5 ? "#4ade80" : "#38bdf8",
        });
      }

      pulsesRef.current = pulsesRef.current.filter((p) => p.progress <= 1.05);
      pulsesRef.current.forEach((p) => {
        p.progress += p.speed;
        const pa = pos(p.conn[0]);
        const pb = pos(p.conn[1]);

        for (let t = 0; t < TRAIL_COUNT; t++) {
          const trailProgress = p.progress - t * TRAIL_GAP;
          if (trailProgress < 0 || trailProgress > 1) continue;
          const x = pa.x + (pb.x - pa.x) * trailProgress;
          const y = pa.y + (pb.y - pa.y) * trailProgress;
          const alpha = 1 - t / TRAIL_COUNT;
          const radius = 2.6 - t * 0.6;

          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.shadowColor = p.hue;
          ctx.shadowBlur = 8 - t * 2;
          ctx.fillStyle = p.hue;
          ctx.beginPath();
          ctx.arc(x, y, Math.max(radius, 0.8), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });
    },
    [nodes],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const loop = (timestamp) => {
      const rect = canvas.getBoundingClientRect();
      draw(ctx, rect.width, rect.height, timestamp);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
      pulsesRef.current = [];
    };
  }, [draw]);

  return (
    <div className="nm-wrapper" ref={wrapperRef}>
      <div className="nm-container">
        <div className="nm-circle">
          <svg
            className="nm-grid-svg"
            viewBox="0 0 440 440"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="nm-fade" cx="50%" cy="50%" r="50%">
                <stop offset="60%" stopColor="rgba(255,255,255,0.09)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
            </defs>

            {Array.from({ length: 10 }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={(i + 1) * 40}
                y1="0"
                x2={(i + 1) * 40}
                y2="440"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={(i + 1) * 40}
                x2="440"
                y2={(i + 1) * 40}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
            ))}

            {[70, 130, 190, 250, 310, 370].map((cy, i) => (
              <path
                key={`lat-${i}`}
                d={`M 0 ${cy} Q 220 ${cy - 26} 440 ${cy}`}
                fill="none"
                stroke="rgba(255,255,255,0.07)"
                strokeWidth="1"
              />
            ))}

            {[70, 130, 190, 250, 310, 370].map((cx, i) => (
              <path
                key={`lon-${i}`}
                d={`M ${cx} 0 Q ${cx - 26} 220 ${cx} 440`}
                fill="none"
                stroke="rgba(255,255,255,0.07)"
                strokeWidth="1"
              />
            ))}

            {[60, 110, 160, 210].map((r) => (
              <circle
                key={`ring-${r}`}
                cx="220"
                cy="220"
                r={r}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
            ))}

            <circle cx="220" cy="220" r="216" fill="url(#nm-fade)" />
          </svg>

          <canvas className="nm-canvas" ref={canvasRef} />

          {nodes.map((n) => (
            <div
              key={n.id}
              className="nm-node"
              style={{
                left: `${n.x}%`,
                top: `${n.y}%`,
                "--node-color": n.color,
              }}
              title={n.label}
            >
              <DatabaseIcon color={n.color} />
            </div>
          ))}

          <div className="nm-hub">
            <span>NEXA</span>
          </div>
        </div>

        <div className="nm-stats">
          <div className="nm-stat-item">
            <span className={`nm-status-dot ${online ? "is-online" : ""}`}>
              ●
            </span>
            <span className="nm-stat-label">
              Network: {online ? "Online" : "Offline"}
            </span>
          </div>
          <div className="nm-stat-item">
            <span className="nm-stat-label">Latency</span>
            <span className="nm-latency-value">{latency}ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DatabaseIcon({ color }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      aria-hidden="true"
    >
      <ellipse cx="12" cy="5.5" rx="8" ry="3" fill={color} opacity="0.9" />
      <path
        d="M4 5.5V18.5C4 20.16 7.58 21.5 12 21.5C16.42 21.5 20 20.16 20 18.5V5.5"
        stroke={color}
        strokeWidth="1.6"
        fill="none"
      />
      <path
        d="M4 12C4 13.66 7.58 15 12 15C16.42 15 20 13.66 20 12"
        stroke={color}
        strokeWidth="1.6"
        fill="none"
      />
    </svg>
  );
}
