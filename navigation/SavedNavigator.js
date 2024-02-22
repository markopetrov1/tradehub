import { createStackNavigator } from "@react-navigation/stack";
import { Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SavedScreen } from "../screens/SavedScreen";
import { ItemDetailScreen } from "../screens/ItemDetailScreen";

const Stack = createStackNavigator();

export const SavedNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SavedScreen"
        options={{ header: () => null }}
        component={SavedScreen}
      />
      <Stack.Screen
        name="ItemDetailScreen"
        options={{ header: () => null, presentation: "modal" }}
        component={ItemDetailScreen}
      />
    </Stack.Navigator>
  );
};
