import "./footer.css";

function Footer() {
  return (
    <footer className="footer-outer">
      <div className="footer-wrapper">
        <div className="footer-align">
          {/* Brand */}

          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">N</div>

              <h3>
                Nexa
                <span>.chat</span>
              </h3>
            </div>

            <p>
              Secure real-time messaging platform built for modern communication
              with end-to-end encryption and lightning-fast performance.
            </p>

            <div className="footer-social">
              <img src="/icons/github.svg" alt="" />

              <img src="/icons/twitter.svg" alt="" />

              <img src="/icons/linkedin.svg" alt="" />

              <img src="/icons/discord.svg" alt="" />
            </div>
          </div>

          {/* Links */}

          <div className="footer-links">
            <div className="col">
              <h4>Product</h4>

              <ul>
                <li>Features</li>

                <li>Download</li>

                <li>Web App</li>

                <li>Pricing</li>
              </ul>
            </div>

            <div className="col">
              <h4>Company</h4>

              <ul>
                <li>About</li>

                <li>Blog</li>

                <li>Careers</li>

                <li>Contact</li>
              </ul>
            </div>

            <div className="col">
              <h4>Resources</h4>

              <ul>
                <li>Documentation</li>

                <li>Developers</li>

                <li>API</li>

                <li>GitHub</li>
              </ul>
            </div>

            <div className="col">
              <h4>Legal</h4>

              <ul>
                <li>Privacy</li>

                <li>Terms</li>

                <li>Cookies</li>

                <li>Status</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Nexa Chat. Built with React & Firebase.</p>

          <span>Designed for secure communication.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
