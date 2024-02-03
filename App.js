import React from 'react';
import { AuthProvider } from './src/hooks/useAuth';
import RootNavigator from './src/navigators/RootNavigator';

export default function App() {
    return (
        <AuthProvider>
            <RootNavigator />
        </AuthProvider>
    );
};