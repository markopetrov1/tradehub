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
import { FontAwesome, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LottieView from "lottie-react-native";
import { Loading } from "../components/Loading";
import { FlatList } from "react-native-gesture-handler";
import { setGuest } from "../redux/slices/userSlice";

export const ProfileScreen = ({ navigation }) => {
  const { user, userItems, guest } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleCardPress = (item) => {
    navigation.navigate("ItemDetailScreen", { item });
  };

  const handleLoginPress = () => {
    dispatch(setGuest(false))
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.listElement}
        onPress={() => {
          handleCardPress(item);
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
            backgroundColor: colors.bg.primary,
            paddingVertical: 10,
          }}
        >
          {item.userProfilePic ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={{ uri: item.userProfilePic }}
                style={{ borderRadius: 50, width: 30, height: 30 }}
              />
              <Text style={{ marginLeft: 5 }}>
                {item.userFirstName} {item.userLastName}
              </Text>
            </View>
          ) : (
            // <FontAwesome name="image" size={24} color="black" />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome name="user-circle" size={22} color="black" />

              <Text style={{ marginLeft: 5 }}>
                {item.userFirstName} {item.userLastName}
              </Text>
            </View>
          )}
        </View>
        <Image source={{ uri: item.itemImage }} style={styles.listImage} />
        <Text
          style={{
            textAlign: "center",
            paddingVertical: 10,
            backgroundColor: colors.bg.primary,
            fontWeight: "bold",
          }}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.logoutWrapper}>
        {
          !guest &&
          <TouchableOpacity onPress={handleLogout}>
            <MaterialIcons name="logout" size={30} color="white" />
          </TouchableOpacity>
        }
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
        {guest && (
          <Text style={styles.nameText}>
            Guest
          </Text>
        )}
        {
          !guest && 
          <TouchableOpacity
            style={{ paddingHorizontal: 120, paddingTop: 15 }}
            onPress={() => {
              navigation.navigate("EditProfileScreen");
            }}
            >
            <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
        }
      </View>

      <View style={[styles.contentContainer, {flex: guest ? 5 : 4}]}>

  {!guest ? (
    <>
      {userItems.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={userItems}
          renderItem={renderItem}
        />
      ) : (
        <>
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
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
            }}
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
        </>
      )}
    </>
  ) : (
    <View style={styles.guestContainer}>
      <Text style={styles.guestText}>Join Tradehub to make exchanges and unlock full features!</Text>
      <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
        <Text style={styles.loginButtonText}>Join</Text>
      </TouchableOpacity>
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
    paddingTop: 50,
  },
  contentContainer: {
    backgroundColor: colors.bg.inverse,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    alignItems: "center",
    paddingTop: 30,
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
  listElement: {
    width: 300,
    borderWidth: 1,
    borderColor: "lightgray",
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  listImage: {
    width: "100%",
    height: 190,
    overflow: "hidden",
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    color: '#3b3b3b',
    paddingHorizontal: 20
  },
  loginButton: {
    backgroundColor: colors.bg.secondary, 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
  },
});
