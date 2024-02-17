import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import CustomText from "../components/CustomText";
import { PRIMARY_COLOR } from "../services/Utils";
import { auth } from "../config/firebase";
import { Button } from "react-native";

const Home = ({ navigation }) => {
    const handleLogoutPress = function() {
        auth.signOut();
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <CustomText style={styles.headerText}>
                    Wheel
                </CustomText>
            </View>
            <View style={styles.body}>
                <Button title="Logout" onPress={handleLogoutPress} />
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