/*–––––––––––––––––––––––––REACT IMPORTS–––––––––––––––––––––––––*/
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  TouchableOpacity,
} from "react-native";
import { Header } from "react-native-elements";

/*–––––––––––––––––––––––––ICONS IMPORT–––––––––––––––––––––––––*/
import Icon from "react-native-vector-icons/Ionicons";

/*–––––––––––––––––––––––––CUSTOM IMPORTS–––––––––––––––––––––––––*/
import CourseData from "./../data/Spring2020CourseInformation.json";

/*–––––––––––––––––––––––––CUSTOM INFORMATION SCREEN COMPONENT–––––––––––––––––––––––––*/
class CourseInformationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseCode: this.props.navigation.state.params.courseCode,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          backgroundColor="#4E342E"
          leftComponent={
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("TabNavigatorSearch")
              }
            >
              <Icon name="ios-arrow-back" color="#fafafa" size={35} />
            </TouchableOpacity>
          }
          centerComponent={
            <Text style={styles.headerTitle}>{this.state.courseCode}</Text>
          }
        ></Header>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.courseName}>
            {CourseData[this.state.courseCode]["Course Name"]}
          </Text>
          <Text style={styles.semester}>Spring 2020</Text>
          {CourseData[this.state.courseCode]["Course Capacity"] !== "" && (
            <React.Fragment>
              <Text style={styles.subHeader}>Course Capacity:</Text>
              <Text style={styles.description}>
                {CourseData[this.state.courseCode]["Course Capacity"]}
              </Text>
            </React.Fragment>
          )}
          {CourseData[this.state.courseCode]["Course Description"] !== "" && (
            <React.Fragment>
              <Text style={styles.subHeader}>Course Description:</Text>
              <Text style={styles.description}>
                {CourseData[this.state.courseCode]["Course Description"]}
              </Text>
            </React.Fragment>
          )}
          {CourseData[this.state.courseCode]["Course Restrictions"] !== "" && (
            <React.Fragment>
              <Text style={styles.subHeader}>Course Restrictions:</Text>
              <Text style={styles.description}>
                {CourseData[this.state.courseCode]["Course Restrictions"]}
              </Text>
            </React.Fragment>
          )}

          {CourseData[this.state.courseCode]["Critical Review"] !== "" && (
            <React.Fragment>
              <Text style={styles.subHeader}>Critical Review:</Text>
              <Text style={styles.description}>
                {CourseData[this.state.courseCode]["Critical Review"]}
              </Text>
            </React.Fragment>
          )}
          {CourseData[this.state.courseCode]["Exam Time"] !== "" && (
            <React.Fragment>
              <Text style={styles.subHeader}>Final Exam:</Text>
              <Text style={styles.description}>
                {CourseData[this.state.courseCode]["Exam Time"]}
              </Text>
            </React.Fragment>
          )}
          {CourseData[this.state.courseCode]["Course Meeting Time"] !== "" && (
            <React.Fragment>
              <Text style={styles.subHeader}>Schedule and Location:</Text>
              <Text style={styles.description}>
                {CourseData[this.state.courseCode]["Course Meeting Time"]}
              </Text>
            </React.Fragment>
          )}
          {CourseData[this.state.courseCode]["Course Instructor"] !== "" && (
            <React.Fragment>
              <Text style={styles.subHeader}>Instructor:</Text>
              <Text style={styles.description}>
                {CourseData[this.state.courseCode]["Course Instructor"]}
              </Text>
            </React.Fragment>
          )}
          {CourseData[this.state.courseCode]["Section(s)"] !== "" && (
            <React.Fragment>
              <Text style={styles.subHeader}>Sections:</Text>
              <Text style={styles.description}>
                {CourseData[this.state.courseCode]["Section(s)"]}
              </Text>
            </React.Fragment>
          )}
          <Text style={styles.subHeader}>Grade Cutoffs:</Text>
          <Text style={styles.description}>Coming Soon...</Text>
          <View
            style={{ alignItems: "center", marginTop: 15, marginBottom: 10 }}
          >
            <CustomButton title="Add Course"></CustomButton>
          </View>
        </ScrollView>
      </View>
    );
  }
}

/*–––––––––––––––––––––––––CUSTOM BUTTON COMPONENT–––––––––––––––––––––––––*/
const CustomButton = ({ onPress, title }) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.customButtonContainer}
    activeOpacity={0.8}
  >
    <Text style={styles.customButtonText}>{title}</Text>
  </TouchableOpacity>
);

/*–––––––––––––––––––––––––STYLING–––––––––––––––––––––––––*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  scrollContainer: {
    backgroundColor: "#fff",
    padding: 14,
  },
  headerTitle: {
    fontSize: 30,
    color: "#fafafa",
    fontWeight: "700",
    letterSpacing: 1,
  },
  courseName: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#757575",
  },
  semester: {
    marginTop: 3,
    fontWeight: "bold",
    color: "#757575",
    fontSize: 23,
  },
  subHeader: {
    marginTop: 15,
    fontWeight: "bold",
    color: "#757575",
    fontSize: 20,
  },
  description: {
    marginTop: 3,
    color: "#757575",
    fontSize: 17,
  },
  customButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5ED483",
    borderRadius: 15,
    paddingVertical: 17,
    paddingHorizontal: 12,
    width: "80%",
  },
  customButtonText: {
    fontSize: 18,
    color: "#fafafa",
    fontWeight: "bold",
    alignSelf: "center",
  },
});

export default CourseInformationScreen;
