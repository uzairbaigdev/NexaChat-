import React, { useState, useEffect } from "react";
import "./privacy.css";
import { Link } from "react-router-dom";
import { db, doc, getDoc, setDoc } from "../../firebaseConfig.js";


const Privacy = () => {
  const [showVisibilityPopup, setShowVisibilityPopup] = useState(false);
  const UID = window.localStorage.getItem("uid");
  let [userData, setUserData] = useState({});

  //working on getting user data from database 
  const gettingUserData = async () => {
    try {
      const docRef = doc(db, "users", UID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setUserData(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    gettingUserData();
  }, []);

  return (
    <div className="settings-page">
      {/* Top bar */}
      <header className="settings-topbar">
        <Link to="/settings" className="back-link">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M12.7 4.3a1 1 0 010 1.4L8.42 10l4.3 4.3a1 1 0 01-1.42 1.4l-5-5a1 1 0 010-1.4l5-5a1 1 0 011.4 0z"
              clipRule="evenodd"
            />
          </svg>

          Back to settings
        </Link>

        <div className="brand-row">
          <span className="brand-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M4 5.5C4 4.67157 4.67157 4 5.5 4H18.5C19.3284 4 20 4.67157 20 5.5V15.5C20 16.3284 19.3284 17 18.5 17H9L5 20.5V17H5.5C4.67157 17 4 16.3284 4 15.5V5.5Z"
                fill="url(#brandGradPrivacy)"
              />

              <defs>
                <linearGradient
                  id="brandGradPrivacy"
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
          <h1 className="settings-title">Privacy</h1>
          <p className="settings-subtitle">
            Manage who can see your account
          </p>

          <section className="settings-section">
            <h2 className="section-label">Account Visibility</h2>

            {/* Currently Private / Public */}
            <div className="settings-card">
              <div className="settings-row">
                <span
                  className={
                    userData.Visibility === "private" || userData.Visiblity === "private"
                      ? "row-icon row-icon-private"
                      : "row-icon row-icon-public"
                  }
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 2a4 4 0 00-4 4v2H5a1 1 0 00-1 1v8a1 1 0 001 1h10a1 1 0 001-1v-8a1 1 0 00-1-1h-1V6a4 4 0 00-4-4zm-2 6V6a2 2 0 114 0v2H8zm2 3a1.5 1.5 0 011.5 1.5c0 .61-.36 1.13-.88 1.37l.13 1.38a.63.63 0 01-.62.75h-.26a.63.63 0 01-.62-.75l.13-1.38A1.5 1.5 0 0110 11z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>

                <span className="row-text">
                  <span className="row-title">Profile Visibility</span>
                  <span className="row-desc">
                    {userData.Visibility === "private" || userData.Visiblity === "private"
                      ? "Only you can see your profile and activity"
                      : "Anyone can see your profile and activity"}
                  </span>
                </span>

                <span
                  className={
                    userData.Visibility === "private" || userData.Visiblity === "private"
                      ? "status-pill status-pill-private"
                      : "status-pill status-pill-public"
                  }
                >
                  {userData.Visibility === "private" || userData.Visiblity === "private" ? "Currently Private" : "Currently Public"}
                </span>

                <button
                  type="button"
                  className="change-visibility-btn"
                  onClick={() => setShowVisibilityPopup(true)}
                >
                  Change Visibility
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>


      {showVisibilityPopup && (
        <div className="modal-overlay">
          <div className="modal-card visibility-modal-card">
            <span className="visibility-modal-icon">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 2a8 8 0 100 16 8 8 0 000-16zm.75 4.5a.75.75 0 10-1.5 0v4c0 .2.08.39.22.53l2.5 2.5a.75.75 0 101.06-1.06L10.75 10V6.5z"
                  clipRule="evenodd"
                />
              </svg>
            </span>

            <h3 className="modal-title">
              {userData.Visibility === "private" || userData.Visiblity === "private" ? "Make Profile Public?" : "Make Profile Private?"}
            </h3>

            <p className="modal-desc">
              {userData.Visibility === "private" || userData.Visiblity === "private"
                ? "If you make it public then any one can contact with you without sending request"
                : "If you make it private then no one can contact you without sending request to you"}
            </p>

            <div className="modal-actions visibility-modal-actions">
              <button
                type="button"
                className="modal-btn modal-btn-accept"
                onClick={async () => {
                  {
                    (userData.Visibility === "private" || userData.Visiblity === "private") ?
                      await setDoc(
                        doc(db, "users", UID),
                        { Visibility: "public" },
                        { merge: true }
                      )
                      :
                      await setDoc(
                        doc(db, "users", UID),
                        { Visibility: "private" },
                        { merge: true }
                      );
                  }
                  setShowVisibilityPopup(false)
                }}
              >
                I Accept
              </button>
            </div>
          </div>
        </div>
      )
      }
    </div >
  );
};

export default Privacy;