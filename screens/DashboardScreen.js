import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Modal,
  TouchableOpacity,
  Picker,
  Alert,
} from "react-native";
import { PieChart } from "react-native-chart-kit";

import { Header } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "react-navigation-drawer";

import firebase from "firebase";
import "firebase/firestore";
import { AdMobBanner } from "expo-ads-admob";

import SemesterCard from "./../components/SemesterCard";
import AddSemesterCard from "./../components/AddSemesterCard";
import SemesterPiece from "./../components/SemesterPiece";
import DepartmentsWithAreasOfStudy from "./../data/DepartmentsWithAreasOfStudy";
import Colors from "./../data/Colors";
import CourseList from "./../data/CourseList";

import Icon from "react-native-vector-icons/Ionicons";

class DashboardScreen extends Component {
  constructor(props) {
    super(props);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.state = {
      semestersList: [],
      isAddSemesterModalVisible: false,
      semesterPickerVisible: false,
      semesterPickerValue: "Click to Choose",
      yearPickerVisible: false,
      yearPickerValue: "Click to Choose",
      errorMessage: null,
      userID: "",
      isBigPictureModalVisible: false,
      degree: "",
      concentration_1: "",
      concentration_2: "",
      concentration_2_duplicate: "",
      refresh: false,
      divisionsOfStudyData: null,
      courseDeptData: null,
      concentrationData: null,
    };
  }

