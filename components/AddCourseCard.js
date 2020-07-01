/*–––––––––––––––––––––––––REACT IMPORTS–––––––––––––––––––––––––*/
import React from "react";
import { StyleSheet, Text, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

/*–––––––––––––––––––––––––"ADD COURSE" CARD COMPONENT–––––––––––––––––––––––––*/
const AddCourseCard = () => (
  <TouchableOpacity style={styles.addCourseCard}>
    <Text style={styles.addCourse}>Add Course</Text>
  </TouchableOpacity>
);

/*–––––––––––––––––––––––––STYLING–––––––––––––––––––––––––*/
const styles = StyleSheet.create({
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

export default AddCourseCard;
