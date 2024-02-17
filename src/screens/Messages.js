import React from "react";
import { StyleSheet, View } from "react-native";
import { PRIMARY_COLOR } from "../services/Utils";
import CustomText from "../components/CustomText";

const Messages = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <CustomText style={styles.headerText}>
                    Messages
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

export default Messages;