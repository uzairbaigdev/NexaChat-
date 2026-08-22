import React, { useState } from "react";
import "./editProfileImage.css";
import { Link } from "react-router-dom";
import { auth } from "../../firebaseConfig.js";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import supabase from "../../superbaseConfig.js";

const EditProfileImage = () => {
  const [imageURL, setImageURL] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setLoading(true);

    try {
      const fileName = `${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (error) {
        throw new Error(error.message);
      }

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      const imageURL = data.publicUrl;

      setImageURL(imageURL);

      const db = getFirestore();
      
      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        { imageURL: imageURL },
        { merge: true }
      );

      alert("Profile image uploaded successfully!");
    } catch (error) {
      console.error("Profile image upload failed:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-image-page">

      {/* Top Bar */}
      <header className="edit-image-topbar">

        <Link to="/settings/editprofile" className="back-link">
          <button className="back-button">
            <span>←</span>
            Back to Profile
          </button>
        </Link>

        <div className="brand-row">

          <span className="brand-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M4 5.5C4 4.67 4.67 4 5.5 4H18.5C19.33 4 20 4.67 20 5.5V15.5C20 16.33 19.33 17 18.5 17H9L5 20.5V17H5.5C4.67 17 4 16.33 4 15.5V5.5Z"
                fill="url(#imageGradient)"
              />

              <defs>
                <linearGradient
                  id="imageGradient"
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
      <main className="edit-image-content">

        <div className="edit-image-container">

          {/* Heading */}
          <div className="page-heading">
            <h1>Edit Profile Image</h1>
            <p>Update your profile picture</p>
          </div>


          {/* Image Card */}
          <div className="image-card">

            <div className="current-image">

              {imageURL ? (
                <img src={imageURL} alt="Profile" />
              ) : (
                <span>U</span>
              )}

            </div>


            <h2>Profile Image</h2>

            <p className="image-description">
              Choose a clear image that represents you on NexaChat.
            </p>


            <label className="change-image-button">

              <span>
                {loading ? "Uploading..." : "Change Profile Image"}
              </span>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
              />

            </label>


            <p className="image-note">
              JPG, PNG or WEBP • Recommended size 400 × 400px
            </p>

          </div>

        </div>

      </main>

    </div>
  );
};

export default EditProfileImage;