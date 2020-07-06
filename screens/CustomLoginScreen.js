import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import firebase from "firebase";

import Icon from "react-native-vector-icons/Ionicons";

class CustomLoginScreen extends Component {
  state = {
    email: "",
    password: "",
    errorMessage: null,
  };

  handleLogin = () => {
    const email = this.state.email + "@brown.edu";
    const password = this.state.password;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) =>
        this.setState({
          errorMessage: error.message,
        })
      );
  };

  navigateToNextScreen = () => {
    if (this.state.email !== "" && this.state.password !== "") {
      firebase.auth().onAuthStateChanged((user) => {
        if (user.emailVerified) {
          this.props.navigation.navigate("TabNavigator", {
            userID: this.state.email,
          });
        } else {
          this.setState({
            errorMessage: "Verify Your Email Before Attempting To Log-In",
          });
        }
      });
    } else {
      this.setState({ errorMessage: "Please Fill All Fields Correctly" });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {/* /*–––––––––––––––––––––––––BACK BUTTON–––––––––––––––––––––––––*/}
        <TouchableOpacity
          style={styles.backArrow}
          onPress={() => this.props.navigation.navigate("LandingScreen")}
        >
          <Icon name="ios-arrow-dropleft" color="#fafafa" size={40} />
        </TouchableOpacity>
        {/* /*–––––––––––––––––––––––––TITLE–––––––––––––––––––––––––*/}
        <Text style={styles.title}>Log In</Text>
        {/* /*–––––––––––––––––––––––––ERROR MESSAGE–––––––––––––––––––––––––*/}
        <View style={styles.errorMessage}>
          {this.state.errorMessage && (
            <Text style={styles.errorMessageText}>
              {this.state.errorMessage}
            </Text>
          )}
        </View>
        {/* /*–––––––––––––––––––––––––FORM 1 - EMAIL ADDRESS–––––––––––––––––––––––––*/}
        <View style={styles.form1}>
          <Text style={styles.inputTitle}>Email Address</Text>
          <View style={styles.customEmailForm}>
            <TextInput
              style={styles.input}
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={(text) => this.setState({ email: text })}
              value={this.state.email}
            ></TextInput>
            <TextInput
              style={[styles.input, { textAlign: "right" }]}
              autoCorrect={false}
              autoCapitalize="none"
              editable={false}
              value="@brown.edu"
            ></TextInput>
          </View>
        </View>
        {/* /*–––––––––––––––––––––––––FORM 2 - PASSWORD–––––––––––––––––––––––––*/}
        <View style={styles.form2}>
          <Text style={styles.inputTitle}>Password</Text>
          <TextInput
            style={styles.input}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={(text) => this.setState({ password: text })}
            value={this.state.password}
            secureTextEntry={true}
          ></TextInput>
        </View>
        {/* /*–––––––––––––––––––––––––FORGOT PASSWORD MESSAGE–––––––––––––––––––––––––*/}
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("ForgotPasswordScreen")}
          style={styles.forgotPasswordContainer}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: "#fafafa", fontWeight: "800" }}>
              Forgot Password?
            </Text>
          </View>
        </TouchableOpacity>
        {/* /*–––––––––––––––––––––––––SIGN UP MESSAGE–––––––––––––––––––––––––*/}
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("CustomSignUpScreen")}
          style={styles.signUpContainer}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: "#fafafa" }}>New to </Text>
            <Text style={{ color: "#fafafa" }}>Brown Course Plan? </Text>
            <Text style={{ color: "#fafafa", fontWeight: "800" }}>Sign Up</Text>
          </View>
        </TouchableOpacity>
        {/* /*–––––––––––––––––––––––––LOG-IN BUTTON–––––––––––––––––––––––––*/}
        <CustomButton
          title="Log In"
          onPress={() => {
            this.handleLogin();
            this.navigateToNextScreen();
          }}
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
  form1: {
    position: "absolute",
    top: "26%",
    width: 0.8 * Dimensions.get("window").width,
  },
  form2: {
    position: "absolute",
    top: "36%",
    width: 0.8 * Dimensions.get("window").width,
  },
  inputTitle: {
    color: "#fafafa",
    fontSize: 12,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  input: {
    flex: 1,
    borderBottomColor: "#fafafa",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 13,
    color: "#fafafa",
  },
  customButtonContainer: {
    flexDirection: "row",
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
  customEmailForm: {
    flexDirection: "row",
  },
  errorMessage: {
    flex: 1,
    position: "absolute",
    top: "18%",
    width: 0.8 * Dimensions.get("window").width,
    justifyContent: "center",
    alignItems: "center",
  },
  errorMessageText: {
    flex: 1,
    color: "#fafafa",
  },
  signUpMessage: {
    flex: 1,
    width: 0.8 * Dimensions.get("window").width,
    justifyContent: "center",
    alignItems: "center",
  },
  signUpMessageText: {
    flex: 1,
    color: "#fafafa",
  },
  signUpContainer: {
    flex: 1,
    position: "absolute",
    top: "50%",
  },
  forgotPasswordContainer: {
    flex: 1,
    position: "absolute",
    top: "46%",
  },
  backArrow: {
    position: "absolute",
    top: "6%",
    left: "6%",
  },
});

export default CustomLoginScreen;
