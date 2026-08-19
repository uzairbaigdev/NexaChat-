import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc,doc,setDoc, serverTimestamp,
 query, where, getDocs,getDoc,updateDoc , or , and,onSnapshot, deleteDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth,GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo,
onAuthStateChanged,signOut,signInWithEmailAndPassword
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDXzTB9OwqqFQSJ_2s3RClKZ1xxQ_uM2Z4",
  authDomain: "nexachat-1b902.firebaseapp.com",
  projectId: "nexachat-1b902",
  storageBucket: "nexachat-1b902.firebasestorage.app",
  messagingSenderId: "224301095586",
  appId: "1:224301095586:web:9881dc02c0563916aed5fb",
  measurementId: "G-9P3MH5CSYR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, collection, addDoc, createUserWithEmailAndPassword, auth,doc,setDoc,serverTimestamp,
  provider,getAuth, signInWithPopup,GoogleAuthProvider, getAdditionalUserInfo,onAuthStateChanged,  
signOut,  signInWithEmailAndPassword,query,where,getDocs,getDoc,updateDoc , or , and,onSnapshot
,deleteDoc};