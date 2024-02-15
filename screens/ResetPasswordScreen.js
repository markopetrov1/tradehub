import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../themes/colors";
import LottieView from "lottie-react-native";
import { BackButton } from "../components/BackButton";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Loading } from "../components/Loading";
import { changePassword } from "../utilities/auth";
import { validateEmail } from "../utilities/validation";

export const ResetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!validateEmail(email)) {
      setErrorMsg("Invalid email address");
      return;
    }

    setIsLoading(true);

    const status = await changePassword(email);

    if (!status) {
      setErrorMsg("Email already exists");
    } else {
      setSuccessMsg("Email with instructions to reset your password was sent");
    }

    setIsLoading(false);
  };

  return (
    <KeyboardAvoidingView style={styles.mainContainer}>
      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        <View style={{ justifyContent: "flex-end", marginLeft: 30 }}>
          <BackButton />
        </View>
        <Text
          style={{
            alignSelf: "center",
            color: colors.text.inverse,
            fontSize: 24,
            fontWeight: "bold",
            marginLeft: 35,
          }}
        >
          Reset password
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <LottieView
          style={{ width: 250, height: 220, alignSelf: "center" }}
          key="animation"
          resizeMode="cover"
          autoPlay
          loop={false}
          source={require("../assets/animations/reset-password-lottie.json")}
        />
      </View>

      <View style={styles.contentContainer}>
        <View
          style={[styles.inputContainer, { marginTop: 50, marginBottom: 20 }]}
        >
          <View style={{ padding: 15 }}>
            <Text
              style={{
                fontSize: 16,
                textAlign: "center",
                color: colors.text.disabled,
                marginBottom: 20,
              }}
            >
              Enter the email address associated with your account
            </Text>
          </View>
          <Text style={styles.label}>Email</Text>
          <View
            style={[
              styles.inputSubContainer,
              { borderColor: errorMsg ? "red" : "gray" },
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={24}
              color="gray"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>
        {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
        {successMsg && <Text style={styles.successText}>{successMsg}</Text>}
        {isLoading ? (
          <Loading />
        ) : (
          <TouchableOpacity
            style={[styles.submitButton, { marginBottom: 10 }]}
            onPress={handleResetPassword}
          >
            <Text style={styles.submitButtonText}>Reset password</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    paddingTop: 50,
  },
  contentContainer: {
    backgroundColor: colors.bg.inverse,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    flex: 1.5,
  },
  inputContainer: {
    marginBottom: 10,
    paddingHorizontal: 40,
  },
  inputSubContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 15,
  },
  inputIcon: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: 40,
    paddingHorizontal: 10,
  },
  submitButton: {
    backgroundColor: colors.bg.secondary,
    paddingVertical: 12,
    borderRadius: 15,
    marginHorizontal: 40,
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  label: {
    color: "gray",
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 10,
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  successText: {
    color: colors.text.success,
    textAlign: "center",
  },
  forgotPasswordText: {
    textAlign: "right",
    paddingTop: 10,
    color: colors.text.disabled,
  },
  iconWrapper: {
    backgroundColor: "#f3f3f3",
    height: 52,
    borderWidth: 1,
    borderColor: colors.brand.muted,
    borderRadius: 15,
    padding: 2,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "black",
    marginHorizontal: 10,
    alignSelf: "center",
  },
});
