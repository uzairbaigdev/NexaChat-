import React, { useState, useEffect } from "react";
import "./userProfile.css";
import { Link } from "react-router-dom";
import { db, doc, getDoc } from "../../firebaseConfig.js";

const UserProfile = () => {
  const uid = window.localStorage.getItem("uid");

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const dummyUser = {
    imageURL: "",
    username: "User",
    displayName: "User Name",
    bio: "NO BIO",
  };

  // fetch user data from database
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [uid]);

  // Merge fetched data over the dummy defaults, same pattern dashboard.jsx
  const displayImageURL = userData?.imageURL || dummyUser.imageURL;
  const displayUsername = userData?.username || dummyUser.username;
  const displayBio = userData?.bio || dummyUser.bio;
  const avatarInitial = (displayUsername || "?").charAt(0).toUpperCase();

  return (
    <div className="userprofile-page">
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
                fill="url(#brandGradUserProfile)"
              />

              <defs>
                <linearGradient
                  id="brandGradUserProfile"
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
      <main className="userprofile-content">
        <div className="userprofile-container">
          <h1 className="settings-title">Your Profile</h1>
          <p className="settings-subtitle">
            This is how others see you on NexaChat
          </p>

          {/* Profile card with avatar */}
          <section className="profile-hero-card">
            <div className="profile-avatar-wrap">
              {displayImageURL ? (
                <img
                  src={displayImageURL}
                  alt="Profile"
                  className="profile-avatar-img"
                />
              ) : (
                <div className="profile-avatar-fallback">{avatarInitial}</div>
              )}

              <button
                type="button"
                className="avatar-edit-btn"
                aria-label="Change profile photo"
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.69 3.31a1.5 1.5 0 012.12 0l.88.88a1.5 1.5 0 010 2.12l-8.5 8.5-3.8.76.76-3.8 8.54-8.46zM4.3 16.7l4.6-.92 8.32-8.32-3.68-3.68-8.32 8.32-.92 4.6z" />
                </svg>
              </button>
            </div>

            <h2 className="profile-display-name">{displayUsername}</h2>
            <p className="profile-username">@{displayUsername}</p>
          </section>

          {/* Info section */}
          <section className="settings-section">
            <h2 className="section-label">Profile Info</h2>

            <div className="settings-card">
              {/* Username */}
              <div className="profile-field">
                <span className="row-icon">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      d="M10 10a4 4 0 100-8 4 4 0 000 8zm0 2c-3.314 0-6 1.79-6 4v1h12v-1c0-2.21-2.686-4-6-4z"
                    />
                  </svg>
                </span>

                <span className="row-text">
                  <span className="row-title">Username</span>
                  <span className="row-desc">{displayUsername}</span>
                </span>
              </div>

              <div className="profile-field-divider" />

              {/* Bio */}
              <div className="profile-field">
                <span className="row-icon">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 3a1 1 0 000 2h6a1 1 0 100-2H7zm0 4a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>

                <span className="row-text">
                  <span className="row-title">Bio</span>
                  <span className="row-desc">{displayBio}</span>
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;