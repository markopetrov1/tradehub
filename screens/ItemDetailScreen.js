import {
    Button,
    FlatList,
    Image,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from "react-native";
  import { colors } from "../themes/colors";
  import { useEffect } from "react";
  import { Ionicons } from "@expo/vector-icons";
  
  export const ItemDetailScreen = ({ route, navigation }) => {
    const { item } = route.params;
  
    const handleExchange = () => {
      console.log("Should exchange now");
    };
  
    return (
      <View style={styles.mainContainer}>
        <View style={styles.headerWrapper}>
          <Text style={{ fontWeight: "bold", color: "#FFF", fontSize: 32 }}>
            Details
          </Text>
          <TouchableOpacity style={styles.starIconContainer}>
            <Ionicons name="star-sharp" size={40} color="yellow" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Image
            source={{ uri: item.itemImage }}
            style={{ width: 250, height: 170, borderRadius: 15 }}
            resizeMode="cover"
          />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.condition}>Condition: {item.itemCondition}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.preference}>Preference: {item.preference}</Text>
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
      fontWeight: "bold",
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
      marginTop: 30,
    },
    starIconContainer: {
      position: "absolute",
      top: 25,
      right: 15,
    },
  });