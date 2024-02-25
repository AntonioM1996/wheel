import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import CustomText from "../components/CustomText";
import { PRIMARY_COLOR } from "../services/Utils";
import { auth, db } from "../config/firebase";
import { updateDoc, doc } from "firebase/firestore";
import { Button } from "react-native";
import * as Location from "expo-location";
import { useAuth } from "../hooks/useAuth";
import { geohashForLocation } from "geofire-common";
import { getUsersInRange } from "../services/Utils";

const Home = ({ navigation }) => {
    const { userRecord, setUserRecord } = useAuth();

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
                            }).then(result => {
                                const usersInRange = getUsersInRange[[location.coords.latitude, location.coords.longitude], 5 * 1000];
                                console.log("usersInRange", usersInRange);
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
        justifyContent: "center"
    }
});

export default Home;