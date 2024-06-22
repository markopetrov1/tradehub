import {
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import React from "react";
import { colors } from "../themes/colors";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";


export const ChatItem = ({ item }) => {
  const navigation = useNavigation()

  const openChatRoom = () => {
    navigation.navigate("ChatRoomScreen", { item });
  }
  
  return (
    <TouchableOpacity style={styles.itemWrapper} onPress={openChatRoom}>
      {item.profilePic ? (
        <Image
          source={{ uri: item.profilePic }}
          style={{ borderRadius: 50, width: 40, height: 40 }}
        />
      ) : (
        <FontAwesome name="user-circle" size={40} color="black" />
      )}

      <View style={styles.itemContainer}>
        <View style={styles.itemInnerWrapper}>
          <Text style={{fontSize:16, fontWeight:"600", color:"#3b3b3b"}}>
            {item.firstName+" "+item.lastName}
          </Text>
          <Text style={{fontSize:14, color: 'darkgray', fontWeight:"500"}}>
            Time
          </Text>
        </View>
        <Text style={{fontSize:14, color: 'darkgray', fontWeight:"500"}}>
        Last message
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
    paddingBottom:10, 
    alignItems: "center",
    borderBottomColor: "lightgray",
    borderBottomWidth:1
  },
  itemContainer: {
    display:"flex",
    gap: 1,
    flex:1,
    paddingLeft: 10
  },
  itemInnerWrapper: {
    flex:1,
    flexDirection:"row",
    justifyContent:"space-between",
  }
});
