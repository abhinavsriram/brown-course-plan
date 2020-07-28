import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Keyboard,
  Picker,
  TouchableOpacity,
  TextInput,
  Modal,
  Linking,
  Dimensions,
} from "react-native";
import { Header } from "react-native-elements";
import SwitchSelector from "react-native-switch-selector";

import * as firebase from "firebase";
import "firebase/firestore";
import { AdMobBanner } from "expo-ads-admob";

import Icon from "react-native-vector-icons/Ionicons";

import CourseData from "./../data/CourseData.json";
import StopWordsList from "./../data/StopWordsList";
import CourseCard from "../components/CourseCardSearch";
import CourseList from "./../data/CourseList";
import Colors from "./../data/Colors";

class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: "",
      searchResults: [],
      searchBoxValue: "",
      yOffset: 0,
      // here we set the default value to the latest semester
      semesterPickerValue: this.props.navigation.state.params.semester,
      semesterPickerVisible: false,
      currentSemesterCode: 0,
      courseCode: "Placeholder Course",
      isCourseInfoModalVisible: false,
      isCourseAddModalVisible: false,
      popUpGradeMode: true,
      popUpConcentrationRequirement: false,
      popUpConcentration2Requirement: false,
      popUpWritRequirement: false,
      popUpfullhalfCredit: true,
      popUpShopping: false,
      errorMessage: null,
      firstConcentration: null,
      secondConcentartion: null,
    };
  }

  // called when component mounts
  getUserID = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const email = user.email;
        const userID = email.split("@")[0];
        this.setState({ userID: userID }, () => {
          this.getConcentrations();
        });
      } else {
      }
    });
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

  componentDidMount() {
    this.getUserID();
    switch (this.state.semesterPickerValue) {
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
  }

  /*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––UPLOADING INFORMATION TO DATABASE–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

  getPropertyByIndex = (obj, index) => {
    return obj[Object.keys(obj)[index]];
  };

  createKeywordArrayHelper = (toSplit) => {
    const keywordArray = [];
    let currKeyword = "";
    toSplit.split("").forEach((toSplitChar) => {
      currKeyword += toSplitChar;
      keywordArray.push(currKeyword);
    });
    return keywordArray;
  };

  createKeywordArrayOneCourse = (toSplit) => {
    const [courseCode, courseName, courseInstr] = toSplit;
    const keywordArrayCourseCodeWithSpace = this.createKeywordArrayHelper(
      courseCode.toLowerCase()
    );
    const keywordArrayCourseCodeWithoutSpace = this.createKeywordArrayHelper(
      courseCode.toLowerCase().split(" ").join("")
    );
    const keywordArrayCourseNameWithStopWords = this.createKeywordArrayHelper(
      courseName.toLowerCase()
    );
    const tempValue = courseName
      .toLowerCase()
      .split(" ")
      .filter((xYz) => !StopWordsList.includes(xYz))
      .map((currWord) => this.createKeywordArrayHelper(currWord));
    const keywordArrayCourseNameWithoutStopWords = [].concat(...tempValue);
    const keywordArrayCourseInstrFullName = this.createKeywordArrayHelper(
      courseInstr.toLowerCase()
    );
    const keywordArrayCourseInstrLastName = this.createKeywordArrayHelper(
      courseInstr.toLowerCase().split(" ").pop()
    );
    return [
      ...new Set([
        "",
        ...keywordArrayCourseCodeWithSpace,
        ...keywordArrayCourseCodeWithoutSpace,
        ...keywordArrayCourseNameWithStopWords,
        ...keywordArrayCourseNameWithoutStopWords,
        ...keywordArrayCourseInstrFullName,
        ...keywordArrayCourseInstrLastName,
      ]),
    ];
  };

  createKeywordArrayAllCourses = () => {
    let courseKeywordsList = [];
    for (let i = 0; i < Object.keys(CourseData[7]).length; i++) {
      const courseCode = this.getPropertyByIndex(CourseData[7], i)[
        "Course_Code"
      ];
      const courseName = this.getPropertyByIndex(CourseData[7], i)[
        "Course Name"
      ];
      const courseInstr = this.getPropertyByIndex(CourseData[7], i)[
        "Course Instructor"
      ];
      const courseKeyword = this.createKeywordArrayOneCourse([
        courseCode,
        courseName,
        courseInstr,
      ]);
      courseKeywordsList.push(courseKeyword);
    }
    return courseKeywordsList;
  };

  createFullDatabase = () => {
    const courseKeywordsList = this.createKeywordArrayAllCourses();
    for (let i = 0; i < Object.keys(CourseData[7]).length; i++) {
      this.getPropertyByIndex(CourseData[7], i)["Keywords"] =
        courseKeywordsList[i];
    }
    return CourseData[7];
  };

  writeToFirestore = (data) => {
    if (data && typeof data === "object") {
      Object.keys(data).forEach((docKey) => {
        firebase
          .firestore()
          .collection("summer-2019")
          .doc(docKey)
          .set(data[docKey])
          .then((res) => {
            console.log("document " + docKey + " successfully written!");
          })
          .catch((error) => {
            console.error("error writing document: ", error);
          });
      });
    }
  };

  // call onKeyPress={() => this.writeToFirestore(this.createFullDatabase())} to upload information
  // change collection name within writeToFirestore
  // change index appropriately (CourseData[index])

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
                {this.state.semesterPickerValue}
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
              >
                <CustomButton
                  title="Add Course"
                  onPress={() => this.showHideCourseAddPopUp()}
                ></CustomButton>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    );
  };

  /*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––COURSE ADD POP-UP BEGINS–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

  showHideCourseAddPopUp = () => {
    this.setState({ isCourseInfoModalVisible: false });
    if (this.state.isCourseAddModalVisible === true) {
      this.setState({ isCourseAddModalVisible: false });
    } else {
      this.setState({ isCourseAddModalVisible: true });
    }
  };

  closeCourseAddPopUp = () => {
    if (this.state.isCourseAddModalVisible === true) {
      this.setState({ isCourseAddModalVisible: false });
    }
  };

  setDefaultValues = () => {
    this.setState({ popUpGradeMode: true });
    this.setState({ popUpConcentrationRequirement: false });
    this.setState({ popUpConcentration2Requirement: false });
    this.setState({ popUpWritRequirement: false });
    this.setState({ popUpfullhalfCredit: true });
    this.setState({ popUpShopping: false });
  };

  addCourseToDatabase = () => {
    firebase
      .firestore()
      .collection("user-information")
      .doc(this.state.userID)
      .collection("course-information")
      .doc(this.state.semesterPickerValue)
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

  addSemesterIfNeeded = () => {
    firebase
      .firestore()
      .collection("user-information")
      .doc(this.state.userID)
      .collection("course-information")
      .doc("Semesters List")
      .set(
        {
          semestersList: firebase.firestore.FieldValue.arrayUnion(
            this.state.semesterPickerValue
          ),
        },
        { merge: true }
      );
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
                this.setState({ isCourseInfoModalVisible: true });
              }}
            >
              <Icon name="ios-arrow-dropleft" color="#fafafa" size={40} />
            </TouchableOpacity>
            <View style={courseAddPopUpStyles.header}>
              <Text style={courseAddPopUpStyles.title}>Course Details</Text>
            </View>
            <View style={courseAddPopUpStyles.content}>
              <View style={courseAddPopUpStyles.rowContent}>
                <View style={courseAddPopUpStyles.itemContainer}>
                  <Text style={courseAddPopUpStyles.item}>Grade Mode</Text>
                  <SwitchSelector
                    initial={0}
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
                      initial={0}
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
                      initial={0}
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
                    initial={0}
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
                    initial={0}
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
                    initial={0}
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
              }}
            >
              <CustomButton
                title="Add Course"
                onPress={() => {
                  this.closeCourseAddPopUp();
                  this.addSemesterIfNeeded();
                  this.addCourseToDatabase();
                  this.setDefaultValues();
                }}
              ></CustomButton>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  /*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––SEARCH SCREEN–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

  /*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––SEARCH FUNCTIONALITY–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

  // this method is called when the user types something in the search box for the first time
  searchEngine = async (searchInput, currentSemester) => {
    var newCollection = this.handleFutureSemester(currentSemester);
    if (CourseList.includes(searchInput.toUpperCase())) {
      searchInput = searchInput + " ";
    }
    const querySnapshot = await firebase
      .firestore()
      .collection(newCollection)
      .where("Keywords", "array-contains", searchInput.toLowerCase())
      .orderBy("Course_Code")
      .limit(10)
      .get();
    const result = querySnapshot.docs;
    var localSearchResults = [];
    result.forEach((course) => {
      localSearchResults.push(course.get("Course_Code"));
    });
    this.setState({ searchResults: localSearchResults });
  };

  // this method is called when the user types something in the search box every subsequent time
  // it takes in a number that helps increment the limit on the results rendered
  searchEngineStartAfter = async (
    searchInput,
    searchResultNum,
    currentSemester
  ) => {
    var newCollection = this.handleFutureSemester(currentSemester);
    if (CourseList.includes(searchInput.toUpperCase())) {
      searchInput = searchInput + " ";
    }
    const querySnapshot = await firebase
      .firestore()
      .collection(newCollection)
      .where("Keywords", "array-contains", searchInput.toLowerCase())
      .orderBy("Course_Code")
      .limit(10 * searchResultNum)
      .get();
    const result = querySnapshot.docs;
    var localSearchResults = [];
    result.forEach((course) => {
      localSearchResults.push(course.get("Course_Code"));
    });
    this.setState({ searchResults: localSearchResults });
  };

  // lazy loading functionality to save on reads
  lazyLoading = () => {
    var y = this.state.searchResults.length / 10;
    if (y < 4) {
      if (this.state.yOffset > 500 * y) {
        this.searchEngineStartAfter(
          this.state.searchBoxValue,
          y + 1,
          this.state.semesterPickerValue
        );
      }
    }
  };

  /*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––SEMESTER PICKER–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

  showHideSemesterPicker = () => {
    Keyboard.dismiss();
    this.setState({ searchResults: [] });
    this.setState({ searchBoxValue: "" });
    if (this.state.semesterPickerVisible == true) {
      this.setState({ semesterPickerVisible: false });
    } else {
      this.setState({ semesterPickerVisible: true });
    }
  };

  defaultSemesterValue = () => {
    if (this.state.semesterPickerValue === "Click to Choose") {
      this.setState({ semesterPickerValue: "Spring 2020" });
    }
  };

  pickSemester = () => {
    switch (this.state.semesterPickerValue) {
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

  // helps handle cases where the user wants to add courses from future semesters
  // i.e. semesters for which CAB does not have information yet
  handleFutureSemester = (anySemester) => {
    const semesterSplit = anySemester.split(" ");
    const semesterSeason = semesterSplit[0];
    const semesterYear = semesterSplit[1];
    if (
      parseInt(semesterYear, 10) > 2020 &&
      (semesterSeason === "Spring" || semesterSeason === "Summer")
    ) {
      if (semesterSeason === "Spring") {
        this.setState({ currentSemesterCode: 10 });
        this.setState({
          errorMessage:
            "Warning: The information being displayed is from " +
            [semesterSeason, 2020].join().replace(/,/g, " ") +
            " because Brown has not released the course schedule for this semester.",
        });
        return [semesterSeason, 2020]
          .join()
          .replace(/,/g, " ")
          .replace(/ /g, "-")
          .toLowerCase();
      }
      if (semesterSeason === "Summer") {
        this.setState({ currentSemesterCode: 11 });
        this.setState({
          errorMessage:
            "Warning: The information being displayed is from " +
            [semesterSeason, 2020].join().replace(/,/g, " ") +
            " because Brown has not released the course schedule for this semester.",
        });
        return [semesterSeason, 2020]
          .join()
          .replace(/,/g, " ")
          .replace(/ /g, "-")
          .toLowerCase();
      }
    } else if (
      parseInt(semesterYear, 10) > 2019 &&
      (semesterSeason === "Fall" || semesterSeason === "Winter")
    ) {
      if (semesterSeason === "Fall") {
        this.setState({ currentSemesterCode: 8 });
        this.setState({
          errorMessage:
            "Warning: The information being displayed is from " +
            [semesterSeason, 2019].join().replace(/,/g, " ") +
            " because Brown has not released the course schedule for this semester.",
        });
        return [semesterSeason, 2019]
          .join()
          .replace(/,/g, " ")
          .replace(/ /g, "-")
          .toLowerCase();
      }
      if (semesterSeason === "Winter") {
        this.setState({ currentSemesterCode: 9 });
        this.setState({
          errorMessage:
            "Warning: The information being displayed is from " +
            [semesterSeason, 2019].join().replace(/,/g, " ") +
            " because Brown has not released the course schedule for this semester.",
        });
        return [semesterSeason, 2019]
          .join()
          .replace(/,/g, " ")
          .replace(/ /g, "-")
          .toLowerCase();
      }
    } else {
      this.setState({ errorMessage: null });
      return [semesterSeason, semesterYear]
        .join()
        .replace(/,/g, " ")
        .replace(/ /g, "-")
        .toLowerCase();
    }
  };

  /*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––CREATING COURSE CARDS–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

  createCards = () => {
    return this.state.searchResults.map((courseCode, index) => {
      return (
        <CourseCard
          key={index}
          onPress={() => {
            this.showHideCourseInfoPopUp(courseCode);
          }}
          courseCode={courseCode}
          courseName={
            CourseData[this.state.currentSemesterCode][courseCode][
              "Course Name"
            ]
          }
          instructor={
            CourseData[this.state.currentSemesterCode][courseCode][
              "Course Instructor"
            ]
          }
          meetingTime={
            CourseData[this.state.currentSemesterCode][courseCode][
              "Course Meeting Time"
            ]
          }
          semesterCode={this.state.currentSemesterCode}
          style={[
            styles.courseCard,
            {
              borderColor:
                Colors[CourseList.indexOf(courseCode.toString().split(" ")[0])],
            },
          ]}
        ></CourseCard>
      );
    });
  };

  /*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––RENDER METHOD–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

  render() {
    return (
      <React.Fragment>
        <View style={styles.container}>
          {/* /*–––––––––––––––––––––––––HEADER–––––––––––––––––––––––––*/}
          <Header
            backgroundColor="#4E342E"
            centerComponent={<Text style={styles.title}>Search</Text>}
          >
            <TouchableOpacity
              style={styles.trigger}
              onPress={() => {
                this.props.navigation.navigate("TabNavigator");
              }}
            >
              <Icon name="ios-arrow-back" color="#fafafa" size={35} />
            </TouchableOpacity>
          </Header>
          {/* /*–––––––––––––––––––––––––SEARCH BOX–––––––––––––––––––––––––*/}
          <View style={styles.searchBox}>
            <Icon name="ios-search" size={20} />
            <TextInput
              placeholder="Course Code, Name, Instructor"
              placeholderTextColor="dimgrey"
              style={styles.textInput}
              onChangeText={(text) => {
                // this.writeToFirestore(this.createFullDatabase());
                this.pickSemester();
                this.setState({ searchBoxValue: text }, async () => {
                  await this.searchEngine(
                    this.state.searchBoxValue,
                    this.state.semesterPickerValue
                  );
                });
                this.setState({ semesterPickerVisible: false });
              }}
              value={this.state.searchBoxValue}
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => {
                this.setState({ searchBoxValue: "" });
                this.setState({ searchResults: [] });
                this.setState({ errorMessage: null });
              }}
            >
              <Icon name="ios-backspace" size={22} />
            </TouchableOpacity>
          </View>
          {/* /*–––––––––––––––––––––––––SEMESTER PICKER BOX–––––––––––––––––––––––––*/}
          <TouchableOpacity
            onPress={() => {
              this.showHideSemesterPicker();
              this.setState({ errorMessage: null });
            }}
            style={styles.searchBox}
          >
            <Icon name="ios-arrow-dropdown" size={20} />
            <Text style={styles.textInput}>
              {this.state.semesterPickerValue}
            </Text>
          </TouchableOpacity>
          {/* /*–––––––––––––––––––––––––SEMESTER PICKER–––––––––––––––––––––––––*/}
          {this.state.semesterPickerVisible ? (
            <React.Fragment>
              <Picker
                style={styles.concentrationPicker}
                selectedValue={this.state.semesterPickerValue}
                onValueChange={(itemValue) => {
                  this.setState({ semesterPickerValue: itemValue });
                }}
                itemStyle={{ color: "#333333", borderColor: "#fafafa" }}
              >
                {/* 2017-2018 Academic Year */}
                <Picker.Item label="Fall 2017" value="Fall 2017"></Picker.Item>
                <Picker.Item
                  label="Winter 2017"
                  value="Winter 2017"
                ></Picker.Item>
                <Picker.Item
                  label="Spring 2018"
                  value="Spring 2018"
                ></Picker.Item>
                <Picker.Item
                  label="Summer 2018"
                  value="Summer 2018"
                ></Picker.Item>
                {/* 2018-2019 Academic Year */}
                <Picker.Item label="Fall 2018" value="Fall 2018"></Picker.Item>
                <Picker.Item
                  label="Winter 2018"
                  value="Winter 2018"
                ></Picker.Item>
                <Picker.Item
                  label="Spring 2019"
                  value="Spring 2019"
                ></Picker.Item>
                <Picker.Item
                  label="Summer 2019"
                  value="Summer 2019"
                ></Picker.Item>
                {/* 2019-2020 Academic Year */}
                <Picker.Item label="Fall 2019" value="Fall 2019"></Picker.Item>
                <Picker.Item
                  label="Winter 2019"
                  value="Winter 2019"
                ></Picker.Item>
                <Picker.Item
                  label="Spring 2020"
                  value="Spring 2020"
                ></Picker.Item>
                <Picker.Item
                  label="Summer 2020"
                  value="Summer 2020"
                ></Picker.Item>
                {/* 2020-2021 Academic Year */}
                <Picker.Item label="Fall 2020" value="Fall 2020"></Picker.Item>
                <Picker.Item
                  label="Winter 2020"
                  value="Winter 2020"
                ></Picker.Item>
                <Picker.Item
                  label="Spring 2021"
                  value="Spring 2021"
                ></Picker.Item>
                <Picker.Item
                  label="Summer 2021"
                  value="Summer 2021"
                ></Picker.Item>
                {/* 2021-2022 Academic Year */}
                <Picker.Item label="Fall 2021" value="Fall 2021"></Picker.Item>
                <Picker.Item
                  label="Winter 2021"
                  value="Winter 2021"
                ></Picker.Item>
                <Picker.Item
                  label="Spring 2022"
                  value="Spring 2022"
                ></Picker.Item>
                <Picker.Item
                  label="Summer 2022"
                  value="Summer 2022"
                ></Picker.Item>
                {/* 2022-2023 Academic Year */}
                <Picker.Item label="Fall 2022" value="Fall 2022"></Picker.Item>
                <Picker.Item
                  label="Winter 2022"
                  value="Winter 2022"
                ></Picker.Item>
                <Picker.Item
                  label="Spring 2023"
                  value="Spring 2023"
                ></Picker.Item>
                <Picker.Item
                  label="Summer 2023"
                  value="Summer 2023"
                ></Picker.Item>
                {/* 2023-2024 Academic Year */}
                <Picker.Item label="Fall 2023" value="Fall 2023"></Picker.Item>
                <Picker.Item
                  label="Winter 2023"
                  value="Winter 2023"
                ></Picker.Item>
                <Picker.Item
                  label="Spring 2024"
                  value="Spring 2024"
                ></Picker.Item>
                <Picker.Item
                  label="Summer 2024"
                  value="Summer 2024"
                ></Picker.Item>
              </Picker>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  this.showHideSemesterPicker();
                  this.defaultSemesterValue();
                  this.pickSemester();
                  this.setState({ courseCode: "Placeholder Course" });
                }}
              >
                <Text style={styles.cancelButtonText}>DONE</Text>
              </TouchableOpacity>
            </React.Fragment>
          ) : null}
          {/* /*–––––––––––––––––––––––––SCROLL VIEW–––––––––––––––––––––––––*/}
          <ScrollView
            contentContainerStyle={styles.text}
            showsVerticalScrollIndicator={"false"}
            keyboardDismissMode={"on-drag"}
            onScroll={(event) =>
              this.setState(
                { yOffset: event.nativeEvent.contentOffset.y },
                () => {
                  this.lazyLoading();
                }
              )
            }
            scrollEventThrottle={0}
          >
            <Text style={styles.errorMessage}>
              {this.state.errorMessage && (
                <Icon name="ios-warning" color="#ffae42" size={18} />
              )}{" "}
              {this.state.errorMessage}
            </Text>
            {this.createCards()}
            <View style={{ alignItems: "center", alignContent: "center" }}>
              <AdMobBanner
                style={styles.banner1}
                bannerSize="largeBanner"
                adUnitID="ca-app-pub-3940256099942544/6300978111"
                testDeviceID="EMULATOR"
              />
            </View>
          </ScrollView>
          <this.createCourseInfoPopUp></this.createCourseInfoPopUp>
          <this.createAddCoursePopUp></this.createAddCoursePopUp>
        </View>
      </React.Fragment>
    );
  }
}

