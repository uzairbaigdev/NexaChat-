import { Link, useNavigate } from "react-router-dom";
import "./EditUserName.css";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import React from 'react'
import { useState } from "react";

const EditUserName = () => {
    let [firstName, setFirstName] = useState("");
    let [lastName, setLastName] = useState("");

    let navigate = useNavigate()



    const handleUpdate = async () => {

        try {

            let uid = localStorage.getItem("uid");

            if (!uid) {
                alert('User not found!')
                return
            }

            const username = `${firstName} ${lastName}`.trim();

            await setDoc(doc(db, "users", uid), {
                username: username,
            },
                { merge: true }
            );

            alert('Username updated successfully!');
            navigate("/settings/editprofile");

        } catch (error) {
            console.error("username updated failed:", error);
        }
    }






    return (
        <>
            {/* <header>
        <nav>
            <div>
                <button>
                    <span>←</span>
                    Back to Profile
                </button>
            </div>
        </nav>
    </header> */}

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

            {/* Edit User Name */}
            <div className="main-div">
                <div className="content-div">
                    <h1>Edit User Name</h1> <br />
                    <p>Update your user name</p>
                </div>
                <div className="update-div">
                    <div className='inputs'>
                        <input type="text" placeholder="enter your first name" className="input"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <input type="text" placeholder="enter your last name" className="input"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <button className="update-btn"
                            onClick={handleUpdate}
                        >

                            Update</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditUserName

