import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../themes/colors";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LottieView from "lottie-react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { timeAgo } from "../utilities/methodHelpers";
import { setFavouriteItems } from "../redux/slices/userSlice";
import { favouriteItemsRef } from "../config/firebase";
import {
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { CustomHeader } from "../components/Header";

export const ChatScreen = ({ navigation }) => {
  const { user, matchedUsers } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  return (
    <View style={styles.mainContainer}>
      <CustomHeader title="Chat" back={true} chat={false} />
      <View style={styles.inputContainer}>{}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  inputContainer: {
    paddingTop: 15,
    paddingHorizontal: 40,
    marginTop: 20,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: "white",
    flex: 1,
  },
});
