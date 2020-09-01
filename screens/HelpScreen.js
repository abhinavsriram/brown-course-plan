import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Header } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "react-navigation-drawer";

class HelpScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Header
          backgroundColor="#4E342E"
          centerComponent={<Text style={styles.title}>Help</Text>}
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
        <View style={styles.comingSoonContainer}>
          <Text style={styles.comingSoonText}>Coming Soon....</Text>
          <Text
            style={{
              color: "#4E342E",
              fontWeight: "500",
              fontStyle: "italic",
              marginTop: 10,
            }}
          >
            In the mean time, feel free to reach out to us by email
            (browncourseplan@gmail.com) or through the Suggestions Page.
          </Text>
        </View>
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
    alignItems: "center",
    width: "80%",
  },
  comingSoonText: {
    color: "#4E342E",
    fontSize: 28,
    fontStyle: "italic",
    fontWeight: "bold",
  },
});

export default HelpScreen;
