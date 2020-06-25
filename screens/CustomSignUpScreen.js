/*–––––––––––––––––––––––––REACT IMPORTS–––––––––––––––––––––––––*/
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Keyboard,
} from "react-native";

/*–––––––––––––––––––––––––FIREBASE IMPORT–––––––––––––––––––––––––*/
import firebase from "firebase";
import "firebase/firestore";

/*–––––––––––––––––––––––––ICONS IMPORT–––––––––––––––––––––––––*/
import Icon from "react-native-vector-icons/Ionicons";

/*–––––––––––––––––––––––––CUSTOM SIGN UP SCREEN COMPONENT–––––––––––––––––––––––––*/
class CustomSignUpScreen extends Component {
  state = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    userCredential: "",
    errorMessage: null,
  };

  /*–––––––––––––––––––––––––HANDLE SIGN UP METHOD–––––––––––––––––––––––––*/
  handleSignUp = () => {
    const email = this.state.email + "@brown.edu";
    const password = this.state.password;

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        userCredentials.user.updateProfile({
          displayName: this.state.firstName + " " + this.state.lastName,
        });
      })
      .catch((error) => {
        this.setState({ errorMessage: error.message });
      });
  };

  writeToDatabase = () => {
    firebase
      .firestore()
      .collection("user-information")
      .doc(this.state.email)
      .set({
        email: this.state.email + "@brown.edu",
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        created_at: Date.now(),
      })
      .then(() => {})
      .catch((error) => {
        console.log(error.message);
      });
  };

  navigateToNextScreen = () => {
    if (
      this.state.email !== "" &&
      this.state.password !== "" &&
      this.state.firstName !== "" &&
      this.state.lastName !== "" &&
      this.state.errorMessage === null
    ) {
      this.setState({ userCredential: this.state.email }, () => {
        this.props.navigation.navigate("CreateProfileScreen1", {
          userID: this.state.userCredential,
        });
      });
    } else {
      this.setState({ errorMessage: "Please Fill All Fields Correctly" });
    }
  };
  /*–––––––––––––––––––––––––RENDER METHOD–––––––––––––––––––––––––*/
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
        <Text style={styles.title}>Sign Up</Text>
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
        {/* /*–––––––––––––––––––––––––FORM 3 - FIRST NAME–––––––––––––––––––––––––*/}
        <View style={styles.form3}>
          <Text style={styles.inputTitle}>First Name</Text>
          <TextInput
            style={styles.input}
            autoCorrect={false}
            onChangeText={(text) => this.setState({ firstName: text })}
            value={this.state.firstName}
          ></TextInput>
        </View>
        {/* /*–––––––––––––––––––––––––FORM 4 - LAST NAME–––––––––––––––––––––––––*/}
        <View style={styles.form4}>
          <Text style={styles.inputTitle}>Last Name</Text>
          <TextInput
            style={styles.input}
            autoCorrect={false}
            onChangeText={(text) => this.setState({ lastName: text })}
            value={this.state.lastName}
          ></TextInput>
        </View>
        {/* /*–––––––––––––––––––––––––ERROR MESSAGE–––––––––––––––––––––––––*/}
        <View style={styles.errorMessage}>
          {this.state.errorMessage && (
            <Text style={styles.errorMessageText}>
              {this.state.errorMessage}
            </Text>
          )}
        </View>
        {/* /*–––––––––––––––––––––––––LOG-IN MESSAGE–––––––––––––––––––––––––*/}
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("CustomLoginScreen")}
          style={styles.logInContainer}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: "#fafafa" }}>Previously Used </Text>
            <Text style={{ color: "#fafafa" }}>Brown Course Plan? </Text>
            <Text style={{ color: "#fafafa", fontWeight: "800" }}>Log In</Text>
          </View>
        </TouchableOpacity>
        {/* /*–––––––––––––––––––––––––SIGN UP BUTTON–––––––––––––––––––––––––*/}
        <CustomButton
          title="Sign Up"
          onPress={() => {
            this.handleSignUp();
            this.writeToDatabase();
            Keyboard.dismiss();
            this.navigateToNextScreen();
          }}
        ></CustomButton>
      </View>
    );
  }
}

/*–––––––––––––––––––––––––CUSTOM BUTTON COMPONENT–––––––––––––––––––––––––*/
const CustomButton = ({ onPress, title }) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.customButtonContainer}
    activeOpacity={0.8}
  >
    <Text style={styles.customButtonText}>{title}</Text>
  </TouchableOpacity>
);

const inputWidth = 0.8 * Dimensions.get("window").width;

/*–––––––––––––––––––––––––STYLING–––––––––––––––––––––––––*/
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
    width: inputWidth,
  },
  form2: {
    position: "absolute",
    top: "36%",
    width: inputWidth,
  },
  form3: {
    position: "absolute",
    top: "46%",
    width: inputWidth,
  },
  form4: {
    position: "absolute",
    top: "56%",
    width: inputWidth,
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
    width: inputWidth,
    justifyContent: "center",
    alignItems: "center",
  },
  errorMessageText: {
    flex: 1,
    color: "#fafafa",
  },
  logInContainer: {
    flex: 1,
    position: "absolute",
    top: "66%",
  },
  backArrow: {
    position: "absolute",
    top: "6%",
    left: "6%",
  },
});

export default CustomSignUpScreen;
