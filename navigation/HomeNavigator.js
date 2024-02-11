import { createStackNavigator } from "@react-navigation/stack";
import { Text } from "react-native";
import { HomeScreen } from "../screens/HomeScreen";

const Stack = createStackNavigator();

export const HomeNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        options={{ header: () => null }}
        component={HomeScreen}
      />
    </Stack.Navigator>
  );
};
