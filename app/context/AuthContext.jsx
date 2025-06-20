"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [userName, setUserName] = useState("");
  const [redirectPathAfterLogin, setRedirectPathAfterLogin] = useState(null); // ← NEW

  useEffect(() => {
    // Restore login from localStorage on reload
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");

    if (token) {
      setIsLoggedIn(true);
      setUserName(name || "");
    }
  }, []);

  const login = (token, name) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userName", name); // persist username
    setIsLoggedIn(true);
    setUserName(name);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    setUserName("");
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        showLoginForm,
        setShowLoginForm,
        userName,
        setUserName,
        login,
        logout,
        redirectPathAfterLogin,
        setRedirectPathAfterLogin, // ← expose setter
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
