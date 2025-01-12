"use client";
import React, { createContext, useState, useEffect, useContext } from "react";

const ClothingContext = createContext();

const getState = (item) => {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(item);
  return saved ? JSON.parse(saved) : [];
};

const setState = (item, value) => {
  localStorage.setItem(item, JSON.stringify(value));

}

export function ClothingProvider({ children }) {
  const [shirts, setShirts] = useState(getState("shirts"));
  const [pants, setPants] = useState(getState("pants"));
  const [hats, setHats] = useState(getState("hats"));

  useEffect(() => {
    setState("shirts", shirts);
  }, [shirts]);
  
  useEffect(() => {
    setState("pants", pants);
  }, [pants]);
  
  useEffect(() => {
    setState("hats", hats);
  }, [hats]);

  return (
    <ClothingContext.Provider
      value={{ shirts, setShirts, pants, setPants, hats, setHats }}
    >
      {children}
    </ClothingContext.Provider>
  );
}

export function useClothing() {
  const context = useContext(ClothingContext);
  if (!context) throw new Error("useClothing must be used ClothingProvider");

  return context;
}
