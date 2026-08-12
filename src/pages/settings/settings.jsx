import React, { useState,useEffect, useRef } from "react";
import "./settings.css";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth,onAuthStateChanged } from "../../firebaseConfig.js";
import axios from'axios'

const Settings = () => {
  const navigate = useNavigate();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const fileInputRef = useRef(null)
  const[prevURL , setPrevURL] = useState('')
  const[profileImg , setProfileImg] = useState(null)
  // image uploading work
   

   const openFileSelect = () =>{
    fileInputRef.current.click()
  }

    const handleFileChange = (e)=>{
    setProfileImg(e.target.files[0])
    setPrevURL(URL.createObjectURL(e.target.files[0]))
  }

  const profileUpdateBtn = async () =>{
    if (profileImg) {
      
      let fromData = new FormData()

      fromData.append('file', profileImg )
      fromData.append('upload_preset' ,'NexaChat')
      fromData.append('folder', 'NCProfileImg')

      try {

        let postImg = await fetch('https://api.cloudinary.com/v1_1/cieksb93/image/upload' , {
          method:'post',
          body: fromData  
        })

        let urlImg = await postImg.json()
        console.log(urlImg)

        

      } catch (error) {
        console.error(error)
      }

    }    
  }



  // checking if user exist or not
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/signup");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  //working on logout 
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        window.localStorage.removeItem("uid");
        navigate("/signup")})
      .catch((error) => console.error("Logout failed:", error));
  };

  return (
    <div className="settings-page">
      {/* ---------- Top bar ---------- */}
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
                <linearGradient id="brandGradSettings" x1="4" y1="4" x2="20" y2="20">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className="brand-word">NexaChat</span>
        </div>
      </header>

      {/* ---------- Content ---------- */}
      <main className="settings-content">
        <div className="settings-container">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">Manage your account preferences</p>

          <section className="settings-section">

            <h2 className="section-label">Account</h2>

            <div className="settings-card">
          {
          
          (prevURL.length > 0) ? 
          
          <div className="prev-imgBtn-con" >
            <img width={80} height={80} style={{objectFit:'cover' , 
            border:'1px solid black' , 
            borderRadius:'50%'}} src={prevURL} />

            <button onClick={profileUpdateBtn} className="dp-update-btn">update know </button>
          </div>
          :
          null
          }
              
              <input 
              type="file"
              accept="image/*"
              multiple
              style={{display:'none'}}
              ref={fileInputRef}
              onLoad={URL.revokeObjectURL(fileInputRef)}
              onChange={handleFileChange}
               />

              <button 
              type="submit"
              className="settings-row settings-row-danger"
              onClick={openFileSelect}
              > 


              <span className="row-text upload-cion-txt-con row-desc">
                
                <svg className="upload-svg"
                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
        
               </svg>

              update your profile image

              </span>

              <svg className="row-chevron" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M7.3 4.3a1 1 0 000 1.4L11.58 10l-4.3 4.3a1 1 0 001.42 1.4l5-5a1 1 0 000-1.4l-5-5a1 1 0 00-1.4 0z"
                    clipRule="evenodd"
                  />
                </svg>
              
              </button>

            </div>


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
                  <span className="row-desc">Sign out of your account on this device</span>
                </span>
                <svg className="row-chevron" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M7.3 4.3a1 1 0 000 1.4L11.58 10l-4.3 4.3a1 1 0 001.42 1.4l5-5a1 1 0 000-1.4l-5-5a1 1 0 00-1.4 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

            </div>
          </section>
        </div>
      </main>

      {/* ---------- Log out confirmation popup ---------- */}
      {showLogoutPopup && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 className="modal-title">Log out of NexaChat?</h3>
            <p className="modal-desc">You'll need to sign in again next time.</p>

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
                onClick={()=> handleLogout()}
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