/*–––––––––––––––––––––––––REACT IMPORTS–––––––––––––––––––––––––*/
import React, { Component } from "react";
import { StyleSheet, Text, View, Button, Dimensions } from "react-native";

/*–––––––––––––––––––––––––FIREBASE IMPORT–––––––––––––––––––––––––*/
import * as firebase from "firebase";
import "firebase/firestore";

/*–––––––––––––––––––––––––CUSTOM IMPORTS–––––––––––––––––––––––––*/
import CourseData from "./../data/CourseData.json";
import Colors from "./../data/Colors";
import CourseList from "./../data/CourseList";
import CoursePiece from "./../components/CoursePiece";

class SemesterPiece extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: "",
      title: this.props.title,
      data: {},
      trigger: false,
      currentSemesterCode: 0,
      navprops: this.props.navprops,
      visibility: this.props.visibility,
    };
  }

  determineSemesterCode = () => {
    switch (this.state.title) {
      case "Spring 2020":
        this.setState({ currentSemesterCode: 0 });
        break;
      case "Summer 2020":
        this.setState({ currentSemesterCode: 1 });
        break;
      case "Fall 2019":
        this.setState({ currentSemesterCode: 2 });
        break;
      case "Winter 2019":
        this.setState({ currentSemesterCode: 3 });
        break;
    }
  };

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
    this.determineSemesterCode();
  }

  triggerRenderCourseCards = () => {
    this.setState({ trigger: true });
  };

  bubbleSort1 = (arr, mainArr) => {
    var len = arr.length;
    for (var i = len - 1; i >= 0; i--) {
      for (var j = 1; j <= i; j++) {
        if (arr[j - 1].toLowerCase() > arr[j].toLowerCase()) {
          var temp = arr[j - 1];
          var mainTemp = mainArr[j - 1];
          arr[j - 1] = arr[j];
          mainArr[j - 1] = mainArr[j];
          arr[j] = temp;
          mainArr[j] = mainTemp;
        }
      }
    }
    return mainArr;
  };

  renderCourseCards = () => {
    var results = [];
    var courseObjects = [];
    var courseNames = [];
    var sortedCourseObjects = [];
    if (this.state.trigger) {
      for (let i = 0; i < Object.keys(this.state.data).length; i++) {
        currentCourse = this.state.data[Object.keys(this.state.data)[i]];
        courseObjects.push(currentCourse);
        courseNames.push(currentCourse["course_code"].split(" ")[0]);
      }
      sortedCourseObjects = this.bubbleSort1(courseNames, courseObjects);
      for (let i = 0; i < sortedCourseObjects.length; i++) {
        currentCourse = sortedCourseObjects[i];
        if (!currentCourse["shopping"]) {
          results.push(
            <CoursePiece
              key={i}
              courseCode={currentCourse["course_code"]}
              color={
                Colors[
                  CourseList.indexOf(currentCourse["course_code"].split(" ")[0])
                ]
              }
            ></CoursePiece>
          );
        }
      }
      return results;
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.state.visibility ? (
          <View style={[styles.mainContainer, { borderColor: "#E3E3E3" }]}>
            {this.state.visibility ? (
              <React.Fragment>
                <Text style={styles.title}>{this.state.title}</Text>
                <View style={{ flexDirection: "column" }}>
                  {this.renderCourseCards()}
                </View>
                <Text style={styles.hours1}>Avg. Hrs: 12</Text>
                <Text style={styles.hours2}>Max. Hrs: 12</Text>
              </React.Fragment>
            ) : null}
          </View>
        ) : (
          <View style={[styles.mainContainer, { borderColor: "#fff" }]}>
            {this.state.visibility ? (
              <React.Fragment>
                <Text style={styles.title}>{this.state.title}</Text>
                <View style={{ flexDirection: "column" }}>
                  {this.renderCourseCards()}
                </View>
                <Text style={styles.hours1}>Avg. Hrs: 12</Text>
                <Text style={styles.hours2}>Max. Hrs: 12</Text>
              </React.Fragment>
            ) : null}
          </View>
        )}
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    borderWidth: 2,
    margin: 2,
    height: 253,
    borderRadius: 15,
    width: 90,
    alignItems: "center",
  },
  title: {
    fontWeight: "600",
    fontStyle: "italic",
    color: "dimgrey",
    fontSize: 12,
    padding: 1,
  },
  hours1: {
    fontStyle: "italic",
    fontSize: 10,
    marginBottom: 4,
    color: "dimgrey",
    position: "absolute",
    bottom: 15,
  },
  hours2: {
    fontStyle: "italic",
    fontSize: 10,
    marginBottom: 4,
    color: "dimgrey",
    position: "absolute",
    bottom: 1,
  },
});

export default SemesterPiece;
