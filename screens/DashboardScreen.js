import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Header } from "react-native-elements";

import firebase from "firebase";

import CourseCard from "./../components/CourseCard";
import SemesterCard from "./../components/SemesterCard";

/*–––––––––––––––––––––––––DASHBOARD SCREEN COMPONENT–––––––––––––––––––––––––*/
class DashboardScreen extends Component {
  createSemesterCard = () => {
    return <SemesterCard></SemesterCard>;
  };

  /*–––––––––––––––––––––––––RENDER METHOD–––––––––––––––––––––––––*/
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          backgroundColor="#4E342E"
          leftComponent={{ icon: "menu", color: "#fff", size: 30 }}
          centerComponent={<Text style={styles.title}>Dashboard</Text>}
        ></Header>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.container}
        >
          <View style={{ flexDirection: "row" }}>
            <Button
              title="Go Back"
              onPress={() =>
                this.props.navigation.navigate("CreateProfileScreen1")
              }
            ></Button>
            <Button
              title="Sign Out"
              onPress={() => {
                this.props.navigation.navigate("LandingScreen");
                firebase.auth().signOut();
              }}
            ></Button>
            <Button
              title="Add Semester"
              onPress={() => this.createSemesterCard()}
            ></Button>
          </View>
          <View>
            <SemesterCard></SemesterCard>
            <CourseCard
              courseCode="CSCI 0160"
              courseName="Introduction to Algorithms and Data Structures"
              grading="Graded A/B/C/NC"
              credit="1 Credit"
              concentrationRequirement="Concentration Requirement"
              writRequirement="WRIT Requirement"
            ></CourseCard>
            <CourseCard
              courseCode="ECON 1130"
              courseName="Intermediate Microeconomics (Mathematical) This name is long"
              grading="Graded A/B/C/NC"
              credit="1 Credit"
              writRequirement="WRIT Requirement"
            ></CourseCard>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    color: "#fafafa",
    fontWeight: "700",
    letterSpacing: 1.5,
  },
});

export default DashboardScreen;
