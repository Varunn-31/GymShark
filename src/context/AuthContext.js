import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guest, setGuestState] = useState(() => localStorage.getItem("guest") === "true");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
      if (currentUser) {
        setGuestState(false);
        localStorage.removeItem("guest");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setGuest = (value) => {
    setGuestState(value);
    if (value) {
      localStorage.setItem("guest", "true");
    } else {
      localStorage.removeItem("guest");
    }
  };

  const value = useMemo(() => ({ user, loading, guest, setGuest }), [user, loading, guest]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
