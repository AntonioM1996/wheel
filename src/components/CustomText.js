import React from "react";
import { Text, StyleSheet } from "react-native";
import { FONT_FAMILY } from "../services/Utils";

const CustomText = (props) => {
    return (
        <Text style={[styles.defaultStyle, props.style]} onPress={props.onPress}>
            {props.children}
        </Text>
    );
}

const styles = StyleSheet.create({
    defaultStyle: {
        fontFamily: FONT_FAMILY
    }
});

export default CustomText;