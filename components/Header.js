import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../themes/colors";
import { AntDesign } from "@expo/vector-icons";
import { BackButton } from "./BackButton";

export const CustomHeader = ({ title, back, chat }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerWrapper}>
      {back && <BackButton />}
      <Text
        style={[
          styles.headerText,
          { paddingLeft: chat && !back ? 30 : 0, paddingRight: back ? 30 : 0 },
        ]}
      >
        {title}
      </Text>
      {chat && (
        <TouchableOpacity onPress={() => navigation.navigate("ChatScreen")}>
          <AntDesign name="message1" size={28} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: colors.bg.primary,
    paddingTop: 50,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  headerText: {
    fontWeight: "bold",
    color: "#FFF",
    fontSize: 32,
    flex: 1,
    textAlign: "center",
  },
});
