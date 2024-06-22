import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { CustomHeader } from "../components/Header";
import { colors } from "../themes/colors";
import { BackButton } from "../components/BackButton";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { openURL, canOpenURL } from "expo-linking";



export const ChatRoomScreen = ({ route }) => {
    const { item } = route.params;

    useEffect(() => {
        console.log(item)
    })
    
  return (
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
        <TouchableOpacity onPress={() => {openURL(`tel:${item.phoneNumber}`)}}>
          <Ionicons name="call" size={28} color="#3b3b3b" />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor:  colors.bg.primary,
  },
  inputContainer: {
    paddingTop: 15,
    paddingHorizontal: 40,
    marginTop: 20,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: '#f3f3f3',
    flex: 1,
  },
  headerWrapper: {
    paddingTop: 60,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
});