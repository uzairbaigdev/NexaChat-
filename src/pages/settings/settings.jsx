import React, { useState, useEffect } from "react";
import "./settings.css";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, onAuthStateChanged } from "../../firebaseConfig.js";
  
const Settings = () => {
  const navigate = useNavigate();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/signup");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Logout
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        window.localStorage.removeItem("uid");
        navigate("/signup");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  return (
    <div className="settings-page">
      {/* Top bar */}
      <header className="settings-topbar">
        <Link to="/dashboard" className="back-link">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M12.7 4.3a1 1 0 010 1.4L8.42 10l4.3 4.3a1 1 0 01-1.42 1.4l-5-5a1 1 0 010-1.4l5-5a1 1 0 011.4 0z"
              clipRule="evenodd"
            />
          </svg>

          Back to chats
        </Link>

        <div className="brand-row">
          <span className="brand-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M4 5.5C4 4.67157 4.67157 4 5.5 4H18.5C19.3284 4 20 4.67157 20 5.5V15.5C20 16.3284 19.3284 17 18.5 17H9L5 20.5V17H5.5C4.67157 17 4 16.3284 4 15.5V5.5Z"
                fill="url(#brandGradSettings)"
              />

              <defs>
                <linearGradient
                  id="brandGradSettings"
                  x1="4"
                  y1="4"
                  x2="20"
                  y2="20"
                >
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
            </svg>
          </span>

          <span className="brand-word">NexaChat</span>
        </div>
      </header>

      {/* Content */}
      <main className="settings-content">
        <div className="settings-container">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">
            Manage your account preferences
          </p>

          <section className="settings-section">
            <h2 className="section-label">Account</h2>

            {/* Your Profile */}
            <div className="settings-card">
              <button
                type="button"
                className="settings-row"
                onClick={() => navigate("/settings/userprofile")}
              >
                <span className="row-icon">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 2a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM3.5 18a6.5 6.5 0 0113 0 1 1 0 01-1 1h-11a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>

                <span className="row-text">
                  <span className="row-title">Profile</span>
                  <span className="row-desc">
                    View your profile as others see it
                  </span>
                </span>

                <svg
                  className="row-chevron"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.3 4.3a1 1 0 000 1.4L11.58 10l-4.3 4.3a1 1 0 01-1.42 0l-5-5a1 1 0 010-1.4l5-5a1 1 0 011.4 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Edit Profile */}
            
            <div className="settings-card">
              <Link to="/settings/editprofile" className="settings-row-link">
                <button
                  type="button"
                  className="settings-row"
                >
                  <span className="row-icon">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path
                        d="M10 10a4 4 0 100-8 4 4 0 000 8zm0 2c-3.314 0-6 1.79-6 4v1h12v-1c0-2.21-2.686-4-6-4z"
                      />
                    </svg>
                  </span>

                  <span className="row-text">
                    <span className="row-title">Edit Profile</span>
                    <span className="row-desc">
                      Update your profile information
                    </span>
                  </span>

                  <svg
                    className="row-chevron"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.3 4.3a1 1 0 000 1.4L11.58 10l-4.3 4.3a1 1 0 01-1.42 0l-5-5a1 1 0 010-1.4l5-5a1 1 0 011.4 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </Link>
            </div>




            {/* Logout */}
            <div className="settings-card">
              <button
                type="button"
                className="settings-row settings-row-danger"
                onClick={() => setShowLogoutPopup(true)}
              >
                <span className="row-icon row-icon-danger">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h6a1 1 0 110 2H5v10h5a1 1 0 110 2H4a1 1 0 01-1-1V4zm10.29 2.29a1 1 0 011.42 0l3 3a1 1 0 010 1.42l-3 3a1 1 0 01-1.42-1.42L14.59 11H8a1 1 0 110-2h6.59l-1.3-1.29a1 1 0 010-1.42z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>

                <span className="row-text">
                  <span className="row-title">Log Out</span>
                  <span className="row-desc">
                    Sign out of your account on this device
                  </span>
                </span>

                <svg
                  className="row-chevron"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.3 4.3a1 1 0 000 1.4L11.58 10l-4.3 4.3a1 1 0 01-1.42 0l-5-5a1 1 0 010-1.4l5-5a1 1 0 011.4 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Logout confirmation popup */}
      {showLogoutPopup && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 className="modal-title">Log out of NexaChat?</h3>

            <p className="modal-desc">
              You'll need to sign in again next time.
            </p>

            <div className="modal-actions">
              <button
                type="button"
                className="modal-btn modal-btn-cancel"
                onClick={() => setShowLogoutPopup(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="modal-btn modal-btn-confirm"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;