import React, { Component } from "react";
import { StyleSheet, Text, View, Button, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const AddSemesterCard = ({ onPress }) => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.mainContainer} onPress={onPress}>
      <Text style={styles.addSemester}>Add Semester</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  mainContainer: {
    borderColor: "#E3E3E3",
    borderWidth: 3,
    borderRadius: 15,
    width: 0.9 * Dimensions.get("window").width,
    alignItems: "center",
    marginBottom: 30,
    height: 150,
    borderStyle: "dotted",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    marginVertical: 10,
  },
  title: {
    marginLeft: 10,
    marginTop: 12,
    color: "#757575",
    fontSize: 24,
    fontWeight: "800",
    alignSelf: "stretch",
    justifyContent: "space-around",
  },
  addSemester: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#757575",
    fontWeight: "800",
  },
});

export default AddSemesterCard;
