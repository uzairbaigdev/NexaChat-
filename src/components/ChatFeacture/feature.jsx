import "./feature.css";

import {
  FaShieldAlt,
  FaBolt,
  FaLaptop,
  FaCheckCircle,
  FaLock,
  FaGlobe,
} from "react-icons/fa";

function Features() {
  return (
    <section className="features-outer">
      <div className="features-wrapper">
        {/* Heading */}

        <div className="section-heading">
          <span className="section-badge">Why Developers Choose Nexa</span>

          <h2 className="section-title">
            Built For
            <span> Privacy </span>
            And
            <span> Speed</span>
          </h2>

          <p className="section-desc">
            Nexa is designed for modern communication with enterprise-level
            security, lightning-fast messaging, and seamless access across all
            your devices.
          </p>
        </div>

        {/* Cards */}

        <div className="features-grid">
          {/* Card 1 */}

          <div className="feature-card">
            <div className="icon">
              <FaShieldAlt />
            </div>

            <h3>End-to-End Encryption</h3>

            <p>
              Every conversation is encrypted before leaving your device. Nobody
              except you and the receiver can access your messages.
            </p>

            <ul>
              <li>
                <FaCheckCircle />
                Signal Protocol
              </li>

              <li>
                <FaCheckCircle />
                AES-256 Encryption
              </li>

              <li>
                <FaCheckCircle />
                Zero Data Collection
              </li>

              <li>
                <FaCheckCircle />
                Private By Default
              </li>

              <li>
                <FaCheckCircle />
                Local Device Keys
              </li>
            </ul>

            <div className="card-footer">
              <div className="footer-icon">
                <FaLock />
              </div>

              <div>
                <span>Security</span>
                <strong>256-bit Encryption</strong>
              </div>
            </div>
          </div>

          {/* Card 2 */}

          <div className="feature-card">
            <div className="icon">
              <FaBolt />
            </div>

            <h3>Real-Time Messaging</h3>

            <p>
              Powered by Firebase infrastructure to deliver instant messaging
              with extremely low latency around the world.
            </p>

            <ul>
              <li>
                <FaCheckCircle />
                Instant Delivery
              </li>

              <li>
                <FaCheckCircle />
                Read Receipts
              </li>

              <li>
                <FaCheckCircle />
                Typing Indicators
              </li>

              <li>
                <FaCheckCircle />
                Online Presence
              </li>

              <li>
                <FaCheckCircle />
                Push Notifications
              </li>
            </ul>

            <div className="card-footer">
              <div className="footer-icon">
                <FaBolt />
              </div>

              <div>
                <span>Performance</span>
                <strong>Average Latency &lt; 40ms</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Large Card */}

        <div className="feature-large-card">
          <div className="large-left">
            <div className="icon large-icon">
              <FaLaptop />
            </div>

            <h3>Cross Platform Experience</h3>

            <p>
              Continue your conversations on Desktop, Mobile and Web with
              automatic synchronization and a beautiful responsive interface.
            </p>
          </div>

          <div className="large-right">
            <div className="device-list">
              <div className="device-item">
                <FaGlobe />
                Web Browser
              </div>

              <div className="device-item">💻 Windows</div>

              <div className="device-item">🍎 macOS</div>

              <div className="device-item">🐧 Linux</div>

              <div className="device-item">📱 Android</div>

              <div className="device-item">📲 iPhone</div>
            </div>
          </div>
        </div>

        {/* Stats */}

        <div className="stats-grid">
          <div className="stat-card">
            <h3>256-bit</h3>
            <p>AES Encryption</p>
          </div>

          <div className="stat-card">
            <h3>99.99%</h3>
            <p>Cloud Uptime</p>
          </div>

          <div className="stat-card">
            <h3>&lt;40ms</h3>
            <p>Average Delivery</p>
          </div>

          <div className="stat-card">
            <h3>Unlimited</h3>
            <p>Connected Devices</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
