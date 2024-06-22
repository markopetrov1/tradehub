import {
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../themes/colors";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { formatDate, getRoomId } from "../utilities/methodHelpers";
import { collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { database } from "../config/firebase";


export const ChatItem = ({ item, currentUser }) => {
  const navigation = useNavigation()
  const [ lastMessage, setLastMessage ] = useState(undefined)

  const openChatRoom = () => {
    navigation.navigate("ChatRoomScreen", { item });
  }

  const renderTime = () => {
    if(lastMessage){
      let date = lastMessage?.createdAt;
      return formatDate(new Date(date?.seconds * 1000));
    }
  }

  const renderLastMessage = () => {
    if(typeof lastMessage == "undefined") return "Loading...";

    if(lastMessage){
      if(currentUser?.id == lastMessage?.userId) return "You: "+lastMessage?.text;
      return lastMessage?.text;
    }
    else{
      return "Say Hi 👋";
    }
  }
  
  useEffect(() => {

    let roomId = getRoomId(currentUser?.id, item?.id);
    const docRef = doc(database, "rooms", roomId);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));

    let unsub = onSnapshot(q, (snapshot) =>{
      let allMessages = snapshot.docs.map(doc => {
          return doc.data()
      });
      setLastMessage(allMessages[0] ? allMessages[0] : null);
    });
  }, []);

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
            {renderTime()}
          </Text>
        </View>
        <Text style={{fontSize:14, color: 'darkgray', fontWeight:"500"}}>
        {renderLastMessage()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom:10, 
    marginBottom:20,
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
