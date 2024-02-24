import React, { createContext, useState, useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { app, auth, db } from "../config/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const authValue = useProvideAuth();

    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    );
};

function useProvideAuth() {
    const [user, setUser] = useState();
    const [userRecord, setUserRecord] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            async authenticatedUser => {
                console.log("useProvideAuth onAuthStateChanged - authenticatedUser", authenticatedUser);

                if(authenticatedUser && authenticatedUser.emailVerified) {
                    setUser(authenticatedUser);

                    const q = query(collection(db, "users"), where("userId", "==", authenticatedUser.uid), limit(1));

                    getDocs(q).then(results => {
                        console.warn("useAuth - getDocs on users");
                        console.warn(results.docs[0].data());
                        let thisUserRecord = results.docs[0].data();
                        thisUserRecord.id = results.docs[0].id;
                        console.warn(thisUserRecord);
                        setUserRecord(thisUserRecord);
                    }).catch(error => {
                        console.error(error);
                    });
                }
                else {
                    auth.signOut();
                    setUser(null);
                }
                
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return {
        user,
        userRecord,
        loading
    };
}

export const useAuth = () => {
    return useContext(AuthContext);
};