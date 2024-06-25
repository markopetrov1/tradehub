import {
  Alert,
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
import {
  setFavouriteItems,
  setMatchedUsers,
  setUserExchanges,
} from "../redux/slices/userSlice";
import {
  exchangesRef,
  favouriteItemsRef,
  matchedUsersRef,
} from "../config/firebase";
import {
  Timestamp,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { AntDesign } from "@expo/vector-icons";
import { CustomHeader } from "../components/Header";
import { current } from "@reduxjs/toolkit";

export const ExchangesScreen = ({ navigation }) => {
  const { user, userExchanges, matchedUsers } = useSelector(
    (state) => state.user
  );

  const [selectedCategory, setSelectedCategory] = useState("Received");

  const [currentExchanges, setCurrentExchanges] = useState([]);

  const dispatch = useDispatch();

  const acceptExchange = async (item) => {
    try {
      const data = {
        userId1: user.id,
        userId2: item.senderItemUserId,
      };
      dispatch(setMatchedUsers([...matchedUsers, data]));

      const updatedExchanges = userExchanges.map((exchange) =>
        exchange === item ? { ...exchange, status: "SUCCESS", acceptedAt: Timestamp.fromDate(new Date()).toDate().toDateString()} : exchange
      );
      dispatch(setUserExchanges(updatedExchanges));

      Alert.alert(
        "Exchange successful!",
        `Sucessfully accepted the exchange invitation from ${item.senderItemUserFirstName}. Feel free to chat anytime you want!`
      );

      await addDoc(matchedUsersRef, data);
      const exchangeDoc = doc(exchangesRef, item.exchangeId);
      await updateDoc(exchangeDoc, { ...item, status: "SUCCESS" });
    } catch (error) {
      console.log("Error accepting exchange item:", error);
    }
  };

  const denyExchange = async (item) => {
    try {
      dispatch(
        setUserExchanges(userExchanges.filter((exchange) => exchange != item))
      );

      const exchangeDoc = doc(exchangesRef, item.exchangeId);

      Alert.alert(
        "Exchange denied!",
        `The exchange invitation from ${item.senderItemUserFirstName} ${item.senderItemUserLastName} was denied.`
      );
      await deleteDoc(exchangeDoc.ref);
    } catch (error) {
      console.log("Error removing exchange item:", error);
    }
  };
  useEffect(() => {
    // Filter and set current exchanges based on selected category and userExchanges
    let filteredExchanges = [];
    if (selectedCategory === "Sent") {
      filteredExchanges = userExchanges.filter(
        (exchange) =>
          exchange.status === "PENDING" && exchange.senderItemUserId === user.id
      );
    } else if (selectedCategory === "Received") {
      filteredExchanges = userExchanges.filter(
        (exchange) =>
          exchange.status === "PENDING" &&
          exchange.receiverItemUserId === user.id
      );
    } else if (selectedCategory === "History") {
      filteredExchanges = userExchanges.filter(
        (exchange) => exchange.status === "SUCCESS"
      );
    }
    setCurrentExchanges(filteredExchanges);
  }, [selectedCategory, user.id, userExchanges]);

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
                    acceptExchange(item);
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
                    Accept
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    denyExchange(item);
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
                    Decline
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
                {item.receiverItemUserProfilePic ? (
                  <Image
                    source={{ uri: item.receiverItemUserProfilePic }}
                    style={{ borderRadius: 50, width: 35, height: 35 }}
                  />
                ) : (
                  <FontAwesome name="user-circle" size={33} color="black" />
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
        style={{ marginTop: 30 }}
        renderItem={({ item }) => {
          const isSender = item.senderItemUserId === user.userId;
          const otherUser = isSender ? 'receiver' : 'sender';
  
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
                {item[`${otherUser}ItemUserProfilePic`] ? (
                  <Image
                    source={{ uri: item[`${otherUser}ItemUserProfilePic`] }}
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
                  You have exchanged items with{" "}
                  {item[`${otherUser}ItemUserFirstName`]}{" "}
                  {item[`${otherUser}ItemUserLastName`]} on{" "}
                  {new Date(item.acceptedAt).toLocaleDateString()}.
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
                    handleCardPress(item, otherUser);
                  }}
                  style={{ alignItems: "center" }}
                >
                  <Image
                    source={{ uri: item[`${isSender ? 'sender' : 'receiver'}ItemItemImage`] }}
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
                      {item[`${isSender ? 'sender' : 'receiver'}ItemTitle`]}
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
                    handleCardPress(item, isSender ? 'receiver' : 'sender');
                  }}
                  style={{ alignItems: "center" }}
                >
                  <Image
                    source={{ uri: item[`${otherUser}ItemItemImage`] }}
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
                      {item[`${isSender ? 'receiver' : 'sender'}ItemTitle`]}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  paddingTop: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "gray" }}>
                  Exchanged on {new Date(item.acceptedAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          );
        }}
      />
    );
  };
  

  return (
    <View style={styles.mainContainer}>
      <CustomHeader chat={true} title={"Exchanges"} />
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
