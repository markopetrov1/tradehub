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

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      console.log("GOT USER ", u);
      if (u) {
        dispatch(
          setUser({
            id: u.uid,
            email: u.email,
          })
        );
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
