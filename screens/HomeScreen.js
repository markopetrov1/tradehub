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
import { database, itemsRef } from "../config/firebase";
import { getDocs, limit, orderBy, query, startAfter } from "firebase/firestore";
import { Loading } from "../components/Loading";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";
import { timeAgo } from "../utilities/methodHelpers";

export const HomeScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.user);

  let onEndReachedCalledDuringMomentum = false;

  const [isLoading, setIsLoading] = useState(false);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [postedItems, setPostedItems] = useState([]);

  useEffect(() => {
    getPostedItems();
  }, []);

  const getPostedItems = async () => {
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

  const getMore = async () => {
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
              newPostedItems.push(doc.data());
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
      getPostedItems();
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
        <Text style={{ fontWeight: "bold", color: "#FFF", fontSize: 32 }}>
          TradeHub
        </Text>
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
              getMore();
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
