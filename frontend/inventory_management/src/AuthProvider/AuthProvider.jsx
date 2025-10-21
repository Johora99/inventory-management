import React, { useEffect, useState } from 'react'
import AuthContext from '../ContextAPI/AuthContext';
import auth from '../firebase/firebase.init';
import { onAuthStateChanged } from 'firebase/auth';

export default function AuthProvider({children}) {
  const [loading, setLoading] = useState(true)
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
   const authInfo = {
    setLoading,
    setUser,
    user,
    setAuthUser,
   }
  return (
  <AuthContext.Provider value={authInfo}>
  {children}
  </AuthContext.Provider>
  )
}
