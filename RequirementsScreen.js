import React, { Component } from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { Header } from "react-native-elements";

class RequirementsScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Header
          backgroundColor="#4E342E"
          leftComponent={{ icon: "menu", color: "#fff", size: 30 }}
          centerComponent={<Text style={styles.title}>Requirements</Text>}
        ></Header>
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