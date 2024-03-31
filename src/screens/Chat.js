import React, { useEffect, useState, useCallback, useLayoutEffect } from "react";
import { View, StyleSheet, Button, TextInput } from "react-native";
import { GiftedChat, Send } from "react-native-gifted-chat";
import CustomText from "../components/CustomText";
import CustomInput from "../components/CustomInput";
import { PRIMARY_COLOR, CHAT_MESSAGES_QUERY_LIMIT, getChatMessages, FONT_FAMILY, MAX_LATEST_MESSAGE_LENGTH } from "../services/Utils";
import { useAuth } from "../hooks/useAuth";
import { Timestamp, addDoc, collection, onSnapshot, query, orderBy, limit, updateDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";

const Chat = ({ route, navigation }) => {
    const { chat } = route.params;
    const { userRecord } = useAuth();
    const [chatHeader, setChatHeader] = useState();
    const [targetUserAvatarUrl, setTargetUserAvatarUrl] = useState();
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');

    useLayoutEffect(() => {
        console.log("Chat.chat", chat);
        console.log("userRecord.id", userRecord.id);
        console.log("chatHeader", chatHeader);
        console.log("targetUserAvatarUrl", targetUserAvatarUrl);

        const chatMessagesRef = collection(db, "chats", chat.id, "messages");
        const chatMessagesQuery = query(
            chatMessagesRef, 
            orderBy('createdDate', 'desc'),
            limit(CHAT_MESSAGES_QUERY_LIMIT)
        );

        const unsubscribe = onSnapshot(chatMessagesQuery, (chatMessagesQuerySnapshot) => {
            let messagesTmp = [];
            const chatMessages = [];

            if(chatMessagesQuerySnapshot?.docs) {
                for(const chatMessageDoc of chatMessagesQuerySnapshot.docs) {
                    let thisChatMessage = chatMessageDoc.data();
                    thisChatMessage.id = chatMessageDoc.id;
    
                    chatMessages.push(thisChatMessage);
                }
            }

            chatMessages.forEach((chatMessage, index) => {
                let messageUser = chatMessage.userId;
                let messageUserName;
                let messageAvatar;

                if (chatMessage.userId == userRecord.id) {
                    messageUser = 1;
                    messageUserName = userRecord.name;
                    messageAvatar = userRecord.profilePictureUrl;
                }
                else {
                    messageUser = 2;
                    messageUserName = chatHeader;
                    messageAvatar = targetUserAvatarUrl;
                }

                const message = {
                    _id: index + 1,
                    text: chatMessage.messageBody,
                    createdAt: (chatMessage.createdDate).toDate(),
                    user: {
                        _id: messageUser,
                        name: messageUserName,
                        avatar: targetUserAvatarUrl,
                    },
                }

                messagesTmp.push(message);
            });

            setMessages(messagesTmp);
        });

        if (chatHeader == null || targetUserAvatarUrl == null) {
            if (userRecord.id != chat.targetUser) {
                setChatHeader(chat.targetUserName);
                setTargetUserAvatarUrl(chat.targetUserProfilePicUrl);
            }
            else if (userRecord.id != chat.sourceUser) {
                setChatHeader(chat.sourceUserName);
                setTargetUserAvatarUrl(chat.sourceUserProfilePicUrl);
            }
        }
        else {
            unsubscribe();
        }
    }, [chatHeader, targetUserAvatarUrl]);

    const onSend = useCallback((messages = []) => {
        setMessageInput('');

        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, messages),
        );

        let message = messages[0];

        console.log("messages", messages);

        addDoc(collection(db, "chats", chat.id, "messages"), {
            "userId": userRecord.id,
            "chatId": chat.id,
            "messageBody": message.text,
            "createdDate": Timestamp.fromDate(message.createdAt)
        });

        let chatRef = doc(db, "chats", chat.id);
        
        updateDoc(chatRef, {
            "latestMessage": (message.text).length > 50 ? (message.text).substring(0, MAX_LATEST_MESSAGE_LENGTH) + "..." : message.text,
            "latestMessageDate": Timestamp.fromDate(message.createdAt)
        });
    }, [])

    const renderInputToolbar = useCallback((props) => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <CustomInput
                    {...props}
                    placeholder="Type a message..."
                    style={styles.textInput}
                    setValue={setMessageInput}
                    value={messageInput}
                />
                <Send {...props} containerStyle={{ marginLeft: 10 }} />
            </View>
        );
    }, [messageInput]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <CustomText style={styles.headerText}>
                    {chatHeader}
                </CustomText>
            </View>
            <View style={styles.body}>
                <GiftedChat
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    user={{
                        _id: 1,
                        name: userRecord.name,
                        avatar: userRecord.profilePictureUrl
                    }}
                    renderInputToolbar={renderInputToolbar}
                    minInputToolbarHeight={60}
                    text={messageInput}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
        flex: 1,
    },
    body: {
        flex: 1
    },
    textInput: {
        flex: 1,
        marginHorizontal: 10
    }
});

export default Chat;