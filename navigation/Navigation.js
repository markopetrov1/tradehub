import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AppNavigator } from "./AppNavigator";
import { LoginNavigator } from "./LoginNavigator";
import { useSelector, useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { setUser } from "../redux/slices/user";
import { auth } from "../config/firebase";

export const Navigation = () => {
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  onAuthStateChanged(auth, (user) => {
    console.log("GOT USER ", user);
    dispatch(setUser(user));
  });

  return (
    <NavigationContainer>
      {user !== null ? <AppNavigator /> : <LoginNavigator />}
    </NavigationContainer>
  );
};
