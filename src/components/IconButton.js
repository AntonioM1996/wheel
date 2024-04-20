import React from "react";
import { StyleSheet, Platform } from "react-native";
import { TouchableOpacity } from "react-native";
import { PRIMARY_COLOR } from "../services/Utils";
import Ionicons from "@expo/vector-icons/Ionicons";

const IconButton = ({ iconName, size = "medium", color = "white", iconColor = PRIMARY_COLOR, onPress }) => {
    let width = 70;
    let height = 70;

    switch (size) {
        case 'small':
            width = 40;
            height = 40;
            break;
        case 'large':
            width = 100;
            height = 100;
            break;
    }

    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, { width: width, height: height, backgroundColor: color }]}>
            <Ionicons style={styles.icon} name={iconName} size={width / 2} color={iconColor} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowOpacity: 0.8,
                shadowRadius: 6,
                shadowOffset: {
                    height: 3,
                    width: 3,
                },
            },
            android: {
                elevation: 5,
            }
        })
    },
    icon: {
        
    }
});

export default IconButton;