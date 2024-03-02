import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import CustomText from "../components/CustomText";
import { PRIMARY_COLOR } from "../services/Utils";
import { auth, db } from "../config/firebase";
import { updateDoc, doc } from "firebase/firestore";
import { Button } from "react-native";
import * as Location from "expo-location";
import { useAuth } from "../hooks/useAuth";
import { geohashForLocation } from "geofire-common";
import { getUsersInRange } from "../services/Utils";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, runOnJS } from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

const Home = ({ navigation }) => {
    const { userRecord } = useAuth();
    const spinPressed = useSharedValue(false);
    const [usersInRange, setUsersInRange] = useState();
    const [drawnUser, setDrawnUser] = useState();

    const tap = Gesture.Tap().onBegin(() => {
        spinPressed.value = true;
    }).onFinalize(() => {
        spinPressed.value = false;
        console.log("usersInRange", usersInRange);

        if(usersInRange && usersInRange.length > 0) {
            const drawnUserTmp = usersInRange[Math.floor(Math.random() * usersInRange.length)];
            console.log("drawnUserTmp", drawnUserTmp);
            runOnJS(setDrawnUser)(drawnUserTmp);
        }
    });

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ scale: withTiming(spinPressed.value ? 1.2 : 1) }],
        opacity: withTiming(spinPressed.value ? 0.5 : 1)
    }));

    useEffect(() => {
        if(userRecord) {
            console.log("userRecord", userRecord);
            console.log("userRecord.userId", userRecord.userId);

            Location.requestForegroundPermissionsAsync().then(result => {
                console.log("POSITION PERMISSION", result);

                if(result.status == "granted") {
                    Location.getCurrentPositionAsync({ }).then(location => {
                        console.log("location", location);

                        if(userRecord && location && location.coords) {
                            const userRecordRef = doc(db, "users", userRecord.id);
                            const geoHash = geohashForLocation([location.coords.latitude, location.coords.longitude]);

                            updateDoc(userRecordRef, {
                                lastPositionLongitude: location.coords.longitude,
                                lastPositionLatitude: location.coords.latitude,
                                geohash: geoHash
                            }).then(async result => {
                                const usersInRangeTmp = await getUsersInRange(
                                    [location.coords.latitude, location.coords.longitude], 
                                    5 * 1000, 
                                    userRecord.id
                                );

                                setUsersInRange(usersInRangeTmp);

                                console.log("usersInRangeTmp", usersInRangeTmp);
                            });
                        }
                    }).catch(error => {
                        console.error(error);
                    });
                }
            });
        }
    }, [userRecord]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <CustomText style={styles.headerText}>
                    Wheel
                </CustomText>
            </View>
            <View style={styles.body}>
                <GestureDetector gesture={tap}>
                    <Animated.View style={[styles.spinButton, animatedStyles]}>
                        <CustomText style={styles.spinButtonText}>SPIN</CustomText>
                    </Animated.View>
                </GestureDetector>
                {
                    drawnUser &&
                    <CustomText>{drawnUser.name}</CustomText>
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1
    },
    header: {
        backgroundColor: "transparent",
        flex: 0.15
    },
    headerText: {
        fontSize: 25,
        fontWeight: "bold",
        color: PRIMARY_COLOR,
        marginTop: "16%",
        marginLeft: 20
    },
    container: {
        flex: 1
    },
    body: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    spinButton: {
        backgroundColor: PRIMARY_COLOR,
        width: 200,
        height: 200,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center"
    },
    spinButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 40,
        fontStyle: "italic"
    }
});

export default Home;