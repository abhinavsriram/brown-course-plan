import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Button } from "react-native";
import { Header } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "react-navigation-drawer";

/*–––––––––––––––––––––––––ICONS IMPORT–––––––––––––––––––––––––*/
import Icon from "react-native-vector-icons/Ionicons";

import firebase from "firebase";

class LogOutScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        {/* /*–––––––––––––––––––––––––BACK BUTTON–––––––––––––––––––––––––*/}
        <TouchableOpacity
          style={styles.backArrow}
          onPress={() => {
            // this.props.navigation.navigate("TabNavigator");
            this.props.navigation.dispatch(DrawerActions.openDrawer());
          }}
        >
          <Icon name="ios-arrow-dropleft" color="#fafafa" size={40} />
        </TouchableOpacity>
        <Text style={styles.title}>Log Out</Text>
        <Text style={styles.areYouSure}>Sure?</Text>
        <CustomButton
          title="Log Out"
          onPress={() => {
            this.props.navigation.navigate("LandingScreen");
            firebase.auth().signOut();
          }}
          style={styles.LogOutButtonContainer}
        ></CustomButton>
        <Text style={styles.areYouNotSure}>Not So Sure?</Text>
        <CustomButton
          title="Go To Dashboard"
          onPress={() => {
            this.props.navigation.navigate("TabNavigator");
          }}
          style={styles.HomeButtonContainer}
        ></CustomButton>
      </View>
    );
  }
}

/*–––––––––––––––––––––––––CUSTOM BUTTON COMPONENT–––––––––––––––––––––––––*/
const CustomButton = ({ onPress, title, style }) => (
  <TouchableOpacity onPress={onPress} style={style} activeOpacity={0.8}>
    <Text style={styles.CustomButtonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E53935",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    color: "#fafafa",
    fontWeight: "700",
    letterSpacing: 1,
  },
  areYouSure: {
    position: "absolute",
    bottom: "60%",
    fontSize: 20,
    color: "#fff",
  },
  LogOutButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingVertical: 17,
    paddingHorizontal: 12,
    width: "80%",
    position: "absolute",
    bottom: "50%",
  },
  areYouNotSure: {
    position: "absolute",
    bottom: "44%",
    fontSize: 20,
    color: "#fafafa",
  },
  HomeButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
    borderRadius: 15,
    paddingVertical: 17,
    paddingHorizontal: 12,
    width: "80%",
    position: "absolute",
    bottom: "34%",
  },
  CustomButtonText: {
    fontSize: 18,
    color: "#E53935",
    fontWeight: "bold",
    alignSelf: "center",
  },
  title: {
    color: "#fafafa",
    fontWeight: "bold",
    alignSelf: "center",
    fontSize: 40,
    position: "absolute",
    top: "8%",
  },
  backArrow: {
    position: "absolute",
    top: "6%",
    left: "6%",
  },
});

export default LogOutScreen;
