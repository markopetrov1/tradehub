import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../themes/colors";
import LottieView from "lottie-react-native";
import { BackButton } from "../components/BackButton";
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome,
  Feather,
  FontAwesome5,
} from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, usersRef } from "../config/firebase";
import { useSelector, useDispatch } from "react-redux";
import { Loading } from "../components/Loading";
import { setUserLoading } from "../redux/slices/user";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";

export const EditProfileScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.user);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState(null);

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    setUserData(user);
    setProfilePicUrl(user?.profilePic);
  }, [user]);

  const handleUpdate = async () => {
    let imgUrl = profilePicUrl;

    if (image) {
      imgUrl = await uploadImage();
    }

    const userDocument = doc(usersRef, user.id);

    updateDoc(userDocument, {
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: userData.phoneNumber,
      country: userData.country,
      city: userData.city,
      profilePic: imgUrl,
    }).then(() => {
      console.log("User Updated!");
      Alert.alert(
        "Profile Updated!",
        "Your profile has been updated successfully."
      );
    });
  };

  const uploadImage = async () => {
    if (image == null) {
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);

    // Add timestamp to File Name
    const extension = filename.split(".").pop();
    const name = filename.split(".").slice(0, -1).join(".");
    filename = name + Date.now() + "." + extension;

    setUploading(true);

    const storage = getStorage();

    const storageRef = ref(storage, `photos/${filename}`);

    const task = uploadBytes(storageRef, uploadUri);

    try {
      await task;

      const url = await getDownloadURL(storageRef);

      setUploading(false);
      setImage(null);

      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    }).then((image) => {
      const imageUri = Platform.OS === "ios" ? image.assets[0].uri : image.path;
      setImage(imageUri);
    });
  };

  return (
    <KeyboardAvoidingView style={styles.mainContainer}>
      <View style={{ justifyContent: "flex-end", marginLeft: 30 }}>
        <BackButton />
      </View>
      <TouchableOpacity
        style={styles.profileIconWrapper}
        onPress={choosePhotoFromLibrary}
      >
        {profilePicUrl ? (
          <Image style={styles.profileIcon} source={profilePicUrl} />
        ) : (
          <FontAwesome5
            style={styles.profileIcon}
            name="user-alt"
            size={80}
            color="#f3f3f3"
          />
        )}
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <View style={styles.action}>
          <FontAwesome name="user-o" color="#333333" size={20} />
          <TextInput
            placeholder="First Name"
            placeholderTextColor="#666666"
            autoCorrect={false}
            value={userData ? userData.firstName : ""}
            onChangeText={(txt) => setUserData({ ...userData, firstName: txt })}
            style={styles.textInput}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="user-o" color="#333333" size={20} />
          <TextInput
            placeholder="Last Name"
            placeholderTextColor="#666666"
            value={userData ? userData.lastName : ""}
            onChangeText={(txt) => setUserData({ ...userData, lastName: txt })}
            autoCorrect={false}
            style={styles.textInput}
          />
        </View>
        <View style={styles.action}>
          <Feather name="phone" color="#333333" size={20} />
          <TextInput
            placeholder="Phone number"
            placeholderTextColor="#666666"
            keyboardType="number-pad"
            autoCorrect={false}
            value={userData ? userData.phoneNumber : ""}
            onChangeText={(txt) =>
              setUserData({ ...userData, phoneNumber: txt })
            }
            style={styles.textInput}
          />
        </View>

        <View style={styles.action}>
          <FontAwesome name="globe" color="#333333" size={20} />
          <TextInput
            placeholder="Country"
            placeholderTextColor="#666666"
            autoCorrect={false}
            value={userData ? userData.country : ""}
            onChangeText={(txt) => setUserData({ ...userData, country: txt })}
            style={styles.textInput}
          />
        </View>
        <View style={styles.action}>
          <MaterialCommunityIcons
            name="map-marker-outline"
            color="#333333"
            size={20}
          />
          <TextInput
            placeholder="City"
            placeholderTextColor="#666666"
            autoCorrect={false}
            value={userData ? userData.city : ""}
            onChangeText={(txt) => setUserData({ ...userData, city: txt })}
            style={styles.textInput}
          />
        </View>
        <TouchableOpacity onPress={handleUpdate} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.bg.inverse,
    paddingTop: 50,
  },
  action: {
    flexDirection: "row",
    marginTop: 25,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#333333",
  },
  infoContainer: {
    paddingHorizontal: 30,
  },
  profileIcon: {
    alignSelf: "center",
    borderWidth: 3,
    borderColor: "#f3f3f3",
    borderRadius: 15,
    padding: 20,
    width: 127,
    height: 127,
  },
  profileIconWrapper: {
    justifyContent: "center",
    marginTop: 30,
  },
  submitButtonText: {
    textAlign: "center",
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  submitButton: {
    marginTop: 30,
    backgroundColor: colors.bg.primary,
    width: 100,
    padding: 5,
    borderRadius: 10,
    alignSelf: "center",
  },
});
