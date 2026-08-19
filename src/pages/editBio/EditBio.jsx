import React, { useEffect, useRef, useState } from "react";
import { data, Link } from "react-router-dom";
import "./EditBio.css";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

const EditBio = () => {
  const [bioTxt, setBioTxt] = useState(null);
  const [prevBio, setPrevBio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [getBioData , setBioData] = useState(false) // this flag method for geting data loader 
  const inputRef = useRef(null);
  const Uid = localStorage.getItem("uid");

  const setBio = async () => {
    try {
      setLoading(true);
      let docRef = doc(db, "users", Uid);
      await setDoc(
        docRef,
        {
          bio: bioTxt,
        },
        { merge: true },
      );
      setLoading(false);
      alert("bio update successfully");
    } catch (error) {
      setLoading(false);

      console.error(new Error(error));
    }
  };

  useEffect(() => {
    
    setBioData(true)
    try {
      let docRef = doc(db, "users", Uid);
      const unsub = onSnapshot(docRef, (docSnap) => {
        setPrevBio(docSnap.data().bio);
        setBioData(false)
      });
      return () => unsub();
    } catch (error) {
      setBioData(false)
      console.error(new Error(error));
    }
  }, [Uid]);
  return (
    <>
      <div className="edit-profile-page">
        <header className="edit-profile-topbar">
          <Link to="/settings" className="back-link">
            <button className="back-button">
              <span>←</span>
              Back to Profile
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

        <main className="main-container"> 
          <div className="wrapper-con">
            <h1 className="page-title">Edit Profile Bio</h1>
            <p className="page-subtitle">
              Update your personal bio on NexaChat
            </p>

            <div className="prev-bio-con">
              <div className="em-box">
                <textarea
                  ref={inputRef}
                  onChange={(e) => {
                   (prevBio == e.target.value ) ? setBioTxt(prevBio) : setBioTxt(e.target.value);
                  }}
                  className="bio-input"
                  defaultValue={prevBio}
                  placeholder="Write your bio here..."
                  maxLength={200}
                />
              </div>
              <div style={{ pointerEvents : getBioData ? 'none' : 'auto'}} onClick={() => setBio()} className="change-image-button">
                {loading ? <span class="loader"></span> : <span>Save Bio</span>}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default EditBio;
