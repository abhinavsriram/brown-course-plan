import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";

import firebase from "firebase";
import "firebase/firestore";

class UserProfileCardNetwork extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // placeholders when loading
      userData: {
        class_year: "0...",
        first_name: "Loading...",
        last_name: "",
      },
      downloadURL: "",
    };
  }

  getUserProfilePicture = (userIdent) => {
    firebase
      .storage()
      .ref("images/" + userIdent)
      .getDownloadURL()
      .then((downloadURL) => {
        this.setState({ downloadURL: downloadURL });
      });
  };

  componentDidMount() {
    this.getUserProfilePicture(this.props.userID);
  }

  render() {
    return (
      <React.Fragment>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            this.props.navigation.navigate("UserProfileScreenNetwork", {
              userID: this.props.userID,
            });
          }}
        >
          <View style={styles.mainContainer}>
            <View style={styles.profilePictureContainer}>
              <Image
                source={{ uri: this.state.downloadURL }}
                style={styles.profilePicture}
              ></Image>
            </View>
            <View style={styles.nameContainer}>
              <Text
                style={{
                  color: "dimgrey",
                  fontSize: 20,
                  fontWeight: "500",
                  flexShrink: 1,
                }}
              >
                {this.props.userFirstName +
                  " " +
                  this.props.userLastName +
                  " '" +
                  this.props.userClassYear}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    borderColor: "#E3E3E3",
    borderWidth: 3,
    borderRadius: 15,
    width: 0.9 * Dimensions.get("window").width,
    marginVertical: 5,
    minHeight: 125,
  },
  profilePictureContainer: {
    position: "absolute",
    top: 10,
    left: "2%",
    justifyContent: "center",
    alignItems: "center",
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePicturePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fafafa",
    justifyContent: "center",
    alignItems: "center",
    color: "red",
  },
  nameContainer: {
    position: "absolute",
    top: 10,
    left: "40%",
    flex: 1,
    width: "55%",
  },
  classYearContainer: {
    position: "absolute",
    top: 55,
    left: "40%",
  },
});

export default UserProfileCardNetwork;
