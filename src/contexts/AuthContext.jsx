import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  // Function to handle Google Sign In
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user document exists
      const userRef = doc(db, 'Users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create new user document with the required structure
        await setDoc(userRef, {
          'Address': '',
          'DOB': '',
          'Email Address': user.email,
          'Full Name': user.displayName || '',
          'Mobile Number': '',
          'ProfilePicture': user.photoURL || '',
          'fcmToken': ''
        });
      }

      return true;
    } catch (error) {
      console.error('Error in Google sign in:', error);
      throw error;
    }
  };

  // Function to handle Email/Password Sign In
  const signInWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // Check if user document exists
      const userRef = doc(db, 'Users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create new user document with the required structure
        await setDoc(userRef, {
          'Address': '',
          'DOB': '',
          'Email Address': user.email,
          'Full Name': user.displayName || '',
          'Mobile Number': '',
          'ProfilePicture': user.photoURL || '',
          'fcmToken': ''
        });
      }

      return true;
    } catch (error) {
      console.error('Error in email sign in:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get the user's Firestore data
        const userRef = doc(db, 'Users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          // Combine auth user and Firestore data
          setCurrentUser({
            ...user,
            ...userSnap.data()
          });
        } else {
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signInWithGoogle,
    signInWithEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

