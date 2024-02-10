import React, { useState } from "react";
import { View, Alert, StyleSheet, ImageBackground, TextInput, TouchableOpacity, Platform } from "react-native";
import CustomText from "../components/CustomText";
import BackgroundImage from "../../assets/app_background.jpg";
import { PRIMARY_COLOR, FONT_FAMILY } from "../services/Utils";
import { auth } from "../config/firebase";
import { Button } from "react-native";

const Home = ({ navigation }) => {
    const handleLogoutPress = function() {
        auth.signOut();
    }

    return (
        <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
            <View style={styles.container}>
                <CustomText style={styles.headerText}>Home</CustomText>
                <Button title="Logout" onPress={handleLogoutPress} />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1
    },
    headerText: {
        fontSize: 50,
        fontWeight: "bold",
        marginBottom: 50,
        color: PRIMARY_COLOR
    },
    container: {
        flex: 1,
        padding: 30,
        justifyContent: "center"
    },
    imageContainer: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 50
    },
    image: {
        flex: 1,
        width: 500
    },
    inputContainer: {
        height: 60,
        width: '100%',
        marginBottom: 16,
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
        backgroundColor: 'white',
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
    inputBox: {
    },
    input: {
        marginLeft: 10,
        fontFamily: FONT_FAMILY,
        flex: 1
    },
    button: {
        paddingVertical: 15,
        borderRadius: 50,
        width: 150,
        alignSelf: "flex-end",
        alignItems: "center",
        backgroundColor: PRIMARY_COLOR,
        marginTop: 20,
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
    buttonTitle: {
        color: "white",
        fontWeight: "bold"
    },
    logoImage: {
        width: 50,
        height: 50,
        color: "white"
    },
    signUpTextContainer: {
        marginTop: 20,
        flexDirection: "row"
    },
    signUpText: {
        color: PRIMARY_COLOR,
        fontWeight: "bold"
    },
    wheel: {
        flex: 1
    }
});

export default Home;