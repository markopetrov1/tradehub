import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../themes/colors";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

export const ProfileScreen = ({ navigation }) => {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <View style={{ paddingTop: 50 }}>
      <Text style={{ fontSize: 32 }}>ProfileScreen</Text>
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          padding: 10,
          backgroundColor: "#f3f3f3",
          borderWidth: 1,
          borderColor: "black",
        }}
      >
        <Text style={{ fontSize: 32 }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({});
