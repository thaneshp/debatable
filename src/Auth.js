import React, { useEffect, useState } from 'react'
import firebaseAppInit from './config/firebase.js'

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        firebaseAppInit.auth().onAuthStateChanged(setCurrentUser);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                currentUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};