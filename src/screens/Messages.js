import React, { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { PRIMARY_COLOR, getChats } from "../services/Utils";
import CustomText from "../components/CustomText";
import { useAuth } from "../hooks/useAuth";
import ChatRow from "../components/ChatRow";
import { useFocusEffect } from "@react-navigation/native";
import { collection, onSnapshot, query, or, where, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";

const Messages = ({ navigation }) => {
    const { userRecord } = useAuth();
    const [chats, setChats] = useState();

    useEffect(() => {
        const chatsRef = collection(db, "chats");
        const chatQuery = query(
            chatsRef, 
            or(
                where('sourceUser', '==', userRecord.id), 
                where('targetUser', '==', userRecord.id)
            ),
            orderBy(
                "latestMessageDate",
                "desc"
            )
        );

        const unsubscribe = onSnapshot(chatQuery, (chatQuerySnapshot) => {
            const chats = [];

            if(chatQuerySnapshot?.docs) {
                for(const chatDoc of chatQuerySnapshot.docs) {
                    let thisChat = chatDoc.data();
                    thisChat.id = chatDoc.id;
        
                    chats.push(thisChat);
                }
            }

            setChats(chats);
        });

        return () => unsubscribe();
    }, []);

    const handleChatRowPress = function(chat) {
        console.log("handleChatRowPress chat.id", chat.id);
        navigation.navigate("Chat", {
            chat: chat
        });
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <CustomText style={styles.headerText}>
                    Messages
                </CustomText>
            </View>
            <View style={styles.body}>
                <FlatList 
                    data={chats}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => <ChatRow chat={item} onPress={handleChatRowPress} />}
                />
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
        flex: 1,
    },
    body: {
        flex: 1,
        justifyContent: "center",
        paddingTop: 30,
        paddingHorizontal: 20
    }
});

export default Messages;