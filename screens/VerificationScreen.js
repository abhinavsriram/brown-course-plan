import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import * as firebase from "firebase";

class VerificationScreen extends Component {
  sendVerificationEmail = () => {
    var authFlag = true;
    var emailFlag = true;
    if (authFlag) {
      authFlag = false;
      firebase.auth().onAuthStateChanged((user) => {
        if (emailFlag) {
          emailFlag = false;
          if (user) {
            user
              .sendEmailVerification()
              .then(() => {})
              .catch((error) => console.log(error.message));
          }
        }
      });
    }
  };

  componentDidMount() {
    this.sendVerificationEmail();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Verification</Text>
        <View style={styles.innerContainer}>
          <Text style={{ color: "#fafafa" }}>
            Log In and complete setting up your profile after verifying that you
            are indeed a member of our wonderful institution through the secure
            link sent to your brown.edu email address.
          </Text>
        </View>
        <CustomButton
          title="Log In"
          onPress={() => this.props.navigation.navigate("CustomLoginScreen")}
        ></CustomButton>
      </View>
    );
  }
}

const CustomButton = ({ onPress, title }) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.customButtonContainer}
    activeOpacity={0.8}
  >
    <Text style={styles.customButtonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E53935",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#fafafa",
    fontWeight: "bold",
    alignSelf: "center",
    fontSize: 40,
    position: "absolute",
    top: "8%",
  },
  innerContainer: {
    flex: 1,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  customButtonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
    borderRadius: 15,
    paddingVertical: 17,
    paddingHorizontal: 12,
    width: "80%",
    position: "absolute",
    bottom: 40,
  },
  customButtonText: {
    fontSize: 18,
    color: "#E53935",
    fontWeight: "bold",
    alignSelf: "center",
  },
});

export default VerificationScreen;
