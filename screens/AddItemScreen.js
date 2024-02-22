import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  Image,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { Dropdown } from "react-native-element-dropdown";
import { addDoc, serverTimestamp } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Loading } from "../components/Loading";
import { colors } from "../themes/colors";
import { itemsRef } from "../config/firebase";

export const AddItemScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.user);

  const [itemData, setItemData] = useState({
    title: "",
    itemCondition: "",
    description: "",
    preference: "",
    hashtags: [],
    itemImage: "",
    datePosted: "",
  });

  useEffect(() => {
    setItemData({
      ...itemData,
      userId: user.id,
      userProfilePic: user.profilePic,
      datePosted: serverTimestamp(),
      userCity: user.city,
      userCountry: user.country,
      userFirstName: user.firstName,
      userLastName: user.lastName,
    });
  }, [user]);

  const [hashtagText, setHashtagText] = useState("");

  const [isFocus, setIsFocus] = useState(false);
  const [loading, setLoading] = useState(false);

  const conditionsData = [
    { label: "Great", value: "Great" },
    { label: "Good", value: "Good" },
    { label: "Fair", value: "Fair" },
    { label: "Bad", value: "Bad" },
  ];

  const handleAddHashtag = () => {
    if (hashtagText) {
      setItemData({
        ...itemData,
        hashtags: [
          ...itemData.hashtags,
          hashtagText.replace("#", "").toLowerCase(),
        ],
      });
      setHashtagText("");
    }
  };

  const validateFields = () => {
    const { title, itemCondition, description, preference, itemImage } =
      itemData;

    if (!title || !itemCondition || !description || !preference || !itemImage) {
      Alert.alert(
        "All fields required!",
        "Please fill all the fields and upload an image."
      );
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setItemData({
      title: "",
      itemCondition: "",
      description: "",
      preference: "",
      hashtags: [],
      itemImage: "",
      datePosted: "",
    });
  };

  const handleAddItem = async () => {
    setItemData({
      ...itemData,
      userId: user.id,
      userProfilePic: user.profilePic,
    });
    if (!validateFields()) {
      return;
    }
    setLoading(true);
    try {
      await addDoc(itemsRef, itemData);
      Alert.alert("New item added!", "New item has been added successfully.");
      setLoading(false);
      resetForm();
    } catch (error) {
      setLoading(false);
      console.log("Error adding new item:", error);
      Alert.alert("Error", "Failed to add new item. Please try again later.");
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
      setItemData({ ...itemData, itemImage: url });

      return url;
    } catch (error) {
      setLoading(false);
      console.log("Error uploading image:", error);
      return null;
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

  return (
    <KeyboardAvoidingView style={styles.mainContainer}>
      <View style={styles.headerWrapper}>
        <Text style={styles.headerText}>Add Item</Text>
      </View>
      <ScrollView style={styles.inputContainer}>
        <View style={{ alignContent: "center" }}>
          {loading ? (
            <View
              style={{
                alignItems: "center",
                height: 170,
              }}
            >
              <Loading />
            </View>
          ) : itemData?.itemImage ? (
            <Image
              style={styles.profileIcon}
              source={{ uri: itemData?.itemImage }}
            />
          ) : (
            <TouchableOpacity
              style={styles.cameraWrapper}
              onPress={choosePhotoFromLibrary}
            >
              <AntDesign name="camerao" size={80} color="lightgray" />
              <Text style={{ color: "lightgray", fontWeight: "bold" }}>
                Add photo
              </Text>
            </TouchableOpacity>
          )}
          <Text style={[styles.label, { marginTop: 15 }]}>Title</Text>
          <View style={[styles.inputSubContainer, styles.titleInputContainer]}>
            <TextInput
              style={styles.input}
              placeholder="Item title"
              value={itemData.title}
              onChangeText={(text) => {
                setItemData({ ...itemData, title: text });
              }}
            />
          </View>
          <Text style={styles.label}>Item Condition</Text>
          <View style={[styles.dropdownContainer, styles.inputSubContainer]}>
            <Dropdown
              style={styles.dropdown}
              placeholder="Select item condition"
              placeholderStyle={styles.placeholderStyle}
              data={conditionsData}
              labelField="label"
              valueField="value"
              value={itemData.itemCondition}
              onChange={(item) =>
                setItemData({ ...itemData, itemCondition: item.value })
              }
              containerStyle={{
                borderWidth: 1,
                borderColor: "gray",
                borderRadius: 5,
              }}
            />
          </View>

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea, { marginBottom: 30 }]}
            placeholder="Enter item description"
            multiline
            numberOfLines={4}
            value={itemData.description}
            onChangeText={(text) => {
              setItemData({ ...itemData, description: text });
            }}
          />
          <Text style={styles.label}>Preference for swap</Text>
          <View style={styles.inputSubContainer}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What would you like to swap it for?"
              multiline
              numberOfLines={2}
              value={itemData.preference}
              onChangeText={(text) => {
                setItemData({ ...itemData, preference: text });
              }}
            />
          </View>
          <Text style={styles.label}>Add hashtags</Text>
          <View style={styles.hashtagContainer}>
            <TextInput
              style={styles.hashtagInput}
              placeholder="e.g #bike, #phone"
              value={hashtagText}
              onChangeText={setHashtagText}
              returnKeyType="search"
            />
            <TouchableOpacity
              style={styles.hashtagAddbutton}
              onPress={handleAddHashtag}
            >
              <Ionicons name="add-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.addedHashtagsContainer}>
            {itemData.hashtags.map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={styles.singleHashtagContainer}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  #{tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {loading ? (
            <View style={{ marginTop: 20 }}>
              <Loading />
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleAddItem}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>Save</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  headerWrapper: {
    backgroundColor: colors.bg.primary,
    paddingTop: 50,
    paddingBottom: 15,
    alignItems: "center",
  },
  headerText: {
    fontSize: 28,
    color: "white",
    fontWeight: "bold",
  },
  inputContainer: {
    paddingHorizontal: 40,
    marginTop: 20,
  },
  inputSubContainer: {
    marginBottom: 30,
    borderRadius: 10,
  },
  titleInputContainer: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
  },
  dropdownContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "gray",
    paddingLeft: 10,
  },
  label: {
    color: "gray",
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    height: 40,
    paddingHorizontal: 10,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  dropdown: {
    width: "100%",
  },
  placeholderStyle: {
    color: "lightgray",
  },
  hashtagContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    borderWidth: 0.5,
    marginBottom: 30,
  },
  hashtagInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 14,
  },
  hashtagAddbutton: {
    backgroundColor: colors.bg.primary,
    padding: 10,
    borderTopEndRadius: 10,
    borderBottomEndRadius: 10,
  },
  submitButtonText: {
    textAlign: "center",
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: colors.bg.primary,
    width: 150,
    padding: 5,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 50,
  },
  profileIcon: {
    alignSelf: "center",
    borderWidth: 3,
    borderColor: "#f3f3f3",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    height: 170,
  },
  profileIconWrapper: {
    justifyContent: "center",
    marginTop: 30,
  },
  cameraWrapper: {
    borderWidth: 1,
    borderColor: "gray",
    borderStyle: "dashed",
    width: 150,
    padding: 20,
    alignSelf: "center",
    borderRadius: 10,
    alignItems: "center",
  },
  addedHashtagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  singleHashtagContainer: {
    backgroundColor: colors.bg.secondary,
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 10,
    marginRight: 10,
    marginBottom: 10,
    textAlign: "center",
    justifyContent: "center",
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: "white",
  },
});
