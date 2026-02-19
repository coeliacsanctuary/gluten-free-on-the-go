import React, { createContext, useState, ReactNode } from "react";
import { incrementLifetimeViews } from "@/services/storeReview";

type SessionContextType = {
  eateryDetailsViewCount: number;
  incrementEateryDetailsViewCount: () => void;
  mapSidebarViewCount: number;
  incrementMapSidebarViewCount: () => void;
};

export const SessionContext = createContext<SessionContextType>({
  eateryDetailsViewCount: 0,
  incrementEateryDetailsViewCount: () => {},
  mapSidebarViewCount: 0,
  incrementMapSidebarViewCount: () => {},
});

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [eateryDetailsViewCount, setEateryDetailsViewCount] =
    useState<number>(0);
  const [mapSidebarViewCount, setMapSidebarViewCount] = useState<number>(0);

  const incrementEateryDetailsViewCount = () => {
    setEateryDetailsViewCount((v) => v + 1);
    incrementLifetimeViews();
  };

  const incrementMapSidebarViewCount = () => {
    setMapSidebarViewCount((v) => v + 1);
    incrementLifetimeViews();
  };

  return (
    <SessionContext.Provider
      value={{
        eateryDetailsViewCount,
        incrementEateryDetailsViewCount,
        mapSidebarViewCount,
        incrementMapSidebarViewCount,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
