import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Header } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "react-navigation-drawer";

class RequirementsScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Header
          backgroundColor="#4E342E"
          centerComponent={<Text style={styles.title}>Requirements</Text>}
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
        <View></View>
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
});

export default RequirementsScreen;
