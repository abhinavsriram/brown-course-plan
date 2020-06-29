/*–––––––––––––––––––––––––REACT IMPORTS–––––––––––––––––––––––––*/
import React, { Component } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

/*–––––––––––––––––––––––––COURSE CARD COMPONENT–––––––––––––––––––––––––*/
const CourseCard = ({
  onPress,
  courseCode,
  courseName,
  instructor,
  meetingTime,
  navigation,
  semesterCode,
}) => (
  <View style={styles.mainContainer}>
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("CourseInformationScreen", {
          courseCode: courseCode,
          semesterCode: semesterCode,
        })
      }
      activeOpacity={0.4}
      style={[
        styles.courseCard,
        {
          borderColor:
            "rgb(" +
            Math.floor(Math.random() * 256) +
            "," +
            Math.floor(Math.random() * 256) +
            "," +
            Math.floor(Math.random() * 256) +
            ")",
        },
      ]}
    >
      <View style={styles.container}>
        <Text style={styles.line1}>{courseCode}</Text>
        <Text numberOfLines={1} style={styles.line2}>
          {courseName}
        </Text>
        <View style={styles.line3Container}>
          <Text style={styles.line3}>{instructor}</Text>
        </View>
        <View style={styles.line4Container}>
          <Text style={styles.line4}>{meetingTime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  </View>
);

/*–––––––––––––––––––––––––STYLING FOR COURSE CARD COMPONENT–––––––––––––––––––––––––*/
const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: 7,
  },
  courseCard: {
    height: 100,
    backgroundColor: "#fafafa",
    borderWidth: 3,
    borderRadius: 10,
    width: 0.85 * Dimensions.get("window").width,
  },
  container: {
    flex: 1,
    padding: 5,
  },
  line1: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#484747",
    padding: 1,
  },
  line2: {
    fontSize: 15,
    color: "#484747",
    padding: 1,
  },
  line3Container: {
    flex: 1,
    flexDirection: "row",
    paddingTop: 4,
  },
  line3: {
    fontSize: 13,
    color: "#757575",
    padding: 1,
    fontStyle: "italic",
  },
  line4Container: {
    flex: 1,
    flexDirection: "row",
  },
  line4: {
    fontSize: 13,
    color: "#757575",
    padding: 1,
  },
});

export default CourseCard;
