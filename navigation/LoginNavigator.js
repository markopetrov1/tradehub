import { createStackNavigator } from "@react-navigation/stack";
import { Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RegisterScreen } from "../screens/RegisterScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { WelcomeScreen } from "../screens/WelcomeScreen";

const Stack = createStackNavigator();

export const LoginNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WelcomeScreen"
        options={{ header: () => null, presentation: "modal" }}
        component={WelcomeScreen}
      />
      <Stack.Screen
        name="LoginScreen"
        options={{ header: () => null, presentation: "modal" }}
        component={LoginScreen}
      />
      <Stack.Screen
        name="RegisterScreen"
        options={{ header: () => null, presentation: "modal" }}
        component={RegisterScreen}
      />
    </Stack.Navigator>
  );
};
