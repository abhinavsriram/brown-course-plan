/*–––––––––––––––––––––––––REACT IMPORTS–––––––––––––––––––––––––*/
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
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "react-navigation-drawer";

/*–––––––––––––––––––––––––FIREBASE IMPORT–––––––––––––––––––––––––*/
import * as firebase from "firebase";
import "firebase/firestore";

/*–––––––––––––––––––––––––ICONS IMPORT–––––––––––––––––––––––––*/
import Icon from "react-native-vector-icons/Ionicons";

/*–––––––––––––––––––––––––CUSTOM IMPORTS–––––––––––––––––––––––––*/
import CourseData from "./../data/CourseData.json";
import StopWordsList from "./../data/StopWordsList";
import CourseCard from "../components/CourseCardSearch";
import CourseList from "./../data/CourseList";
import Colors from "./../data/Colors";

/*–––––––––––––––––––––––––SEARCH SCREEN COMPONENT–––––––––––––––––––––––––*/
class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: "",
      searchResults: [],
      searchBoxValue: "",
      yOffset: 0,
      semesterPickerValue: "Spring 2020",
      semesterPickerVisible: false,
      currentSemesterCode: 0,
      isCourseInfoModalVisible: false,
      courseCode: "Placeholder Course",
      isCourseAddModalVisible: false,
      popUpGradeMode: true,
      popUpConcentrationRequirement: true,
      popUpWritRequirement: true,
      popUpfullhalfCredit: true,
      popUpShopping: true,
    };
  }

  getUserID = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const email = user.email;
        const userID = email.split("@")[0];
        this.setState({ userID: userID });
      } else {
      }
    });
  };

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
    for (let i = 0; i < Object.keys(CourseData[3]).length; i++) {
      const courseCode = this.getPropertyByIndex(CourseData[3], i)[
        "Course_Code"
      ];
      const courseName = this.getPropertyByIndex(CourseData[3], i)[
        "Course Name"
      ];
      const courseInstr = this.getPropertyByIndex(CourseData[3], i)[
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
    for (let i = 0; i < Object.keys(CourseData[3]).length; i++) {
      this.getPropertyByIndex(CourseData[3], i)["Keywords"] =
        courseKeywordsList[i];
    }
    return CourseData[3];
  };

  writeToFirestore = (data) => {
    if (data && typeof data === "object") {
      Object.keys(data).forEach((docKey) => {
        firebase
          .firestore()
          .collection("winter-2019")
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
  // change collection name withtin writeToFirestore
  // change index appropriately (CourseData[index])

  searchEngine = async (searchInput, currentSemester) => {
    var hyphenate = currentSemester.replace(/ /g, "-");
    var collection = hyphenate.toLowerCase();
    if (CourseList.includes(searchInput.toUpperCase())) {
      searchInput = searchInput + " ";
    }
    const querySnapshot = await firebase
      .firestore()
      .collection(collection)
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

  searchEngineStartAfter = async (
    searchInput,
    searchResultNum,
    currentSemester
  ) => {
    var hyphenate = currentSemester.replace(/ /g, "-");
    var collection = hyphenate.toLowerCase();
    if (CourseList.includes(searchInput.toUpperCase())) {
      searchInput = searchInput + " ";
    }
    const querySnapshot = await firebase
      .firestore()
      .collection(collection)
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

  lazyLoading = () => {
    var y = this.state.searchResults.length / 10;
    if (y < 4) {
      if (this.state.yOffset > 575 * y) {
        this.searchEngineStartAfter(
          this.state.searchBoxValue,
          y + 1,
          this.state.semesterPickerValue
        );
      }
    }
  };

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
      case "Fall 2020":
        this.setState({ currentSemesterCode: 2 });
        break;
    }
  };

  componentDidMount() {
    this.getUserID();
    switch (this.state.semesterPickerValue) {
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
      case "Fall 2020":
        this.setState({ currentSemesterCode: 2 });
        break;
    }
  }

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
              <Text style={popUpStyles.semester}>
                {this.state.semesterPickerValue}
              </Text>
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

  createAddCoursePopUp = () => {
    return (
      <View style={courseAddPopUpStyles.container}>
        <Modal visible={this.state.isCourseAddModalVisible}>
          <View style={courseAddPopUpStyles.modal}>
            <TouchableOpacity
              style={popUpStyles.backArrow}
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
                    initial={1}
                    textColor={"#4E342E"}
                    selectedColor={"white"}
                    buttonColor={"#4E342E"}
                    borderColor={"#4E342E"}
                    hasPadding
                    options={[
                      { label: "S/NC", value: false },
                      { label: "A/B/C/NC", value: true },
                    ]}
                    style={courseAddPopUpStyles.item}
                    onPress={(value) =>
                      this.setState({ popUpGradeMode: value })
                    }
                  />
                </View>
              </View>
              <View style={courseAddPopUpStyles.rowContent}>
                <View style={courseAddPopUpStyles.itemContainer}>
                  <Text style={courseAddPopUpStyles.item}>
                    Concentration Requirement
                  </Text>
                  <SwitchSelector
                    initial={1}
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
              <View style={courseAddPopUpStyles.rowContent}>
                <View style={courseAddPopUpStyles.itemContainer}>
                  <Text style={courseAddPopUpStyles.item}>
                    WRIT Requirement
                  </Text>
                  <SwitchSelector
                    initial={1}
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
                    initial={1}
                    textColor={"#4E342E"}
                    selectedColor={"white"}
                    buttonColor={"#4E342E"}
                    borderColor={"#4E342E"}
                    hasPadding
                    options={[
                      { label: "0.5", value: false },
                      { label: "1", value: true },
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
                    initial={1}
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
                  this.setDefaultValues();
                  this.addCourseToDatabase();
                  this.addSemesterIfNeeded();
                }}
              ></CustomButton>
            </View>
          </View>
        </Modal>
      </View>
    );
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
    this.setState({ popUpConcentrationRequirement: true });
    this.setState({ popUpWritRequirement: true });
    this.setState({ popUpfullhalfCredit: true });
    this.setState({ popUpShopping: true });
  };

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
                this.props.navigation.dispatch(DrawerActions.openDrawer());
              }}
            >
              <Ionicons name={"md-menu"} size={32} color={"white"} />
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
              }}
            >
              <Icon name="ios-backspace" size={22} />
            </TouchableOpacity>
          </View>
          {/* /*–––––––––––––––––––––––––SEMESTER PICKER BOX–––––––––––––––––––––––––*/}
          <TouchableOpacity
            onPress={() => this.showHideSemesterPicker()}
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
                <Picker.Item label="Fall 2020" value="Fall 2020"></Picker.Item>
                <Picker.Item
                  label="Winter 2020"
                  value="Winter 2020"
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
            {this.createCards()}
          </ScrollView>
          <this.createCourseInfoPopUp></this.createCourseInfoPopUp>
          <this.createAddCoursePopUp></this.createAddCoursePopUp>
        </View>
      </React.Fragment>
    );
  }
}

/*–––––––––––––––––––––––––CUSTOM BUTTON COMPONENT–––––––––––––––––––––––––*/
const CustomButton = ({ onPress, title }) => (
  <TouchableOpacity
    onPress={onPress}
    style={popUpStyles.customButtonContainer}
    activeOpacity={0.8}
  >
    <Text style={popUpStyles.customButtonText}>{title}</Text>
  </TouchableOpacity>
);

/*–––––––––––––––––––––––––STYLING–––––––––––––––––––––––––*/
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
});

/*–––––––––––––––––––––––––COURSE INFROMATION POP-UP STYLING–––––––––––––––––––––––––*/
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
    fontSize: 25,
    color: "white",
    fontWeight: "600",
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
