import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signup.css";
import {db,auth,doc,createUserWithEmailAndPassword,setDoc,serverTimestamp,signInWithPopup,provider,
getAdditionalUserInfo,onAuthStateChanged} from "../../firebaseConfig.js";

const Signup = () => {
  const navigate = useNavigate();
  const [nameInp, setNameInp] = useState("");
  const [emailInp, setEmailInp] = useState("");
  const [passwordInp, setPasswordInp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // State to manage loader

  // If user is already logged in, skip signup and go straight to dashboard
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Working on email/password authentication
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!nameInp.trim()) {
      setError("Please enter a username.");
      return;
    }
    if (!emailInp.trim()) {
      setError("Please enter an email address.");
      return;
    }
    if (!passwordInp) {
      setError("Please enter a password.");
      return;
    }

    setLoading(true);

    try {
      let userCred = await createUserWithEmailAndPassword(auth, emailInp, passwordInp);
      console.log(userCred)
      await setDoc(doc(db, "users", userCred.user.uid), {
        username: nameInp,
        email: emailInp,
        UID:userCred.user.uid,
        Visibility: "private", 
        createdAt: serverTimestamp()
      });
      //pushing UID to localStorage
      window.localStorage.setItem("uid",userCred.user.uid);  

      setNameInp("");
      setEmailInp("");
      setPasswordInp("");

      navigate("/dashboard");
    } catch (err) {
      console.error("Something went wrong", err);
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  // Working on Google Btn
  const googleBtn = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      //push UID to localStorage
      window.localStorage.setItem("uid",user.uid)

      // Check if this is a new Google account
      const additionalInfo = getAdditionalUserInfo(result);
      if (additionalInfo.isNewUser) {
        await setDoc(doc(db, "users", user.uid), {
          username: user.displayName,
          email: user.email,
          Visibility: "private",
          UID:user.uid,
          createdAt: serverTimestamp(),
        });
        console.log("New user added to Firestore");
      } else {
        console.log("Existing user, data already exists");
      }

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  return (
  <>
    <div className="signup-page">
      {/* ---------- Left: brand / visual panel ---------- */}
      <aside className="visual-panel">
        <div className="glow glow-a"></div>
        <div className="glow glow-b"></div>

        <svg className="constellation" viewBox="0 0 600 800" preserveAspectRatio="none">
          <line x1="60" y1="120" x2="220" y2="240" />
          <line x1="220" y1="240" x2="140" y2="420" />
          <line x1="220" y1="240" x2="420" y2="180" />
          <line x1="140" y1="420" x2="320" y2="520" />
          <line x1="420" y1="180" x2="500" y2="380" />
          <line x1="320" y1="520" x2="500" y2="380" />
          <line x1="320" y1="520" x2="200" y2="660" />
          <circle cx="60" cy="120" r="4" />
          <circle cx="220" cy="240" r="5" />
          <circle cx="140" cy="420" r="4" />
          <circle cx="420" cy="180" r="4" />
          <circle cx="500" cy="380" r="5" />
          <circle cx="320" cy="520" r="4" />
          <circle cx="200" cy="660" r="4" />

          {/* traveling message pulses, follow the lines above */}
          <circle r="5" className="pulse-dot pulse-cyan">
            <animateMotion dur="6s" repeatCount="indefinite" path="M60,120 L220,240 L420,180 L500,380" />
          </circle>
          <circle r="4" className="pulse-dot pulse-indigo">
            <animateMotion
              dur="7.5s"
              begin="1.2s"
              repeatCount="indefinite"
              path="M220,240 L140,420 L320,520 L200,660"
            />
          </circle>
        </svg>

        <div className="visual-content">
          <div className="brand-row">
            <span className="brand-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 5.5C4 4.67157 4.67157 4 5.5 4H18.5C19.3284 4 20 4.67157 20 5.5V15.5C20 16.3284 19.3284 17 18.5 17H9L5 20.5V17H5.5C4.67157 17 4 16.3284 4 15.5V5.5Z"
                  fill="url(#brandGrad)"
                />
                <defs>
                  <linearGradient id="brandGrad" x1="4" y1="4" x2="20" y2="20">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#22D3EE" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span className="brand-word">NexaChat</span>
          </div>

          <h1 className="visual-headline">
            Every conversation.
            <br />
            Everywhere.
          </h1>
          <p className="visual-sub">
            Fast, secure messaging built for global scale. Create an account
            and start talking to anyone, anywhere, instantly.
          </p>

          <div className="chat-chips">
            <div className="chat-chip chip-1">
              <span className="chip-dot"></span>
              Hey! Are we still on for today?
            </div>
            <div className="chat-chip chip-2">
              <span className="chip-dot"></span>
              Just landed, calling you now
            </div>
            <div className="chat-chip chip-3">
              <span className="chip-dot"></span>
              Sent — delivered in 0.2s
            </div>
          </div>
        </div>

        <p className="visual-footer">Trusted by people in 120+ countries</p>
      </aside>

      {/* ---------- Right: form panel ---------- */}
      <main className="form-panel">
        <div className="form-panel-inner">
          <div className="mobile-brand">
            <span className="brand-icon brand-icon-sm">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 5.5C4 4.67157 4.67157 4 5.5 4H18.5C19.3284 4 20 4.67157 20 5.5V15.5C20 16.3284 19.3284 17 18.5 17H9L5 20.5V17H5.5C4.67157 17 4 16.3284 4 15.5V5.5Z"
                  fill="url(#brandGradSm)"
                />
                <defs>
                  <linearGradient id="brandGradSm" x1="4" y1="4" x2="20" y2="20">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#22D3EE" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span className="brand-word brand-word-sm">NexaChat</span>
          </div>

          <h2 className="form-title">Create your account</h2>
          <p className="form-subtitle">It takes less than a minute</p>

          {error ? (
            <div className="error-banner">
              <svg viewBox="0 0 20 20" fill="currentColor" className="error-icon">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9a1 1 0 012 0v3a1 1 0 11-2 0V9zm1-4a1.25 1.25 0 100 2.5A1.25 1.25 0 0010 5z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          ) : null}

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Username</label>
              <div className="input-shell">
                <svg className="input-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 9a4 4 0 100-8 4 4 0 000 8zM10 11c-4.42 0-8 2.24-8 5v1a1 1 0 001 1h14a1 1 0 001-1v-1c0-2.76-3.58-5-8-5z" />
                </svg>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={nameInp}
                  disabled={loading}
                  onChange={(e) => setNameInp(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Email</label>
              <div className="input-shell">
                <svg className="input-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.94 6.94A2 2 0 014.5 6h11a2 2 0 011.56.94L10 12.5 2.94 6.94z" />
                  <path d="M18 8.12l-7.4 5.78a1 1 0 01-1.2 0L2 8.12V13.5A2.5 2.5 0 004.5 16h11a2.5 2.5 0 002.5-2.5V8.12z" />
                </svg>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={emailInp}
                  disabled={loading}
                  onChange={(e) => setEmailInp(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-shell">
                <svg className="input-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 2a4 4 0 00-4 4v2H5a1 1 0 00-1 1v7a2 2 0 002 2h8a2 2 0 002-2V9a1 1 0 00-1-1h-1V6a4 4 0 00-4-4zm2 6V6a2 2 0 10-4 0v2h4z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={passwordInp}
                  disabled={loading}
                  onChange={(e) => setPasswordInp(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? <span className="btn-spinner"></span> : "Create Account"}
            </button>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <button
            type="button"
            className="google-btn"
            onClick={googleBtn}
            disabled={loading}
          >
            {loading ? (
              <span className="btn-spinner"></span>
            ) : (
              <>
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                />
                Continue with Google
              </>
            )}
          </button>

          <p className="login-text">
            Already have an account?
            <Link to="/login"> Log in</Link>
          </p>
        </div>
      </main>
    </div>

  
  </>
 );

}
export default Signup;