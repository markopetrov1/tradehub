import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../themes/colors";
import { HomeNavigator } from "./HomeNavigator";
import { ExchangesNavigator } from "./ExchangesNavigator";
import { ProfileNavigator } from "./ProfileNavigator";
import { SavedNavigator } from "./SavedNavigator";
import { AddItemScreen } from "../screens/AddItemScreen";

const TAB_ICON = {
  Home: "home-outline",
  Saved: "star",
  Add: "add-outline",
  Exchanges: "swap-horizontal",
  Profile: "person-circle-outline",
};

const Tab = createBottomTabNavigator();

const createScreenOptions = ({ route }) => {
  const iconName = TAB_ICON[route.name];

  return {
    tabBarIcon: ({ color }) => (
      <Ionicons
        name={iconName}
        size={iconName == "add-outline" ? 30 : 24}
        color={color}
      />
    ),
    tabBarLabel: "",
    tabBarStyle: {
      paddingTop: 10,
    },

    tabBarActiveTintColor: colors.bg.primary,
    tabBarInactiveTintColor: "#bebebe",
    headerShown: false,
  };
};

export const AppNavigator = () => (
  <Tab.Navigator
    screenOptions={createScreenOptions}
    tabBarOptions={{
      activeTintColor: colors.brand.primary,
      inactiveTintColor: colors.brand.muted,
    }}
  >
    <Tab.Screen name="Home" component={HomeNavigator} />
    <Tab.Screen name="Saved" component={SavedNavigator} />
    <Tab.Screen name="Add" component={AddItemScreen} />
    <Tab.Screen name="Exchanges" component={ExchangesNavigator} />
    <Tab.Screen name="Profile" component={ProfileNavigator} />
  </Tab.Navigator>
);
