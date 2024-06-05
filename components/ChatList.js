import { View, ActivityIndicator, StyleSheet } from "react-native";
import React from "react";
import { colors } from "../themes/colors";
import { FlatList } from "react-native-gesture-handler";
import { ChatItem } from "./ChatItem";

export const ChatList = ({ users }) => {
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={users}
        contentContainerStyle={{ flex: 1, paddingVertical: 25 }}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => <ChatItem item={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({});
