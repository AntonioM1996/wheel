import React, { createContext, useState, useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { app, auth } from "../config/firebase";

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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            async authenticatedUser => {
                console.log("useProvideAuth onAuthStateChanged - authenticatedUser", authenticatedUser);
                setUser(authenticatedUser);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return {
        user,
        loading
    };
}

export const useAuth = () => {
    return useContext(AuthContext);
};