import { useEffect, useRef, useState } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, View } from "react-native";
import { CustomHeader } from "../components/Header";
import { colors } from "../themes/colors";
import { BackButton } from "../components/BackButton";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { openURL, canOpenURL } from "expo-linking";
import { Timestamp, addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import { CustomKeyboardView } from "../components/CustomKeyboardView";
import { database } from "../config/firebase";
import { useSelector } from "react-redux";
import { MessagesList } from "../components/MessagesList";
import { getRoomId } from "../utilities/methodHelpers";


export const ChatRoomScreen = ({ route }) => {
    const { user } = useSelector(
        (state) => state.user
      ); // logged in user
    const { item } = route.params; // second user
    const [messages, setMessages] = useState([]);
    const textRef = useRef(" ");
    const inputRef = useRef(null);
  
    useEffect(() => {
      createRoomIfNotExists();

      let roomId = getRoomId(user?.id, item?.id);
      const docRef = doc(database, "rooms", roomId);
      const messagesRef = collection(docRef, "messages");
      const q = query(messagesRef, orderBy("createdAt", "asc"));

      let unsub = onSnapshot(q, (snapshot) =>{
        let allMessages = snapshot.docs.map(doc => {
            return doc.data()
        });
        setMessages([...allMessages])
      });
    }, []);

    const createRoomIfNotExists = async () => {
        let roomId = getRoomId(user?.id, item.id)
        await setDoc(doc(database, "rooms", roomId), {
            roomId,
            createdAt: Timestamp.fromDate(new Date())
        })
    }


    const handleSendMessage = async () => {
        let message = textRef.current.trim();

        if(!message) return;
        try{
            let roomId = getRoomId(user?.id, item?.id);
            const docRef = doc(database, 'rooms', roomId);
            const messagesRef = collection(docRef, "messages");
            textRef.current = "";
            if(inputRef) inputRef?.current.clear();
            const newDoc = await addDoc(messagesRef, {
                userId: user?.id,
                text: message,
                senderFirstName: user.firstName,
                senderLastName: user.lastName,
                createdAt: Timestamp.fromDate(new Date())
            });
        }
        catch(error){
            Alert.alert("Message", error.message)
        }
    }


    return (
      <CustomKeyboardView inChat={true}>
        <View style={styles.mainContainer}>
          <View style={styles.headerWrapper}>
            <BackButton />
            {item.profilePic ? (
              <Image
                source={{ uri: item.profilePic }}
                style={{ borderRadius: 50, width: 40, height: 40, marginLeft: 20 }}
              />
            ) : (
              <FontAwesome name="user-circle" size={40} color="black" style={{ marginLeft: 20 }} />
            )}
            <Text style={{ fontSize: 20, marginLeft: 15, fontWeight: '700', color: '#3b3b3b' }}>
              {item.firstName + ' ' + item.lastName}
            </Text>
            <View style={{ flex: 1 }} />
            <TouchableOpacity onPress={() => { openURL(`tel:${item.phoneNumber}`) }}>
              <Ionicons name="call" size={28} color="#3b3b3b" />
            </TouchableOpacity>
          </View>
          <View style={styles.messagesContainer}>
            <MessagesList currentUser={user} messages={messages}/>
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
            ref={inputRef}
            onChangeText={(value) => textRef.current = value}
              placeholder="Type message..."
              style={styles.input}
            />
            <TouchableOpacity onPress={handleSendMessage}>
              <FontAwesome name="send" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </CustomKeyboardView>
    );
  };
  
  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: '#f0f0f0', // Update with your desired background color
    },
    messagesContainer: {
      flex: 1,
    },
    headerWrapper: {
      paddingTop: 60,
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: 20,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 30,
      margin: 10,
      paddingHorizontal: 15,
      paddingVertical: 10,
      position: 'absolute',
      bottom: 0,
      left: 10,
      right: 10,
      borderWidth: 1,
      borderColor:"lightgray"
    },
    input: {
      flex: 1,
      fontSize: 18,
      padding:5
    },
  });
  