import React, {useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
// import { AppNavigator } from './AppNavigator';
import { LoginNavigator } from './LoginNavigator';


export const Navigation = () => {
  
  
  return (
    <NavigationContainer>
      <LoginNavigator/>
    </NavigationContainer>
  );
};