import React from "react";
import { Link } from "react-router-dom";
import "./notFound.css";

const NotFound = () => {
  return (
    <div className="notfound-page">
      <div className="glow glow-a"></div>
      <div className="glow glow-b"></div>

      <svg className="constellation" viewBox="0 0 1200 800" preserveAspectRatio="none">
        <line x1="100" y1="120" x2="340" y2="260" />
        <line x1="340" y1="260" x2="220" y2="460" />
        <line x1="340" y1="260" x2="620" y2="180" />
        <line x1="620" y1="180" x2="860" y2="300" />
        <line x1="860" y1="300" x2="1100" y2="200" />
        <line x1="620" y1="180" x2="520" y2="440" />
        <line x1="520" y1="440" x2="760" y2="540" />
        <line x1="760" y1="540" x2="980" y2="460" />
        <line x1="220" y1="460" x2="380" y2="620" />

        <circle cx="100" cy="120" r="4" />
        <circle cx="340" cy="260" r="5" />
        <circle cx="220" cy="460" r="4" />
        <circle cx="620" cy="180" r="5" />
        <circle cx="860" cy="300" r="4" />
        <circle cx="1100" cy="200" r="4" />
        <circle cx="520" cy="440" r="4" />
        <circle cx="760" cy="540" r="5" />
        <circle cx="980" cy="460" r="4" />
        <circle cx="380" cy="620" r="4" />

        {/* traveling message pulses, follow the lines above */}
        <circle r="5" className="pulse-dot pulse-cyan">
          <animateMotion dur="6s" repeatCount="indefinite" path="M100,120 L340,260 L620,180 L860,300 L1100,200" />
        </circle>
        <circle r="4" className="pulse-dot pulse-indigo">
          <animateMotion
            dur="7.5s"
            begin="1.2s"
            repeatCount="indefinite"
            path="M340,260 L220,460 L380,620"
          />
        </circle>
        <circle r="4" className="pulse-dot pulse-cyan">
          <animateMotion
            dur="8.5s"
            begin="2.4s"
            repeatCount="indefinite"
            path="M620,180 L520,440 L760,540 L980,460"
          />
        </circle>
      </svg>

      <div className="notfound-content">
        <div className="brand-row">
          <span className="brand-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M4 5.5C4 4.67157 4.67157 4 5.5 4H18.5C19.3284 4 20 4.67157 20 5.5V15.5C20 16.3284 19.3284 17 18.5 17H9L5 20.5V17H5.5C4.67157 17 4 16.3284 4 15.5V5.5Z"
                fill="url(#notFoundBrandGrad)"
              />
              <defs>
                <linearGradient id="notFoundBrandGrad" x1="4" y1="4" x2="20" y2="20">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className="brand-word">NexaChat</span>
        </div>

        <span className="notfound-eyebrow">Signal lost</span>
        <h1 className="notfound-code">404</h1>
        <h2 className="notfound-title">This conversation went quiet</h2>
        <p className="notfound-sub">
          The page you're looking for doesn't exist, moved, or never made it
          across the network. Let's get you back on track.
        </p>

        <div className="notfound-actions">
          <Link className="btn btn-primary" to="/">
            Back to home
          </Link>
          <Link className="btn btn-ghost" to="/login">
            Go to log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;