import React, { Component } from "react";
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

// pullFirstNameFromDatabse = () => {
//     firebase
//       .firestore()
//       .collection("user-information")
//       .doc(this.state.userID)
//       .get()
//       .then((doc) => {
//         if (doc.exists) {
//           doc.data.first_name
//         } else {
//           console.log("no data accquired");
//         }
//       })
//       .catch((error) => {
//         console.log(error.message);
//       });
//   };

const DrawerNavigator = createDrawerNavigator({
    Home: {
        screen: BottomTabNavigator,
        navigationOptions: ({ tintColor }) => ({
            drawerLabel: "Home",
            drawerIcon: () => (
                <Icon name="ios-home" color={tintColor} size={30}/>
            )
        })
    },
    Profile: {
        screen: ScreenOne,
        navigationOptions: ({ tintColor }) => ({
            drawerLabel: "Edit Profile",
            drawerIcon: () => (
                <Icon name="ios-person" color={tintColor} size={30}/>
            )
        })
    },
    SubmitInformation: {
        screen: ScreenTwo,
        navigationOptions: ({ tintColor }) => ({
            drawerLabel: "Submit Information",
            drawerIcon: () => (
                <Icon name="ios-add" color={tintColor} size={30}/>
            )
        })
    },
    Suggestions: {
        screen: ScreenOne,
        navigationOptions: ({ tintColor }) => ({
            drawerLabel: "Suggestions",
            drawerIcon: () => (
                <Icon name="ios-hand" color={tintColor} size={30}/>
            )
        })
    },
    Help: {
        screen: ScreenTwo,
        navigationOptions: ({ tintColor }) => ({
            drawerLabel: "Help",
            drawerIcon: () => (
                <Icon name="ios-help" color={tintColor} size={45}/>
            )
        })
    },
    LogOut: {
        screen: ScreenOne,
        navigationOptions: ({ tintColor }) => ({
            drawerLabel: "Log Out",
            drawerIcon: () => (
                <Icon name="ios-exit" color={tintColor} size={30}/>
            )
        })
    },
}, {
    contentComponent: (props) => (
        <SafeAreaView style={styles.container}>
            <View style={styles.profilePictureContainer}>
                <Image
                    style={styles.profilePicture}
                    source={require("./../assets/dp-placeholder.jpg")}>
                </Image>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text}>
                    Hello,
                </Text>
                <Text style={styles.text}>
                    Daniel Ghebreyesus!
                </Text>
                <Text style={styles.email}>
                    daniel_ghebreyesus@brown.edu
                </Text>
            </View>
            <ScrollView>
                <View style={styles.items}>
                    <DrawerItems {...props} labelStyle={{ fontSize: 15, fontWeight: "400" }}/>
                </View>
            </ScrollView>
        </SafeAreaView >
    )
});

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
    }
})

export default DrawerNavigator;