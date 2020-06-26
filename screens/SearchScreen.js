import React, { Component } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import { TextInput } from "react-native-gesture-handler";
import { Header } from "react-native-elements";

class SearchScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Header
          backgroundColor="#4E342E"
          leftComponent={{ icon: "menu", color: "#fff", size: 30 }}
          centerComponent={<Text style={styles.title}>Search</Text>}
        ></Header>
        <View style={styles.searchBox}>
          <Icon name="ios-search" size={20} />
          <TextInput
            placeholder="Course Code, Name, CRN, Field, Instructor "
            placeholderTextColor="dimgrey"
            style={styles.textInput}
          />
        </View>
        <ScrollView contentContainerStyle={styles.text}></ScrollView>
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
  searchBox: {
    marginTop: 10,
    height: 55,
    width: "90%",
    padding: 10,
    flexDirection: "row",
    backgroundColor: "#EBEBEB",
    borderRadius: 15,
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    alignSelf: "stretch",
    padding: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
  },
  text: {
    flex: 1,
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

export default SearchScreen;
