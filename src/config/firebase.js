import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import Constants from "expo-constants";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: Constants.expoConfig.extra.apiKey,
    authDomain: Constants.expoConfig.extra.authDomain,
    projectId: Constants.expoConfig.extra.projectId,
    storageBucket: Constants.expoConfig.extra.storageBucket,
    messagingSenderId: Constants.expoConfig.extra.messagingSenderId,
    appId: Constants.expoConfig.extra.appId
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { app, auth, db, storage };