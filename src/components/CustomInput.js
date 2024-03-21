import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { FONT_FAMILY } from "../services/Utils";

const CustomInput = ({value, setValue, placeholder, secureTextEntry, autoCapitalize, error, style, multiline = false}) => {
    return (
        <View style={[error == true ? styles.errorContainer : styles.container, style]}>
            <TextInput 
                value={value} 
                onChangeText={setValue} 
                placeholder={placeholder} 
                style={styles.input} 
                secureTextEntry={secureTextEntry} 
                autoCapitalize={autoCapitalize}
                multiline={multiline}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',
        borderColor: '#e8e8e8',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginVertical: 5
    },
    errorContainer: {
        backgroundColor: 'white',
        width: '100%',
        borderColor: 'red',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginVertical: 5
    },
    input: {
        fontFamily: FONT_FAMILY
    }
});

export default CustomInput;