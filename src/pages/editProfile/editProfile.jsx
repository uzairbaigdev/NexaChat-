import React from "react";
import "./editProfile.css";
import { Link } from "react-router-dom";

const EditProfile = () => {
  return (
    <div className="edit-profile-page">
      {/* Top Bar */}

      <header className="edit-profile-topbar">
        <Link to="/settings" className="back-link">
          <button className="back-button">
            <span>←</span>
            Back to Settings
          </button>
        </Link>

        <div className="brand-row">
          <span className="brand-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M4 5.5C4 4.67157 4.67157 4 5.5 4H18.5C19.3284 4 20 4.67157 20 5.5V15.5C20 16.3284 19.3284 17 18.5 17H9L5 20.5V17H5.5C4.67157 17 4 16.3284 4 15.5V5.5Z"
                fill="url(#editProfileGradient)"
              />

              <defs>
                <linearGradient
                  id="editProfileGradient"
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

      {/* Main Content */}

      <main className="edit-profile-content">
        <div className="edit-profile-container">
          <div className="edit-profile-heading">
            <h1>Edit Profile</h1>
            <p>Manage your profile information</p>
          </div>

          {/* Profile Settings */}
          <section className="edit-profile-section">
            <h2 className="section-label">Profile</h2>

            {/* Edit Profile Image */}
            <div className="profile-setting-card">
              <Link
                to="/settings/editprofile/editprofileimage"
                className="profile-setting-row"
              >
                <button className="profile-setting-row">
                  <span className="profile-setting-icon image-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 3.5A2.5 2.5 0 1110 11a2.5 2.5 0 010-4.5zM5 19l3.5-4.5 2.5 3 3.5-4.5L19 19H5z" />
                    </svg>
                  </span>

                  <span className="profile-setting-text">
                    <span className="profile-setting-title">Profile Imagess</span>

                    <span className="profile-setting-description">
                      Change your profile picture
                    </span>
                  </span>

                  <span className="setting-chevron">›</span>
                </button>
              </Link>
            </div>

            {/* Edit Username */}
            <div className="profile-setting-card">
              <Link to={"/settings/editprofile/editusername"}>
                <button className="profile-setting-row">
                  <span className="profile-setting-icon username-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
                    </svg>
                  </span>

                  <span className="profile-setting-text">
                    <span className="profile-setting-title">Username</span>

                    <span className="profile-setting-description">
                      Change your username
                    </span>
                  </span>

                  <span className="setting-chevron">›</span>
                </button>
              </Link>
            </div>

            {/* Edit Bio */}

            <div className="profile-setting-card">
              
         <Link to={'/settings/editprofile/editBio'}>
              <button className="profile-setting-row">
                <span className="profile-setting-icon bio-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 4h16v2H4V4zm0 5h16v2H4V9zm0 5h11v2H4v-2zm0 5h8v2H4v-2z" />
                  </svg>
                </span>

                <span className="profile-setting-text">
                  <span className="profile-setting-title">Bio</span>

                  <span className="profile-setting-description">
                    Edit your profile bio
                     </span>
                   </span>
                 <span className="setting-chevron">›</span>
               </button>
         </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;
