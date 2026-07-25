import React from "react";
import "./signup.css";
import { db, auth,doc,createUserWithEmailAndPassword,setDoc,serverTimestamp,provider } from "./firebaseConfig.js";
import { useState } from "react";

const Signup = () => {

const [nameInp,setNameInp] = useState("");
const [emailInp,setEmailInp] = useState("");
const [passwordInp,setPasswordInp] =useState("");

//working on Google Btn
const googleBtn = ()=> {
  try {
    
    

  } catch (error) {
    console.error(error);
  }
}

return (
    <div className="signup-container">
      <div className="signup-card">
        <h1 className="logo">NexaChat</h1>
        <p className="subtitle">Create your account</p>

        <form className="signup-form" onSubmit={async (e) => {
          e.preventDefault();
          try {
              let userCred = await createUserWithEmailAndPassword(auth, emailInp, passwordInp);
              console.log(userCred);
              const docRef = await setDoc(doc(db, "users", userCred.user.uid), {
                username: nameInp,
                email: emailInp,
                createdAt: serverTimestamp()
              })              
          } catch (error) {
            console.error("Something went wrong", error);
          }
        }}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={nameInp}
              onChange={(e)=> setNameInp(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={emailInp}
              onChange={(e)=> setEmailInp(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={passwordInp}
              onChange={(e)=> setPasswordInp(e.target.value)}
            />
          </div>

          <button className="signup-btn">
            Create Account
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button className="google-btn">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            onClick={()=> googleBtn()}
          />
          Continue with Google
        </button>

        <p className="login-text">
          Already have an account?
          <a href="/"> Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;