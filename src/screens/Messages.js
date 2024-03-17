import React, { useEffect, useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { PRIMARY_COLOR, getChats } from "../services/Utils";
import CustomText from "../components/CustomText";
import { useAuth } from "../hooks/useAuth";
import ChatRow from "../components/ChatRow";
import { useFocusEffect } from "@react-navigation/native";

const Messages = ({ navigation }) => {
    const { userRecord } = useAuth();
    const [chats, setChats] = useState();

    useFocusEffect(React.useCallback(() => {
        const getUserChats = async function() {
            const chatsTmp = await getChats(userRecord.id);
            console.log("chatsTmp", chatsTmp);
    
            setChats(chatsTmp);
        };

        getUserChats();
    }, []));

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
                    renderItem={({item}) => <ChatRow chat={item} />}
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
        marginTop: "16%",
        marginLeft: 20
    },
    container: {
        flex: 1
    },
    body: {
        flex: 1,
        justifyContent: "center",
        paddingTop: 30,
        paddingHorizontal: 20
    }
});

export default Messages;