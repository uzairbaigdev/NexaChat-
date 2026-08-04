import React from "react";
import { useEffect } from "react";
import "./landingPage.css";
import { Link, useNavigate } from "react-router-dom";
import {auth,onAuthStateChanged} from "../../firebaseConfig"

const LandingPage = () => {
const navigate = useNavigate();

// If user is already logged in, skip signup and go straight to dashboard
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard");
      }
    });
    return () => unsubscribe();
}, [navigate]);


  return (
    <div className="landing">
      {/* ================= NAVBAR ================= */}
      <header className="nav">
        <div className="nav-inner">
          <Link className="nav-brand" to="/">
            <span className="brand-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 5.5C4 4.67157 4.67157 4 5.5 4H18.5C19.3284 4 20 4.67157 20 5.5V15.5C20 16.3284 19.3284 17 18.5 17H9L5 20.5V17H5.5C4.67157 17 4 16.3284 4 15.5V5.5Z"
                  fill="url(#navBrandGrad)"
                />
                <defs>
                  <linearGradient id="navBrandGrad" x1="4" y1="4" x2="20" y2="20">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#22D3EE" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span className="brand-word">NexaChat</span>
          </Link>

          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#security">Security</a>
            <a href="#global">Global reach</a>
          </nav>

          <div className="nav-actions">
            <Link className="nav-login" to="/login">
              Log in
            </Link>
            <Link className="nav-cta" to="/signup">
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="glow glow-a"></div>
        <div className="glow glow-b"></div>

        <svg className="hero-constellation" viewBox="0 0 1200 600" preserveAspectRatio="none">
          <line x1="120" y1="120" x2="360" y2="240" />
          <line x1="360" y1="240" x2="260" y2="440" />
          <line x1="360" y1="240" x2="640" y2="160" />
          <line x1="640" y1="160" x2="860" y2="300" />
          <line x1="860" y1="300" x2="1080" y2="180" />
          <line x1="640" y1="160" x2="520" y2="420" />
          <line x1="520" y1="420" x2="780" y2="480" />
          <line x1="780" y1="480" x2="980" y2="380" />

          <circle cx="120" cy="120" r="4" />
          <circle cx="360" cy="240" r="5" />
          <circle cx="260" cy="440" r="4" />
          <circle cx="640" cy="160" r="5" />
          <circle cx="860" cy="300" r="4" />
          <circle cx="1080" cy="180" r="4" />
          <circle cx="520" cy="420" r="4" />
          <circle cx="780" cy="480" r="5" />
          <circle cx="980" cy="380" r="4" />

          {/* traveling message pulses, follow the lines above */}
          <circle r="5" className="pulse-dot pulse-cyan">
            <animateMotion dur="6s" repeatCount="indefinite" path="M120,120 L360,240 L640,160 L860,300" />
          </circle>
          <circle r="4" className="pulse-dot pulse-indigo">
            <animateMotion
              dur="7.5s"
              begin="1.2s"
              repeatCount="indefinite"
              path="M640,160 L520,420 L780,480 L980,380"
            />
          </circle>
        </svg>

        <div className="hero-content">
          <span className="hero-eyebrow">Global scale messaging</span>
          <h1 className="hero-headline">
            Every conversation.
            <br />
            Everywhere.
          </h1>
          <p className="hero-sub">
            NexaChat keeps people close no matter the distance. Fast delivery,
            private by default, and built to feel instant on any device.
          </p>

          <div className="hero-actions">
            <Link className="btn btn-primary" to="/signup">
              Get started free
            </Link>
            <a className="btn btn-ghost" href="#features">
              See how it works
            </a>
          </div>

          <div className="hero-chips">
            <div className="chat-chip chip-1">
              <span className="chip-dot"></span>
              Hey! Are we still on for today?
            </div>
            <div className="chat-chip chip-2">
              <span className="chip-dot"></span>
              Just landed, calling you now
            </div>
            <div className="chat-chip chip-3">
              <span className="chip-dot chip-dot-green"></span>
              Sent — delivered in 0.2s
            </div>
          </div>
        </div>
      </section>

      {/* ================= TRUSTED BY ================= */}
      <section className="trusted">
        <p className="trusted-label">Trusted by teams at</p>
        <div className="trusted-row">
          <span>ORBIT</span>
          <span>VESSEL</span>
          <span>ATLAS</span>
          <span>LUMEN</span>
          <span>NORTHWIND</span>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="features" id="features">
        <div className="section-head">
          <span className="section-eyebrow">Why NexaChat</span>
          <h2 className="section-title">Built for how people actually talk</h2>
          <p className="section-sub">
            No clutter, no lag, no wondering if a message went through.
          </p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <span className="feature-icon">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 2L3 12h6l-1 6 8-10h-6l1-6z" />
              </svg>
            </span>
            <h3>Instant delivery</h3>
            <p>Messages land the moment you send them, wherever your people are.</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 2a4 4 0 00-4 4v2H5a1 1 0 00-1 1v7a2 2 0 002 2h8a2 2 0 002-2V9a1 1 0 00-1-1h-1V6a4 4 0 00-4-4zm2 6V6a2 2 0 10-4 0v2h4z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <h3>Private by default</h3>
            <p>Every conversation stays between you and the people in it.</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4a2 2 0 00-2 2v6a2 2 0 002 2h4v2H6a1 1 0 100 2h8a1 1 0 100-2h-2v-2h4a2 2 0 002-2V6a2 2 0 00-2-2H4z" />
              </svg>
            </span>
            <h3>One thread, every device</h3>
            <p>Pick up a conversation on your phone and finish it on your laptop.</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 9a4 4 0 100-8 4 4 0 000 8zM3 19c0-3.31 3.13-6 7-6s7 2.69 7 6a1 1 0 01-1 1H4a1 1 0 01-1-1z" />
              </svg>
            </span>
            <h3>Built for groups</h3>
            <p>Turn a chat into a community without losing track of anyone.</p>
          </div>
        </div>
      </section>

      {/* ================= GLOBAL REACH / STATS ================= */}
      <section className="global" id="global">
        <div className="glow glow-c"></div>

        <div className="global-content">
          <span className="section-eyebrow section-eyebrow-light">Global reach</span>
          <h2 className="global-title">One network, every time zone</h2>
          <p className="global-sub">
            NexaChat routes every message along the fastest path available, so
            conversations feel local no matter where they start.
          </p>

          <div className="stat-row">
            <div className="stat">
              <span className="stat-number">120+</span>
              <span className="stat-label">Countries with active users</span>
            </div>
            <div className="stat">
              <span className="stat-number">0.2s</span>
              <span className="stat-label">Median message delivery</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support around the clock</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PRODUCT MOCKUP ================= */}
      <section className="mockup-section" id="security">
        <div className="mockup-copy">
          <span className="section-eyebrow">See it in action</span>
          <h2 className="section-title">A conversation, wherever it starts</h2>
          <p className="section-sub">
            Clean threads, clear timestamps, and delivery you can actually see
            happening.
          </p>
        </div>

        <div className="phone-frame">
          <div className="phone-notch"></div>
          <div className="phone-screen">
            <div className="phone-header">
              <span className="phone-avatar">A</span>
              <div>
                <p className="phone-name">Aiko Tanaka</p>
                <p className="phone-status">Online</p>
              </div>
            </div>

            <div className="phone-messages">
              <div className="bubble bubble-in">Landed in Lisbon, the wifi here is great</div>
              <div className="bubble bubble-out">Perfect, send me the address when you're settled</div>
              <div className="bubble bubble-in">On it — give me five minutes</div>
              <div className="bubble bubble-out bubble-sent">
                Sounds good <span className="bubble-tick">✓✓</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="cta">
        <div className="glow glow-d"></div>
        <h2 className="cta-title">Ready to talk to the world?</h2>
        <p className="cta-sub">Create your account in under a minute. No card required.</p>
        <Link className="btn btn-primary btn-large" to="/signup">
          Get started free
        </Link>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        <div className="footer-top">
          <Link className="nav-brand" to="/">
            <span className="brand-icon brand-icon-sm">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 5.5C4 4.67157 4.67157 4 5.5 4H18.5C19.3284 4 20 4.67157 20 5.5V15.5C20 16.3284 19.3284 17 18.5 17H9L5 20.5V17H5.5C4.67157 17 4 16.3284 4 15.5V5.5Z"
                  fill="url(#footerBrandGrad)"
                />
                <defs>
                  <linearGradient id="footerBrandGrad" x1="4" y1="4" x2="20" y2="20">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#22D3EE" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span className="brand-word">NexaChat</span>
          </Link>

          <div className="footer-links">
            <div className="footer-col">
              <p className="footer-heading">Product</p>
              <a href="#features">Features</a>
              <a href="#security">Security</a>
              <a href="#global">Global reach</a>
            </div>
            <div className="footer-col">
              <p className="footer-heading">Company</p>
              <a href="#about">About</a>
              <a href="#careers">Careers</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="footer-col">
              <p className="footer-heading">Resources</p>
              <a href="#faq">FAQ</a>
              <a href="#help">Help center</a>
              <a href="#status">Status</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} NexaChat. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;