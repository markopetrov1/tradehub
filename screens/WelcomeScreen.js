import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../themes/colors";
import LottieView from "lottie-react-native";

export const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.mainContainer}>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Text style={styles.header}>Welcome!</Text>
      </View>
      <View style={{ flex: 3, paddingTop: 50 }}>
        <LottieView
          style={{ width: 300, height: 300, alignSelf: "center" }}
          key="animation"
          resizeMode="cover"
          autoPlay
          loop={false}
          source={require("../assets/animations/greetings-lottie.json")}
        />
      </View>
      <View style={{ flex: 1, alignItems: "center" }}>
        <TouchableOpacity
          style={styles.signUp}
          onPress={() => {
            navigation.navigate("RegisterScreen");
          }}
        >
          <Text
            style={{
              fontSize: 18,
              textAlign: "center",
              fontWeight: "bold",
              color: colors.text.inverse,
            }}
          >
            Sign Up
          </Text>
        </TouchableOpacity>
        <Text style={{ color: colors.text.inverse }}>
          Already have an account?{" "}
          <Text
            style={{ color: colors.bg.secondary }}
            onPress={() => {
              navigation.navigate("LoginScreen");
            }}
          >
            Log in.
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    padding: 20,
  },
  header: {
    fontSize: 34,
    fontWeight: "bold",
    color: colors.text.inverse,
    textAlign: "center",
  },
  signUp: {
    padding: 10,
    borderRadius: 15,
    backgroundColor: colors.bg.secondary,
    textAlign: "center",
    width: 260,
    marginBottom: 15,
  },
});
