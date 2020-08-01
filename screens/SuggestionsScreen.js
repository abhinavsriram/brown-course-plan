import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Picker,
  Keyboard,
  Alert,
} from "react-native";

import { Header } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/Ionicons";
import { DrawerActions } from "react-navigation-drawer";

import * as firebase from "firebase";
import "firebase/firestore";
import { ScrollView } from "react-native-gesture-handler";

class SuggestionsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: "",
      fullName: "",
      email: "",
      suggestion: "",
      namePickerValue: "Click to Choose",
      namePickerVisible: false,
      characterCountExceeded: false,
    };
  }

  getUserID = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const email = user.email;
        const userID = email.split("@")[0];
        this.setState({ userID: userID }, () => {
          this.getNameAndEmailFromDatabase();
        });
      }
    });
  };

  getNameAndEmailFromDatabase = () => {
    firebase
      .firestore()
      .collection("user-information")
      .doc(this.state.userID)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const firstName = doc.data().first_name;
          const lastName = doc.data().last_name;
          const fullName = firstName + " " + lastName;
          const email = doc.data().email;
          this.setState({ fullName: fullName });
          this.setState({ email: email });
        } else {
          console.log("no data accquired");
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  componentDidMount() {
    this.getUserID();
  }

  showHideNamePicker = () => {
    Keyboard.dismiss();
    if (this.state.namePickerValue == true) {
      this.setState({ namePickerVisible: false });
    } else {
      this.setState({ namePickerVisible: true });
    }
  };

  writeToDatabase = () => {
    if (this.state.namePickerValue === "Anonymous") {
      firebase.firestore().collection("suggestions").add({
        name: this.state.namePickerValue,
        suggestion: this.state.suggestion,
        email: "Anonymous",
        addressed: false,
      });
    } else {
      firebase.firestore().collection("suggestions").add({
        name: this.state.namePickerValue,
        suggestion: this.state.suggestion,
        email: this.state.email,
        addressed: false,
      });
    }
  };

  showAlert = () => {
    Alert.alert(
      "Your Response Has Been Noted",
      "Thanks for the suggestion. We will look into addressing it.",
      [
        {
          text: "Ok",
        },
      ],
      { cancelable: false }
    );
  };

  characterLimitAlert = () => {
    Alert.alert(
      "Try Again",
      "You have exceeded the 500 character limit.",
      [
        {
          text: "Ok",
        },
      ],
      { cancelable: false }
    );
  };

  errorAlert = () => {
    Alert.alert(
      "Try Again",
      "Please fill out all fields before submitting.",
      [
        {
          text: "Ok",
        },
      ],
      { cancelable: false }
    );
  };

  checkCharacterCount = () => {
    if (
      this.state.suggestion.length === 499 ||
      this.state.suggestion.length > 499
    ) {
      this.setState({ characterCountExceeded: true });
    } else {
      this.setState({ characterCountExceeded: false });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Header
          backgroundColor="#4E342E"
          centerComponent={<Text style={styles.title}>Suggestions</Text>}
        >
          <TouchableOpacity
            style={styles.trigger}
            onPress={() => {
              this.props.navigation.dispatch(DrawerActions.openDrawer());
            }}
          >
            <Ionicons name={"md-menu"} size={32} color={"white"} />
          </TouchableOpacity>
        </Header>
        <ScrollView
          contentContainerStyle={styles.scrollViewWrapper}
          showsVerticalScrollIndicator={"false"}
          keyboardDismissMode={"on-drag"}
          keyboardShouldPersistTaps={"always"}
        >
          <Text style={styles.question}>
            Would you like your submission to be anonymous or would you like us
            to be able to reach out to you to better assist you?
          </Text>
          <TouchableOpacity
            onPress={() => {
              this.showHideNamePicker();
            }}
            style={styles.nameBox}
          >
            <Icon name="ios-arrow-dropdown" size={20} />
            <Text style={styles.nameInput}>{this.state.namePickerValue}</Text>
          </TouchableOpacity>
          {this.state.namePickerVisible ? (
            <React.Fragment>
              <Picker
                style={styles.namePicker}
                selectedValue={this.state.namePickerValue}
                onValueChange={(itemValue) => {
                  this.setState({ namePickerValue: itemValue });
                }}
                itemStyle={{ color: "#333333", borderColor: "#fafafa" }}
              >
                <Picker.Item label="Anonymous" value="Anonymous"></Picker.Item>
                <Picker.Item
                  label={this.state.fullName}
                  value={this.state.fullName}
                ></Picker.Item>
              </Picker>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  this.setState({ namePickerVisible: false });
                  if (this.state.namePickerValue === "Click to Choose") {
                    this.setState({ namePickerValue: "Anonymous" });
                  }
                }}
              >
                <Text style={styles.cancelButtonText}>DONE</Text>
              </TouchableOpacity>
            </React.Fragment>
          ) : null}
          <View style={styles.messageBox}>
            <TextInput
              placeholder="Write Suggestion"
              placeholderTextColor="dimgrey"
              style={styles.messageInput}
              onChangeText={(text) => {
                this.setState({ suggestion: text });
                this.checkCharacterCount();
              }}
              value={this.state.suggestion}
              multiline={true}
              autoCorrect={false}
              // editable={!this.state.characterCountExceeded}
            />
            <TouchableOpacity
              onPress={() => {
                this.setState({ suggestion: "" });
              }}
            >
              <Icon name="ios-backspace" size={22} />
            </TouchableOpacity>
          </View>
          <Text style={styles.text}>
            Characters: {this.state.suggestion.length}/500
          </Text>
        </ScrollView>
        <CustomButton
          title="Submit Suggestion"
          onPress={() => {
            if (this.state.suggestion.length > 500) {
              this.characterLimitAlert();
            } else {
              if (
                this.state.namePickerValue !== "Click to Choose" &&
                this.state.suggestion !== ""
              ) {
                this.writeToDatabase();
                this.props.navigation.navigate("TabNavigator");
                this.showAlert();
              } else {
                this.errorAlert();
              }
            }
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
    backgroundColor: "#fff",
    alignItems: "center",
  },
  scrollViewWrapper: {
    flex: 1,
    backgroundColor: "#fff",
    height: "100%",
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    color: "#fafafa",
    fontWeight: "700",
    letterSpacing: 1,
  },
  question: {
    color: "#484848",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  namePicker: {
    position: "absolute",
    top: "62.5%",
    width: "95%",
    backgroundColor: "#fff",
    zIndex: 1,
    height: 250,
    borderColor: "#fafafa",
  },
  nameBox: {
    marginTop: 10,
    height: 55,
    width: "90%",
    padding: 10,
    flexDirection: "row",
    backgroundColor: "#EBEBEB",
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 7,
    justifyContent: "center",
  },
  nameInput: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "dimgrey",
  },
  cancelButton: {
    position: "absolute",
    top: "66.5%",
    right: 0,
    height: 50,
    width: 50,
    fontSize: 13,
    backgroundColor: "#fff",
    zIndex: 2,
  },
  cancelButtonText: {
    color: "dimgrey",
    fontSize: 11,
  },
  messageBox: {
    marginTop: 10,
    height: "39%",
    width: "90%",
    padding: 10,
    flexDirection: "row",
    backgroundColor: "#EBEBEB",
    borderRadius: 15,
    marginBottom: 7,
  },
  messageInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "dimgrey",
  },
  text: {
    marginLeft: 220,
    color: "dimgrey",
    fontSize: 13,
  },
  customButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5ED483",
    borderRadius: 15,
    paddingVertical: 17,
    paddingHorizontal: 12,
    width: "90%",
    marginBottom: 30,
  },
  customButtonText: {
    fontSize: 18,
    color: "#fafafa",
    fontWeight: "bold",
    alignSelf: "center",
  },
});

export default SuggestionsScreen;
