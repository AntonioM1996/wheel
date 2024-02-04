import React from "react";
import { View, Text, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
    const clearAsyncStorage = function() {
        AsyncStorage.clear();
    }

    return (
        <View>
            <Text>Home</Text>
            <Button title="Clear AsyncStorage" onPress={clearAsyncStorage} />
        </View>
    );
}

export default Home;