import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Header } from "react-native-elements";
import SwitchSelector from "react-native-switch-selector";
import Icon from "react-native-vector-icons/Ionicons";

import CourseCard from "./../components/CourseCardDashboard";
import AddCourseCard from "./../components/AddCourseCard";

import * as firebase from "firebase";
import "firebase/firestore";

import CourseData from "./../data/CourseData.json";
import Colors from "./../data/Colors";
import CourseList from "./../data/CourseList";

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
      courseCode: "Placeholder Course",
      isCourseInfoModalVisible: false,
      isCourseAddModalVisible: false,
      popUpGradeMode: true,
      popUpConcentrationRequirement: false,
      popUpConcentration2Requirement: false,
      popUpWritRequirement: false,
      popUpfullhalfCredit: true,
      popUpShopping: false,
      initialpopUpGradeMode: 1,
      initialpopUpConcentrationRequirement: 1,
      initialpopUpConcentration2Requirement: 1,
      initialpopUpWritRequirement: 1,
      initialpopUpfullhalfCredit: 1,
      initialpopUpShopping: 1,
      firstConcentration: null,
      secondConcentartion: null,
    };
  }

  // called when component mounts
  // calls on three methods that are integral to this class' functionality
  getUserID = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const email = user.email;
        const userID = email.split("@")[0];
        this.setState({ userID: userID }, () => {
          this.pullDataObjectFromDatabase();
          this.getConcentrations();
          this.determineSemesterCode();
        });
      } else {
      }
    });
  };

  // pulls all the information for a particular semester as a doc object
  pullDataObjectFromDatabase = () => {
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

  // accounts for time-delay between code compile and database response
  triggerRenderCourseCards = () => {
    this.setState({ trigger: true });
  };

  // called after acquiring userID
  // helps determine if "concentration requirement" switch selectors should exist on Pop-Up
  getConcentrations = () => {
    firebase
      .firestore()
      .collection("user-information")
      .doc(this.state.userID)
      .get()
      .then((doc) => {
        if (doc.exists) {
          if (doc.data().concentration !== undefined) {
            if (
              doc.data().concentration !== "Yet To Declare" &&
              doc.data().concentration !== "Not Declaring"
            ) {
              this.setState({ firstConcentration: doc.data().concentration });
            }
          }
          if (
            doc.data().second_concentration !== undefined &&
            doc.data().second_concentration !== "Not Declaring" &&
            doc.data().second_concentration !== "Click to Choose"
          ) {
            if (doc.data().second_concentration !== "Yet To Declare") {
              this.setState({
                secondConcentartion: doc.data().second_concentration,
              });
            }
          }
        }
      });
  };

  determineSemesterCode = () => {
    switch (this.state.title) {
      case "Spring 2020":
      case "Spring 2021":
      case "Spring 2022":
      case "Spring 2023":
      case "Spring 2024":
        this.setState({ currentSemesterCode: 10 });
        break;
      case "Summer 2020":
      case "Summer 2021":
      case "Summer 2022":
      case "Summer 2023":
      case "Summer 2024":
        this.setState({ currentSemesterCode: 11 });
        break;
      case "Fall 2019":
      case "Fall 2020":
      case "Fall 2021":
      case "Fall 2022":
      case "Fall 2023":
      case "Fall 2024":
        this.setState({ currentSemesterCode: 8 });
        break;
      case "Winter 2019":
      case "Winter 2020":
      case "Winter 2021":
      case "Winter 2022":
      case "Winter 2023":
      case "Winter 2024":
        this.setState({ currentSemesterCode: 9 });
        break;
      case "Fall 2017":
        this.setState({ currentSemesterCode: 0 });
        break;
      case "Winter 2017":
        this.setState({ currentSemesterCode: 1 });
        break;
      case "Spring 2018":
        this.setState({ currentSemesterCode: 2 });
        break;
      case "Summer 2018":
        this.setState({ currentSemesterCode: 3 });
        break;
      case "Fall 2018":
        this.setState({ currentSemesterCode: 4 });
        break;
      case "Winter 2018":
        this.setState({ currentSemesterCode: 5 });
        break;
      case "Spring 2019":
        this.setState({ currentSemesterCode: 6 });
        break;
      case "Summer 2019":
        this.setState({ currentSemesterCode: 7 });
        break;
      case "Fall 2019":
        this.setState({ currentSemesterCode: 8 });
        break;
      case "Winter 2019":
        this.setState({ currentSemesterCode: 9 });
        break;
      case "Spring 2020":
        this.setState({ currentSemesterCode: 10 });
        break;
      case "Summer 2020":
        this.setState({ currentSemesterCode: 11 });
        break;
    }
  };

  componentDidMount() {
    this.getUserID();
  }

  /*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––COURSE INFO POP-UP BEGINS–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

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
      <View style={courseInfoPopUpStyles.container}>
        <Modal visible={this.state.isCourseInfoModalVisible}>
          <View style={courseInfoPopUpStyles.modal}>
            <Header
              backgroundColor="#4E342E"
              leftComponent={
                <TouchableOpacity onPress={() => this.closeCourseInfoPopUp()}>
                  <Icon name="ios-arrow-back" color="#fafafa" size={35} />
                </TouchableOpacity>
              }
              centerComponent={
                <Text style={courseInfoPopUpStyles.headerTitle}>
                  {this.state.courseCode}
                </Text>
              }
            ></Header>
            <ScrollView
              contentContainerStyle={courseInfoPopUpStyles.scrollContainer}
            >
              <Text style={courseInfoPopUpStyles.courseName}>
                {
                  CourseData[this.state.currentSemesterCode][
                    this.state.courseCode
                  ]["Course Name"]
                }
              </Text>
              <Text style={courseInfoPopUpStyles.semester}>
                {this.state.title}
              </Text>
              {CourseData[this.state.currentSemesterCode][
                this.state.courseCode
              ]["Course Capacity"] !== "" && (
                <React.Fragment>
                  <Text style={courseInfoPopUpStyles.subHeader}>
                    Course Capacity:
                  </Text>
                  <Text style={courseInfoPopUpStyles.description}>
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
                  <Text style={courseInfoPopUpStyles.subHeader}>
                    Course Description:
                  </Text>
                  <Text style={courseInfoPopUpStyles.description}>
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
                  <Text style={courseInfoPopUpStyles.subHeader}>
                    Course Restrictions:
                  </Text>
                  <Text style={courseInfoPopUpStyles.description}>
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
                  <Text style={courseInfoPopUpStyles.subHeader}>
                    Critical Review:
                  </Text>
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
                  <Text style={courseInfoPopUpStyles.subHeader}>
                    Final Exam:
                  </Text>
                  <Text style={courseInfoPopUpStyles.description}>
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
                  <Text style={courseInfoPopUpStyles.subHeader}>
                    Schedule and Location:
                  </Text>
                  <Text style={courseInfoPopUpStyles.description}>
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
                  <Text style={courseInfoPopUpStyles.subHeader}>
                    Instructor:
                  </Text>
                  <Text style={courseInfoPopUpStyles.description}>
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
                  <Text style={courseInfoPopUpStyles.subHeader}>Sections:</Text>
                  <Text style={courseInfoPopUpStyles.description}>
                    {
                      CourseData[this.state.currentSemesterCode][
                        this.state.courseCode
                      ]["Section(s)"]
                    }
                  </Text>
                </React.Fragment>
              )}
              <Text style={courseInfoPopUpStyles.subHeader}>
                Grade Cutoffs:
              </Text>
              <Text style={courseInfoPopUpStyles.description}>
                Coming Soon...
              </Text>
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

  /*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––COURSE ADD POP-UP BEGINS–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

  showHideCourseAddPopUp = (courseCode) => {
    this.setState({ courseCode: courseCode }, () => {
      this.setState({ isCourseInfoModalVisible: false });
      if (this.state.isCourseAddModalVisible === true) {
        this.setState({ isCourseAddModalVisible: false });
      } else {
        this.pullCourseDetailsFromDatabase();
        setTimeout(
          () => this.setState({ isCourseAddModalVisible: true }),
          1250
        );
      }
    });
  };

  closeCourseAddPopUp = () => {
    if (this.state.isCourseAddModalVisible === true) {
      this.setState({ isCourseAddModalVisible: false });
    }
  };

  // resets the values that are passed into "initial" of every switch selector
  setDefaultInitialValues = () => {
    this.setState({ initialpopUpGradeMode: 0 });
    this.setState({ initialpopUpConcentrationRequirement: 1 });
    this.setState({ initialpopUpConcentration2Requirement: 1 });
    this.setState({ initialpopUpWritRequirement: 1 });
    this.setState({ initialpopUpfullhalfCredit: 0 });
    this.setState({ initialpopUpShopping: 1 });
  };

  setDefaultValues = () => {
    this.setState({ popUpGradeMode: true });
    this.setState({ popUpConcentrationRequirement: false });
    this.setState({ popUpConcentration2Requirement: false });
    this.setState({ popUpWritRequirement: false });
    this.setState({ popUpfullhalfCredit: true });
    this.setState({ popUpShopping: false });
  };

  // pulls information for all the switch selectors from the database
  pullCourseDetailsFromDatabase = () => {
    var courseObjects = [];
    var courseNames = [];
    var sortedCourseObjects = [];
    var sortedCourseNames = [];
    firebase
      .firestore()
      .collection("user-information")
      .doc(this.state.userID)
      .collection("course-information")
      .doc(this.state.title)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const semesterCourseDetails = doc.data();
          for (let i = 0; i < Object.keys(semesterCourseDetails).length; i++) {
            currentCourse =
              semesterCourseDetails[Object.keys(semesterCourseDetails)[i]];
            courseObjects.push(currentCourse);
            courseNames.push(currentCourse["course_code"]);
          }
          sortedCourseObjects = this.bubbleSortAlphabetically(
            courseNames,
            courseObjects
          );
          sortedCourseNames = this.bubbleSortAlphabetically(
            courseNames,
            courseNames
          );
          sortedCourseObjects.map((currentCourse, index) => {
            let n = sortedCourseNames.indexOf(this.state.courseCode);
            if (index === n) {
              this.setState(
                { popUpGradeMode: currentCourse["grade_mode"] },
                () => {
                  if (!this.state.popUpGradeMode) {
                    this.setState({ initialpopUpGradeMode: 1 });
                  }
                }
              );
              this.setState(
                {
                  popUpConcentrationRequirement:
                    currentCourse["concentration_1_requirement"],
                },
                () => {
                  if (!this.state.popUpConcentrationRequirement) {
                    this.setState({ initialpopUpConcentrationRequirement: 0 });
                  }
                }
              );
              this.setState(
                {
                  popUpConcentration2Requirement:
                    currentCourse["concentration_2_requirement"],
                },
                () => {
                  if (!this.state.popUpConcentration2Requirement) {
                    this.setState({ initialpopUpConcentration2Requirement: 0 });
                  }
                }
              );
              this.setState(
                { popUpWritRequirement: currentCourse["writ_requirement"] },
                () => {
                  if (!this.state.popUpWritRequirement) {
                    this.setState({ initialpopUpWritRequirement: 0 });
                  }
                }
              );
              this.setState(
                { popUpfullhalfCredit: currentCourse["full_half_credit"] },
                () => {
                  if (!this.state.popUpfullhalfCredit) {
                    this.setState({ initialpopUpfullhalfCredit: 1 });
                  }
                }
              );
              this.setState(
                { popUpShopping: currentCourse["shopping"] },
                () => {
                  if (!this.state.popUpShopping) {
                    this.setState({ initialpopUpShopping: 0 });
                  }
                }
              );
            }
          });
        }
      });
  };

  addCourseToDatabase = () => {
    firebase
      .firestore()
      .collection("user-information")
      .doc(this.state.userID)
      .collection("course-information")
      .doc(this.state.title)
      .set(
        {
          [this.state.courseCode]: {
            course_code: this.state.courseCode,
            grade_mode: this.state.popUpGradeMode,
            concentration_1_requirement: this.state
              .popUpConcentrationRequirement,
            concentration_2_requirement: this.state
              .popUpConcentration2Requirement,
            writ_requirement: this.state.popUpWritRequirement,
            full_half_credit: this.state.popUpfullhalfCredit,
            shopping: this.state.popUpShopping,
          },
        },
        { merge: true }
      );
  };

  // alert raised before deleting course
  deleteCourseAlert = () => {
    Alert.alert(
      "Delete Course",
      "Are you sure you want to delete the following course: " +
        this.state.courseCode +
        "?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            this.deleteCourseFromDatabase();
            this.closeCourseAddPopUp();
            this.props.refresh(true);
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  // deletes the course from the database
  deleteCourseFromDatabase = () => {
    firebase
      .firestore()
      .collection("user-information")
      .doc(this.state.userID)
      .collection("course-information")
      .doc(this.state.title)
      .update({
        [this.state.courseCode]: firebase.firestore.FieldValue.delete(),
      });
  };

  createAddCoursePopUp = () => {
    return (
      <View style={courseAddPopUpStyles.container}>
        <Modal visible={this.state.isCourseAddModalVisible}>
          <View style={courseAddPopUpStyles.modal}>
            <TouchableOpacity
              style={courseInfoPopUpStyles.backArrow}
              onPress={() => {
                this.closeCourseAddPopUp();
                this.setDefaultValues();
                this.setDefaultInitialValues();
                this.setState({ isCourseInfoModalVisible: false });
              }}
            >
              <Icon name="ios-arrow-dropleft" color="#fafafa" size={40} />
            </TouchableOpacity>
            <View style={courseAddPopUpStyles.header}>
              <Text style={courseAddPopUpStyles.title}>
                {this.state.courseCode}
              </Text>
            </View>
            <View style={courseAddPopUpStyles.content}>
              <View style={courseAddPopUpStyles.rowContent}>
                <View style={courseAddPopUpStyles.itemContainer}>
                  <Text style={courseAddPopUpStyles.item}>Grade Mode</Text>
                  <SwitchSelector
                    initial={this.state.initialpopUpGradeMode}
                    textColor={"#4E342E"}
                    selectedColor={"white"}
                    buttonColor={"#4E342E"}
                    borderColor={"#4E342E"}
                    hasPadding
                    options={[
                      { label: "A/B/C/NC", value: true },
                      { label: "S/NC", value: false },
                    ]}
                    style={courseAddPopUpStyles.item}
                    onPress={(value) =>
                      this.setState({ popUpGradeMode: value })
                    }
                  />
                </View>
              </View>
              {this.state.firstConcentration ? (
                <View style={courseAddPopUpStyles.rowContent}>
                  <View style={courseAddPopUpStyles.itemContainer}>
                    <Text style={courseAddPopUpStyles.item}>
                      {this.state.firstConcentration} Requirement
                    </Text>
                    <SwitchSelector
                      initial={this.state.initialpopUpConcentrationRequirement}
                      textColor={"#4E342E"}
                      selectedColor={"white"}
                      buttonColor={"#4E342E"}
                      borderColor={"#4E342E"}
                      hasPadding
                      options={[
                        { label: "No", value: false },
                        { label: "Yes", value: true },
                      ]}
                      style={courseAddPopUpStyles.item}
                      onPress={(value) =>
                        this.setState({ popUpConcentrationRequirement: value })
                      }
                    />
                  </View>
                </View>
              ) : null}
              {this.state.secondConcentartion ? (
                <View style={courseAddPopUpStyles.rowContent}>
                  <View style={courseAddPopUpStyles.itemContainer}>
                    <Text style={courseAddPopUpStyles.item}>
                      {this.state.secondConcentartion} Requirement
                    </Text>
                    <SwitchSelector
                      initial={this.state.initialpopUpConcentration2Requirement}
                      textColor={"#4E342E"}
                      selectedColor={"white"}
                      buttonColor={"#4E342E"}
                      borderColor={"#4E342E"}
                      hasPadding
                      options={[
                        { label: "No", value: false },
                        { label: "Yes", value: true },
                      ]}
                      style={courseAddPopUpStyles.item}
                      onPress={(value) =>
                        this.setState({ popUpConcentration2Requirement: value })
                      }
                    />
                  </View>
                </View>
              ) : null}
              <View style={courseAddPopUpStyles.rowContent}>
                <View style={courseAddPopUpStyles.itemContainer}>
                  <Text style={courseAddPopUpStyles.item}>
                    WRIT Requirement
                  </Text>
                  <SwitchSelector
                    initial={this.state.initialpopUpWritRequirement}
                    textColor={"#4E342E"}
                    selectedColor={"white"}
                    buttonColor={"#4E342E"}
                    borderColor={"#4E342E"}
                    hasPadding
                    options={[
                      { label: "No", value: false },
                      { label: "Yes", value: true },
                    ]}
                    style={courseAddPopUpStyles.item}
                    onPress={(value) =>
                      this.setState({ popUpWritRequirement: value })
                    }
                  />
                </View>
              </View>
              <View style={courseAddPopUpStyles.rowContent}>
                <View style={courseAddPopUpStyles.itemContainer}>
                  <Text style={courseAddPopUpStyles.item}>
                    Full Credit/Half Credit
                  </Text>
                  <SwitchSelector
                    initial={this.state.initialpopUpfullhalfCredit}
                    textColor={"#4E342E"}
                    selectedColor={"white"}
                    buttonColor={"#4E342E"}
                    borderColor={"#4E342E"}
                    hasPadding
                    options={[
                      { label: "1", value: true },
                      { label: "0.5", value: false },
                    ]}
                    style={courseAddPopUpStyles.item}
                    onPress={(value) =>
                      this.setState({ popUpfullhalfCredit: value })
                    }
                  />
                </View>
              </View>
              <View style={courseAddPopUpStyles.rowContent}>
                <View style={courseAddPopUpStyles.itemContainer}>
                  <Text style={courseAddPopUpStyles.item}>Shopping</Text>
                  <SwitchSelector
                    initial={this.state.initialpopUpShopping}
                    textColor={"#4E342E"}
                    selectedColor={"white"}
                    buttonColor={"#4E342E"}
                    borderColor={"#4E342E"}
                    hasPadding
                    options={[
                      { label: "No", value: false },
                      { label: "Yes", value: true },
                    ]}
                    style={courseAddPopUpStyles.item}
                    onPress={(value) => this.setState({ popUpShopping: value })}
                  />
                </View>
              </View>
            </View>
            <View
              style={{
                alignItems: "center",
                marginTop: 15,
                marginBottom: 10,
                flexDirection: "row",
              }}
            >
              <CustomButton
                title="Delete"
                onPress={() => {
                  this.deleteCourseAlert();
                }}
                style={courseInfoPopUpStyles.deleteButtonContainer}
                textStyle={courseInfoPopUpStyles.deleteButtonText}
              ></CustomButton>
              <CustomButton
                title="Update"
                onPress={() => {
                  this.closeCourseAddPopUp();
                  this.addCourseToDatabase();
                  this.setDefaultValues();
                  this.setDefaultInitialValues();
                  this.props.refresh(true);
                }}
                style={courseInfoPopUpStyles.updateButtonContainer}
                textStyle={courseInfoPopUpStyles.updateButtonText}
              ></CustomButton>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  /*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––CREATE/RENDER COURSE CARDS–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

  // works similar to other bubble sort methods in DashboardScreen.js
  bubbleSortAlphabetically = (arr, mainArr) => {
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

  bubbleSortNumerically = (arr, mainArr) => {
    var len = arr.length;
    for (var i = len - 1; i >= 0; i--) {
      for (var j = 1; j <= i; j++) {
        if (arr[j - 1] > arr[j]) {
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

  // standard bubbleSort
  bubbleSort = (arr) => {
    var len = arr.length;
    for (var i = len - 1; i >= 0; i--) {
      for (var j = 1; j <= i; j++) {
        if (arr[j - 1] > arr[j]) {
          var temp = arr[j - 1];
          arr[j - 1] = arr[j];
          arr[j] = temp;
        }
      }
    }
    return arr;
  };

  // course credits calculator
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

  // enrollment units calculator
  returnEnrollmentUnits = () => {
    if (this.returnCredits() >= 3) {
      return 4;
    } else {
      return " N/A";
    }
  };

  // sorts courses alphabetically and numerically
  sortCourses = (list, mainList) => {
    const len = list.length;
    let departments = [];
    for (let i = 0; i < len; i++) {
      const dept = list[i].split(" ")[0];
      departments.push(dept);
    }
    let uniqueDepartments = [...new Set(departments)];
    const result = this.bubbleSortAlphabetically(departments, list);
    uniqueDepartments = this.bubbleSort(uniqueDepartments);
    let finalResult = [];
    for (let k = 0; k < uniqueDepartments.length; k++) {
      let courses = [];
      let wholeStringList = [];
      for (let i = 0; i < len; i++) {
        if (list[i].split(" ")[0] === uniqueDepartments[k]) {
          const courseCode = list[i].split(" ")[1];
          const wholeString = list[i];
          courses.push(courseCode);
          wholeStringList.push(wholeString);
        }
      }
      const partFinalResult = this.bubbleSortNumerically(
        courses,
        wholeStringList
      );
      finalResult = [...finalResult, ...partFinalResult];
    }
    var realFinalResult = [];
    for (let i = 0; i < finalResult.length; i++) {
      for (let j = 0; j < mainList.length; j++) {
        currentCourse = finalResult[i];
        if (currentCourse === mainList[j]["course_code"]) {
          realFinalResult.push(mainList[j]);
        }
      }
    }
    return realFinalResult;
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
        courseNames.push(currentCourse["course_code"]);
      }
      sortedCourseObjects = this.sortCourses(courseNames, courseObjects);
      sortedCourseObjects.map((currentCourse, index) => {
        if (!currentCourse["shopping"]) {
          results.push(
            <CourseCard
              key={index}
              courseCode={currentCourse["course_code"]}
              onPress={() => {
                this.determineSemesterCode();
                this.showHideCourseInfoPopUp(currentCourse["course_code"]);
              }}
              onLongPress={() => {
                this.setDefaultInitialValues();
                this.showHideCourseAddPopUp(currentCourse["course_code"]);
              }}
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
                currentCourse["concentration_1_requirement"] ||
                currentCourse["concentration_2_requirement"]
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
      });
      return results;
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
        courseNames.push(currentCourse["course_code"]);
      }
      sortedCourseObjects = this.sortCourses(courseNames, courseObjects);
      sortedCourseObjects.map((currentCourse, index) => {
        if (currentCourse["shopping"]) {
          results.push(
            <CourseCard
              key={index}
              courseCode={currentCourse["course_code"]}
              onPress={() => {
                this.determineSemesterCode();
                this.showHideCourseInfoPopUp(currentCourse["course_code"]);
              }}
              onLongPress={() => {
                this.setDefaultInitialValues();
                this.showHideCourseAddPopUp(currentCourse["course_code"]);
              }}
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
      });
      return results;
    }
  };

  /*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––RENDER METHOD–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

  // deletes the document containing information about each of the courses
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

  // deletes the semester from the SemestersList array
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
      "Are you sure you want to delete the following semester: " +
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
          style={{ flex: 1 }}
        >
          <Text style={styles.title}>{this.state.title}</Text>
          <Text style={styles.credits}>
            Course Credits: {this.returnCredits()}, Enrollment Units:{" "}
            {this.returnEnrollmentUnits()}
          </Text>
        </TouchableOpacity>
        <View style={{ alignItems: "center" }}>
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
          <this.createAddCoursePopUp></this.createAddCoursePopUp>
        </View>
      </View>
    );
  }
}

/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––STYLING–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

/*–––––––––––––––––––––––––STYLING FOR SEMESTER CARD COMPONENT–––––––––––––––––––––––––*/
const styles = StyleSheet.create({
  mainContainer: {
    borderColor: "#E3E3E3",
    borderWidth: 3,
    borderRadius: 15,
    width: 0.9 * Dimensions.get("window").width,
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

/*–––––––––––––––––––––––––CUSTOM BUTTON COMPONENT–––––––––––––––––––––––––*/
const CustomButton = ({ onPress, title, style, textStyle }) => (
  <TouchableOpacity onPress={onPress} style={style} activeOpacity={0.8}>
    <Text style={textStyle}>{title}</Text>
  </TouchableOpacity>
);

/*–––––––––––––––––––––––––COURSE INFORMATION POP-UP STYLING–––––––––––––––––––––––––*/
const courseInfoPopUpStyles = StyleSheet.create({
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
  updateButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5ED483",
    borderRadius: 15,
    paddingVertical: 17,
    paddingHorizontal: 12,
    width: "47%",
    margin: 5,
  },
  updateButtonText: {
    fontSize: 18,
    color: "#fafafa",
    fontWeight: "bold",
    alignSelf: "center",
  },
  deleteButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E53935",
    borderRadius: 15,
    paddingVertical: 17,
    paddingHorizontal: 12,
    width: "47%",
    margin: 5,
  },
  deleteButtonText: {
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

/*–––––––––––––––––––––––––COURSE ADD POP-UP STYLING–––––––––––––––––––––––––*/
const courseAddPopUpStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    flex: 1,
    backgroundColor: "#4E342E",
    padding: 20,
  },
  header: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    color: "white",
    fontWeight: "600",
    position: "absolute",
    top: "35%",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rowContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  itemContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: "white",
    marginBottom: 4,
  },
});

export default SemesterCard;
