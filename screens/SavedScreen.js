import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../themes/colors";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export const SavedScreen = ({ navigation }) => {
  const { user, setFavouriteItems, favouriteItems } = useSelector(
    (state) => state.user
  );
  useEffect(() => {
    console.log("EVEI BRE, ", favouriteItems);
  }, []);
  return (
    <View>
      <Text style={{ fontSize: 32 }}>SavedScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({});
