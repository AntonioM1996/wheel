import React from "react";
import { StyleSheet, View, Button } from "react-native";
import { PRIMARY_COLOR } from "../services/Utils";
import CustomText from "../components/CustomText";
import { auth } from "../config/firebase";
import { useAuth } from "../hooks/useAuth";

const Profile = ({ navigation }) => {
    const user = auth.currentUser;
    const { userRecord } = useAuth();

    const handleLogoutPress = function() {
        auth.signOut();
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <CustomText style={styles.headerText}>
                    {userRecord.name}
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

export default Profile;