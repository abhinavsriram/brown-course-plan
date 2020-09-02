import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const CoursePieceDashboard = ({ courseCode, color }) => (
  <TouchableOpacity
    style={[summaryStyles.coursePieceStyle, { backgroundColor: color }]}
    activeOpacity={1}
  >
    <Text style={summaryStyles.coursePieceText}>{courseCode}</Text>
  </TouchableOpacity>
);

const summaryStyles = StyleSheet.create({
  coursePieceStyle: {
    height: 30,
    width: 77,
    margin: 3,
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

export default CoursePieceDashboard;