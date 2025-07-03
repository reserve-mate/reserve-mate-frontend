import { createContext, RefObject, useContext } from "react";

export const ScrollContext = createContext<RefObject<HTMLElement | null> | null>(null);

export const useScrollRef = () => {
    const ctx = useContext(ScrollContext);
    if (!ctx) throw new Error("ScrollContext not provided");
    return ctx;
};