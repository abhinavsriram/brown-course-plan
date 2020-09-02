import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";

import firebase from "firebase";
import "firebase/firestore";

class UserProfileCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // placeholders when loading
      userData: {
        class_year: "0...",
        first_name: "Loading...",
        last_name: "",
      },
    };
  }

  getUserID = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const email = user.email;
        const userID = email.split("@")[0];
        this.setState({ userID: userID }, () => {
          this.getUserInformation();
        });
      }
    });
  };

  getUserInformation = () => {
    firebase
      .firestore()
      .collection("user-information")
      .doc(this.state.userID)
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.setState({ userData: doc.data() });
        }
      });
  };

  componentDidMount() {
    this.getUserID();
  }

  render() {
    return (
      <React.Fragment>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            this.props.navigation.navigate("MyProfileScreenDashboard");
          }}
        >
          <View style={styles.mainContainer}>
            <View style={styles.profilePictureContainer}>
              <TouchableOpacity
                activeOpacity={1.0}
                style={styles.profilePicturePlaceholder}
                onPress={this.handlePickProfilePicture}
                disabled={true}
              >
                {this.state.userData["profile_picture_url"] ===
                "./../assets/dp-placeholder.jpg" ? (
                  <Image
                    source={require("./../assets/dp-placeholder.jpg")}
                    style={styles.profilePicture}
                  ></Image>
                ) : (
                  <Image
                    source={{
                      uri: this.state.userData["profile_picture_url"],
                    }}
                    style={styles.profilePicture}
                  ></Image>
                )}
              </TouchableOpacity>
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
                {this.state.userData["first_name"] +
                  " " +
                  this.state.userData["last_name"] +
                  " '" +
                  this.state.userData["class_year"].split("0")[1]}
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

export default UserProfileCard;
