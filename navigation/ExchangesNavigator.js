import { createStackNavigator } from "@react-navigation/stack";
import { Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ProfileScreen } from "../screens/ProfileScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { ExchangesScreen } from "../screens/ExchangesScreen";
import { ItemDetailScreen } from "../screens/ItemDetailScreen";
import { ChatScreen } from "../screens/ChatScreen";
import { ChatRoomScreen } from "../screens/ChatRoomScreen";

const Stack = createStackNavigator();

export const ExchangesNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ExchangesScreen"
        options={{ header: () => null }}
        component={ExchangesScreen}
      />
      <Stack.Screen
        name="ItemDetailScreen"
        options={{ header: () => null, presentation: "modal" }}
        component={ItemDetailScreen}
      />
      <Stack.Screen
        name="ChatScreen"
        options={{ header: () => null }}
        component={ChatScreen}
      />
      <Stack.Screen
        name="ChatRoomScreen"
        options={{ header: () => null }}
        component={ChatRoomScreen}
      />
    </Stack.Navigator>
  );
};