  // called when component mounts
  // calls on two methods that are integral to displaying information on dashboard
  getUserID = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const email = user.email;
        const userID = email.split("@")[0];
        this.setState({ userID: userID }, () => {
          this.pullSemestersFromDatabase();
          this.getAcademicObjective();
        });
      } else {
      }
    });
  };

  // updates the semestersList array in the database every time changes are made
  writeToDatabase = () => {
    firebase
      .firestore()
      .collection("user-information")
      .doc(this.state.userID)
      .collection("course-information")
      .doc("Semesters List")
      .set(
        {
          semestersList: this.state.semestersList,
        },
        { merge: true }
      );
  };

  // primary method that pulls course info to be rendered on dashboard
  pullSemestersFromDatabase = () => {
    firebase
      .firestore()
      .collection("user-information")
      .doc(this.state.userID)
      .collection("course-information")
      .doc("Semesters List")
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.setState({ semestersList: doc.data().semestersList }, () => {
            this.setState(
              {
                semestersList: this.sortSemestersChronologically(
                  this.state.semestersList
                ),
              },
              () => {
                this.writeToDatabase();
              }
            );
          });
        } else {
          console.log("no data accquired");
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  // gets academic objective to be displayed in "the big picture"
  getAcademicObjective = () => {
    firebase
      .firestore()
      .collection("user-information")
      .doc(this.state.userID)
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.setState({ degree: doc.data().degree }, () => {
            if (this.state.degree === "Sc.B.") {
              this.setState({ degree: "Sc.B. (Bachelor of Science): " });
            }
            if (this.state.degree === "A.B.") {
              this.setState({ degree: "A.B. (Bachelor of Arts): " });
            }
            if (this.state.degree === "Yet To Declare") {
              this.setState({ degree: "Yet To Declare" });
            }
          });
          if (
            doc.data().concentration === "Yet To Declare" ||
            doc.data().concentration === "Click to Choose"
          ) {
            this.setState({ concentration_1: "" });
          } else {
            this.setState({ concentration_1: doc.data().concentration });
          }
          if (doc.data().second_concentration !== undefined) {
            if (
              doc.data().second_concentration !== "Yet To Declare" &&
              doc.data().second_concentration !== "Click to Choose" &&
              doc.data().second_concentration !== "Not Declaring"
            ) {
              this.setState({
                concentration_2: " and " + doc.data().second_concentration,
              });
              this.setState({
                concentration_2_duplicate: doc.data().second_concentration,
              });
            } else {
              this.setState({
                concentration_2: "",
              });
              this.setState({
                concentration_2_duplicate: "",
              });
            }
          }
        } else {
          console.log("no data acquired");
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  componentDidMount() {
    this.getUserID();
    this.props.navigation.dispatch(DrawerActions.toggleDrawer());
    this.props.navigation.dispatch(DrawerActions.toggleDrawer());
    this.props.navigation.addListener("willFocus", () => this.getUserID());
  }

  /*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––ADD SEMESTER POP-UP BEGINS–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

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

  // bubbleSort semesters based on year
  // param1 is the array based on which sorting is performed
  // param2 is an array in which identical swaps are made
  bubbleSortOnYear = (arr, mainArr) => {
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

  // bubbleSort semesters based on season
  // param1 is the array based on which sorting is performed
  // param2 is an array in which identical swaps are made
  bubbleSortOnSeason = (arr, mainArr) => {
    var len = arr.length;
    for (var i = len - 1; i >= 0; i--) {
      for (var j = 1; j <= i; j++) {
        if (this.chronologyDeterminer(arr[j - 1], arr[j])) {
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

  // assigns numerical values based on string
  // makes comparison and returns a boolean
  chronologyDeterminer = (a, b) => {
    if (a === "Spring") {
      a = 1;
    }
    if (a === "Summer") {
      a = 2;
    }
    if (a === "Fall") {
      a = 3;
    }
    if (a === "Winter") {
      a = 4;
    }
    if (b === "Spring") {
      b = 1;
    }
    if (b === "Summer") {
      b = 2;
    }
    if (b === "Fall") {
      b = 3;
    }
    if (b === "Winter") {
      b = 4;
    }
    if (a > b) {
      return true;
    } else {
      return false;
    }
  };

  // takes in a list of semesters
  // returns a chronologically sorted list of semesters
  sortSemestersChronologically = (list) => {
    const len = list.length;
    let years = [];
    for (let i = 0; i < len; i++) {
      const year = list[i].split(" ")[1];
      years.push(year);
    }
    let uniqueYears = [...new Set(years)];
    const result = this.bubbleSortOnYear(years, list);
    uniqueYears = this.bubbleSort(uniqueYears);
    let finalResult = [];
    for (let k = 0; k < uniqueYears.length; k++) {
      let semesters = [];
      let wholeStringList = [];
      for (let i = 0; i < len; i++) {
        if (list[i].split(" ")[1] === uniqueYears[k]) {
          const semester = list[i].split(" ")[0];
          const wholeString = list[i];
          semesters.push(semester);
          wholeStringList.push(wholeString);
        }
      }
      const partFinalResult = this.bubbleSortOnSeason(
        semesters,
        wholeStringList
      );
      finalResult = [...finalResult, ...partFinalResult];
    }
    return finalResult;
  };

  // every time a new semester is added this method is called
  // it updates the state and the database with a chronologically sorted list
  createSemesterCard = () => {
    const semesterName =
      this.state.semesterPickerValue + " " + this.state.yearPickerValue;
    this.setState(
      {
        semestersList: [...this.state.semestersList, semesterName],
      },
      () => {
        this.setState(
          {
            semestersList: this.sortSemestersChronologically(
              this.state.semestersList
            ),
          },
          () => {
            this.writeToDatabase();
          }
        );
      }
    );
  };

  // this method is called when a user hits "Add Semester" in the Pop-Up
  // it handles all remaining actions
  performRemainingActions = () => {
    const currentChoice =
      this.state.semesterPickerValue + " " + this.state.yearPickerValue;
    if (this.state.semestersList.includes(currentChoice)) {
      this.setState({ errorMessage: "You Have Already Added This Semester" });
      this.setState({ isAddSemesterModalVisible: true });
    } else {
      if (
        this.state.semesterPickerValue !== "Click to Choose" &&
        this.state.yearPickerValue !== "Click to Choose"
      ) {
        this.setState({ isAddSemesterModalVisible: false });
        this.createSemesterCard();
        this.resetPickers();
        this.setState({ errorMessage: null });
      } else {
        this.setState({ errorMessage: "Please Choose All Values" });
        this.setState({ isAddSemesterModalVisible: true });
      }
    }
  };

  showHideSemesterModal = () => {
    if (this.state.semestersList.length < 8) {
      if (this.state.isAddSemesterModalVisible === true) {
        this.setState({ isAddSemesterModalVisible: false });
      } else {
        this.setState({ isAddSemesterModalVisible: true });
      }
    } else {
      Alert.alert(
        "9th Semester",
        "You have added 8 semesters, if you would like to add another, get in touch with us through the Suggestions Page",
        [
          {
            text: "Ok",
          },
        ],
        { cancelable: false }
      );
    }
  };

  showHideSemesterPicker = () => {
    if (this.state.semesterPickerVisible == true) {
      this.setState({ semesterPickerVisible: false });
    } else {
      this.setState({ semesterPickerVisible: true });
    }
    this.setState({ yearPickerVisible: false });
  };

  defaultSemesterValue = () => {
    if (this.state.semesterPickerValue === "Click to Choose") {
      this.setState({ semesterPickerValue: "Spring" });
    }
  };

  showHideYearPicker = () => {
    if (this.state.yearPickerVisible == true) {
      this.setState({ yearPickerVisible: false });
    } else {
      this.setState({ yearPickerVisible: true });
    }
    this.setState({ semesterPickerVisible: false });
  };

  defaultYearValue = () => {
    if (this.state.yearPickerValue === "Click to Choose") {
      this.setState({ yearPickerValue: "2017" });
    }
  };

  resetPickers = () => {
    this.setState({ semesterPickerValue: "Click to Choose" });
    this.setState({ yearPickerValue: "Click to Choose" });
  };

  AddSemesterModal = () => (
    <View style={addSemesterModalStyles.popUpContainer}>
      <Modal
        animationType={"fade"}
        visible={this.state.isAddSemesterModalVisible}
      >
        <View style={addSemesterModalStyles.modal}>
          {/* /*–––––––––––––––––––––––––BACK BUTTON–––––––––––––––––––––––––*/}
          <TouchableOpacity
            style={addSemesterModalStyles.backArrow}
            onPress={() => {
              this.showHideSemesterModal();
              this.setState({ errorMessage: null });
            }}
          >
            <Icon name="ios-arrow-dropleft" color="#fafafa" size={40} />
          </TouchableOpacity>
          <View style={addSemesterModalStyles.header}>
            <Text style={addSemesterModalStyles.popUpTitle}>
              Semester Details
            </Text>
          </View>
          {/* /*–––––––––––––––––––––––––ERROR MESSAGE–––––––––––––––––––––––––*/}
          <View style={addSemesterModalStyles.errorMessage}>
            {this.state.errorMessage && (
              <Text style={addSemesterModalStyles.errorMessageText}>
                {this.state.errorMessage}
              </Text>
            )}
          </View>
          {/* /*–––––––––––––––––––––––––FORM 1 - SEMESTER–––––––––––––––––––––––––*/}
          <View style={addSemesterModalStyles.form1}>
            <Text style={addSemesterModalStyles.inputTitle}>Semester</Text>
            <TouchableOpacity
              style={addSemesterModalStyles.chooseConcentration}
              onPress={this.showHideSemesterPicker}
            >
              <Text
                style={{
                  color: "#fafafa",
                  fontSize: 13,
                }}
              >
                {this.state.semesterPickerValue}
              </Text>
            </TouchableOpacity>
          </View>
          {/* /*–––––––––––––––––––––––––SEMESTER PICKER–––––––––––––––––––––––––*/}
          {this.state.semesterPickerVisible ? (
            <React.Fragment>
              <Picker
                style={addSemesterModalStyles.concentrationPicker}
                selectedValue={this.state.semesterPickerValue}
                onValueChange={(itemValue) => {
                  this.setState({ semesterPickerValue: itemValue });
                }}
                itemStyle={{ color: "#fafafa", borderColor: "#fafafa" }}
              >
                <Picker.Item label="Spring" value="Spring"></Picker.Item>
                <Picker.Item label="Summer" value="Summer"></Picker.Item>
                <Picker.Item label="Fall" value="Fall"></Picker.Item>
                <Picker.Item label="Winter" value="Winter"></Picker.Item>
              </Picker>
              <TouchableOpacity
                style={addSemesterModalStyles.cancelButton}
                onPress={() => {
                  this.showHideSemesterPicker();
                  this.defaultSemesterValue();
                }}
              >
                <Text style={addSemesterModalStyles.cancelButtonText}>
                  DONE
                </Text>
              </TouchableOpacity>
            </React.Fragment>
          ) : null}
          {/* /*–––––––––––––––––––––––––FORM 2 - YEAR–––––––––––––––––––––––––*/}
          <View style={addSemesterModalStyles.form2}>
            <Text style={addSemesterModalStyles.inputTitle}>Year</Text>
            <TouchableOpacity
              style={addSemesterModalStyles.chooseConcentration}
              onPress={this.showHideYearPicker}
            >
              <Text
                style={{
                  color: "#fafafa",
                  fontSize: 13,
                }}
              >
                {this.state.yearPickerValue}
              </Text>
            </TouchableOpacity>
          </View>
          {/* /*–––––––––––––––––––––––––YEAR PICKER–––––––––––––––––––––––––*/}
          {this.state.yearPickerVisible ? (
            <React.Fragment>
              <Picker
                style={addSemesterModalStyles.concentrationPicker}
                selectedValue={this.state.yearPickerValue}
                onValueChange={(itemValue) => {
                  this.setState({ yearPickerValue: itemValue });
                }}
                itemStyle={{ color: "#fafafa", borderColor: "#fafafa" }}
              >
                <Picker.Item label="2017" value="2017"></Picker.Item>
                <Picker.Item label="2018" value="2018"></Picker.Item>
                <Picker.Item label="2019" value="2019"></Picker.Item>
                <Picker.Item label="2020" value="2020"></Picker.Item>
                <Picker.Item label="2021" value="2021"></Picker.Item>
                <Picker.Item label="2022" value="2022"></Picker.Item>
                <Picker.Item label="2023" value="2023"></Picker.Item>
                <Picker.Item label="2024" value="2024"></Picker.Item>
              </Picker>
              <TouchableOpacity
                style={addSemesterModalStyles.cancelButton}
                onPress={() => {
                  this.showHideYearPicker();
                  this.defaultYearValue();
                }}
              >
                <Text style={addSemesterModalStyles.cancelButtonText}>
                  DONE
                </Text>
              </TouchableOpacity>
            </React.Fragment>
          ) : null}
          {/* /*–––––––––––––––––––––––––ADD SEMESTER BUTTON–––––––––––––––––––––––––*/}
          <CreateProfileButton
            title="Add Semester"
            onPress={() => {
              this.setState({ isAddSemesterModalVisible: false });
              this.performRemainingActions();
            }}
          ></CreateProfileButton>
        </View>
      </Modal>
    </View>
  );

  /*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––THE BIG PICTURE POP-UP BEGINS–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

  // renders the first 4 semesters in semestersList
  // if 4 don't exist it creates fake placeholders to ensure positioning is not messed up
  createRow1Semesters = () => {
    var results = [];
    for (let i = 0; i < 4; i++) {
      if (this.state.semestersList[i]) {
        results.push(
          <SemesterPiece
            key={i}
            title={this.state.semestersList[i]}
            navprops={this.props}
            visibility={true}
          ></SemesterPiece>
        );
      }
    }
    if (results.length < 4) {
      while (results.length < 4) {
        results.push(
          <SemesterPiece
            key={Math.random()}
            title={this.state.semestersList[0]}
            navprops={this.props}
            visibility={false}
          ></SemesterPiece>
        );
      }
    }
    return results;
  };

  // renders the next 4 semesters in semestersList
  // if 4 don't exist it creates fake placeholders to ensure positioning is not messed up
  createRow2Semesters = () => {
    var results = [];
    for (let i = 4; i < 8; i++) {
      if (this.state.semestersList[i]) {
        results.push(
          <SemesterPiece
            key={Math.random()}
            title={this.state.semestersList[i]}
            navprops={this.props}
            visibility={true}
          ></SemesterPiece>
        );
      }
    }
    if (results.length < 4) {
      while (results.length < 4) {
        results.push(
          <SemesterPiece
            key={Math.random()}
            title={this.state.semestersList[0]}
            navprops={this.props}
            visibility={false}
          ></SemesterPiece>
        );
      }
    }
    return results;
  };

  showHideBigPicturePopUp = () => {
    if (this.state.semestersList[0]) {
      if (this.state.isBigPictureModalVisible) {
        this.setState({ isBigPictureModalVisible: false });
      } else {
        this.setState({ isBigPictureModalVisible: true });
      }
    } else {
      Alert.alert(
        "Patience",
        "Good Things Come To Those Who Wait",
        [
          {
            text: "I Shall Wait",
          },
        ],
        { cancelable: false }
      );
    }
  };

  BigPictureModal = () => (
    <View style={bigPictureStyles.container}>
      <Modal visible={this.state.isBigPictureModalVisible}>
        <View style={bigPictureStyles.container}>
          <Header
            backgroundColor="#4E342E"
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  this.showHideBigPicturePopUp();
                }}
              >
                <Icon name="ios-arrow-back" color="#fafafa" size={35} />
              </TouchableOpacity>
            }
            centerComponent={
              <Text style={bigPictureStyles.title}>The Big Picture</Text>
            }
          ></Header>
          <ScrollView
            directionalLockEnabled={true}
            scrollEnabled={true}
            contentContainerStyle={{
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Text style={bigPictureStyles.academicObjectiveTitle}>
              Academic Objective
            </Text>
            <Text style={bigPictureStyles.academicObjective}>
              {this.state.degree}
            </Text>
            <Text
              style={[
                bigPictureStyles.academicObjectivePt2,
                { alignSelf: "center", textAlign: "center" },
              ]}
            >
              {this.state.concentration_1 + this.state.concentration_2}
            </Text>
            <View style={bigPictureStyles.row1}>
              {this.createRow1Semesters()}
            </View>
            <View style={bigPictureStyles.row2}>
              {this.createRow2Semesters()}
            </View>

            {this.state.divisionsOfStudyData ? (
              <React.Fragment>
                <Text
                  style={{
                    fontWeight: "500",
                    fontStyle: "italic",
                    color: "#4E342E",
                    marginTop: 10,
                  }}
                >
                  Divisions of the College
                </Text>
                <PieChart
                  data={this.state.divisionsOfStudyData}
                  width={Dimensions.get("window").width}
                  height={220}
                  chartConfig={{
                    backgroundColor: "#e26a00",
                    backgroundGradientFrom: "#fb8c00",
                    backgroundGradientTo: "#ffa726",
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                  }}
                  accessor="value"
                  backgroundColor="transparent"
                  paddingLeft="5"
                />
              </React.Fragment>
            ) : null}
            {this.state.courseDeptData ? (
              <React.Fragment>
                <Text
                  style={{
                    fontWeight: "500",
                    fontStyle: "italic",
                    color: "#4E342E",
                  }}
                >
                  Departments
                </Text>
                <PieChart
                  data={this.state.courseDeptData}
                  width={Dimensions.get("window").width}
                  height={220}
                  chartConfig={{
                    backgroundColor: "#e26a00",
                    backgroundGradientFrom: "#fb8c00",
                    backgroundGradientTo: "#ffa726",
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                  }}
                  accessor="value"
                  backgroundColor="transparent"
                  paddingLeft="5"
                />
              </React.Fragment>
            ) : null}
            {this.state.concentrationData ? (
              <React.Fragment>
                <Text
                  style={{
                    fontWeight: "500",
                    fontStyle: "italic",
                    color: "#4E342E",
                  }}
                >
                  Concentrations
                </Text>
                <PieChart
                  data={this.state.concentrationData}
                  width={Dimensions.get("window").width}
                  height={220}
                  chartConfig={{
                    backgroundColor: "#e26a00",
                    backgroundGradientFrom: "#fb8c00",
                    backgroundGradientTo: "#ffa726",
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                  }}
                  accessor="value"
                  backgroundColor="transparent"
                  paddingLeft="5"
                />
              </React.Fragment>
            ) : null}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );

  handleRefresh(bool) {
    this.setState({ refresh: bool });
  }

  performRefresh = () => {
    if (this.state.refresh) {
      this.getUserID();
      this.setState({ refresh: false });
    }
  };

  /*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––PIE-CHART BEGINS–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

  getPieChartData = () => {
    var toReturn = [];
    for (let i = 0; i < this.state.semestersList.length; i++) {
      firebase
        .firestore()
        .collection("user-information")
        .doc(this.state.userID)
        .collection("course-information")
        .doc(this.state.semestersList[i])
        .get()
        .then((doc) => {
          if (doc.exists) {
            toReturn.push(doc.data());
            var hashMap = {};
            for (let i = 0; i < toReturn.length; i++) {
              for (let j = 0; j < Object.keys(toReturn[i]).length; j++) {
                var isShopping = this.getPropertyByIndex(toReturn[i], j)[
                  "shopping"
                ];
                var isRequirement1 = false;
                var isRequirement2 = false;
                if (
                  this.getPropertyByIndex(toReturn[i], j)[
                    "concentration_1_requirement"
                  ]
                ) {
                  isRequirement1 = this.getPropertyByIndex(toReturn[i], j)[
                    "concentration_1_requirement"
                  ];
                }
                if (
                  this.getPropertyByIndex(toReturn[i], j)[
                    "concentration_2_requirement"
                  ]
                ) {
                  isRequirement2 = this.getPropertyByIndex(toReturn[i], j)[
                    "concentration_2_requirement"
                  ];
                }
                var courseCode = this.getPropertyByIndex(toReturn[i], j)[
                  "course_code"
                ];
                var courseDept = courseCode.split(" ")[0];
                if (!isShopping) {
                  this.populateHashMap(
                    courseDept,
                    hashMap,
                    isRequirement1,
                    isRequirement2
                  );
                }
              }
            }
            if (i === this.state.semestersList.length - 1) {
              var totalCourses = 0;
              var totalConcentrationOneReq = 0;
              var totalConcentrationTwoReq = 0;
              var totalHumanitiesCourses = 0;
              var totalLifeSciencesCourses = 0;
              var totalPhysicalSciencesCourses = 0;
              var totalSocialSciencesCourses = 0;
              for (let i = 0; i < Object.keys(hashMap).length; i++) {
                totalCourses =
                  totalCourses + hashMap[Object.keys(hashMap)[i]]["deptFreq"];
                totalConcentrationOneReq =
                  totalConcentrationOneReq +
                  hashMap[Object.keys(hashMap)[i]]["concentration1Req"];
                if (this.state.concentration_2_duplicate !== "") {
                  totalConcentrationTwoReq =
                    totalConcentrationTwoReq +
                    hashMap[Object.keys(hashMap)[i]]["concentration2Req"];
                }
                if (
                  hashMap[Object.keys(hashMap)[i]]["deptAreaOfStudy"] ===
                  "Humanities"
                ) {
                  totalHumanitiesCourses =
                    totalHumanitiesCourses +
                    hashMap[Object.keys(hashMap)[i]]["deptFreq"];
                }
                if (
                  hashMap[Object.keys(hashMap)[i]]["deptAreaOfStudy"] ===
                  "Life Sciences"
                ) {
                  totalLifeSciencesCourses =
                    totalLifeSciencesCourses +
                    hashMap[Object.keys(hashMap)[i]]["deptFreq"];
                }
                if (
                  hashMap[Object.keys(hashMap)[i]]["deptAreaOfStudy"] ===
                  "Physical Sciences"
                ) {
                  totalPhysicalSciencesCourses =
                    totalPhysicalSciencesCourses +
                    hashMap[Object.keys(hashMap)[i]]["deptFreq"];
                }
                if (
                  hashMap[Object.keys(hashMap)[i]]["deptAreaOfStudy"] ===
                  "Social Sciences"
                ) {
                  totalSocialSciencesCourses =
                    totalSocialSciencesCourses +
                    hashMap[Object.keys(hashMap)[i]]["deptFreq"];
                }
              }
              // pie-chart for divisions of study
              const divisionsOfStudy = [
                "Humanities",
                "Life Sciences",
                "Physical Sciences",
                "Social Sciences",
              ];
              const divisionsOfStudyValues = [
                totalHumanitiesCourses,
                totalLifeSciencesCourses,
                totalPhysicalSciencesCourses,
                totalSocialSciencesCourses,
              ];
              const colorsForDivisionsOfStudy = [
                "#bc5090",
                "#003f5c",
                "#ff6361",
                "#ffa600",
              ];
              let divisionsOfStudyData = {};
              for (let i = 0; i < divisionsOfStudy.length; i++) {
                let currentDivision = divisionsOfStudy[i];
                divisionsOfStudyData[currentDivision] = {
                  name: divisionsOfStudy[i],
                  value: divisionsOfStudyValues[i],
                  color: colorsForDivisionsOfStudy[i],
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 11,
                };
              }
              let divisionsOfStudyDataArray = [];
              for (
                let j = 0;
                j < Object.keys(divisionsOfStudyData).length;
                j++
              ) {
                let currentObject = this.getPropertyByIndex(
                  divisionsOfStudyData,
                  j
                );
                divisionsOfStudyDataArray.push(currentObject);
              }
              this.setState({
                divisionsOfStudyData: divisionsOfStudyDataArray,
              });
              // pie-chart for departments
              let courseDeptDataArray = [];
              let courseDeptData = {};
              for (let i = 0; i < Object.keys(hashMap).length; i++) {
                var courseDept = Object.keys(hashMap)[i];
                var courseDeptValue =
                  hashMap[Object.keys(hashMap)[i]]["deptFreq"];
                var courseDeptColor = Colors[CourseList.indexOf(courseDept)];
                courseDeptData[courseDept] = {
                  name: courseDept,
                  value: courseDeptValue,
                  color: courseDeptColor,
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 11,
                };
              }
              for (let j = 0; j < Object.keys(courseDeptData).length; j++) {
                let currentObject = this.getPropertyByIndex(courseDeptData, j);
                courseDeptDataArray.push(currentObject);
              }
              this.setState({ courseDeptData: courseDeptDataArray });
              // pie-chart for concentration
              if (totalConcentrationTwoReq !== 0) {
                let concentrationDataArray = [
                  {
                    name: this.state.concentration_1.split(" - ")[0],
                    value: totalConcentrationOneReq,
                    color: "#FBDE44FF",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 11,
                  },
                  {
                    name: this.state.concentration_2_duplicate.split(" - ")[0],
                    value: totalConcentrationTwoReq,
                    color: "#28334aff",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 11,
                  },
                  {
                    name: "Other Courses",
                    value:
                      totalCourses -
                      totalConcentrationOneReq -
                      totalConcentrationTwoReq,
                    color: "#F65058FF",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 11,
                  },
                ];
                this.setState({ concentrationData: concentrationDataArray });
              } else {
                let concentrationDataArray = [
                  {
                    name: this.state.concentration_1.split(" - ")[0],
                    value: totalConcentrationOneReq,
                    color: "#FBDE44FF",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 11,
                  },
                  {
                    name: "Other Courses",
                    value:
                      totalCourses -
                      totalConcentrationOneReq -
                      totalConcentrationTwoReq,
                    color: "#F65058FF",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 11,
                  },
                ];
                this.setState({ concentrationData: concentrationDataArray });
              }
            }
          } else {
            console.log("no data acquired");
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  };

  populateHashMap = (courseDept, hashMap, isRequirement1, isRequirement2) => {
    if (courseDept in hashMap) {
      var existingFreq = hashMap[courseDept]["deptFreq"];
      var existingReq1 = hashMap[courseDept]["concentration1Req"];
      var existingReq2 = hashMap[courseDept]["concentration2Req"];
      if (isRequirement1 && !isRequirement2) {
        hashMap[courseDept] = {
          deptFreq: existingFreq + 1,
          deptAreaOfStudy: this.areaOfStudy(courseDept),
          concentration1Req: existingReq1 + 1,
          concentration2Req: existingReq2,
        };
      }
      if (!isRequirement1 && isRequirement2) {
        hashMap[courseDept] = {
          deptFreq: existingFreq + 1,
          deptAreaOfStudy: this.areaOfStudy(courseDept),
          concentration1Req: existingReq1,
          concentration2Req: existingReq2 + 1,
        };
      }
      if (isRequirement1 && isRequirement2) {
        hashMap[courseDept] = {
          deptFreq: existingFreq + 1,
          deptAreaOfStudy: this.areaOfStudy(courseDept),
          concentration1Req: existingReq1 + 1,
          concentration2Req: existingReq2 + 1,
        };
      }
      if (!isRequirement1 && !isRequirement2) {
        hashMap[courseDept] = {
          deptFreq: existingFreq + 1,
          deptAreaOfStudy: this.areaOfStudy(courseDept),
          concentration1Req: existingReq1,
          concentration2Req: existingReq2,
        };
      }
    } else {
      if (isRequirement1 && !isRequirement2) {
        hashMap[courseDept] = {
          deptFreq: 1,
          deptAreaOfStudy: this.areaOfStudy(courseDept),
          concentration1Req: 1,
          concentration2Req: 0,
        };
      }
      if (!isRequirement1 && isRequirement2) {
        hashMap[courseDept] = {
          deptFreq: 1,
          deptAreaOfStudy: this.areaOfStudy(courseDept),
          concentration1Req: 0,
          concentration2Req: 1,
        };
      }
      if (isRequirement1 && isRequirement2) {
        hashMap[courseDept] = {
          deptFreq: 1,
          deptAreaOfStudy: this.areaOfStudy(courseDept),
          concentration1Req: 1,
          concentration2Req: 1,
        };
      }
      if (!isRequirement1 && !isRequirement2) {
        hashMap[courseDept] = {
          deptFreq: 1,
          deptAreaOfStudy: this.areaOfStudy(courseDept),
          concentration1Req: 0,
          concentration2Req: 0,
        };
      }
    }
  };

  getPropertyByIndex = (obj, index) => {
    return obj[Object.keys(obj)[index]];
  };

  areaOfStudy = (courseDept) => {
    for (let i = 0; i < DepartmentsWithAreasOfStudy.length; i++) {
      if (DepartmentsWithAreasOfStudy[i].includes(courseDept)) {
        if (i === 0) {
          return "Humanities";
        }
        if (i === 1) {
          return "Life Sciences";
        }
        if (i === 2) {
          return "Physical Sciences";
        }
        if (i === 3) {
          return "Social Sciences";
        }
      }
    }
  };

  /*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––RENDER METHOD–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
  render() {
    return (
      <View style={{ flex: 1 }}>
        {/* /*–––––––––––––––––––––––––HEADER–––––––––––––––––––––––––*/}
        <Header
          backgroundColor="#4E342E"
          centerComponent={<Text style={styles.title}>Dashboard</Text>}
        >
          <TouchableOpacity
            style={styles.trigger}
            onPress={() => {
              this.props.navigation.dispatch(DrawerActions.toggleDrawer());
            }}
          >
            <Ionicons name={"md-menu"} size={32} color={"white"} />
          </TouchableOpacity>
        </Header>
        {/* /*–––––––––––––––––––––––––SCROLL VIEW–––––––––––––––––––––––––*/}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.container}
          onScroll={this.performRefresh()}
          scrollEventThrottle={0}
        >
          {/* /*–––––––––––––––––––––––––CARDS–––––––––––––––––––––––––*/}
          <View>
            {/* this button opens up the big picture modal/pop-up */}
            <CustomButton
              style={bigPictureStyles.summaryButtonContainer}
              textStyle={bigPictureStyles.summaryButtonText}
              title={"The Big Picture"}
              onPress={() => {
                this.showHideBigPicturePopUp();
                this.getAcademicObjective();
                this.getPieChartData();
              }}
            ></CustomButton>
            {/* this is the pop-up that always exists but remains invisible until "The Big Picture" is clicked */}
            <this.BigPictureModal></this.BigPictureModal>
            {/* this function returns semester cards based on the number the user has created */}
            {this.state.semestersList.map((semester, index) => {
              return (
                <SemesterCard
                  key={Math.random()}
                  title={semester}
                  navprops={this.props}
                  refresh={this.handleRefresh}
                ></SemesterCard>
              );
            })}
            {/* this is the pop-up that always exists but remains invisible until add semester is clicked */}
            <this.AddSemesterModal></this.AddSemesterModal>
            {/* this is the add semester card that always exists at the end of all semesters added */}
            <AddSemesterCard
              onPress={() => this.showHideSemesterModal()}
            ></AddSemesterCard>
            <View style={{ alignItems: "center", alignContent: "center" }}>
              {/* <AdMobBanner
                style={styles.banner1}
                bannerSize="largeBanner"
                adUnitID="ca-app-pub-3940256099942544/6300978111"
                testDeviceID="EMULATOR"
              /> */}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––STYLING–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

