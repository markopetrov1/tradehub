import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../themes/colors";
import { useEffect, useState } from "react";
import {
  database,
  exchangesRef,
  favouriteItemsRef,
  itemsRef,
  matchedUsersRef,
} from "../config/firebase";
import {
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { Loading } from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesome, Feather, AntDesign } from "@expo/vector-icons";
import { timeAgo } from "../utilities/methodHelpers";
import {
  setFavouriteItems,
  setMatchedUsers,
  setUserExchanges,
  setUserItems,
} from "../redux/slices/userSlice";

export const HomeScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  let onEndReachedCalledDuringMomentum = false;

  const [isLoading, setIsLoading] = useState(false);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [postedItems, setPostedItems] = useState([]);

  useEffect(() => {
    getFirstThreeItems();
    getFavouriteItems();
    getUserItems();
    getUserExchanges();
    getMatchedUsers();
  }, []);

  const getUserExchanges = async () => {
    try {
      const senderQ = query(
        exchangesRef,
        where("senderItemUserId", "==", user.id)
      );
      const receiverQ = query(
        exchangesRef,
        where("receiverItemUserId", "==", user.id)
      );

      const [senderSnapshot, receiverSnapshot] = await Promise.all([
        getDocs(senderQ),
        getDocs(receiverQ),
      ]);

      const senderExchanges = senderSnapshot.docs.map((doc) => ({
        exchangeId: doc.id,
        ...doc.data(),
      }));
      const receiverExchanges = receiverSnapshot.docs.map((doc) => ({
        exchangeId: doc.id,
        ...doc.data(),
      }));

      const exchanges = senderExchanges.concat(receiverExchanges);
      dispatch(setUserExchanges(exchanges));
    } catch (error) {
      console.log("Error fetching user exchanges:", error);
    }
  };

  const getMatchedUsers = async () => {
    try {
      const user1Q = query(matchedUsersRef, where("userId1", "==", user.id));
      const user2Q = query(matchedUsersRef, where("userId2", "==", user.id));

      const [firstSnapshot, secondSnapshot] = await Promise.all([
        getDocs(user1Q),
        getDocs(user2Q),
      ]);

      const firstUserIds = firstSnapshot.docs.map((doc) => doc.data().userId2);
      const secondUserIds = secondSnapshot.docs.map(
        (doc) => doc.data().userId1
      );

      const matchedUserIds = [...new Set(firstUserIds.concat(secondUserIds))];
      console.log("MATCHED USERS IDS", matchedUserIds);
      dispatch(setMatchedUsers(matchedUserIds));
    } catch (error) {
      console.log("Error fetching user exchanges:", error);
    }
  };

  const getFavouriteItems = async () => {
    try {
      const q = query(
        favouriteItemsRef,
        where("receiverItemId", "==", user.id)
      );
      const snapshot = await getDocs(q);

      const favouriteItems = [];
      snapshot.forEach((doc) => {
        const itemData = doc.data();
        // Exclude the "datePosted" attribute
        const { datePosted, ...itemWithoutDatePosted } = itemData;
        favouriteItems.push(itemWithoutDatePosted);
      });
      dispatch(setFavouriteItems(favouriteItems));
    } catch (error) {
      console.log("Error fetching favorite items:", error);
    }
  };

  const getUserItems = async () => {
    try {
      const q = query(itemsRef, where("userId", "==", user.id));
      const snapshot = await getDocs(q);

      const userItems = [];
      snapshot.forEach((doc) => {
        const itemData = doc.data();
        const itemId = doc.id;
        const { datePosted, ...itemWithoutDatePosted } = itemData;
        const itemWithId = { id: itemId, ...itemWithoutDatePosted };
        userItems.push(itemWithId);
      });

      dispatch(setUserItems(userItems));
    } catch (error) {
      console.log("Error fetching user's items:", error);
    }
  };

  const getFirstThreeItems = async () => {
    setIsLoading(true);

    const q = query(itemsRef, orderBy("datePosted", "desc"), limit(3));

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      let newPostedItems = [];

      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

      for (let i = 0; i < snapshot.docs.length; i++) {
        const documentId = snapshot.docs[i].id;
        newPostedItems.push({ ...snapshot.docs[i].data(), id: documentId });
      }

      setPostedItems(newPostedItems);
    } else {
      setLastDoc(null);
    }

    setIsLoading(false);
  };

  const getMoreItems = async () => {
    if (lastDoc) {
      setIsMoreLoading(true);

      setTimeout(async () => {
        const q = query(
          itemsRef,
          orderBy("datePosted", "desc"),
          startAfter(lastDoc),
          limit(3)
        );

        try {
          const snapshot = await getDocs(q);

          if (!snapshot.empty) {
            const newPostedItems = [...postedItems];

            snapshot.forEach((doc) => {
              const documentId = doc.id;
              newPostedItems.push({ ...doc.data(), id: documentId });
            });

            setPostedItems(newPostedItems);
            setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
          } else {
            setLastDoc(null);
          }
        } catch (error) {
          console.error("Error fetching more items:", error);
        }

        setIsMoreLoading(false);
      }, 1000);
    }

    onEndReachedCalledDuringMomentum = true;
  };

  const onRefresh = () => {
    setTimeout(() => {
      getFirstThreeItems();
    }, 1000);
  };

  const renderFooter = () => {
    if (!isMoreLoading) return true;

    return (
      <View style={{ alignItems: "center", paddingVertical: 10 }}>
        <Loading />
      </View>
    );
  };

  const handleCardPress = (item) => {
    navigation.navigate("ItemDetailScreen", { item });
  };

  const renderList = (item) => {
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
          <Text style={{ marginLeft: "auto" }}>{timeAgo(item.datePosted)}</Text>
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
      <View style={styles.headerWrapper}>
        <Text
          style={{
            fontWeight: "bold",
            color: "#FFF",
            fontSize: 32,
            flex: 1,
            textAlign: "center",
            paddingLeft: 30,
          }}
        >
          TradeHub
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("ChatScreen")}>
          <AntDesign name="message1" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={postedItems}
          renderItem={({ item }) => renderList(item)}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
          }
          initialNumToRender={3}
          onEndReachedThreshold={0.1}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum = false;
          }}
          onEndReached={() => {
            if (!onEndReachedCalledDuringMomentum && !isMoreLoading) {
              getMoreItems();
            }
          }}
          directionalLockEnabled={true}
        />
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
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 28,
    color: "white",
    fontWeight: "bold",
  },
  inputContainer: {
    paddingTop: 15,
    paddingHorizontal: 40,
    marginTop: 20,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: "white",
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
});