/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––STYLING–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

/*–––––––––––––––––––––––––CUSTOM BUTTON COMPONENT–––––––––––––––––––––––––*/
const CustomButton = ({ onPress, title }) => (
  <TouchableOpacity
    onPress={onPress}
    style={courseInfoPopUpStyles.customButtonContainer}
    activeOpacity={0.8}
  >
    <Text style={courseInfoPopUpStyles.customButtonText}>{title}</Text>
  </TouchableOpacity>
);

/*–––––––––––––––––––––––––SEARCH SCREEN STYLING–––––––––––––––––––––––––*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  searchBox: {
    marginTop: 10,
    height: 55,
    width: "90%",
    padding: 10,
    flexDirection: "row",
    backgroundColor: "#EBEBEB",
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 7,
    justifyContent: "center",
  },
  textInput: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 10,
    padding: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "dimgrey",
  },
  text: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    color: "#fafafa",
    fontWeight: "700",
    letterSpacing: 1,
  },
  concentrationPicker: {
    position: "absolute",
    top: "55%",
    width: "82%",
    backgroundColor: "#fff",
    zIndex: 1,
    height: 250,
    borderColor: "#fafafa",
  },
  cancelButton: {
    position: "absolute",
    top: "54%",
    right: 33,
    height: 50,
    width: 50,
    fontSize: 13,
    backgroundColor: "#fff",
    zIndex: 2,
  },
  cancelButtonText: {
    color: "dimgrey",
    fontSize: 11,
  },
  courseCard: {
    height: 100,
    backgroundColor: "#fafafa",
    borderWidth: 3,
    borderRadius: 10,
    width: 0.85 * Dimensions.get("window").width,
  },
  errorMessage: {
    width: 0.85 * Dimensions.get("window").width,
    color: "#ffae42",
  },
  banner1: {
    alignContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
});

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
    top: "40%",
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

export default SearchScreen;
