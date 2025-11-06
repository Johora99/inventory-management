import React, { useEffect, useState } from 'react'
import AuthContext from '../ContextAPI/AuthContext';
import auth from '../firebase/firebase.init';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';

export default function AuthProvider({children}) {
  const [loading, setLoading] = useState(true)
  const provider = new GoogleAuthProvider();
  const [user, setUser] = useState(() => {
  return localStorage.getItem("userEmail");
  });

  useEffect(() => {
  setLoading(true);
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      setUser(currentUser.email);
      localStorage.setItem("userEmail", currentUser.email);
    } else {
      const storedEmail = localStorage.getItem("userEmail");
      setUser(storedEmail);
    }
    setLoading(false);
  });

  return () => unsubscribe(); // cleanup
}, []);

  const setAuthUser = (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("userEmail", userData.email);
    // setUser(userData.email);
     setUser(userData.email);
  };
    const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setUser(null);
  };
  // handle sign out by firebase =========================
const signOutUser = ()=>{
  setLoading(true)
 signOut(auth)
 .then(res =>{
  
 })
 .catch(err =>{
  console.log(err)
 })
  
}
// google sign in by using firebase =====================
const googleSignIn = ()=>{
  setLoading(true);
  return signInWithPopup(auth,provider);
}
   const authInfo = {
    setLoading,
    setUser,
    user,
    setAuthUser,
    logout,
    signOutUser,
    googleSignIn,
   }
  return (
  <AuthContext.Provider value={authInfo}>
  {children}
  </AuthContext.Provider>
  )
}
