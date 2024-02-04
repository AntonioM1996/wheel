import React, { useState } from "react";
import { View, Text, Button, StyleSheet, ImageBackground, TextInput, TouchableOpacity } from "react-native";
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import BackgroundImage from "../../assets/wheel_icon.png";
import CustomText from "../components/CustomText";
import CustomInput from "../components/CustomInput";

const Login = () => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const handleLoginPress = function() {
        createUserWithEmailAndPassword(auth, "tolf96@gmail.com", "sium96").then(userCredential => {
            console.log(userCredential);
        }).catch(error => {
            console.error(error);
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <ImageBackground resizeMode="cover" source={BackgroundImage} style={styles.image}>
                </ImageBackground>
            </View>
            <View style={styles.formContainer}>
                <View style={styles.inputBox}>
                    <CustomInput
                        style={styles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={(text) => setUsername(text)}
                    />
                    <CustomInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry={true}
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                    />
                </View>

                <TouchableOpacity>
                    <CustomText>Login</CustomText>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
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
    formContainer: {
        borderColor: "grey",
        borderWidth: 3,
        flex: 1.5,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        paddingHorizontal: 30
    },
    input: {
        height: 60,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 2,
        marginBottom: 16,
        padding: 8,
        borderRadius: 10
    },
    inputBox: {
        marginTop: 120
    }
});

export default Login;