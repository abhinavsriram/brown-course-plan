/*–––––––––––––––––––––––––REACT IMPORTS–––––––––––––––––––––––––*/
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Header } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";

/*–––––––––––––––––––––––––CUSTOM IMPORTS–––––––––––––––––––––––––*/
import CourseCard from "./../components/CourseCardDashboard";
import AddCourseCard from "./../components/AddCourseCard";

/*–––––––––––––––––––––––––FIREBASE IMPORT–––––––––––––––––––––––––*/
import * as firebase from "firebase";
import "firebase/firestore";

/*–––––––––––––––––––––––––CUSTOM IMPORTS–––––––––––––––––––––––––*/
import CourseData from "./../data/CourseData.json";
import Colors from "./../data/Colors";
import CourseList from "./../data/CourseList";

/*–––––––––––––––––––––––––SEMESTER CARD COMPONENT–––––––––––––––––––––––––*/
class SemesterCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: "",
      title: this.props.title,
      data: {},
      trigger: false,
      currentSemesterCode: 0,
      navprops: this.props.navprops,
      function: this.props.function,
      courseCode: "Placeholder Course",
      isCourseInfoModalVisible: false,
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

  showHideCourseInfoPopUp = (courseCode) => {
    this.setState({ courseCode: courseCode }, () => {
      if (this.state.isCourseInfoModalVisible === true) {
        this.setState({ isCourseInfoModalVisible: false });
      } else {
        this.setState({ isCourseInfoModalVisible: true });
      }
    });
  };

  closeCourseInfoPopUp = () => {
    if (this.state.isCourseInfoModalVisible === true) {
      this.setState({ isCourseInfoModalVisible: false });
    }
  };

  createCourseInfoPopUp = () => {
    return (
      <View style={popUpStyles.container}>
        <Modal visible={this.state.isCourseInfoModalVisible}>
          <View style={popUpStyles.modal}>
            <Header
              backgroundColor="#4E342E"
              leftComponent={
                <TouchableOpacity onPress={() => this.closeCourseInfoPopUp()}>
                  <Icon name="ios-arrow-back" color="#fafafa" size={35} />
                </TouchableOpacity>
              }
              centerComponent={
                <Text style={popUpStyles.headerTitle}>
                  {this.state.courseCode}
                </Text>
              }
            ></Header>
            <ScrollView contentContainerStyle={popUpStyles.scrollContainer}>
              <Text style={popUpStyles.courseName}>
                {
                  CourseData[this.state.currentSemesterCode][
                    this.state.courseCode
                  ]["Course Name"]
                }
              </Text>
              <Text style={popUpStyles.semester}>{this.state.title}</Text>
              {CourseData[this.state.currentSemesterCode][
                this.state.courseCode
              ]["Course Capacity"] !== "" && (
                <React.Fragment>
                  <Text style={popUpStyles.subHeader}>Course Capacity:</Text>
                  <Text style={popUpStyles.description}>
                    {
                      CourseData[this.state.currentSemesterCode][
                        this.state.courseCode
                      ]["Course Capacity"]
                    }
                  </Text>
                </React.Fragment>
              )}
              {CourseData[this.state.currentSemesterCode][
                this.state.courseCode
              ]["Course Description"] !== "" && (
                <React.Fragment>
                  <Text style={popUpStyles.subHeader}>Course Description:</Text>
                  <Text style={popUpStyles.description}>
                    {
                      CourseData[this.state.currentSemesterCode][
                        this.state.courseCode
                      ]["Course Description"]
                    }
                  </Text>
                </React.Fragment>
              )}
              {CourseData[this.state.currentSemesterCode][
                this.state.courseCode
              ]["Course Restrictions"] !== "" && (
                <React.Fragment>
                  <Text style={popUpStyles.subHeader}>
                    Course Restrictions:
                  </Text>
                  <Text style={popUpStyles.description}>
                    {
                      CourseData[this.state.currentSemesterCode][
                        this.state.courseCode
                      ]["Course Restrictions"]
                    }
                  </Text>
                </React.Fragment>
              )}
              {CourseData[this.state.currentSemesterCode][
                this.state.courseCode
              ]["Critical Review"] !== "" && (
                <React.Fragment>
                  <Text style={popUpStyles.subHeader}>Critical Review:</Text>
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(
                        CourseData[this.state.currentSemesterCode][
                          this.state.courseCode
                        ]["Critical Review"]
                      )
                    }
                  >
                    <Text
                      style={{
                        textDecorationLine: "underline",
                        marginTop: 3,
                        color: "#757575",
                        fontSize: 17,
                      }}
                    >
                      {
                        CourseData[this.state.currentSemesterCode][
                          this.state.courseCode
                        ]["Critical Review"]
                      }
                    </Text>
                  </TouchableOpacity>
                </React.Fragment>
              )}
              {CourseData[this.state.currentSemesterCode][
                this.state.courseCode
              ]["Exam Time"] !== "" && (
                <React.Fragment>
                  <Text style={popUpStyles.subHeader}>Final Exam:</Text>
                  <Text style={popUpStyles.description}>
                    {
                      CourseData[this.state.currentSemesterCode][
                        this.state.courseCode
                      ]["Exam Time"]
                    }
                  </Text>
                </React.Fragment>
              )}
              {CourseData[this.state.currentSemesterCode][
                this.state.courseCode
              ]["Course Meeting Time"] !== "" && (
                <React.Fragment>
                  <Text style={popUpStyles.subHeader}>
                    Schedule and Location:
                  </Text>
                  <Text style={popUpStyles.description}>
                    {
                      CourseData[this.state.currentSemesterCode][
                        this.state.courseCode
                      ]["Course Meeting Time"]
                    }
                  </Text>
                </React.Fragment>
              )}
              {CourseData[this.state.currentSemesterCode][
                this.state.courseCode
              ]["Course Instructor"] !== "" && (
                <React.Fragment>
                  <Text style={popUpStyles.subHeader}>Instructor:</Text>
                  <Text style={popUpStyles.description}>
                    {
                      CourseData[this.state.currentSemesterCode][
                        this.state.courseCode
                      ]["Course Instructor"]
                    }
                  </Text>
                </React.Fragment>
              )}
              {CourseData[this.state.currentSemesterCode][
                this.state.courseCode
              ]["Section(s)"] !== "" && (
                <React.Fragment>
                  <Text style={popUpStyles.subHeader}>Sections:</Text>
                  <Text style={popUpStyles.description}>
                    {
                      CourseData[this.state.currentSemesterCode][
                        this.state.courseCode
                      ]["Section(s)"]
                    }
                  </Text>
                </React.Fragment>
              )}
              <Text style={popUpStyles.subHeader}>Grade Cutoffs:</Text>
              <Text style={popUpStyles.description}>Coming Soon...</Text>
              <View
                style={{
                  alignItems: "center",
                  marginTop: 15,
                  marginBottom: 10,
                }}
              ></View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    );
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
            <CourseCard
              key={i}
              courseCode={currentCourse["course_code"]}
              onPress={() =>
                this.showHideCourseInfoPopUp(currentCourse["course_code"])
              }
              courseName={
                CourseData[this.state.currentSemesterCode][
                  currentCourse["course_code"]
                ]["Course Name"]
              }
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
              style={[
                styles.courseCard,
                {
                  borderColor:
                    Colors[
                      CourseList.indexOf(
                        currentCourse["course_code"].split(" ")[0]
                      )
                    ],
                },
              ]}
            ></CourseCard>
          );
        }
      }
      return results;
    }
  };

  returnCredits = () => {
    var results = 0;
    if (this.state.trigger) {
      for (let i = 0; i < Object.keys(this.state.data).length; i++) {
        currentCourse = this.state.data[Object.keys(this.state.data)[i]];
        if (!currentCourse["shopping"] && currentCourse["full_half_credit"]) {
          results = results + 1;
        }
        if (!currentCourse["shopping"] && !currentCourse["full_half_credit"]) {
          results = results + 0.5;
        }
      }
    }
    return results;
  };

  returnEnrollmentUnits = () => {
    if (this.returnCredits() >= 3) {
      return 4;
    } else {
      return "N/A";
    }
  };

  renderShoppingCourseCards = () => {
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
        if (currentCourse["shopping"]) {
          results.push(
            <CourseCard
              key={i}
              courseCode={currentCourse["course_code"]}
              onPress={() =>
                this.showHideCourseInfoPopUp(currentCourse["course_code"])
              }
              onLongPress={() => console.log("WORKS")}
              courseName={
                CourseData[this.state.currentSemesterCode][
                  currentCourse["course_code"]
                ]["Course Name"]
              }
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
              style={[
                styles.courseCard,
                {
                  borderColor: "#E3E3E3",
                },
              ]}
            ></CourseCard>
          );
        }
      }
    }
    return results;
  };

  deleteSemesterFromDatabase1 = () => {
    firebase
      .firestore()
      .collection("user-information")
      .doc(this.state.userID)
      .collection("course-information")
      .doc(this.state.title)
      .delete()
      .then(function () {
        console.log("Document successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  };

  deleteSemesterFromDatabase2 = () => {
    firebase
      .firestore()
      .collection("user-information")
      .doc(this.state.userID)
      .collection("course-information")
      .doc("Semesters List")
      .update({
        semestersList: firebase.firestore.FieldValue.arrayRemove(
          this.state.title
        ),
      })
      .then(function () {
        console.log("Document successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  };

  deleteSemesterAlert = () => {
    Alert.alert(
      "Delete Semester",
      "Are you sure you want to delete the following Semester: " +
        this.state.title +
        "?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            this.deleteSemesterFromDatabase1();
            this.deleteSemesterFromDatabase2();
            this.props.refresh(true);
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <TouchableOpacity
          onLongPress={() => {
            this.deleteSemesterAlert();
          }}
          delayLongPress={1000}
        >
          <Text style={styles.title}>{this.state.title}</Text>
          <Text style={styles.credits}>
            Course Credits: {this.returnCredits()}, Enrollment Units:{" "}
            {this.returnEnrollmentUnits()}
          </Text>
        </TouchableOpacity>
        {this.renderCourseCards()}
        <AddCourseCard
          navprops={this.state.navprops}
          semester={this.state.title}
        ></AddCourseCard>
        <Text style={styles.shoppingTitle}>Shopping</Text>
        {this.renderShoppingCourseCards()}
        <AddCourseCard
          navprops={this.state.navprops}
          semester={this.state.title}
        ></AddCourseCard>
        <this.createCourseInfoPopUp></this.createCourseInfoPopUp>
      </View>
      // </TouchableOpacity>
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
  courseCard: {
    height: 100,
    backgroundColor: "#fafafa",
    borderWidth: 3,
    borderRadius: 10,
    width: 0.85 * Dimensions.get("window").width,
    zIndex: 5,
  },
  shoppingTitle: {
    marginLeft: 10,
    color: "#757575",
    fontSize: 24,
    fontStyle: "italic",
    fontWeight: "700",
    alignSelf: "stretch",
    justifyContent: "space-around",
    marginBottom: 4,
  },
  credits: {
    marginLeft: 10,
    color: "#757575",
    fontSize: 16,
    fontWeight: "600",
    alignSelf: "stretch",
    justifyContent: "space-around",
    marginBottom: 4,
  },
});

const popUpStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  modal: {
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
  backArrow: {
    position: "absolute",
    top: "6%",
    left: "6%",
    zIndex: 2,
  },
});

export default SemesterCard;
