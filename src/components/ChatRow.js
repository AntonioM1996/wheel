import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import CustomText from "./CustomText";
import { useAuth } from "../hooks/useAuth";
import { GREY_COLOR, LIGHT_GREY_COLOR, PRIMARY_COLOR } from "../services/Utils";

const ChatRow = ({ chat, onPress }) => {
    const { userRecord } = useAuth();
    const [chatPictureUrl, setChatPictureUrl] = useState();
    const [chatName, setChatName] = useState();

    useEffect(() => {
        if(userRecord && chat) {
            if(userRecord.id != chat.targetUser) {
                setChatPictureUrl(chat.targetUserProfilePicUrl);
                setChatName(chat.targetUserName);
            }
            else if(userRecord.id != chat.sourceUser) {
                setChatPictureUrl(chat.sourceUserProfilePicUrl);
                setChatName(chat.sourceUserName);
            }
        }
    }, []);

    return (
        <TouchableOpacity style={styles.container} onPress={() => {onPress(chat)}}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: chatPictureUrl }}
                    style={styles.userImage}
                />
            </View>
            <View style={styles.chatTextContainer}>
                <CustomText style={{ fontWeight: "bold", color: PRIMARY_COLOR }}>{chatName}</CustomText>
                <CustomText style={{ color: GREY_COLOR }}>{chat.latestMessage}</CustomText>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        borderBottomWidth: 2,
        borderBottomColor: "#F8F8F8",
        alignItems: "center",
        paddingVertical: 10
    },
    userImage: {
        width: 60,
        height: 60,
        borderRadius: 100
    },
    chatTextContainer: {
        flexDirection: "column",
        flex: 2,
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    imageContainer: {
        flex: 0.5
    }
});

export default ChatRow;