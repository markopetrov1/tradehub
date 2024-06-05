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
import { AntDesign } from "@expo/vector-icons";
import {
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { CustomHeader } from "../components/Header";

export const SavedScreen = ({ navigation }) => {
  const { user, favouriteItems } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const handleCardPress = (item) => {
    const exchangeRestriction = "restricted";
    navigation.navigate("ItemDetailScreen", { item, exchangeRestriction });
  };

  const handleRemoveFromFavorites = async (item) => {
    console.log(item);
    try {
      const q = query(
        favouriteItemsRef,
        where("savedBy", "==", user.id),
        where("id", "==", item.id)
      );

      const updatedFavouriteItems = favouriteItems.filter(
        (favItem) => favItem.id !== item.id
      );

      dispatch(setFavouriteItems(updatedFavouriteItems));

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    } catch (error) {
      console.error("Error removing item from favourites:", error);
      // Handle the error if necessary
    }
  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity
        onPress={() => {
          handleCardPress(item);
        }}
        style={{
          padding: 20,
          borderRadius: 15,
          marginTop: 20,
          backgroundColor: colors.bg.primary,
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
          }}
        >
          {item.title}
        </Text>

        <TouchableOpacity
          style={{ marginLeft: "auto" }}
          onPress={() => {
            handleRemoveFromFavorites(item);
          }}
        >
          <Ionicons name="star-sharp" size={32} color="yellow" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <CustomHeader chat={true} title={"Favourites"} />
      <View style={styles.inputContainer}>
        {favouriteItems.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={favouriteItems}
            renderItem={({ item }) => renderItem(item)}
          />
        ) : (
          <View style={{ marginTop: 120 }}>
            <LottieView
              style={{
                width: 250,
                height: 250,
                alignSelf: "center",
              }}
              key="animation"
              resizeMode="cover"
              autoPlay
              loop={false}
              source={require("../assets/animations/no-favourites-lottie.json")}
            />
            <Text
              style={{ textAlign: "center", fontSize: 22, fontWeight: "bold" }}
            >
              No saved items
            </Text>
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
  listElement: {
    width: 300,
    // height: 200,
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
});
