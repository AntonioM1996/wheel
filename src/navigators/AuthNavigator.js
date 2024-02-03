import React from "react";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Sign Up" component={Signup} />
        </Stack.Navigator>
    )
}

export default AuthNavigator;