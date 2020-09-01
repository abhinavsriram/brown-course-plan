import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Alert,
  Modal,
  Picker,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Header } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "react-navigation-drawer";
import * as Progress from "react-native-progress";

import firebase from "firebase";
import "firebase/firestore";
import { AdMobBanner } from "expo-ads-admob";

import DepartmentsWithAreasOfStudy from "./../data/DepartmentsWithAreasOfStudy";
import SemesterPiece from "./../components/SemesterPieceRequirementsPage";

import Icon from "react-native-vector-icons/Ionicons";

class RequirementsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: "",
      semestersList: [],
      concentration_1: "",
      concentration_2: "",
      concentration_2_duplicate: "",
      totalCourses: null,
      totalConcentrationOneReq: 0,
      totalConcentrationTwoReq: 0,
      totalWRITReq: null,
      totalRequiredCourses: 30,
      totalConcentrationOneRequiredCourses: 12,
      totalConcentrationTwoRequiredCourses: 12,
      totalWRITRequiredCourses: 2,
      refresh: false,
      isBigPictureModalVisible: false,
      errorMessageVisible: true,
      isAddSemesterModalVisible: false,
      semesterPickerVisible: false,
      semesterPickerValue: "Click to Choose",
      yearPickerVisible: false,
      yearPickerValue: "Click to Choose",
      errorMessage: null,
    };
  }

  // called when component mounts
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

  // pulls semestersList from database
  // calls on getProgressBarData
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
            this.getProgressBarData();
          });
        } else {
          console.log("no data acquired in pullSemesters");
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  // gets academic objective to be displayed
  // calls on getTotalRequiredCourses
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
            this.setState({ concentration_1: doc.data().concentration }, () =>
              this.getTotalRequiredCourses(true, false)
            );
            if (doc.data().concentration_1_req) {
              this.setState({
                totalConcentrationOneRequiredCourses: doc.data()
                  .concentration_1_req,
              });
            }
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
              this.setState(
                {
                  concentration_2_duplicate: doc.data().second_concentration,
                },
                () => {
                  this.getTotalRequiredCourses(false, true);
                }
              );
              if (doc.data().concentration_2_req) {
                this.setState({
                  totalConcentrationTwoRequiredCourses: doc.data()
                    .concentration_2_req,
                });
              }
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
          console.log("no data acquired in getAcademicObjective");
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  // gets 12 or 17 based on AB or SCB
  getTotalRequiredCourses = (concentration1, concentration2) => {
    if (concentration1) {
      if (this.state.concentration_1.split(" - ")[1].split(" ")[0] === "AB") {
        this.setState({ totalConcentrationOneRequiredCourses: 12 });
      } else {
        this.setState({ totalConcentrationOneRequiredCourses: 17 });
      }
    }
    if (concentration2) {
      if (
        this.state.concentration_2_duplicate.split(" - ")[1].split(" ")[0] ===
        "AB"
      ) {
        this.setState({ totalConcentrationTwoRequiredCourses: 12 });
      } else {
        this.setState({ totalConcentrationTwoRequiredCourses: 17 });
      }
    }
  };

  componentDidMount() {
    this.getUserID();
    this.props.navigation.addListener("willFocus", () => this.getUserID());
  }

  /*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––PROGRESS BAR BEGINS–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

  getProgressBarData = () => {
    this.setState({ totalConcentrationOneReq: 0 });
    this.setState({ totalConcentrationTwoReq: 0 });
    this.setState({ totalWRITReq: 0 });
    this.setState({ totalCourses: 0 });
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
            // console.log(Object.keys(doc.data()).length);
            toReturn.push(doc.data());
            var hashMap = {};
            for (let i = 0; i < toReturn.length; i++) {
              for (let j = 0; j < Object.keys(toReturn[i]).length; j++) {
                var isShopping = this.getPropertyByIndex(toReturn[i], j)[
                  "shopping"
                ];
                var isRequirement1 = false;
                var isRequirement2 = false;
                var isWRITRequirement = false;
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
                if (
                  this.getPropertyByIndex(toReturn[i], j)["writ_requirement"]
                ) {
                  isWRITRequirement = this.getPropertyByIndex(toReturn[i], j)[
                    "writ_requirement"
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
                    isRequirement2,
                    isWRITRequirement
                  );
                }
              }
            }
            if (i === this.state.semestersList.length - 1) {
              var totalCourses = 0;
              var totalConcentrationOneReq = 0;
              var totalConcentrationTwoReq = 0;
              var totalWRITReq = 0;
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
                totalWRITReq =
                  totalWRITReq + hashMap[Object.keys(hashMap)[i]]["writReq"];
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
              // start here
              this.setState({ totalCourses: totalCourses });
              this.setState({
                totalConcentrationOneReq: totalConcentrationOneReq,
              });
              this.setState({
                totalConcentrationTwoReq: totalConcentrationTwoReq,
              });
              this.setState({ totalWRITReq: totalWRITReq });
            }
          } else {
            console.log("no data acquired in getProgressBarData");
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  };

  populateHashMap = (
    courseDept,
    hashMap,
    isRequirement1,
    isRequirement2,
    isWRITRequirement
  ) => {
    if (courseDept in hashMap) {
      var existingFreq = hashMap[courseDept]["deptFreq"];
      var existingReq1 = hashMap[courseDept]["concentration1Req"];
      var existingReq2 = hashMap[courseDept]["concentration2Req"];
      var existingWRITReq = hashMap[courseDept]["writReq"];
      if (isRequirement1 && !isRequirement2) {
        hashMap[courseDept] = {
          deptFreq: existingFreq + 1,
          deptAreaOfStudy: this.areaOfStudy(courseDept),
          concentration1Req: existingReq1 + 1,
          concentration2Req: existingReq2,
          writReq: existingWRITReq,
        };
      }
      if (!isRequirement1 && isRequirement2) {
        hashMap[courseDept] = {
          deptFreq: existingFreq + 1,
          deptAreaOfStudy: this.areaOfStudy(courseDept),
          concentration1Req: existingReq1,
          concentration2Req: existingReq2 + 1,
          writReq: existingWRITReq,
        };
      }
      if (isRequirement1 && isRequirement2) {
        hashMap[courseDept] = {
          deptFreq: existingFreq + 1,
          deptAreaOfStudy: this.areaOfStudy(courseDept),
          concentration1Req: existingReq1 + 1,
          concentration2Req: existingReq2 + 1,
          writReq: existingWRITReq,
        };
      }
      if (!isRequirement1 && !isRequirement2) {
        hashMap[courseDept] = {
          deptFreq: existingFreq + 1,
          deptAreaOfStudy: this.areaOfStudy(courseDept),
          concentration1Req: existingReq1,
          concentration2Req: existingReq2,
          writReq: existingWRITReq,
        };
      }
      // writReq
      if (isRequirement1 && !isRequirement2 && isWRITRequirement) {
        hashMap[courseDept] = {
          deptFreq: existingFreq + 1,
          deptAreaOfStudy: this.areaOfStudy(courseDept),
          concentration1Req: existingReq1 + 1,
          concentration2Req: existingReq2,
          writReq: existingWRITReq + 1,
        };
      }
      if (!isRequirement1 && isRequirement2 && isWRITRequirement) {
        hashMap[courseDept] = {
          deptFreq: existingFreq + 1,
          deptAreaOfStudy: this.areaOfStudy(courseDept),
          concentration1Req: existingReq1,
          concentration2Req: existingReq2 + 1,
          writReq: existingWRITReq + 1,
        };
      }
      if (isRequirement1 && isRequirement2 && isWRITRequirement) {
        hashMap[courseDept] = {
          deptFreq: existingFreq + 1,
          deptAreaOfStudy: this.areaOfStudy(courseDept),
          concentration1Req: existingReq1 + 1,
          concentration2Req: existingReq2 + 1,
          writReq: existingWRITReq + 1,
        };
      }
      if (!isRequirement1 && !isRequirement2 && isWRITRequirement) {
        hashMap[courseDept] = {
          deptFreq: existingFreq + 1,
          deptAreaOfStudy: this.areaOfStudy(courseDept),
          concentration1Req: existingReq1,
          concentration2Req: existingReq2,
          writReq: existingWRITReq + 1,
        };
      }
    } else {
      if (isRequirement1 && !isRequirement2) {
        hashMap[courseDept] = {
          deptFreq: 1,
          deptAreaOfStudy: this.areaOfStudy(courseDept),
          concentration1Req: 1,
          concentration2Req: 0,
          writReq: 0,
        };
      }
      if (!isRequirement1 && isRequirement2) {
        hashMap[courseDept] = {
          deptFreq: 1,
          deptAreaOfStudy: this.areaOfStudy(courseDept),
          concentration1Req: 0,
          concentration2Req: 1,
          writReq: 0,
        };
      }
      if (isRequirement1 && isRequirement2) {
        hashMap[courseDept] = {
          deptFreq: 1,
          deptAreaOfStudy: this.areaOfStudy(courseDept),
          concentration1Req: 1,
          concentration2Req: 1,
          writReq: 0,
        };
      }
      if (!isRequirement1 && !isRequirement2) {
        hashMap[courseDept] = {
          deptFreq: 1,
          deptAreaOfStudy: this.areaOfStudy(courseDept),
          concentration1Req: 0,
          concentration2Req: 0,
          writReq: 0,
        };
      }
      // writReq
      if (isRequirement1 && !isRequirement2 && isWRITRequirement) {
        hashMap[courseDept] = {
          deptFreq: 1,
          deptAreaOfStudy: this.areaOfStudy(courseDept),
          concentration1Req: 1,
          concentration2Req: 0,
          writReq: 1,
        };
      }
      if (!isRequirement1 && isRequirement2 && isWRITRequirement) {
        hashMap[courseDept] = {
          deptFreq: 1,
          deptAreaOfStudy: this.areaOfStudy(courseDept),
          concentration1Req: 0,
          concentration2Req: 1,
          writReq: 1,
        };
      }
      if (isRequirement1 && isRequirement2 && isWRITRequirement) {
        hashMap[courseDept] = {
          deptFreq: 1,
          deptAreaOfStudy: this.areaOfStudy(courseDept),
          concentration1Req: 1,
          concentration2Req: 1,
          writReq: 1,
        };
      }
      if (!isRequirement1 && !isRequirement2 && isWRITRequirement) {
        hashMap[courseDept] = {
          deptFreq: 1,
          deptAreaOfStudy: this.areaOfStudy(courseDept),
          concentration1Req: 0,
          concentration2Req: 0,
          writReq: 1,
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
              onPress={this.showHideYearPicker()}
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
            onLongPress={() => {
              Alert.alert(
                "Delete Semester",
                "You can delete semesters from the Dashboard",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Go To Dashboard",
                    onPress: () => {
                      this.props.navigation.navigate("TabNavigator");
                    },
                    style: "destructive",
                  },
                ],
                { cancelable: false }
              );
            }}
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
            onPress={() => {
              Alert.alert(
                "Go To Dashboard",
                "You can add new semesters from the Dashboard",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Go To Dashboard",
                    onPress: () => {
                      this.props.navigation.navigate("TabNavigator");
                    },
                  },
                ],
                { cancelable: false }
              );
            }}
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
            key={i}
            title={this.state.semestersList[i]}
            navprops={this.props}
            visibility={true}
            onLongPress={() => {
              Alert.alert(
                "Delete Semester",
                "You can delete semesters from the Dashboard",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Go To Dashboard",
                    onPress: () => {
                      this.props.navigation.navigate("TabNavigator");
                    },
                    style: "destructive",
                  },
                ],
                { cancelable: false }
              );
            }}
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
            onPress={() => {
              Alert.alert(
                "Go To Dashboard",
                "You can add new semesters from the Dashboard",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Go To Dashboard",
                    onPress: () => {
                      this.props.navigation.navigate("TabNavigator");
                    },
                  },
                ],
                { cancelable: false }
              );
            }}
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
              <Text style={bigPictureStyles.title}>Satisfied</Text>
            }
          ></Header>
          <ScrollView
            directionalLockEnabled={true}
            showsVerticalScrollIndicator={"false"}
            scrollEnabled={true}
            contentContainerStyle={{
              alignItems: "center",
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
            {this.state.concentration_1 ? (
              <Text
                style={{
                  fontSize: 18,
                  marginBottom: 10,
                  color: "#4E342E",
                  fontWeight: "700",
                  fontStyle: "italic",
                  marginTop: 15,
                  textAlign: "left",
                  alignItems: "flex-end",
                }}
              >
                {this.state.concentration_1}
                {" ("}
                {this.state.totalConcentrationOneReq}
                {"/"}
                {this.state.totalConcentrationOneRequiredCourses}
                {")"}
              </Text>
            ) : null}
            {this.state.concentration_1 &&
              this.state.totalConcentrationOneReq !== 0 ? (
                <React.Fragment>
                  <Progress.Bar
                    progress={
                      this.state.totalConcentrationOneReq /
                      this.state.totalConcentrationOneRequiredCourses
                    }
                    width={0.85 * Dimensions.get("window").width}
                    height={20}
                    borderRadius={7}
                    color={"#4E342E"}
                  />
                </React.Fragment>
              ) : null}
            {this.state.concentration_2_duplicate ? (
              <Text
                style={{
                  fontSize: 18,
                  marginBottom: 10,
                  color: "#4E342E",
                  fontWeight: "700",
                  fontStyle: "italic",
                  marginTop: 15,
                  textAlign: "left",
                  alignItems: "flex-end",
                }}
              >
                {this.state.concentration_2_duplicate}
                {" ("}
                {this.state.totalConcentrationTwoReq}
                {"/"}
                {this.state.totalConcentrationTwoRequiredCourses}
                {")"}
              </Text>
            ) : null}
            {this.state.concentration_2_duplicate &&
              this.state.totalConcentrationTwoReq !== 0 ? (
                <React.Fragment>
                  <Progress.Bar
                    progress={
                      this.state.totalConcentrationTwoReq /
                      this.state.totalConcentrationTwoRequiredCourses
                    }
                    width={0.85 * Dimensions.get("window").width}
                    height={20}
                    borderRadius={7}
                    color={"#4E342E"}
                  />
                </React.Fragment>
              ) : null}
            <View>
              <View style={{ flexDirection: "row", padding: 5, marginTop: 10 }}>
                <TouchableOpacity
                  style={{
                    height: 15,
                    width: 15,
                    borderRadius: 50,
                    backgroundColor: "#5e35b1",
                  }}
                  disabled={true}
                ></TouchableOpacity>
                <Text
                  style={{
                    color: "#5e35b1",
                    // marginTop: 13,
                    // marginBottom: 3,
                    fontWeight: "500",
                    fontSize: 12.5,
                  }}
                >
                  {"    First and Second Concentration & WRIT Requirement"}
                </Text>
              </View>
              <View style={{ flexDirection: "row", padding: 5 }}>
                <TouchableOpacity
                  style={{
                    height: 15,
                    width: 15,
                    borderRadius: 50,
                    backgroundColor: "#4caf50",
                  }}
                  disabled={true}
                ></TouchableOpacity>
                <Text
                  style={{
                    color: "#4caf50",
                    // marginTop: 13,
                    // marginBottom: 3,
                    fontWeight: "500",
                    fontSize: 12.5,
                  }}
                >
                  {"    First Concentration and WRIT Requirement"}
                </Text>
              </View>
              <View style={{ flexDirection: "row", padding: 5 }}>
                <TouchableOpacity
                  style={{
                    height: 15,
                    width: 15,
                    borderRadius: 50,
                    backgroundColor: "#f9a825",
                  }}
                  disabled={true}
                ></TouchableOpacity>
                <Text
                  style={{
                    color: "#f9a825",
                    // marginTop: 13,
                    // marginBottom: 3,
                    fontWeight: "500",
                    fontSize: 12.5,
                  }}
                >
                  {"    Second Concentration and WRIT Requirement"}
                </Text>
              </View>
              <View style={{ flexDirection: "row", padding: 5 }}>
                <TouchableOpacity
                  style={{
                    height: 15,
                    width: 15,
                    borderRadius: 50,
                    backgroundColor: "#00897b",
                  }}
                  disabled={true}
                ></TouchableOpacity>
                <Text
                  style={{
                    color: "#00897b",
                    // marginTop: 13,
                    // marginBottom: 3,
                    fontWeight: "500",
                    fontSize: 12.5,
                  }}
                >
                  {"    First and Second Concentration"}
                </Text>
              </View>
              <View style={{ flexDirection: "row", padding: 5 }}>
                <TouchableOpacity
                  style={{
                    height: 15,
                    width: 15,
                    borderRadius: 50,
                    backgroundColor: "#00bcd4",
                  }}
                  disabled={true}
                ></TouchableOpacity>
                <Text
                  style={{
                    color: "#00bcd4",
                    // marginTop: 13,
                    // marginBottom: 3,
                    fontWeight: "500",
                    fontSize: 12.5,
                  }}
                >
                  {"    First Concentration"}
                </Text>
              </View>
              <View style={{ flexDirection: "row", padding: 5 }}>
                <TouchableOpacity
                  style={{
                    height: 15,
                    width: 15,
                    borderRadius: 50,
                    backgroundColor: "#ec407a",
                  }}
                  disabled={true}
                ></TouchableOpacity>
                <Text
                  style={{
                    color: "#ec407a",
                    // marginTop: 13,
                    // marginBottom: 3,
                    fontWeight: "500",
                    fontSize: 12.5,
                  }}
                >
                  {"    Second Concentration"}
                </Text>
              </View>
              <View style={{ flexDirection: "row", padding: 5 }}>
                <TouchableOpacity
                  style={{
                    height: 15,
                    width: 15,
                    borderRadius: 50,
                    backgroundColor: "#6d4c41",
                  }}
                  disabled={true}
                ></TouchableOpacity>
                <Text
                  style={{
                    color: "#6d4c41",
                    // marginTop: 13,
                    // marginBottom: 3,
                    fontWeight: "500",
                    fontSize: 12.5,
                  }}
                >
                  {"    WRIT Requirement"}
                </Text>
              </View>
              <View
                style={{ flexDirection: "row", padding: 5, marginBottom: 20 }}
              >
                <TouchableOpacity
                  style={{
                    height: 15,
                    width: 15,
                    borderRadius: 50,
                    backgroundColor: "#bdbdbd",
                  }}
                  disabled={true}
                ></TouchableOpacity>
                <Text
                  style={{
                    color: "#bdbdbd",
                    // marginTop: 13,
                    // marginBottom: 3,
                    fontWeight: "500",
                    fontSize: 12.5,
                  }}
                >
                  {"    Remaining Courses"}
                </Text>
              </View>
            </View>
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

  /*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––RENDER METHOD–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
  render() {
    return (
      <View style={styles.container}>
        <Header
          backgroundColor="#4E342E"
          centerComponent={<Text style={styles.title}>Requirements</Text>}
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
        {/* this is the pop-up that always exists but remains invisible until "The Big Picture" is clicked */}
        <this.BigPictureModal></this.BigPictureModal>
        <ScrollView
          contentContainerStyle={{ alignItems: "center", width: "80%" }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={"false"}
        >
          <Text style={styles.academicObjectiveTitle}>Academic Objective</Text>
          <Text style={styles.academicObjective}>{this.state.degree}</Text>
          <Text style={styles.academicObjectivePt2}>
            {this.state.concentration_1 + this.state.concentration_2}
          </Text>
          <View style={{ flex: 1 }}>
            {/* quantity requirement */}
            <Text style={styles.requirementHeader}>Quantity Requirement:</Text>
            <Progress.Bar
              progress={
                this.state.totalCourses / this.state.totalRequiredCourses
              }
              width={0.85 * Dimensions.get("window").width}
              height={20}
              borderRadius={7}
              color={"#4E342E"}
            />
            <Text style={styles.requirementSubText}>
              {this.state.totalCourses}
              {"/"}
              {this.state.totalRequiredCourses}
              {" Added To Dashboard"}
            </Text>
            <Text style={styles.requirementHeader}>WRIT Requirement:</Text>
            <Progress.Bar
              progress={
                this.state.totalWRITReq / this.state.totalWRITRequiredCourses
              }
              width={0.85 * Dimensions.get("window").width}
              height={20}
              borderRadius={7}
              color={"#4E342E"}
            />
            <Text style={styles.requirementSubText}>
              {this.state.totalWRITReq}
              {"/"}
              {this.state.totalWRITRequiredCourses}
              {" Added To Dashboard"}
            </Text>
            <Text style={styles.requirementHeader}>Concentration(s):</Text>
            {this.state.concentration_1 ? (
              <Text style={styles.requirementSubHeader}>
                {this.state.concentration_1}
              </Text>
            ) : null}
            {this.state.concentration_1 &&
              this.state.totalConcentrationOneReq !== 0 ? (
                <React.Fragment>
                  <Progress.Bar
                    progress={
                      this.state.totalConcentrationOneReq /
                      this.state.totalConcentrationOneRequiredCourses
                    }
                    width={0.85 * Dimensions.get("window").width}
                    height={20}
                    borderRadius={7}
                    color={"#4E342E"}
                  />
                  <Text style={styles.requirementSubText}>
                    {this.state.totalConcentrationOneReq}
                    {"/"}
                    {this.state.totalConcentrationOneRequiredCourses}
                    {" Added To Dashboard"}
                  </Text>
                </React.Fragment>
              ) : null}
            {this.state.totalConcentrationOneReq !==
              this.state.totalConcentrationOneRequiredCourses &&
              this.state.totalConcentrationOneReq !== 0 ? (
                <React.Fragment>
                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert(
                        "Coming Soon",
                        "........",
                        [
                          {
                            text: "Ok!",
                          },
                        ],
                        { cancelable: false }
                      )
                    }
                  >
                    <Text style={styles.requirementSubTextMissing}>
                      View Missing Requirements
                  </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.showHideBigPicturePopUp()}
                  >
                    <Text style={styles.requirementSubTextMissing}>
                      View Satisfied Requirements
                  </Text>
                  </TouchableOpacity>
                </React.Fragment>
              ) : this.state.concentration_1 !== "" ? (
                <Text
                  style={{
                    color: "#4E342E",
                    fontWeight: "600",
                    fontStyle: "italic",
                  }}
                >
                  You Have Not Indicated That Any Of Your Courses Are
                  Concentration Requirements
                </Text>
              ) : null}
            {this.state.concentration_2_duplicate ? (
              <Text style={styles.requirementSubHeader2}>
                {this.state.concentration_2_duplicate}
              </Text>
            ) : null}
            {this.state.concentration_2_duplicate &&
              this.state.totalConcentrationTwoReq !== 0 ? (
                <React.Fragment>
                  <Progress.Bar
                    progress={
                      this.state.totalConcentrationTwoReq /
                      this.state.totalConcentrationTwoRequiredCourses
                    }
                    width={0.85 * Dimensions.get("window").width}
                    height={20}
                    borderRadius={7}
                    color={"#4E342E"}
                  />
                  <Text style={styles.requirementSubText}>
                    {this.state.totalConcentrationTwoReq}
                    {"/"}
                    {this.state.totalConcentrationTwoRequiredCourses}
                    {" Added To Dashboard"}
                  </Text>
                </React.Fragment>
              ) : null}
            {this.state.totalConcentrationTwoReq !==
              this.state.totalConcentrationTwoRequiredCourses &&
              this.state.totalConcentrationTwoReq !== 0 ? (
                <React.Fragment>
                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert(
                        "Coming Soon",
                        "........",
                        [
                          {
                            text: "Ok!",
                          },
                        ],
                        { cancelable: false }
                      )
                    }
                  >
                    <Text style={styles.requirementSubTextMissing}>
                      View Missing Requirements
                  </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.showHideBigPicturePopUp()}
                  >
                    <Text
                      style={[
                        styles.requirementSubTextMissing,
                        { marginBottom: 12 },
                      ]}
                    >
                      View Satisfied Requirements
                  </Text>
                  </TouchableOpacity>
                </React.Fragment>
              ) : this.state.concentration_2_duplicate !== "" ? (
                <Text
                  style={{
                    color: "#4E342E",
                    fontWeight: "600",
                    fontStyle: "italic",
                    marginBottom: 20,
                  }}
                >
                  You Have Not Indicated That Any Of Your Courses Are
                  Concentration Requirements
                </Text>
              ) : null}
          </View>
          {this.state.errorMessageVisible ? (
            <React.Fragment>
              <Text style={styles.errorMessage}>
                <Icon name="ios-warning" color="#ffae42" size={18} /> {"\n"}
                An A.B. concentration is assumed to require 12 credits while an
                Sc.B. concentration is assumed to require 17 credits. Head to
                "Edit Profile" to customize the required credits for your
                specific concentration. An upcoming feature would be to
                automatically display the required number of credits based on
                your chosen concentration.
              </Text>
              <TouchableOpacity
                onPress={() => this.setState({ errorMessageVisible: false })}
              >
                <Text
                  style={[
                    styles.errorMessageDismiss,
                    { fontWeight: "600", fontStyle: "italic" },
                  ]}
                >
                  Click Here To Dismiss
                </Text>
              </TouchableOpacity>
            </React.Fragment>
          ) : null}
          {/* <AdMobBanner
            style={styles.banner1}
            bannerSize="largeBanner"
            adUnitID="ca-app-pub-3940256099942544/6300978111"
            testDeviceID="EMULATOR"
          /> */}
          {/* <this.AddSemesterModal></this.AddSemesterModal> */}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    color: "#fafafa",
    fontWeight: "700",
    letterSpacing: 1,
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
    textAlign: "center",
  },
  errorMessage: {
    marginTop: 5,
    marginBottom: 10,
    width: 0.85 * Dimensions.get("window").width,
    color: "#ffae42",
    fontSize: 13,
  },
  errorMessageDismiss: {
    color: "#ffae42",
    fontSize: 13,
    marginBottom: 20,
  },
  requirementHeader: {
    fontSize: 24,
    marginTop: 30,
    marginBottom: 10,
    color: "#757575",
    fontWeight: "800",
  },
  requirementSubHeader: {
    fontSize: 24,
    marginBottom: 10,
    color: "#757575",
    fontWeight: "800",
    fontStyle: "italic",
  },
  requirementSubHeader2: {
    fontSize: 24,
    marginBottom: 10,
    color: "#757575",
    fontWeight: "800",
    fontStyle: "italic",
    marginTop: 15,
  },
  requirementSubText: {
    marginTop: 7,
    color: "#757575",
    fontWeight: "800",
    textAlign: "right",
  },
  requirementSubTextMissing: {
    marginTop: 7,
    color: "#757575",
    fontWeight: "800",
    textAlign: "right",
    textDecorationLine: "underline",
  },
  banner1: {
    alignContent: "center",
    alignItems: "center",
    marginBottom: 20,
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

const CreateProfileButton = ({ onPress, title }) => (
  <TouchableOpacity
    onPress={onPress}
    style={addSemesterModalStyles.createProfileButtonContainer}
    activeOpacity={0.6}
  >
    <Text style={addSemesterModalStyles.createProfileButtonText}>{title}</Text>
  </TouchableOpacity>
);

export default RequirementsScreen;
