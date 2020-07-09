import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";

import Icon from "react-native-vector-icons/Ionicons";

import firebase from "firebase";
import "firebase/firestore";

import BottomTabNavigator from "./BottomTabNavigator";
import ScreenOne from "./ScreenOne";
import ScreenTwo from "./ScreenTwo";
import LogOutScreen from "./LogOutScreen";
import EditProfileScreen from "./EditProfileScreen";

var result = [];

const pullInformationFromDatabase = () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const email = user.email;
      const userID = email.split("@")[0];
      firebase
        .firestore()
        .collection("user-information")
        .doc(userID)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const email = doc.data().email;
            const firstName = doc.data().first_name;
            const lastName = doc.data().last_name;
            const fullName = firstName + " " + lastName;
            const photoURL = doc.data().profile_picture_url;
            result.push(fullName);
            result.push(email);
            result.push(photoURL);
          } else {
            console.log("no data accquired");
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  });
  if (result[0] !== undefined) {
    return result;
  }
};

const DrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: BottomTabNavigator,
      navigationOptions: ({ tintColor }) => ({
        drawerLabel: "Dashboard",
        drawerIcon: () => <Icon name="ios-home" color={tintColor} size={30} />,
      }),
    },
    Profile: {
      screen: EditProfileScreen,
      navigationOptions: ({ tintColor }) => ({
        drawerLabel: "Edit Profile",
        drawerIcon: () => (
          <Icon name="ios-person" color={tintColor} size={30} />
        ),
      }),
    },
    SubmitInformation: {
      screen: ScreenTwo,
      navigationOptions: ({ tintColor }) => ({
        drawerLabel: "Submit Information",
        drawerIcon: () => <Icon name="ios-add" color={tintColor} size={30} />,
      }),
    },
    Suggestions: {
      screen: ScreenOne,
      navigationOptions: ({ tintColor }) => ({
        drawerLabel: "Suggestions",
        drawerIcon: () => <Icon name="ios-hand" color={tintColor} size={30} />,
      }),
    },
    Help: {
      screen: ScreenTwo,
      navigationOptions: ({ tintColor }) => ({
        drawerLabel: "Help",
        drawerIcon: () => <Icon name="ios-help" color={tintColor} size={45} />,
      }),
    },
    LogOut: {
      screen: LogOutScreen,
      navigationOptions: ({ tintColor }) => ({
        drawerLabel: "Log Out",
        drawerIcon: () => <Icon name="ios-exit" color={tintColor} size={30} />,
      }),
    },
  },
  {
    contentComponent: (props) => {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.profilePictureContainer}>
            {pullInformationFromDatabase() ? (
              <Image
                style={styles.profilePicture}
                source={{ uri: pullInformationFromDatabase()[2] }}
              ></Image>
            ) : null}
          </View>
          <View style={styles.textContainer}>
            {pullInformationFromDatabase() ? (
              <Text style={styles.text}>Hello,</Text>
            ) : null}
            <Text style={styles.text}>
              {pullInformationFromDatabase()
                ? pullInformationFromDatabase()[0]
                : ""}
            </Text>
            <Text style={styles.email}>
              {pullInformationFromDatabase()
                ? pullInformationFromDatabase()[1]
                : ""}
            </Text>
          </View>
          <ScrollView>
            <View style={styles.items}>
              <DrawerItems
                {...props}
                labelStyle={{ fontSize: 15, fontWeight: "400" }}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    },
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profilePictureContainer: {
    padding: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 19,
    fontWeight: "300",
  },
  email: {
    padding: 5,
    fontSize: 15,
    fontWeight: "300",
    color: "gray",
  },
  items: {
    padding: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DrawerNavigator;
