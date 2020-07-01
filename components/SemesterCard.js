/*–––––––––––––––––––––––––REACT IMPORTS–––––––––––––––––––––––––*/
import React, { Component } from "react";
import { StyleSheet, Text, View, Button, Dimensions } from "react-native";

/*–––––––––––––––––––––––––CUSTOM IMPORTS–––––––––––––––––––––––––*/
import CourseCard from "./../components/CourseCardDashboard";
import AddCourseCard from "./../components/AddCourseCard";

/*–––––––––––––––––––––––––FIREBASE IMPORT–––––––––––––––––––––––––*/
import * as firebase from "firebase";
import "firebase/firestore";

/*–––––––––––––––––––––––––SEMESTER CARD COMPONENT–––––––––––––––––––––––––*/
class SemesterCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: "",
      title: this.props.title,
      data: {},
      trigger: false,
    };
  }

  getUserID = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const email = user.email;
        const userID = email.split("@")[0];
        this.setState({ userID: userID }, () => {
          this.pullFromDatabase();
        });
      } else {
      }
    });
  };

  pullFromDatabase = () => {
    firebase
      .firestore()
      .collection("user-information")
      .doc(this.state.userID)
      .collection("course-information")
      .doc(this.state.title)
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.setState({ data: doc.data() }, () => {
            this.triggerRenderCourseCards();
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  componentDidMount() {
    this.getUserID();
  }

  triggerRenderCourseCards = () => {
    this.setState({ trigger: true });
  };

  renderCourseCards = () => {
    var results = [];
    if (this.state.trigger) {
      for (let i = 0; i < Object.keys(this.state.data).length; i++) {
        currentCourse = this.state.data[Object.keys(this.state.data)[i]];
        results.push(
          <CourseCard
            key={i}
            courseCode={currentCourse["course_code"]}
            courseName="Introduction to Algorithms and Data Structures"
            grading={
              currentCourse["grade_mode"] ? "Graded A/B/C/NC" : "Graded S/NC"
            }
            credit={
              currentCourse["full_half_credit"] ? "1 Credit" : "0.5 Credit"
            }
            concentrationRequirement={
              currentCourse["concentration_1_requirement"]
                ? "Concentration Requirement"
                : ""
            }
            writRequirement={
              currentCourse["writ_requirement"] ? "WRIT Requirement" : ""
            }
          ></CourseCard>
        );
      }
      return results;
    }
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <Text style={styles.title}>{this.state.title}</Text>
        {this.renderCourseCards()}
        <AddCourseCard></AddCourseCard>
      </View>
    );
  }
}

/*–––––––––––––––––––––––––STYLING FOR SEMESTER CARD COMPONENT–––––––––––––––––––––––––*/
const styles = StyleSheet.create({
  mainContainer: {
    borderColor: "#E3E3E3",
    borderWidth: 3,
    borderRadius: 15,
    width: 0.9 * Dimensions.get("window").width,
    alignItems: "center",
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
    marginBottom: 4,
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

export default SemesterCard;
