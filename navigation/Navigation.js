import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AppNavigator } from "./AppNavigator";
import { LoginNavigator } from "./LoginNavigator";
import { useSelector, useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { setUser } from "../redux/slices/userSlice";
import { auth } from "../config/firebase";
import { getCurrentUser } from "../utilities/auth";

export const Navigation = () => {
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u) {
        getCurrentUser()
          .then((response) => {
            dispatch(setUser(response));
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        dispatch(setUser(null));
      }
    });
  }, []);

  return (
    <NavigationContainer>
      {user !== null ? <AppNavigator /> : <LoginNavigator />}
    </NavigationContainer>
  );
};
