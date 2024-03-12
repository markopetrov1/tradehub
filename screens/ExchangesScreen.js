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
  const { user } = useSelector((state) => state.user);

  const [selectedCategory, setSelectedCategory] = useState("History");

  const dispatch = useDispatch();

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
        {/* {favouriteItems.length > 0 ? (
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
        )} */}
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