/*–––––––––––––––––––––––––CUSTOM BUTTON COMPONENT–––––––––––––––––––––––––*/
const CreateProfileButton = ({ onPress, title }) => (
  <TouchableOpacity
    onPress={onPress}
    style={addSemesterModalStyles.createProfileButtonContainer}
    activeOpacity={0.6}
  >
    <Text style={addSemesterModalStyles.createProfileButtonText}>{title}</Text>
  </TouchableOpacity>
);

/*–––––––––––––––––––––––––CUSTOM BUTTON 2 COMPONENT–––––––––––––––––––––––––*/
const CustomButton = ({ onPress, title, style, textStyle }) => (
  <TouchableOpacity onPress={onPress} style={style} activeOpacity={0.8}>
    <Text style={textStyle}>{title}</Text>
  </TouchableOpacity>
);

/*–––––––––––––––––––––––––DASHBOARD SCREEN STYLING–––––––––––––––––––––––––*/
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    color: "#fafafa",
    fontWeight: "700",
    letterSpacing: 1,
  },
  banner1: {
    alignContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 5,
  },
});

/*–––––––––––––––––––––––––THE BIG PICTURE POP-UP STYLING–––––––––––––––––––––––––*/
const bigPictureStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  scrollContainer: {
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    color: "#fafafa",
    fontWeight: "700",
    letterSpacing: 1,
  },
  row1: {
    flex: 1,
    flexDirection: "row",
    marginTop: 28,
  },
  row2: {
    flex: 1,
    flexDirection: "row",
    marginTop: 15,
  },
  summaryButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E3E3E3",
    borderRadius: 15,
    paddingVertical: 17,
    paddingHorizontal: 12,
    width: 0.9 * Dimensions.get("window").width,
    top: 10,
    marginBottom: 10,
    zIndex: 3,
  },
  summaryButtonText: {
    fontSize: 18,
    color: "#4E342E",
    fontWeight: "bold",
    alignSelf: "center",
  },
  academicObjectiveTitle: {
    color: "#4E342E",
    fontWeight: "800",
    fontStyle: "italic",
    margin: 5,
    fontSize: 28,
  },
  academicObjective: {
    zIndex: 5,
    color: "#4E342E",
    marginHorizontal: 20,
    fontSize: 20,
    marginBottom: 3,
    fontWeight: "600",
  },
  academicObjectivePt2: {
    zIndex: 5,
    color: "#4E342E",
    marginHorizontal: 20,
    fontSize: 14,
    marginBottom: 3,
    fontWeight: "500",
  },
});

