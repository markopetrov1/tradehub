import {
  Image,
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
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { getCurrentUser } from "../utilities/auth";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getStorage } from "firebase/storage";

export const ProfileScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.user);

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
        <FontAwesome5
          style={styles.profileIcon}
          name="user-alt"
          size={80}
          color="#f3f3f3"
        />
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

      <View style={styles.contentContainer}></View>
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
