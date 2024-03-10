import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { Easing, withSpring, useSharedValue, useAnimatedStyle, runOnJS } from 'react-native-reanimated';
import CustomText from '../components/CustomText';
import { PRIMARY_COLOR, createChat } from '../services/Utils';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../hooks/useAuth";

const DrawnUserCard = ({ user, onClose, navigation }) => {
    const { userRecord } = useAuth();

    useEffect(() => {
        showCard();
    }, []);

    const translateY = useSharedValue(-800);

    const showCard = () => {
        translateY.value = withSpring(0, { damping: 10, stiffness: 120, mass: 0.8 });
    };

    const hideCard = (hasAccepted) => {
        translateY.value = withSpring(-800, { damping: 10, stiffness: 120, mass: 0.8 }, () => {
            runOnJS(onClose)();

            if(hasAccepted) {
                runOnJS(navigation.navigate)("Messages");
            }
        });
    };

    const handleAcceptPress = function() {
        console.log("userRecord.id", userRecord.id);
        console.log("user.id", user.id);
        console.log("user.profilePictureUrl", user.profilePictureUrl);

        createChat(userRecord.id, user.id, userRecord.profilePictureUrl, user.profilePictureUrl);
        hideCard(true);
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    return (
        <Animated.View style={[styles.cardContainer, animatedStyle]}>
            <Image
                source={{ uri: user.profilePictureUrl }}
                style={styles.userImage}
            />
            <CustomText style={styles.userName}>{user.name}</CustomText>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={() => hideCard(false)}>
                    <Ionicons style={styles.buttonIcon} name="close-circle" size={100} color="red" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAcceptPress}>
                    <Ionicons style={styles.buttonIcon} name="chatbubbles" size={100} color={PRIMARY_COLOR} />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%",
        marginTop: 100
    },
    buttonIcon: {
        backgroundColor: 'white'
    },
    buttonText: {
        fontSize: 18,
        color: 'blue',
    },
    cardContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    userImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 10,
    },
    userName: {
        fontSize: 30,
        fontWeight: 'bold',
        color: PRIMARY_COLOR
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 10,
    },
    closeButtonText: {
        fontSize: 16,
        color: 'blue',
    },
});

export default DrawnUserCard;