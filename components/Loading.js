import { View, ActivityIndicator, StyleSheet } from "react-native";
import React from "react";
import { colors } from "../themes/colors";

export const Loading = () => {
    return (
        <View style={styles.acitivtyIndicatorWrapper}>
            <ActivityIndicator size={"large"} color={colors.bg.secondary} />
        </View>
    );
};

const styles = StyleSheet.create({
    acitivtyIndicatorWrapper: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
    },
});