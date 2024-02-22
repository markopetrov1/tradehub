import {
  Alert,
  Button,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../themes/colors";
import { useEffect } from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { favouriteItemsRef } from "../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { addDoc } from "firebase/firestore";
import { setFavouriteItems } from "../redux/slices/userSlice";

export const ItemDetailScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const { user, favouriteItems } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const handleExchange = () => {
    console.log("Should exchange now");
    isItemInFavourites();
  };

  const isItemInFavourites = () => {
    console.log(favouriteItems.map((item) => item.id));
  };

  const addToFavourites = async () => {
    try {
      const { datePosted, ...itemWithoutDatePosted } = item;
      const data = {
        ...itemWithoutDatePosted,
        savedBy: user.id,
      };

      await addDoc(favouriteItemsRef, data);

      dispatch(setFavouriteItems([...favouriteItems, data]));
      Alert.alert("Added to favourites!", "Item has been saved successfully.");
    } catch (error) {
      console.log("Error adding new item:", error);
      Alert.alert("Error", "Failed to save new item. Please try again later.");
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerWrapper}>
        <Text style={{ fontWeight: "bold", color: "#FFF", fontSize: 32 }}>
          Details
        </Text>
        <TouchableOpacity
          style={styles.starIconContainer}
          onPress={addToFavourites}
        >
          <Ionicons name="star-sharp" size={40} color={"yellow"} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.inputContainer}>
        <View style={styles.inputSubContainer}>
          <Image
            source={{ uri: item.itemImage }}
            style={{ width: "100%", height: 170, borderRadius: 15 }}
            resizeMode="cover"
          />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.condition}>Condition: {item.itemCondition}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.preference}>Preference: {item.preference}</Text>
          <View
            style={{
              marginTop: 20,
              fontWeight: "bold",
              flexDirection: "row",
            }}
          >
            <FontAwesome name="user-circle" size={20} color="black" />
            <Text
              style={[
                styles.preference,
                { fontWeight: "bold", marginLeft: 10 },
              ]}
            >
              {item.userFirstName} {item.userLastName}
            </Text>
          </View>
          <View
            style={{
              marginTop: 10,
              fontWeight: "bold",
              flexDirection: "row",
            }}
          >
            <FontAwesome name="globe" size={20} color="black" />
            <Text
              style={[
                styles.preference,
                { fontWeight: "bold", marginLeft: 10 },
              ]}
            >
              {item.userCity}, {item.userCountry}
            </Text>
          </View>

          <View style={styles.hashtags}>
            {item.hashtags.map((tag, index) => (
              <View key={index} style={styles.singleHashtagContainer}>
                <Text
                  style={{
                    textAlign: "center",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  {tag}
                </Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            onPress={handleExchange}
            style={styles.exchangeButton}
          >
            <Text style={styles.exchangeButtonText}>Exchange</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  headerWrapper: {
    backgroundColor: colors.bg.primary,
    paddingTop: 30,
    alignItems: "center",
  },
  headerText: {
    fontSize: 28,
    color: "white",
    fontWeight: "bold",
  },
  inputContainer: {
    paddingTop: 30,
    paddingHorizontal: 40,
    marginTop: 20,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: "white",
  },
  inputSubContainer: {
    flex: 1,
    alignItems: "center",
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
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 15,
  },
  condition: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 25,
    marginTop: 10,
  },
  description: {
    textAlign: "center",
    marginBottom: 20,
  },
  preference: {
    fontSize: 16,
    marginBottom: 5,
  },
  hashtags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 30,
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
  exchangeButtonText: {
    textAlign: "center",
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  exchangeButton: {
    backgroundColor: colors.bg.primary,
    width: 150,
    padding: 5,
    borderRadius: 10,
    alignSelf: "center",
    marginLeft: "auto",
    marginTop: 20,
    marginBottom: 50,
  },
  starIconContainer: {
    position: "absolute",
    top: 25,
    right: 15,
  },
});
