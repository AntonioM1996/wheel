import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { doc, query } from "firebase/firestore";
import { db } from "../config/firebase";
import HomeNavigator from "./HomeNavigator";
import AuthNavigator from "./AuthNavigator";
import * as Notifications from 'expo-notifications';

const RootNavigator = () => {
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    const { user } = useAuth();
    const navigationRef = useNavigationContainerRef();

    useEffect(() => {
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log("NEW NOTIFICATION", notification);
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log("NOTIFICATION RESPONSE RECEIVED");
            console.log(response.notification.request);

            if(response.notification.request.content.data?.chatId) {
                const chatRef = doc(db, "chats", response.notification.request.content.data.chatId);
                const chat = query(chatRef);

                // TODO NOT WORKING, navigationRef The 'navigation' object hasn't been initialized yet

                navigationRef.navigate("Chat", {
                    chat: chat
                });
            }
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        }
    }, []);

    return (
        <NavigationContainer>
            { user ? <HomeNavigator /> : <AuthNavigator /> }
        </NavigationContainer>
    );
}

export default RootNavigator;