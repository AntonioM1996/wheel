import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, limit, updateDoc, doc, onSnapshot } from "firebase/firestore";
import { app, auth, db } from "../config/firebase";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from "react-native";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const authValue = useProvideAuth();

    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    );
};

function useProvideAuth() {
    const [user, setUser] = useState();
    const [userRecord, setUserRecord] = useState();
    const [loading, setLoading] = useState(true);
    const [expoPushToken, setExpoPushToken] = useState();

    useEffect(() => {
        console.log("--- useProvideAuth useEffect ---");

        const unsubscribe = onAuthStateChanged(
            auth,
            async authenticatedUser => {
                console.log("useProvideAuth onAuthStateChanged - authenticatedUser", authenticatedUser);

                if(authenticatedUser && authenticatedUser.emailVerified) {
                    setUser(authenticatedUser);

                    const q = query(collection(db, "users"), where("userId", "==", authenticatedUser.uid), limit(1));

                    const unsubscribe = onSnapshot(q, (userQuerySnapshot) => {
                        console.log("useAuth - getDocs on users");
                        console.log(userQuerySnapshot.docs[0].data());

                        let thisUserRecord = userQuerySnapshot.docs[0].data();
                        thisUserRecord.id = userQuerySnapshot.docs[0].id;

                        console.log(thisUserRecord);
                        setUserRecord(thisUserRecord);

                        if(!thisUserRecord.expoPushToken) {
                            console.log("--- SETTING expoPushToken ---");

                            registerForPushNotificationsAsync().then(token => {
                                console.log("expoPushToken", token);

                                if(token) {
                                    setExpoPushToken(token);

                                    const userRecordRef = doc(db, "users", thisUserRecord.id);
                                    const updatedUser = {
                                        expoPushToken: token
                                    };

                                    updateDoc(userRecordRef, updatedUser);
                                }
                            });
                        }
                    });

                    return () => unsubscribe();
                }
                else {
                    auth.signOut();
                    setUser(null);
                    setUserRecord(null);
                }
                
                setLoading(false);
            }
        );

        

        return () => {
            unsubscribe();
        }
    }, []);

    return {
        user,
        userRecord,
        loading
    };
}

async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }

        token = await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig.extra.eas.projectId,
        });
    }
    else {
        alert('Must use physical device for Push Notifications');
    }

    return token?.data;
}

export const useAuth = () => {
    return useContext(AuthContext);
};