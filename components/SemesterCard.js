import React, { Component } from "react";
import { StyleSheet, Text, View, Button, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const SemesterCard = () => (
  <View style={styles.mainContainer}>
    <Text style={styles.title}>Spring 2020</Text>
    <Text></Text>
    <TouchableOpacity style={styles.addCourseCard}>
      <Text style={styles.addCourse}>Add Course</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.addCourseCard}>
      <Text style={styles.addCourse}>Add Course</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.addCourseCard}>
      <Text style={styles.addCourse}>Add Course</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.addCourseCard}>
      <Text style={styles.addCourse}>Add Course</Text>
    </TouchableOpacity>
    {/* <TouchableOpacity style={styles.addCourseCard}>
      <Text style={styles.addCourse}>Add Course</Text>
    </TouchableOpacity> */}
  </View>
);

const styles = StyleSheet.create({
  mainContainer: {
    borderColor: "#E3E3E3",
    borderWidth: 3,
    borderRadius: 15,
    // height: 600,
    width: 0.9 * Dimensions.get("window").width,
    alignItems: "center",
    marginBottom: 20,
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
  addCourseCard: {
    height: 100,
    backgroundColor: "#fafafa",
    borderColor: "#E3E3E3",
    borderWidth: 3,
    borderRadius: 10,
    borderStyle: "dotted",
    width: 0.85 * Dimensions.get("window").width,
    marginBottom: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  addCourse: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ABABAB",
  },
});

export { SemesterCard };
