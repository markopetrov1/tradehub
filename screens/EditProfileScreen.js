import { createRef, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  View,
} from "react-native";
import { colors } from "../themes/colors";
import LottieView from "lottie-react-native";
import { BackButton } from "../components/BackButton";
import axios from "axios";
import {
  MaterialCommunityIcons,
  AntDesign,
  Ionicons,
  FontAwesome,
  Feather,
  FontAwesome5,
} from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, usersRef } from "../config/firebase";
import { useSelector, useDispatch } from "react-redux";
import { Loading } from "../components/Loading";
import { setUser, setUserLoading } from "../redux/slices/user";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { getCurrentUser } from "../utilities/auth";

export const EditProfileScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.user);
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState(null);

  const [bottomSheetOpened, setBottomSheetOpened] = useState(false);
  const bs = createRef();

  const dispatch = useDispatch();

  useEffect(() => {
    setUserData(user);
  }, [user]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const userDocument = doc(usersRef, user.id);
      await updateDoc(userDocument, userData); // Update user data in database

      // Refresh user data after update
      const response = await getCurrentUser();
      dispatch(setUser(response));

      Alert.alert(
        "Profile Updated!",
        "Your profile has been updated successfully."
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again later.");
    }
  };

  const uploadImage = async (uploadUri) => {
    try {
      setLoading(true);
      // Generate filename with timestamp
      let filename = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);
      const extension = filename.split(".").pop();
      const name = filename.split(".").slice(0, -1).join(".");
      filename = name + Date.now() + "." + extension;

      const storage = getStorage();
      const storageRef = ref(storage, `photos/${filename}`);

      // Fetch the image data
      const response = await fetch(uploadUri);
      const blob = await response.blob();

      // Upload the blob to Firebase Storage
      const snapshot = await uploadBytes(storageRef, blob);

      // Get the download URL
      const url = await getDownloadURL(snapshot.ref);

      setLoading(false);
      setUserData({ ...userData, profilePic: url });

      return url;
    } catch (error) {
      setLoading(false);
      console.log("Error uploading image:", error);
      return null;
    }
  };

  const takePhotoFromCamera = async () => {
    try {
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();
      if (cameraPermission.granted) {
        const image = await ImagePicker.launchCameraAsync({
          compressImageMaxWidth: 300,
          compressImageMaxHeight: 300,
          cropping: true,
          compressImageQuality: 0.7,
        });

        if (image.canceled) return; // User cancelled

        let imageUri = null;
        if (image.assets) {
          imageUri = image.assets[0].uri;
        }

        if (imageUri) {
          setLoading(true);
          await uploadImage(imageUri);
        }
        bs.current && bs.current.snapToPosition(-1);
      } else {
        Alert.alert(
          "Permission Required",
          "Please grant camera permission to take photos."
        );
      }
    } catch (error) {
      console.log("Error taking photo from camera:", error);
      Alert.alert(
        "Error",
        "Failed to take photo from camera. Please try again later."
      );
    }
  };
  const choosePhotoFromLibrary = async () => {
    try {
      const libraryPermission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (libraryPermission.granted) {
        const image = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          quality: 1,
        });

        if (image.canceled) return; // User cancelled

        let imageUri = null;
        if (image.assets) {
          imageUri = image.assets[0].uri;
        }

        if (imageUri) {
          await uploadImage(imageUri);
        }
        bs.current && bs.current.snapToPosition(-1);
      } else {
        Alert.alert(
          "Permission Required",
          "Please grant media library permission to select photos."
        );
      }
    } catch (error) {
      console.log("Error choosing photo from library:", error);
      Alert.alert(
        "Error",
        "Failed to choose photo from library. Please try again later."
      );
    }
  };

  const renderInner = () => (
    <View style={styles.panel}>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.panelTitle}>Upload Photo</Text>
        <Text style={styles.panelSubtitle}>Choose your profile picture</Text>
      </View>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={takePhotoFromCamera}
      >
        <Text style={styles.panelButtonTitle}>Take photo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={choosePhotoFromLibrary}
      >
        <Text style={styles.panelButtonTitle}>Choose from library</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.panelButton, { backgroundColor: colors.bg.error }]}
        onPress={() => {
          bs.current && bs.current.snapToPosition(-1);
        }}
      >
        <Text style={styles.panelButtonTitle}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <KeyboardAvoidingView
        style={[styles.mainContainer, { opacity: bottomSheetOpened ? 0.5 : 1 }]}
      >
        <View style={{ justifyContent: "flex-end", marginLeft: 30 }}>
          <BackButton />
        </View>
        <View>
          <View style={styles.profileIconWrapper}>
            {loading && (
              <View
                style={{
                  position: "absolute",
                  top: 50,
                  left: 180,
                  zIndex: 100,
                }}
              >
                <Loading />
              </View>
            )}
            {userData?.profilePic ? (
              <Image
                style={styles.profileIcon}
                source={{ uri: userData?.profilePic }}
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
            <AntDesign
              name="camera"
              size={24}
              color="white"
              style={styles.cameraIcon}
              onPress={() => {
                bs.current.snapToIndex(0);
                setBottomSheetOpened(true);
              }}
            />
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.action}>
              <FontAwesome name="user-o" color="#333333" size={20} />
              <TextInput
                editable={!bottomSheetOpened}
                placeholder="First Name"
                placeholderTextColor="#666666"
                autoCorrect={false}
                value={userData ? userData.firstName : ""}
                onChangeText={(txt) =>
                  setUserData({ ...userData, firstName: txt })
                }
                style={styles.textInput}
              />
            </View>
            <View style={styles.action}>
              <FontAwesome name="user-o" color="#333333" size={20} />
              <TextInput
                editable={!bottomSheetOpened}
                placeholder="Last Name"
                placeholderTextColor="#666666"
                value={userData ? userData.lastName : ""}
                onChangeText={(txt) =>
                  setUserData({ ...userData, lastName: txt })
                }
                autoCorrect={false}
                style={styles.textInput}
              />
            </View>
            <View style={styles.action}>
              <Feather name="phone" color="#333333" size={20} />
              <TextInput
                editable={!bottomSheetOpened}
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
                editable={!bottomSheetOpened}
                placeholder="Country"
                placeholderTextColor="#666666"
                autoCorrect={false}
                value={userData ? userData.country : ""}
                onChangeText={(txt) =>
                  setUserData({ ...userData, country: txt })
                }
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
                editable={!bottomSheetOpened}
                placeholder="City"
                placeholderTextColor="#666666"
                autoCorrect={false}
                value={userData ? userData.city : ""}
                onChangeText={(txt) => setUserData({ ...userData, city: txt })}
                style={styles.textInput}
              />
            </View>
            {loading ? (
              <View style={{ marginTop: 50 }}>
                <Loading />
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleUpdate}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>Save</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
      <BottomSheet
        onClose={() => {
          setBottomSheetOpened(false);
        }}
        ref={bs}
        snapPoints={["40%"]}
        enablePanDownToClose={true}
        index={-1}
      >
        <BottomSheetView style={{ overflow: "hidden", borderRadius: 20 }}>
          {renderInner()}
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    paddingTop: 50,
    justifyContent: "space-between", // Add this line
  },
  contentContainer: {
    backgroundColor: colors.bg.inverse,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    paddingHorizontal: 30,
    paddingTop: 30, // Add this line
    paddingBottom: 30, // Add this line
    flexGrow: 1,
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
  profileIcon: {
    alignSelf: "center",
    borderWidth: 3,
    borderColor: "#f3f3f3",
    borderRadius: 15,
    padding: 20,
    width: 127,
    height: 127,
    overflow: "hidden",
  },
  profileIconWrapper: {
    justifyContent: "center",
    // marginTop: 40,/
    marginBottom: 50,
  },
  submitButtonText: {
    textAlign: "center",
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  submitButton: {
    marginTop: 40,
    backgroundColor: colors.bg.primary,
    width: 100,
    padding: 5,
    borderRadius: 10,
    alignSelf: "center",
  },
  panel: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#333333",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: "gray",
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: colors.bg.secondary,
    alignItems: "center",
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  cameraIcon: {
    padding: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "white",
    width: 40,
    textAlign: "center",
    height: 38,
    justifyContent: "center",
    position: "absolute",
    top: 95,
    left: 230,
    opacity: 0.8,
  },
});
