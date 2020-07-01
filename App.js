/*–––––––––––––––––––––––––REACT IMPORTS–––––––––––––––––––––––––*/
import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

/*–––––––––––––––––––––––––CUSTOM IMPORTS–––––––––––––––––––––––––*/
import LoadingScreen from "./screens/LoadingScreen";
import LandingScreen from "./screens/LandingScreen";
import CustomLoginScreen from "./screens/CustomLoginScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import CustomSignUpScreen from "./screens/CustomSignUpScreen";
import VerificationScreen from "./screens/VerificationScreen";
import CreateProfileScreen1 from "./screens/CreateProfileScreen1";
import CreateProfileScreen2 from "./screens/CreateProfileScreen2";
import DashboardScreen from "./screens/DashboardScreen";
import TabNavigator from "./screens/BottomTabNavigator";

/*–––––––––––––––––––––––––BASE-64 IMPORT–––––––––––––––––––––––––*/
import { decode, encode } from "base-64";
if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

/*–––––––––––––––––––––––––FIREBASE (brown-cp)–––––––––––––––––––––––––*/
import * as firebase from "firebase";

firebase.initializeApp(firebaseConfig);

/*–––––––––––––––––––––––––NAVIGATOR–––––––––––––––––––––––––*/
const AppSwitchNavigator = createSwitchNavigator(
  {
    LoadingScreen: LoadingScreen,
    LandingScreen: LandingScreen,
    CustomLoginScreen: CustomLoginScreen,
    ForgotPasswordScreen: ForgotPasswordScreen,
    CustomSignUpScreen: CustomSignUpScreen,
    VerificationScreen: VerificationScreen,
    CreateProfileScreen1: CreateProfileScreen1,
    CreateProfileScreen2: CreateProfileScreen2,
    DashboardScreen: DashboardScreen,
    TabNavigator: TabNavigator,
  },
  {
    initialRouteName: "LoadingScreen",
  }
);

const AppNavigator = createAppContainer(AppSwitchNavigator);

/*–––––––––––––––––––––––––APP COMPONENT–––––––––––––––––––––––––*/
export default function App() {
  return <AppNavigator></AppNavigator>;
}
