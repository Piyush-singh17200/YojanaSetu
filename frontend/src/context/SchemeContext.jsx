import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { getCategories } from "../api";

const SchemeContext = createContext(null);

const SAVED_KEY = "schemebridge_saved";
const PROFILE_KEY = "schemebridge_profile";

export function SchemeProvider({ children }) {
  const [profile, setProfileState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(PROFILE_KEY)) || {};
    } catch {
      return {};
    }
  });
  const [saved, setSaved] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SAVED_KEY)) || [];
    } catch {
      return [];
    }
  });
  const [matched, setMatched] = useState(null); // null until onboarding runs a match
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const setProfile = useCallback((updater) => {
    setProfileState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleSave = useCallback((id) => {
    setSaved((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <SchemeContext.Provider value={{ profile, setProfile, saved, toggleSave, matched, setMatched, categories }}>
      {children}
    </SchemeContext.Provider>
  );
}

export function useSchemeContext() {
  const ctx = useContext(SchemeContext);
  if (!ctx) throw new Error("useSchemeContext must be used within SchemeProvider");
  return ctx;
}
