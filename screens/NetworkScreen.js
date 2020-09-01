import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Header } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "react-navigation-drawer";

import Icon from "react-native-vector-icons/Ionicons";

class NetworkScreen extends Component {
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
              this.props.navigation.dispatch(DrawerActions.openDrawer());
            }}
          >
            <Ionicons name={"md-menu"} size={32} color={"white"} />
          </TouchableOpacity>
        </Header>

        <View
          style={{ marginTop: 0.2 * Dimensions.get("window").height }}
        ></View>

        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("FindUsersConcentrationScreen");
          }}
          style={styles.concentrationBox}
        >
          <Text style={styles.concentrationText}>
            Click Here To Find Users In Your Concentration
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.concentrationBox}
        >
          <Text style={styles.concentrationText}>
            Click Here To Find Users In Your Classes
          </Text>
        </TouchableOpacity>
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
  concentrationBox: {
    marginTop: 10,
    height: 120,
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
    fontSize: 24,
    fontWeight: "600",
    color: "dimgrey",
    alignItems: "center",
    textAlign: "center",
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
});

export default NetworkScreen;
