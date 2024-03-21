import React from "react";
import Home from "../screens/Home";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { PRIMARY_COLOR, FONT_FAMILY } from "../services/Utils";
import MessagesNavigator from "../navigators/MessagesNavigator";
import Ionicons from "@expo/vector-icons/Ionicons";
import Profile from "../screens/Profile";

const Tab = createBottomTabNavigator();

const HomeNavigator = () => {
    return (
        <Tab.Navigator initialRouteName="Home" screenOptions={{headerShown: false, tabBarActiveTintColor: PRIMARY_COLOR, 
            tabBarLabelStyle: {fontFamily: FONT_FAMILY}}} sceneContainerStyle={{backgroundColor: "transparent"}} >
            <Tab.Screen name="Home" component={Home} options={{tabBarIcon: ({ focused, color, size }) => {
                let iconName = focused ? "home" : "home-outline";
                return <Ionicons name={iconName} size={size} color={color} />
            }}} />
            <Tab.Screen name="MessagesNavigator" component={MessagesNavigator} options={{tabBarIcon: ({ focused, color, size }) => {
                let iconName = focused ? "chatbubbles" : "chatbubbles-outline";
                return <Ionicons name={iconName} size={size} color={color} />
            }, title: "Messages"}} />
            <Tab.Screen name="Profile" component={Profile} options={{tabBarIcon: ({ focused, color, size }) => {
                let iconName = focused ? "person" : "person-outline";
                return <Ionicons name={iconName} size={size} color={color} />
            }}} />
        </Tab.Navigator>
    )
}

export default HomeNavigator;