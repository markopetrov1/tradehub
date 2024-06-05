import {
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { colors } from "../themes/colors";
import { FontAwesome } from "@expo/vector-icons";

export const ChatItem = ({ item }) => {
  return (
    <TouchableOpacity style={styles.itemWrapper}>
      {item.profilePic ? (
        <Image
          source={{ uri: item.profilePic }}
          style={{ borderRadius: 50, width: 40, height: 40 }}
        />
      ) : (
        <FontAwesome name="user-circle" size={40} color="black" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
    alignItems: "center",
    borderBottomColor: colors.brand.muted,
  },
});
