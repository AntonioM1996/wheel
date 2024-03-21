import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import CustomText from "../components/CustomText";
import { PRIMARY_COLOR } from "../services/Utils";
import { useAuth } from "../hooks/useAuth";

const Chat = ({ route, navigation }) => {
    const { chat } = route.params;
    const { userRecord } = useAuth();
    const [chatHeader, setChatHeader] = useState();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        console.log("Chat.chat", chat);

        if (userRecord.id != chat.targetUser) {
            setChatHeader(chat.targetUserName);
        }
        else if (userRecord.id != chat.sourceUser) {
            setChatHeader(chat.sourceUserName);
        }

        setMessages([
            {
                _id: 1,
                text: 'Adoro questa SIUMMICA app',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            },
        ])
    }, []);

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, messages),
        )
    }, [])

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
                    }} 
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
        marginTop: "16%",
        marginLeft: 20
    },
    container: {
        flex: 1,
    },
    body: {
        flex: 1
    }
});

export default Chat;