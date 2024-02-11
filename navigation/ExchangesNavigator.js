import { createStackNavigator } from "@react-navigation/stack";
import { Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ProfileScreen } from "../screens/ProfileScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { ExchangesScreen } from "../screens/ExchangesScreen";

const Stack = createStackNavigator();

export const ExchangesNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ExchangesScreen"
        options={{ header: () => null }}
        component={ExchangesScreen}
      />
    </Stack.Navigator>
  );
};
