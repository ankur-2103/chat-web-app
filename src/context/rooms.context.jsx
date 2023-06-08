import { createContext, useContext, useEffect, useState } from "react";
import { database } from "../misc/firebase";
import { off, onValue, ref } from "firebase/database";
import { transformToArrayWithId } from "../misc/helpers";

const RoomsContext = createContext();

export const RoomsContextProvider = ({ children }) => {
    const [rooms, setRooms] = useState(null)
    
    useEffect(() => {
        const roomsRef = ref(database, 'rooms');
        
        onValue(roomsRef, snap => {
            const data = transformToArrayWithId(snap.val()); 
            data.sort((a, b) => {
                if (a.lastMessage && b.lastMessage) {
                    return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
                } else if (a.lastMessage) {
                    return new Date(b.createdAt) - new Date(a.lastMessage.createdAt);
                }else if (b.lastMessage) {
                    return new Date(b.lastMessage.createdAt) - new Date(a.createdAt);
                }
                return new Date(b.createdAt) - new Date(a.createdAt);
            })
            setRooms(data);
        });

        return () => {
            off(roomsRef);
        }
    },[])

    return <RoomsContext.Provider value={{rooms}}>{children}</RoomsContext.Provider>
}

export const useRoomsContext = () => useContext(RoomsContext);