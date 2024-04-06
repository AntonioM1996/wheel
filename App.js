import React from 'react';
import { AuthProvider } from './src/hooks/useAuth';
import RootNavigator from './src/navigators/RootNavigator';
import { decode } from "base-64";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import useNotifications from './src/hooks/useNotifications';

export default function App() {
    const {expoPushToken, notification} = useNotifications();

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