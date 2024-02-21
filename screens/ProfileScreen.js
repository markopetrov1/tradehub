import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../themes/colors";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { BackButton } from "../components/BackButton";
import {
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import LottieView from "lottie-react-native";
import { Loading } from "../components/Loading";

export const ProfileScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.logoutWrapper}>
        <TouchableOpacity onPress={handleLogout}>
          <MaterialIcons name="logout" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.profileIconWrapper}>
        {loading && (
          <View
            style={{ position: "absolute", top: 50, left: 180, zIndex: 100 }}
          >
            <Loading />
          </View>
        )}
        {user?.profilePic ? (
          <Image
            style={styles.profileIcon}
            source={{ uri: user?.profilePic }}
            onLoadStart={() => {
              setLoading(true);
            }}
            onLoadEnd={() => {
              setLoading(false);
            }}
          />
        ) : (
          <FontAwesome5
            style={styles.profileIcon}
            name="user-alt"
            size={80}
            color="#f3f3f3"
          />
        )}
      </View>
      <View style={{ flex: 1, alignContent: "center" }}>
        {user && (
          <Text style={styles.nameText}>
            {user.firstName} {user.lastName}
          </Text>
        )}
        <TouchableOpacity
          style={{ paddingHorizontal: 120, paddingTop: 15 }}
          onPress={() => {
            navigation.navigate("EditProfileScreen");
          }}
        >
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {/* <LottieView
          style={{
            width: 160,
            height: 280,
            alignSelf: "center",
          }}
          key="animation"
          resizeMode="cover"
          autoPlay
          source={require("../assets/animations/no-data-lottie.json")}
        /> */}

        <View
          style={{
            alignSelf: "center",
            justifyContent: "flex-end",
            flex: 1,
            paddingTop: 50,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              backgroundColor: colors.bg.secondary,
              color: "white",
              padding: 10,
              borderRadius: 10,
              overflow: "hidden",
              marginBottom: Platform.OS === "android" ? 20 : 0,
            }}
          >
            No items yet
          </Text>
        </View>
        <View
          style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}
        >
          <LottieView
            style={{
              width: 75,
              height: 150,
              alignSelf: "flex-end",
              marginBottom: 10,
              transform: [{ rotate: "15deg" }],
            }}
            key="animation"
            resizeMode="cover"
            autoPlay
            source={require("../assets/animations/arrow-lottie.json")}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    paddingTop: 50,
  },
  contentContainer: {
    backgroundColor: colors.bg.inverse,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    flex: 4,
  },
  logoutWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 15,
  },
  profileIcon: {
    alignSelf: "center",
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 15,
    padding: 20,
    width: 127,
    height: 127,
    overflow: "hidden",
  },
  profileIconWrapper: {
    justifyContent: "center",
    marginTop: 30,
  },
  nameText: {
    textAlign: "center",
    fontSize: 18,
    color: "#FFF",
    paddingTop: 15,
  },
  editProfileText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 5,
    paddingHorizontal: 10,
    padding: 3,
    textAlign: "center",
  },
});