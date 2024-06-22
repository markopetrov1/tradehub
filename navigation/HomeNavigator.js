import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen } from "../screens/HomeScreen";
import { ItemDetailScreen } from "../screens/ItemDetailScreen";
import { ChatScreen } from "../screens/ChatScreen";
import { ChatRoomScreen } from "../screens/ChatRoomScreen";

const Stack = createStackNavigator();

export const HomeNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        options={{ header: () => null }}
        component={HomeScreen}
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
