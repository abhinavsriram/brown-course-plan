/*–––––––––––––––––––––––––REACT IMPORTS–––––––––––––––––––––––––*/
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from "react-native";

/*–––––––––––––––––––––––––LANDING SCREEN COMPONENT–––––––––––––––––––––––––*/
class LoginScreen extends Component {
  /*–––––––––––––––––––––––––RENDER METHOD–––––––––––––––––––––––––*/
  render() {
    return (
      <View style={styles.wholeScreen}>
        <ImageBackground
          style={styles.backgroundImageStyle}
          source={require("./../assets/background-alt.png")}
        ></ImageBackground>
        <Text style={styles.title}>Brown Course Plan</Text>
        <CustomButton
          title="Log In"
          onPress={() => this.props.navigation.navigate("CustomLoginScreen")}
          buttonStyle={styles.logInButtonContainer}
        ></CustomButton>
        <CustomButton
          title="Sign Up"
          onPress={() => this.props.navigation.navigate("CustomSignUpScreen")}
          buttonStyle={styles.signUpButtonContainer}
        ></CustomButton>
      </View>
    );
  }
}

/*–––––––––––––––––––––––––STYLING–––––––––––––––––––––––––*/
const styles = StyleSheet.create({
  wholeScreen: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    color: "#4E342E",
    fontWeight: "bold",
    alignSelf: "center",
    fontSize: 40,
    position: "absolute",
    top: "10%",
  },
  backgroundImageStyle: {
    flex: 1,
    position: "absolute",
    top: "20%",
    width: 0.87 * Dimensions.get("window").width,
    height: 0.5 * Dimensions.get("window").height,
  },
  signUpButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4E342E",
    borderRadius: 15,
    paddingVertical: 17,
    paddingHorizontal: 12,
    width: "80%",
    position: "absolute",
    bottom: 40,
    left: 40,
  },
  logInButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E53935",
    borderRadius: 15,
    paddingVertical: 17,
    paddingHorizontal: 12,
    width: "80%",
    position: "absolute",
    bottom: 115,
    left: 40,
  },
  customButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    justifyContent: "center",
  },
});

/*–––––––––––––––––––––––––CUSTOM BUTTON COMPONENT–––––––––––––––––––––––––*/
const CustomButton = ({ onPress, title, buttonStyle }) => (
  <TouchableOpacity onPress={onPress} style={buttonStyle} activeOpacity={0.8}>
    <Text style={styles.customButtonText}>{title}</Text>
  </TouchableOpacity>
);

export default LoginScreen;