import { onAuthStateChanged } from "firebase/auth";
import { createContext, useState, useContext, useEffect } from "react";
import { auth, database } from "../misc/firebase";
import { off, onDisconnect, onValue, ref, serverTimestamp, set } from "firebase/database";

export const isOfflineForDatabase = {
  state: 'offline',
  last_changed: serverTimestamp(),
};

const isOnlineForDatabase = {
  state: 'online',
  last_changed: serverTimestamp(),
};

const ProfileContext = createContext();

export const ProfileContextProvider = ({ children }) => {
  const [profile, setProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    let userRef;
    let userStatusDatabaseRef;

    const authUnsub = onAuthStateChanged(auth, async authObj => {
      if (authObj) {
        userRef = ref(database, `/profiles/${authObj.uid}`);
        userStatusDatabaseRef = ref(database, `status/${authObj.uid}`)

        onValue(userRef, snap => {
          const { name, createdAt, avatar } = snap.val();

          const data = {
            name,
            createdAt,
            avatar,
            uid: authObj.uid,
            email: authObj.email,
          };

          setProfile(data);
          setIsLoading(false);
        });
        
        onValue(ref(database, '.info/connected'), snap => {
          if (!!snap.val() === false) {
            return;
          }
          onDisconnect(userStatusDatabaseRef).set(isOfflineForDatabase).then(() => set(userStatusDatabaseRef, isOnlineForDatabase));
        })

      } else {

        if (userRef) {
          off(userRef);        
        }
  
        if (userStatusDatabaseRef) {
          off(userStatusDatabaseRef);
        }

        setProfile(false);
        setIsLoading(false);
      }
    });

    return () => {
      if (userRef) {
        off(userRef);        
      }

      if (userStatusDatabaseRef) {
        off(userStatusDatabaseRef);
      }
      
      off(ref(database, '.info/connected'));

      authUnsub();
    };
  }, []);

  return <ProfileContext.Provider value={{profile, isLoading}}>{children}</ProfileContext.Provider>
}

export const useProfileContext = () => useContext(ProfileContext);