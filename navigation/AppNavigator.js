import React from "react";
import {
  createSwitchNavigator,
  createAppContainer,
  createStackNavigator
} from "react-navigation";

import MainTabNavigator from "./MainTabNavigator";
//import HomeScreen from "../screens/HomeScreen";
//import GiamSatScreen from "../screens/GiamSatScreen";
//import KinhDoanhScreen from "../screens/KinhDoanhScreen";
//import SettingsScreen from "../screens/SettingsScreen";
//import NhanDinhScreen from "../screens/NhanDinhScreen";
import LoginScreen from "../LoginScreen";
//const LoginPage = createStackNavigator({ LoginScreen: LoginScreen });
//const SettingsPage = createStackNavigator({ SettingsScreen: SettingsScreen });
export default createAppContainer(
  createSwitchNavigator(
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    {
      Main: MainTabNavigator,
      //  HomeScreen: HomeScreen,
      // KinhDoanhScreen: KinhDoanhScreen,
      // GiamSatScreen: GiamSatScreen,
      //  NhanDinhScreen: NhanDinhScreen,
      //SettingsScreen: SettingsScreen,
      LoginScreen: LoginScreen
    },
    {
      initialRouteName: "Main"
    }
  )
);
