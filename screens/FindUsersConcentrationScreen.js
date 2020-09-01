import React, { Component } from "react";
import {
  Picker,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Header } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "react-navigation-drawer";
import UserProfileCard from "../components/UserProfileCardNetwork";

import firebase from "firebase";
import "firebase/firestore";

import Icon from "react-native-vector-icons/Ionicons";
import completeConcentrationsList from "../data/ConcentrationsList.js";

class FindUsersConcentrationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // placeholders when loading
      userData: {
        class_year: "0...",
        first_name: "Loading...",
        last_name: "",
      },
      searchResults: [],
      concentrationPickerValue: "Click to Choose",
      concentrationPickerVisible: false,
    };
  }

  searchEngine = async (concentrationOne) => {
    var localSearchResults = [];
    const querySnapshot = await firebase
      .firestore()
      .collection("user-information")
      .where("concentration", "==", concentrationOne)
      .orderBy("first_name")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          localSearchResults.push(doc.data());
        });
      });
    this.setState({ searchResults: localSearchResults });
  };

  showHideConcentrationPicker = () => {
    if (this.state.concentrationPickerVisible) {
      this.setState({ concentrationPickerVisible: false });
    } else {
      this.setState({ concentrationPickerVisible: true });
    }
  };

  createUserProfileCards = () => {
    if (this.state.concentrationPickerValue !== "Click to Choose") {
      if (this.state.searchResults.length !== 0) {
        return this.state.searchResults.map((userData, index) => {
          return (
            <UserProfileCard
              userFirstName={userData["first_name"]}
              userLastName={userData["last_name"]}
              userClassYear={userData["class_year"].split("0")[1]}
              userID={userData["email"].split("@")[0]}
              navigation={this.props.navigation}
              userData={userData}
              key={index}
            ></UserProfileCard>
          );
        });
      } else {
        return (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text
              style={{
                color: "gray",
                fontSize: 16,
                fontStyle: "italic",
                marginTop: 10,
              }}
            >
              No Results
            </Text>
          </View>
        );
      }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Header
          backgroundColor="#4E342E"
          centerComponent={<Text style={styles.title}>Network</Text>}
        >
          <TouchableOpacity
            style={styles.trigger}
            onPress={() => {
              this.props.navigation.navigate("TabNavigator");
            }}
          >
            <Ionicons name={"ios-arrow-back"} size={35} color={"white"} />
          </TouchableOpacity>
        </Header>

        <Text
          style={{
            color: "#4E342E",
            fontSize: 16,
            fontWeight: "500",
            fontStyle: "italic",
            marginTop: 8,
          }}
        >
          Choose a Concentration
        </Text>

        <TouchableOpacity
          onPress={() => {
            this.showHideConcentrationPicker();
          }}
          style={styles.concentrationBox}
        >
          <Icon name="ios-arrow-dropdown" size={20} />
          <Text style={styles.concentrationText}>
            {this.state.concentrationPickerValue}
          </Text>
        </TouchableOpacity>

        {this.state.concentrationPickerVisible ? (
          <React.Fragment>
            <Picker
              style={styles.concentrationPicker}
              selectedValue={this.state.concentrationPickerValue}
              onValueChange={(itemValue) => {
                this.setState(
                  { concentrationPickerValue: itemValue },
                  async () => {
                    await this.searchEngine(
                      this.state.concentrationPickerValue
                    );
                  }
                );
              }}
              itemStyle={{ color: "#333333", borderColor: "#fafafa" }}
            >
              {completeConcentrationsList.map((concentration, index) => {
                return (
                  <Picker.Item
                    key={index}
                    label={concentration}
                    value={concentration}
                  ></Picker.Item>
                );
              })}
            </Picker>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                if (this.state.concentrationPickerValue === "Click to Choose") {
                  this.setState(
                    { concentrationPickerValue: "Yet To Declare" },
                    async () => {
                      await this.searchEngine(
                        this.state.concentrationPickerValue
                      );
                    }
                  );
                }
                this.showHideConcentrationPicker();
                this.createUserProfileCards();
              }}
            >
              <Text style={styles.cancelButtonText}>DONE</Text>
            </TouchableOpacity>
          </React.Fragment>
        ) : null}
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.state.concentrationPickerVisible
            ? null
            : this.createUserProfileCards()}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    color: "#fafafa",
    fontWeight: "700",
    letterSpacing: 1,
  },
  comingSoonContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    top: 15,
  },
  comingSoonText: {
    color: "#4E342E",
    fontSize: 28,
    fontStyle: "italic",
    fontWeight: "bold",
    marginBottom: 10,
  },

  concentrationBox: {
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
  concentrationText: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 10,
    padding: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "dimgrey",
  },
  text: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    color: "#fafafa",
    fontWeight: "700",
    letterSpacing: 1,
  },
  concentrationPicker: {
    position: "absolute",
    top: "55%",
    width: "82%",
    backgroundColor: "#fff",
    zIndex: 1,
    height: 250,
    borderColor: "#fafafa",
  },
  cancelButton: {
    position: "absolute",
    top: "54%",
    right: 33,
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
});

export default FindUsersConcentrationScreen;
