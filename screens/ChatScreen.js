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
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LottieView from "lottie-react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { timeAgo } from "../utilities/methodHelpers";
import { setFavouriteItems } from "../redux/slices/userSlice";
import { favouriteItemsRef, usersRef } from "../config/firebase";
import {
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { CustomHeader } from "../components/Header";
import { Loading } from "../components/Loading";
import { ChatList } from "../components/ChatList";

export const ChatScreen = ({ navigation }) => {
  const { user, matchedUsers } = useSelector((state) => state.user);

  const [users, setUsers] = useState([]);

  const dispatch = useDispatch();

  const getUsers = async () => {
    // fetch users

    try {
      const q = query(usersRef, where("id", "in", matchedUsers));
      const snapshot = await getDocs(q);
      const fetchedUsers = [];
      snapshot.forEach((doc) => {
        fetchedUsers.push(doc.data());
      });
      setUsers(fetchedUsers);
      console.log("FETCHNATI", fetchedUsers);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <CustomHeader title="Chat" back={true} chat={false} />
      <View style={styles.inputContainer}>
        {users.length > 0 ? (
          <ChatList users={users} />
        ) : (
          <View style={styles.loadingWrapper}>
            <Loading />
          </View>
        )}
      </View>
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
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
});
