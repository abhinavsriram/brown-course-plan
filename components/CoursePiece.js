/*–––––––––––––––––––––––––REACT IMPORTS–––––––––––––––––––––––––*/
import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import courseList from "../data/CourseList";

/*–––––––––––––––––––––––––"ADD COURSE" CARD COMPONENT–––––––––––––––––––––––––*/

const CoursePiece = ({ courseCode, color }) => (
  <TouchableOpacity
    style={[summaryStyles.coursePieceStyle, { backgroundColor: color }]}
    activeOpacity={1}
  >
    <Text style={summaryStyles.coursePieceText}>{courseCode}</Text>
  </TouchableOpacity>
);

/*–––––––––––––––––––––––––STYLING–––––––––––––––––––––––––*/
const summaryStyles = StyleSheet.create({
  coursePieceStyle: {
    height: 30,
    width: 77,
    margin: 5,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  coursePieceText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 11.5,
  },
});

export default CoursePiece;
