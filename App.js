import React from 'react';
import { AuthProvider } from './src/hooks/useAuth';
import RootNavigator from './src/navigators/RootNavigator';
import { decode } from "base-64";

export default function App() {
    if(typeof atob === "undefined") {
        global.atob = decode;
    }

    return (
        <AuthProvider>
            <RootNavigator />
        </AuthProvider>
    );
};