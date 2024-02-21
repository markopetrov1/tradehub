import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen } from "../screens/HomeScreen";
import { ItemDetailScreen } from "../screens/ItemDetailScreen";


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
    </Stack.Navigator>
  );
};
