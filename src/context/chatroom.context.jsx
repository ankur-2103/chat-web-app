import { createContext, useContextSelector } from "use-context-selector";

const CurrentRoomContext = createContext();

export const CurrentRoomContextProvider = ({ children, data }) => {
    return <CurrentRoomContext.Provider value={data}>{children}</CurrentRoomContext.Provider>
} 

export const useCurrentRoomContext = (selector) => useContextSelector(CurrentRoomContext, selector);