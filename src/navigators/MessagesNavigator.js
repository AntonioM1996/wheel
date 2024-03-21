import React from "react";
import Messages from "../screens/Messages";
import Chat from "../screens/Chat";
import { createStackNavigator } from "@react-navigation/stack";
import { PlatformColor } from "react-native";

const Stack = createStackNavigator();

const MessagesNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Messages" screenOptions={{
            headerShown: false, 
            cardStyle: { backgroundColor: "white" }
        }}>
            <Stack.Screen name="Messages" component={Messages} />
            <Stack.Screen name="Chat" component={Chat} />
        </Stack.Navigator>
    )
}

export default MessagesNavigator;