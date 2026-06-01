import { createContext, useContext } from "react";
import { usePlayerProfilePage } from "./usePlayerProfilePage.js";

const PlayerProfileContext = createContext(null);

export function PlayerProfileProvider({ children }) {
  const value = usePlayerProfilePage();
  return (
    <PlayerProfileContext.Provider value={value}>
      {children}
    </PlayerProfileContext.Provider>
  );
}

export function usePlayerProfileContext() {
  const context = useContext(PlayerProfileContext);
  if (!context) {
    throw new Error(
      "usePlayerProfileContext must be used within PlayerProfileProvider",
    );
  }
  return context;
}
