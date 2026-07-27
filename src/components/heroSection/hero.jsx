import "./hero.css";
import {
  FaLock,
  FaDownload,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import NetworkMap from "../networkmap/map.jsx";
function Hero() {
  return (
    <section className="hero-outer">
      <div className="hero-wrapper">
        <div className="hero-align">

          <div className="hero-content">
            <div className="status-badge">
              <span className="live-dot"></span>
              End-to-End Encrypted Messaging
            </div>

            <h1>
              Chat Faster.
              <br />
              Stay Private.
              <br />
              <span>Connect Anywhere.</span>
            </h1>

            <p>
              Nexa is a modern messaging platform designed for secure,
              lightning-fast communication with end-to-end encryption, beautiful
              UI and instant synchronization across all devices.
            </p>

            <div className="hero-btns">
              <button className="btn-primary-lg">
                Start Messaging
                <FaArrowRight />
              </button>

              <button className="btn-secondary-lg">
                <FaDownload />
                Download App
              </button>
            </div>

            <div className="hero-features">
              <div className="feature-item">
                <FaCheckCircle />
                End-to-End Encryption
              </div>

              <div className="feature-item">
                <FaCheckCircle />
                Lightning Fast
              </div>

              <div className="feature-item">
                <FaCheckCircle />
                Cloud Sync
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="hero-preview">
            <NetworkMap />
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;
