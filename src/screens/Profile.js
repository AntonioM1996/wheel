import React, { useEffect } from "react";
import { StyleSheet, View, Button, Image, Platform } from "react-native";
import { GREY_COLOR, IMAGE_QUALITY, LIGHT_GREY_COLOR, PRIMARY_COLOR } from "../services/Utils";
import CustomText from "../components/CustomText";
import { auth, storage, db } from "../config/firebase";
import { useAuth } from "../hooks/useAuth";
import IconButton from "../components/IconButton";
import CustomInput from "../components/CustomInput";
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateDoc, addDoc, doc, collection } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

const Profile = ({ navigation }) => {
    const user = auth.currentUser;
    const { userRecord } = useAuth();
    const userRecordRef = doc(db, "users", userRecord.id);

    useEffect(() => {
        console.log("--- PROFILE ---");
        console.log(user.photoURL);
    }, [userRecord]);

    const handleLogoutPress = function() {
        auth.signOut();
    }

    const handleEditPicturePress = function() {
        ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: IMAGE_QUALITY
        }).then(result => {
            if (!result.canceled) {
                console.log("image uri", result.assets[0].uri);
                console.log("image size", result.assets[0].fileSize / 1000000);
                console.log("image mimeType", result.assets[0].mimeType);

                // Getting image Blob (using XMLHttpRequest as Fetch API are not working!!)

                const xhr = new XMLHttpRequest();

                xhr.onload = function () {
                    let profilePictureBlob = xhr.response;

                    const profilePictureRef = ref(storage, "images/" + userRecord.userId + "/" + Date.now());

                    uploadBytes(profilePictureRef, profilePictureBlob).then(snapshot => {
                        console.log("snapshot", snapshot);
    
                        getDownloadURL(profilePictureRef).then(downloadURL => {
                            console.log("profile picture downloadURL", downloadURL);
    
                            updateProfile(user, {
                                photoURL: downloadURL
                            }).then(result => {
                                updateDoc(userRecordRef, {
                                    "profilePictureUrl": downloadURL
                                })
    
                                addDoc(collection(db, "images"), {
                                    "userId": userRecord.id,
                                    "imageUrl": downloadURL
                                });
                            });
                        });
                    }).catch(error => {
                        console.error(error);
                    });
                };

                xhr.onerror = function (e) {
                    // TODO
                };

                xhr.responseType = "blob";

                xhr.open("GET", result.assets[0].uri, true);
                xhr.send(true);
            }
        })
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <CustomText style={styles.headerText}>
                    {userRecord.name}
                </CustomText>
            </View>
            <View style={styles.body}>
                <View style={styles.profilePictureContainer}>
                    <View>
                        <Image
                            source={{ uri: userRecord.profilePictureUrl }}
                            style={styles.profilePicture}
                        />
                        <View style={styles.editPictureButton}>
                            <IconButton iconName="images-outline" color="white" size="small" onPress={handleEditPicturePress} />
                        </View>
                    </View>
                </View>
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <CustomText style={styles.inputLabel}>First Name</CustomText>
                        <CustomInput value={userRecord.firstName} style={styles.input} editable={false} />
                    </View>
                    <View style={styles.inputContainer}>
                        <CustomText style={styles.inputLabel}>Last Name</CustomText>
                        <CustomInput value={userRecord.lastName} style={styles.input} editable={false} />
                    </View>
                    <View style={styles.inputContainer}>
                        <CustomText style={styles.inputLabel}>Email</CustomText>
                        <CustomInput value={userRecord.email} style={styles.input} editable={false} />
                    </View>
                </View>
                <Button title="Logout" color="red" onPress={handleLogoutPress} />
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
        marginBottom: 0,
        marginLeft: 20,
        marginTop: "auto"
    },
    container: {
        flex: 1
    },
    body: {
        flex: 1,
        paddingTop: 30,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "space-between"
    },
    profilePictureContainer: {
        alignItems: "center",
        width: "100%"
    },
    profilePicture: {
        width: 150,
        height: 150,
        borderRadius: 100
    },
    editPictureButton: {
        alignSelf: "flex-end",
        bottom: 35
    },
    formContainer: {
        flex: 1,
        width: "100%"
    },
    inputContainer: {
       marginBottom: 10
    },
    inputLabel: {
        color: GREY_COLOR
    },
    input: {
        backgroundColor: LIGHT_GREY_COLOR
    }
});

export default Profile;