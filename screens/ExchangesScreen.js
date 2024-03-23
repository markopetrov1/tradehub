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
import { favouriteItemsRef } from "../config/firebase";
import {
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export const ExchangesScreen = ({ navigation }) => {
  const { user, userExchanges } = useSelector((state) => state.user);

  const [selectedCategory, setSelectedCategory] = useState("History");

  const [currentExchanges, setCurrentExchanges] = useState([]);

  const dispatch = useDispatch();

  const acceptExchange = () => {};

  const denyExchange = () => {};

  const handleCardPress = (oldItem, type) => {
    const exchangeRestriction = "restricted";
    let item = null;

    if (type === "sender") {
      item = {};
      Object.keys(oldItem).forEach((key) => {
        if (key.startsWith("senderItem")) {
          const newKey =
            key.replace("senderItem", "").charAt(0).toLowerCase() +
            key.replace("senderItem", "").slice(1);
          item[newKey] = oldItem[key];
        }
      });
    } else {
      item = {};
      Object.keys(oldItem).forEach((key) => {
        if (key.startsWith("receiverItem")) {
          const newKey =
            key.replace("receiverItem", "").charAt(0).toLowerCase() +
            key.replace("receiverItem", "").slice(1);
          item[newKey] = oldItem[key];
        }
      });
    }
    navigation.navigate("ItemDetailScreen", { item, exchangeRestriction });
  };

  const getNoExchangesMessage = () => {
    if (selectedCategory === "History") {
      return "No exchanges yet";
    } else if (selectedCategory === "Received") {
      return "No requests yet";
    }
    return "No requests to exchange sent yet";
  };

  const renderExchangeRequests = () => {
    return (
      <FlatList
        data={currentExchanges}
        style={{ marginTop: 30 }}
        renderItem={({ item }) => {
          return (
            <View
              style={{
                margin: 10,
                backgroundColor: "#f3f3f3",
                padding: 10,
                borderRadius: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {item.senderItemUserProfilePic ? (
                  <Image
                    source={{ uri: item.senderItemUserProfilePic }}
                    style={{ borderRadius: 50, width: 35, height: 35 }}
                  />
                ) : (
                  <FontAwesome name="user-circle" size={35} color="black" />
                )}
                <Text
                  style={{
                    marginLeft: 5,
                    padding: 10,
                    width: 270,
                  }}
                >
                  {item.senderItemUserFirstName} {item.senderItemUserLastName}{" "}
                  has sent you an offer to exchange.
                </Text>
                {/* <Text
                  style={{
                    padding: 7,
                    backgroundColor: colors.bg.primary,
                    borderRadius: 5,
                    overflow: "hidden",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  Confirm
                </Text> */}
              </View>
              <View
                style={{
                  padding: 15,
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    handleCardPress(item, "sender");
                  }}
                  style={{ alignItems: "center" }}
                >
                  <Image
                    source={{ uri: item.senderItemItemImage }}
                    style={{
                      width: 100,
                      height: 70,
                      borderRadius: 10,
                      marginBottom: 10,
                    }}
                  />
                  <View style={{ height: 40 }}>
                    <Text
                      style={{ fontSize: 15, textAlign: "center", width: 100 }}
                      numberOfLines={2}
                    >
                      {item.senderItemTitle}
                    </Text>
                  </View>
                </TouchableOpacity>
                <FontAwesome
                  name="exchange"
                  style={{ alignSelf: "flex-start", marginTop: 25 }}
                  size={24}
                  color="gray"
                />
                <TouchableOpacity
                  onPress={() => {
                    handleCardPress(item, "receiver");
                  }}
                  style={{ alignItems: "center" }}
                >
                  <Image
                    source={{ uri: item.receiverItemItemImage }}
                    style={{
                      width: 100,
                      height: 70,
                      borderRadius: 10,
                      marginBottom: 10,
                    }}
                  />
                  <View style={{ height: 40 }}>
                    <Text
                      style={{ fontSize: 15, textAlign: "center", width: 100 }}
                      numberOfLines={2}
                    >
                      {item.receiverItemTitle}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    acceptExchange();
                  }}
                >
                  <Text
                    style={{
                      padding: 7,
                      backgroundColor: colors.bg.primary,
                      borderRadius: 5,
                      overflow: "hidden",
                      color: "#fff",
                      fontWeight: "bold",
                      width: 100,
                      textAlign: "center",
                    }}
                  >
                    Confirm
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    denyExchange();
                  }}
                >
                  <Text
                    style={{
                      padding: 7,
                      backgroundColor: colors.bg.error,
                      borderRadius: 5,
                      overflow: "hidden",
                      color: "#fff",
                      fontWeight: "bold",
                      width: 100,
                      textAlign: "center",
                    }}
                  >
                    Remove
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    );
  };

  const renderSentExchanges = () => {
    return (
      <FlatList
        data={currentExchanges}
        style={{ marginTop: 30 }}
        renderItem={({ item }) => {
          return (
            <View
              style={{
                margin: 10,
                backgroundColor: "#f3f3f3",
                padding: 10,
                borderRadius: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {item.senderItemUserProfilePic ? (
                  <Image
                    source={{ uri: item.receiverItemUserProfilePic }}
                    style={{ borderRadius: 50, width: 35, height: 35 }}
                  />
                ) : (
                  <FontAwesome name="user-circle" size={35} color="black" />
                )}
                <Text style={{ marginLeft: 5, padding: 10, width: 270 }}>
                  You have sent an exchange request to{" "}
                  {item.receiverItemUserFirstName}{" "}
                  {item.receiverItemUserLastName}.
                </Text>
              </View>
              <View
                style={{
                  padding: 15,
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    handleCardPress(item, "sender");
                  }}
                  style={{ alignItems: "center" }}
                >
                  <Image
                    source={{ uri: item.senderItemItemImage }}
                    style={{
                      width: 100,
                      height: 70,
                      borderRadius: 10,
                      marginBottom: 10,
                    }}
                  />
                  <View style={{ height: 40 }}>
                    <Text
                      style={{ fontSize: 15, textAlign: "center", width: 100 }}
                      numberOfLines={2}
                    >
                      {item.senderItemTitle}
                    </Text>
                  </View>
                </TouchableOpacity>
                <FontAwesome
                  name="exchange"
                  style={{ alignSelf: "flex-start", marginTop: 25 }}
                  size={24}
                  color="gray"
                />
                <TouchableOpacity
                  onPress={() => {
                    handleCardPress(item, "receiver");
                  }}
                  style={{ alignItems: "center" }}
                >
                  <Image
                    source={{ uri: item.receiverItemItemImage }}
                    style={{
                      width: 100,
                      height: 70,
                      borderRadius: 10,
                      marginBottom: 10,
                    }}
                  />
                  <View style={{ height: 40 }}>
                    <Text
                      style={{ fontSize: 15, textAlign: "center", width: 100 }}
                      numberOfLines={2}
                    >
                      {item.receiverItemTitle}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    );
  };

  const renderExchangesHistory = () => {
    return (
      <FlatList
        data={currentExchanges}
        renderItem={(item) => {
          return (
            <View>
              <Text>asdasda</Text>
            </View>
          );
        }}
      />
    );
  };
  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerWrapper}>
        <Text style={{ fontWeight: "bold", color: "#FFF", fontSize: 32 }}>
          Exchanges
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <TouchableOpacity
            style={[
              styles.exchangeCategoryWrapper,
              {
                borderColor:
                  selectedCategory == "Sent" ? colors.bg.primary : "lightgray",
              },
            ]}
            onPress={() => {
              setSelectedCategory("Sent");
              setCurrentExchanges(
                userExchanges.filter(
                  (exchange) =>
                    exchange.status === "PENDING" &&
                    exchange.senderItemUserId === user.id
                )
              );
            }}
          >
            <Text
              style={{
                fontSize: 22,
                textAlign: "center",
                fontWeight: "bold",
                color:
                  selectedCategory == "Sent" ? colors.bg.primary : "lightgray",
              }}
            >
              Sent
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.exchangeCategoryWrapper,
              {
                borderColor:
                  selectedCategory == "Received"
                    ? colors.bg.primary
                    : "lightgray",
              },
            ]}
            onPress={() => {
              setSelectedCategory("Received");
              setCurrentExchanges(
                userExchanges.filter(
                  (exchange) =>
                    exchange.status === "PENDING" &&
                    exchange.receiverItemUserId === user.id
                )
              );
            }}
          >
            <Text
              style={{
                fontSize: 22,
                textAlign: "center",
                fontWeight: "bold",
                color:
                  selectedCategory == "Received"
                    ? colors.bg.primary
                    : "lightgray",
              }}
            >
              Received
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.exchangeCategoryWrapper,
              {
                borderColor:
                  selectedCategory == "History"
                    ? colors.bg.primary
                    : "lightgray",
              },
            ]}
            onPress={() => {
              setSelectedCategory("History");
              setCurrentExchanges(
                userExchanges.filter(
                  (exchange) => exchange.status === "SUCCESS"
                )
              );
            }}
          >
            <Text
              style={{
                fontSize: 22,
                textAlign: "center",
                fontWeight: "bold",
                color:
                  selectedCategory == "History"
                    ? colors.bg.primary
                    : "lightgray",
              }}
            >
              History
            </Text>
          </TouchableOpacity>
        </View>
        {currentExchanges.length > 0 ? (
          <>
            {selectedCategory == "Sent" && renderSentExchanges()}
            {selectedCategory == "History" && renderExchangesHistory()}
            {selectedCategory == "Received" && renderExchangeRequests()}
          </>
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
              {getNoExchangesMessage()}
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
  headerWrapper: {
    backgroundColor: colors.bg.primary,
    paddingTop: 50,
    alignItems: "center",
  },
  headerText: {
    fontSize: 28,
    color: "white",
    fontWeight: "bold",
  },
  inputContainer: {
    paddingTop: 15,
    paddingHorizontal: 20,
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
  exchangeCategoryWrapper: {
    borderBottomWidth: 3,
    borderColor: colors.bg.primary,
    width: 100,
  },
});