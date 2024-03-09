import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { Easing, withSpring, useSharedValue, useAnimatedStyle, runOnJS } from 'react-native-reanimated';
import CustomText from '../components/CustomText';
import { PRIMARY_COLOR } from '../services/Utils';

const DrawnUserCard = ({ user, onClose }) => {
    useEffect(() => {
        showCard();
    }, []);

    const translateY = useSharedValue(-500);

    const showCard = () => {
        translateY.value = withSpring(0, { damping: 10, stiffness: 120, mass: 0.8 });
    };

    const hideCard = () => {
        translateY.value = withSpring(-500, { damping: 10, stiffness: 120, mass: 0.8 }, () => {
            runOnJS(onClose)();
        });
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    return (
        <Animated.View style={[styles.cardContainer, animatedStyle]}>
            <TouchableOpacity style={styles.closeButton} onPress={hideCard}>
                <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <Image
                source={{ uri: user.profilePictureUrl }}
                style={styles.userImage}
            />
            <CustomText style={styles.userName}>{user.name}</CustomText>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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