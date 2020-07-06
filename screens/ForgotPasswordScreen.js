import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Keyboard,
} from "react-native";

import * as firebase from "firebase";

import Icon from "react-native-vector-icons/Ionicons";

class ForgotPasswordScreen extends Component {
  state = {
    email: "",
    visible: true,
    errorMessage: null,
  };

  sendPasswordResetEmail = () => {
    const email = this.state.email + "@brown.edu";
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        this.showHideComponents();
        Keyboard.dismiss();
      })
      .catch((error) => this.setState({ errorMessage: error.message }));
  };

  showHideComponents = () => {
    if (this.state.visible == true) {
      this.setState({ visible: false });
      this.setState({ errorMessage: null });
    } else {
      this.setState({ visible: true });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {/* /*–––––––––––––––––––––––––BACK BUTTON–––––––––––––––––––––––––*/}
        <TouchableOpacity
          style={styles.backArrow}
          onPress={() => this.props.navigation.navigate("CustomLoginScreen")}
        >
          <Icon name="ios-arrow-dropleft" color="#fafafa" size={40} />
        </TouchableOpacity>
        {/* /*–––––––––––––––––––––––––TITLE–––––––––––––––––––––––––*/}
        <Text style={styles.title}>Forgot Password?</Text>
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
        {this.state.visible ? (
          <CustomButton
            title="Reset Password"
            onPress={() => this.sendPasswordResetEmail()}
            buttonStyle={styles.resetPasswordButtonContainer}
          ></CustomButton>
        ) : null}

        {this.state.visible ? null : (
          <View style={styles.innerContainer}>
            <Text style={{ color: "#fafafa" }}>
              A password reset link has been sent to your brown.edu email
              address. Reset password and Log In.
            </Text>
          </View>
        )}

        {this.state.visible ? null : (
          <CustomButton
            title="Log In"
            onPress={() => this.props.navigation.navigate("CustomLoginScreen")}
            buttonStyle={styles.logInButtonContainer}
          ></CustomButton>
        )}
      </View>
    );
  }
}

const CustomButton = ({ onPress, title, buttonStyle }) => (
  <TouchableOpacity onPress={onPress} style={buttonStyle} activeOpacity={0.8}>
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
    top: "14.5%",
  },
  innerContainer: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "47%",
  },
  logInButtonContainer: {
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
  resetPasswordButtonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
    borderRadius: 15,
    paddingVertical: 17,
    paddingHorizontal: 12,
    width: "80%",
    position: "absolute",
    top: "47%",
  },
  customButtonText: {
    fontSize: 18,
    color: "#E53935",
    fontWeight: "bold",
    alignSelf: "center",
  },
  form1: {
    position: "absolute",
    top: "31%",
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
  customEmailForm: {
    flexDirection: "row",
  },
  errorMessage: {
    flex: 1,
    position: "absolute",
    top: "25%",
    width: 0.8 * Dimensions.get("window").width,
    justifyContent: "center",
    alignItems: "center",
  },
  errorMessageText: {
    flex: 1,
    color: "#fafafa",
  },
  backArrow: {
    position: "absolute",
    top: "6%",
    left: "6%",
  },
});

export default ForgotPasswordScreen;
