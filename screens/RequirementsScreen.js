import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Header } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "react-navigation-drawer";
import * as Progress from "react-native-progress";

import firebase from "firebase";
import "firebase/firestore";
import { AdMobBanner } from "expo-ads-admob";

import DepartmentsWithAreasOfStudy from "./../data/DepartmentsWithAreasOfStudy";

import Icon from "react-native-vector-icons/Ionicons";
import { ScrollView } from "react-native-gesture-handler";

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
      totalConcentrationOneReq: null,
      totalConcentrationTwoReq: null,
      totalWRITReq: null,
      totalRequiredCourses: 30,
      totalConcentrationOneRequiredCourses: 12,
      totalConcentrationTwoRequiredCourses: 12,
      totalWRITRequiredCourses: 2,
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
  // calls on getProgressRingData
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
            this.getProgressRingData();
          });
        } else {
          console.log("no data accquired");
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

  /*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––PROGRESS RINGS BEGIN–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

  getProgressRingData = () => {
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
            console.log("no data acquired");
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
            <Text style={styles.requirementHeader}>Concentrations(s):</Text>
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
              <TouchableOpacity>
                <Text style={styles.requirementSubTextMissing}>
                  View Missing Requirements
                </Text>
              </TouchableOpacity>
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
              <TouchableOpacity>
                <Text style={styles.requirementSubTextMissing}>
                  View Missing Requirements
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <Text style={styles.errorMessage}>
            <Icon name="ios-warning" color="#ffae42" size={18} /> An A.B.
            concentration is assumed to require 12 credits while an Sc.B.
            concentration is assumed to require 17 credits. An upcoming feature
            would be to update credit requirements specific to each
            concentration.
          </Text>
          <AdMobBanner
            style={styles.banner1}
            bannerSize="largeBanner"
            adUnitID="ca-app-pub-3940256099942544/6300978111"
            testDeviceID="EMULATOR"
          />
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
    marginTop: 20,
    marginBottom: 20,
    width: 0.85 * Dimensions.get("window").width,
    color: "#ffae42",
    fontSize: 13,
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

export default RequirementsScreen;