/*–––––––––––––––––––––––––ADD SEMESTER POP-UP STYLING–––––––––––––––––––––––––*/
const addSemesterModalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4E342E",
    alignItems: "center",
    justifyContent: "center",
  },
  form1: {
    position: "absolute",
    top: "30%",
    width: 0.8 * Dimensions.get("window").width,
  },
  form2: {
    position: "absolute",
    top: "45%",
    width: 0.8 * Dimensions.get("window").width,
  },
  inputTitle: {
    color: "#fafafa",
    fontSize: 12,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  input: {
    borderBottomColor: "#fafafa",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 13,
    color: "#fafafa",
  },
  createProfileButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
    borderRadius: 15,
    paddingVertical: 17,
    paddingHorizontal: 12,
    width: "90%",
    position: "absolute",
    bottom: 40,
    zIndex: 3,
  },
  createProfileButtonText: {
    fontSize: 18,
    color: "#4E342E",
    fontWeight: "bold",
    alignSelf: "center",
  },
  chooseConcentration: {
    borderBottomColor: "#fafafa",
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  concentrationPicker: {
    position: "absolute",
    top: "55%",
    width: "82%",
    backgroundColor: "#4E342E",
    zIndex: 1,
    height: 250,
    borderColor: "#fafafa",
  },
  cancelButton: {
    position: "absolute",
    top: "57%",
    right: 33,
    height: 30,
    width: 50,
    fontSize: 13,
    color: "#fafafa",
    zIndex: 2,
  },
  cancelButtonText: {
    color: "#fafafa",
    fontSize: 11,
  },
  addSemesterButton: {
    position: "absolute",
    top: 100,
  },
  popUpContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    flex: 1,
    backgroundColor: "#4E342E",
    padding: 20,
    alignItems: "center",
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  popUpTitle: {
    fontSize: 30,
    color: "white",
    fontWeight: "600",
    position: "absolute",
    top: "10%",
  },
  backArrow: {
    position: "absolute",
    top: "6%",
    left: "6%",
  },
  errorMessage: {
    flex: 1,
    position: "absolute",
    top: "18%",
    width: 0.8 * Dimensions.get("window").width,
    justifyContent: "center",
    alignItems: "center",
  },
  errorMessageText: {
    flex: 1,
    color: "#fafafa",
  },
});

export default DashboardScreen;
