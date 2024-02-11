import { createStackNavigator } from "@react-navigation/stack";
import { Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SavedScreen } from "../screens/SavedScreen";

const Stack = createStackNavigator();

export const SavedNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SavedScreen"
        options={{ header: () => null }}
        component={SavedScreen}
      />
    </Stack.Navigator>
  );
};
