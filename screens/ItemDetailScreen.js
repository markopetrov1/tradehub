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
import { useEffect, useState } from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { exchangesRef, favouriteItemsRef, itemsRef } from "../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { addDoc } from "firebase/firestore";
import { setFavouriteItems, setUserExchanges } from "../redux/slices/userSlice";
import Modal from "react-native-modal";
import { capitalizeFirstLetter } from "../utilities/methodHelpers";
import { Loading } from "../components/Loading";

export const ItemDetailScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const { exchangeRestriction } = route.params;
  const { user, favouriteItems, userItems, userExchanges } = useSelector(
    (state) => state.user
  );

  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleExchange = async (itemToExchange) => {
    setLoading(true);
    try {
      const capitalizedItem = {};
      const capitalizedItemToExchange = {};

      for (const key in itemToExchange) {
        if (
          Object.hasOwnProperty.call(itemToExchange, key) &&
          key !== "datePosted"
        ) {
          capitalizedItem[`senderItem${capitalizeFirstLetter(key)}`] =
            itemToExchange[key];
        }
      }
      new Date().toISOString;
      for (const key in item) {
        if (Object.hasOwnProperty.call(item, key) && key !== "datePosted") {
          capitalizedItemToExchange[
            `receiverItem${capitalizeFirstLetter(key)}`
          ] = item[key];
        }
      }

      const data = {
        ...capitalizedItem,
        ...capitalizedItemToExchange,
        status: "PENDING",
        date: new Date().toISOString(),
      };

      dispatch(setUserExchanges([...userExchanges, data]));
      await addDoc(exchangesRef, data);
      Alert.alert(
        "Exchange requested!",
        "New exchange has been requested successfully."
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error adding an exchange:", error);
      Alert.alert(
        "Error",
        "Failed to request new exchange. Please try again later."
      );
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const renderUserItemsModal = () => {
    return (
      <Modal
        onBackdropPress={toggleModal}
        isVisible={isModalVisible}
        style={styles.modal}
      >
        <View style={styles.modalContainer}>
          <Text
            style={{
              fontSize: 22,
              textAlign: "center",
              fontWeight: "bold",
              paddingBottom: 10,
            }}
          >
            Choose item to exchange
          </Text>
          <FlatList
            contentContainerStyle={{
              justifyContent: "center",
              alignContent: "center",
            }}
            data={userItems}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  handleExchange(item);
                  toggleModal();
                }}
                style={styles.modalItem}
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
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    );
  };

  const isItemInFavourites = () => {
    return favouriteItems.map((item) => item.id).includes(item.id);
  };

  const addToFavourites = async () => {
    try {
      const { datePosted, ...itemWithoutDatePosted } = item;
      const data = {
        ...itemWithoutDatePosted,
        savedBy: user.id,
      };

      dispatch(setFavouriteItems([...favouriteItems, data]));
      await addDoc(favouriteItemsRef, data);
    } catch (error) {
      console.log("Error adding new item:", error);
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
          disabled={isItemInFavourites()}
        >
          <Ionicons
            name="star-sharp"
            size={40}
            color={isItemInFavourites() ? "yellow" : "white"}
          />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.inputContainer}>
        <View style={styles.inputSubContainer}>
          <Image
            source={{ uri: item.itemImage }}
            style={{
              width: "100%",
              height: 170,
              borderRadius: 15,
              shadowColor: "gray",
              shadowOffset: { width: 3, height: 10 },
              shadowOpacity: 0.5,
              shadowRadius: 4,
            }}
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
          {user.id != item.userId && !exchangeRestriction && (
            <TouchableOpacity
              onPress={toggleModal}
              style={styles.exchangeButton}
            >
              <Text style={styles.exchangeButtonText}>Exchange</Text>
            </TouchableOpacity>
          )}
        </View>
        {loading && (
          <View
            style={{
              position: "absolute",
              top: "50%",
              left: "45%",
              zIndex: 100,
            }}
          >
            <Loading />
          </View>
        )}
      </ScrollView>
      {renderUserItemsModal()}
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
  modalContainer: {
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    width: 330,
    height: 500,
    backgroundColor: "#f3f3f3",
    paddingHorizontal: 30,
    alignSelf: "center",
  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalItem: {
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    backgroundColor: colors.bg.primary,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
});
