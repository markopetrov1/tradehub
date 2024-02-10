import { createStackNavigator } from "@react-navigation/stack";
import { Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RegisterScreen } from "../screens/RegisterScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { WelcomeScreen } from "../screens/WelcomeScreen";

const Stack = createStackNavigator();

export const LoginNavigator = () => {

  const screenOptions = {
    headerTitle: ' ',
    headerBackTitle: ' ',
  }

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="WelcomeScreen"
        options={{ header: () => null }}
        component={WelcomeScreen}
      />
      <Stack.Screen
        name="LoginScreen"
        options={{ header: () => null }}
        component={LoginScreen}
      />
      <Stack.Screen
        name="RegisterScreen"
        options={{ headerBackgroundContainerStyle: {backgroundColor:'#f3f3f3', alignItems:'flex-end'}}}
        component={RegisterScreen}
      />
    </Stack.Navigator>
  );
};