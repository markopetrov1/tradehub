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
import { useDispatch, useSelector } from "react-redux";
import { setUserLoading } from "../redux/slices/userSlice";
import { Loading } from "../components/Loading";
import { registerUser } from "../utilities/auth";
import { validateEmail } from "../utilities/validation";

export const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { userLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const [errorMsg, setErrorMsg] = useState(null);

  const handleRegister = async () => {
    setEmailError(false);
    setPasswordError(false);
    setErrorMsg(null);

    if (!email || !password || !confirmPassword) {
      setEmailError(true);
      setPasswordError(true);
      setErrorMsg("All fields are required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError(true);
      setErrorMsg("Invalid email address");
      return;
    }

    if (password.length < 8) {
      setPasswordError(true);
      setErrorMsg("Password is too short");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords don't match");
      passwordMatch = false;
      setPasswordError(true);
      return;
    }

    dispatch(setUserLoading(true));

    const status = await registerUser(email, password);

    if (!status) {
      setErrorMsg("Email already exists");
    }

    dispatch(setUserLoading(false));
  };

  return (
    <KeyboardAvoidingView style={styles.mainContainer}>
      <View style={{ justifyContent: "flex-end", marginLeft: 30 }}>
        <BackButton />
      </View>
      <View style={{ flex: 0.7, marginBottom: 50 }}>
        <LottieView
          style={{ width: 220, height: 220, alignSelf: "center" }}
          key="animation"
          resizeMode="cover"
          autoPlay
          loop={false}
          source={require("../assets/animations/register-lottie.json")}
        />
      </View>

      <View style={styles.contentContainer}>
        <View
          style={[styles.inputContainer, { marginTop: 60, marginBottom: 10 }]}
        >
          <Text style={styles.label}>Email</Text>
          <View
            style={[
              styles.inputSubContainer,
              { borderColor: emailError ? "red" : "gray" },
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
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View
            style={[
              styles.inputSubContainer,
              { borderColor: passwordError ? "red" : "gray" },
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={24}
              color="gray"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <MaterialCommunityIcons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="#aaa"
              style={{ marginRight: 10 }}
              onPress={toggleShowPassword}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm password</Text>
          <View
            style={[
              styles.inputSubContainer,
              { borderColor: passwordError ? "red" : "gray" },
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={24}
              color="gray"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <MaterialCommunityIcons
              name={showConfirmPassword ? "eye-off" : "eye"}
              size={24}
              color="#aaa"
              style={{ marginRight: 10 }}
              onPress={toggleShowConfirmPassword}
            />
          </View>
        </View>
        {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
        {userLoading ? (
          <Loading />
        ) : (
          <TouchableOpacity
            style={[styles.submitButton, { marginBottom: 10 }]}
            onPress={handleRegister}
          >
            <Text style={styles.submitButtonText}>Sign up</Text>
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
    flex: 2,
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
