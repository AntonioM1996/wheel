import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import CustomText from "./CustomText";
import { useAuth } from "../hooks/useAuth";
import { GREY_COLOR, PRIMARY_COLOR } from "../services/Utils";

const ChatRow = ({ chat, onPress }) => {
    const { userRecord } = useAuth();
    const [chatPictureUrl, setChatPictureUrl] = useState();
    const [chatName, setChatName] = useState();
    const [messageFontWeight, setMessageFontWeight] = useState("normal");
    const [unread, setUnread] = useState(false);

    useEffect(() => {
        if(userRecord && chat) {
            if(userRecord.id != chat.targetUser) {
                setChatPictureUrl(chat.targetUserProfilePicUrl);
                setChatName(chat.targetUserName);

                if(chat.unreadSourceUser) {
                    setMessageFontWeight("bold");
                    setUnread(true);
                }
                else {
                    setMessageFontWeight("normal");
                    setUnread(false);
                }
            }
            else if(userRecord.id != chat.sourceUser) {
                setChatPictureUrl(chat.sourceUserProfilePicUrl);
                setChatName(chat.sourceUserName);

                if(chat.unreadTargetUser) {
                    setMessageFontWeight("bold");
                    setUnread(true);
                }
                else {
                    setMessageFontWeight("normal");
                    setUnread(false);
                }
            }
        }
    }, [chat]);

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
                <CustomText style={{ color: GREY_COLOR, fontWeight: messageFontWeight }}>{chat.latestMessage}</CustomText>
            </View>
            { unread && <View style={styles.unreadDot} /> }
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
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 100,
        backgroundColor: "#006FF8"
    }
});

export default ChatRow;