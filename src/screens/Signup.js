import React, { useState } from "react";
import { View, Alert, StyleSheet, ImageBackground, TextInput, TouchableOpacity, Platform, Image } from "react-native";
import { auth, db, storage } from "../config/firebase";
import { doc, addDoc, collection } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, updateProfile } from "firebase/auth";
import CustomText from "../components/CustomText";
import CustomInput from "../components/CustomInput";
import Ionicons from "@expo/vector-icons/Ionicons";
import BackgroundImage from "../../assets/app_background.jpg";
import { PRIMARY_COLOR, FONT_FAMILY } from "../services/Utils";
import * as ImagePicker from 'expo-image-picker';

const Signup = ({ navigation }) => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [profilePicture, setProfilePicture] = useState();

    const handleSignupPress = function () {
        if (validate()) {
            createUserWithEmailAndPassword(auth, username, password).then(userCredential => {
                const profilePictureRef = ref(storage, "profile_pictures/" + userCredential.user.uid);
                const profilePictureMetadata = {
                    contentType: profilePicture.mimeType,
                };
    
                sendEmailVerification(auth.currentUser);

                uploadString(profilePictureRef, profilePicture.base64, "base64", profilePictureMetadata).then(snapshot => {
                    console.log("snapshot", snapshot);

                    getDownloadURL(profilePictureRef).then(downloadURL => {
                        console.log("profile picture downloadURL", downloadURL);

                        updateProfile(userCredential.user, {
                            displayName: firstName + " " + lastName,
                            photoURL: downloadURL
                        }).then(result => {
                            addDoc(collection(db, "users"), {
                                "userId": userCredential.user.uid,
                                "firstName": firstName,
                                "lastName": lastName,
                                "name": firstName + " " + lastName
                            });

                            navigation.navigate("Login");
                        })
                    });
                }).catch(error => {
                    console.error(error);
                });
            }).catch(error => {
                Alert.alert(error.code, error.message);
            });
        }
    }

    const validate = function () {
        if (password != confirmPassword) {
            Alert.alert("Attention!", "Password different from password confirmation.");
            return false;
        }
        else if (!profilePicture) {
            Alert.alert("Attention!", "Please choose a profile picture.");
            return false;
        }

        return true;
    }

    const handleProfilePicturePress = function () {
        ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0,
            base64: true
        }).then(result => {
            if (!result.canceled) {
                console.log("image uri", result.assets[0].uri);
                console.log("image size", result.assets[0].fileSize / 1000000);
                console.log("image mimeType", result.assets[0].mimeType);

                setProfilePicture(result.assets[0]);
            }
        })
    }

    return (
        <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
            <View style={styles.container}>
                <CustomText style={styles.headerText}>Sign Up</CustomText>
                <View style={styles.inputBox}>
                    <View style={styles.profilePictureContainer}>
                        {profilePicture ?
                            <View>
                                <Image style={styles.profilePicture} source={{ uri: profilePicture.uri }} />
                            </View>
                            :
                            <View>
                                <Ionicons style={styles.profileIcon} name="person-circle-outline" size={130} color={PRIMARY_COLOR}
                                    onPress={handleProfilePicturePress} />
                                <Ionicons style={styles.addIcon} name="add-circle-outline" size={30} color={PRIMARY_COLOR} />
                            </View>
                        }
                    </View>
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={25} color="grey" />
                        <TextInput
                            placeholder="Email"
                            style={styles.input}
                            onChangeText={(text) => setUsername(text)}
                            autoCapitalize="none"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={25} color="grey" />
                        <TextInput
                            placeholder="First name"
                            style={styles.input}
                            onChangeText={(text) => setFirstName(text)}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={25} color="grey" />
                        <TextInput
                            placeholder="Last name"
                            style={styles.input}
                            onChangeText={(text) => setLastName(text)}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={25} color="grey" />
                        <TextInput
                            placeholder="Password"
                            style={styles.input}
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry={true}
                            autoCapitalize="none"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={25} color="grey" />
                        <TextInput
                            placeholder="Confirm Password"
                            style={styles.input}
                            onChangeText={(text) => setConfirmPassword(text)}
                            secureTextEntry={true}
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSignupPress}>
                    <CustomText style={styles.buttonTitle}>SIGN UP</CustomText>
                </TouchableOpacity>

                <View style={styles.signUpTextContainer}>
                    <CustomText>Already have an account? </CustomText>
                    <CustomText style={styles.signUpText} onPress={() => { navigation.navigate("Login") }}>Log In</CustomText>
                </View>
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
        marginBottom: 30,
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
        alignItems: "center"
    },
    input: {
        marginLeft: 10,
        flex: 1,
        fontFamily: FONT_FAMILY
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
    profileIcon: {

    },
    profilePicture: {
        width: 130,
        height: 130,
        borderRadius: 100,
    },
    profilePictureContainer: {
        marginBottom: 10
    },
    addIcon: {
        alignSelf: "flex-end",
        bottom: 32,
        right: 10
    }
});

export default Signup;