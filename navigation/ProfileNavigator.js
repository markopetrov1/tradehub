import { createStackNavigator } from "@react-navigation/stack";
import { Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ProfileScreen } from "../screens/ProfileScreen";

const Stack = createStackNavigator();

export const ProfileNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileScreen"
        options={{ header: () => null }}
        component={ProfileScreen}
      />
    </Stack.Navigator>
  );
};
