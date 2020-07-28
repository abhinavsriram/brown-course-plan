import React, { Component } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";

import * as firebase from "firebase";

class LoadingScreen extends Component {
  // checks if the user is logged-in
  // authFlag ensures that this happens once every time the app is opened
  componentDidMount() {
    authFlag = true;
    firebase.auth().onAuthStateChanged((user) => {
      if (authFlag) {
        authFlag = false;
        if (user) {
          // if the user is logged in, checks if email is verified
          try {
            this.props.navigation.navigate(
              user.emailVerified ? "TabNavigator" : "LandingScreen"
            );
          } catch (err) {
            this.props.navigation.navigate(
              user ? "TabNavigator" : "LandingScreen"
            );
          }
        } else {
          this.props.navigation.navigate(
            user ? "TabNavigator" : "LandingScreen"
          );
        }
      }
    });
  }

  // just renders a loading icon
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large"></ActivityIndicator>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LoadingScreen;
