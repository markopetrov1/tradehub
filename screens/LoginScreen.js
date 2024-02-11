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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { useSelector, useDispatch } from "react-redux";
import { Loading } from "../components/Loading";
import { setUserLoading } from "../redux/slices/user";

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const { userLoading } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const [errorMsg, setErrorMsg] = useState(null);

  const handleSignIn = async () => {
    setEmailError(false);
    setPasswordError(false);
    setErrorMsg(null);

    if (!email || !password) {
      setEmailError(true);
      setPasswordError(true);
      setErrorMsg("All fields are required!");
      return;
    }

    try {
      dispatch(setUserLoading(true));
      await signInWithEmailAndPassword(auth, email, password);
      dispatch(setUserLoading(false));
    } catch (e) {
      setErrorMsg("Invalid email or password");
      dispatch(setUserLoading(false));
    }
  };

  return (
    <KeyboardAvoidingView style={styles.mainContainer}>
      <View style={{ justifyContent: "flex-end", marginLeft: 30 }}>
        <BackButton />
      </View>
      <View style={{ flex: 1 }}>
        <LottieView
          style={{ width: 250, height: 250, alignSelf: "center" }}
          key="animation"
          resizeMode="cover"
          autoPlay
          loop={false}
          source={require("../assets/animations/people-wave-lottie.json")}
        />
      </View>

      <View style={styles.contentContainer}>
        <View
          style={[styles.inputContainer, { marginTop: 30, marginBottom: 20 }]}
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
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </View>
        {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
        {userLoading ? (
          <Loading />
        ) : (
          <TouchableOpacity
            style={[styles.submitButton, { marginBottom: 10 }]}
            onPress={handleSignIn}
          >
            <Text style={styles.submitButtonText}>Login</Text>
          </TouchableOpacity>
        )}
        <View
          style={{
            paddingHorizontal: 60,
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <View style={styles.line}></View>
          <Text style={{ fontSize: 18 }}>Or</Text>
          <View style={styles.line}></View>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: 20,
          }}
        >
          <TouchableOpacity>
            <Image source={require("../assets/icons/google.png")} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require("../assets/icons/apple.png")} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require("../assets/icons/facebook.png")} />
          </TouchableOpacity>
        </View>
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
