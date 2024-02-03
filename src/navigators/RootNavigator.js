import React from "react";
import { useAuth } from "../hooks/useAuth";
import { NavigationContainer } from "@react-navigation/native";
import HomeNavigator from "./HomeNavigator";
import AuthNavigator from "./AuthNavigator";

const RootNavigator = () => {
    const { user } = useAuth();

    return (
        <NavigationContainer>
            { user ? <HomeNavigator /> : <AuthNavigator /> }
        </NavigationContainer>
    );
}

export default RootNavigator;