import React from 'react';
import { AuthProvider } from './src/hooks/useAuth';
import RootNavigator from './src/navigators/RootNavigator';
import { decode } from "base-64";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
    if (typeof atob === "undefined") {
        global.atob = decode;
    }

    return (
        <AuthProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <RootNavigator />
            </GestureHandlerRootView>
        </AuthProvider>
    );
};