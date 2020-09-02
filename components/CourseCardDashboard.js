import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const CourseCard = ({
  onPress,
  courseCode,
  courseName,
  grading,
  credit,
  shopping,
  concentrationRequirement,
  writRequirement,
  style,
  onLongPress,
}) => (
  <View style={styles.mainContainer}>
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.4}
      style={style}
      onLongPress={onLongPress}
    >
      <View style={styles.container}>
        <Text style={styles.line1}>{courseCode}</Text>
        <Text numberOfLines={1} style={styles.line2}>
          {courseName}
        </Text>
        <View style={styles.line3Container}>
          <Text style={styles.line3}>
            {grading !== "" ? grading + " | " : grading}
          </Text>
          <Text style={styles.line3}>{credit}</Text>
          <Text style={styles.line3}>{shopping}</Text>
        </View>
        <View style={styles.line4Container}>
          <Text style={styles.line4}>{concentrationRequirement}</Text>
          <Text style={styles.line4}>
            {writRequirement !== "" && concentrationRequirement !== ""
              ? "| WRIT Requirement"
              : writRequirement}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  mainContainer: {
    marginBottom: 7,
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
