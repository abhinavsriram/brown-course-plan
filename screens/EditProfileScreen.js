import React, { Component } from "react";
import {
  Dimensions,
  Image,
  Picker,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import UserPermissions from "./../utilities/UserPermissions.js";
import * as ImagePicker from "expo-image-picker";
import { DrawerActions } from "react-navigation-drawer";

import Icon from "react-native-vector-icons/Ionicons";

import completeConcentrationsList from "./../data/ConcentrationsList.js";
import completeSecondConcentrationsList from "./../data/SecondConcentrationsList";
import numberOfReqList from "./../data/NumberOfRequirementsList";

import firebase from "firebase";
import "firebase/firestore";

class EditProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      concentrationPickerValue: "Click to Choose",
      initialConcentrationPickerValue: "Click to Choose",
      concentrationPickerVisible: false,
      concentrationOneReqPickerValue: "N/A",
      initialConcentrationOneReqPickerValue: "N/A",
      concentrationOneReqPickerVisible: false,
      secondConcentrationPickerValue: "Click to Choose",
      initialSecondConcentrationPickerValue: "Click to Choose",
      secondConcentrationPickerVisible: false,
      concentrationTwoReqPickerValue: "N/A",
      initialConcentrationTwoReqPickerValue: "N/A",
      concentrationTwoReqPickerVisible: false,
      degreePickerValue: "Click to Choose",
      degreePickerVisible: false,
      classYearPickerValue: "Click to Choose",
      classYearPickerVisible: false,
      semesterLevelPickerValue: "Click to Choose",
      semesterLevelPickerVisible: false,
      userID: "",
      profilePicture: "./../assets/dp-placeholder.jpg",
      semestersList: null,
      dataChanged: false,
    };
  }

  // called when component mounts
  // calls on one methods that is integral to displaying information
  getUserID = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const email = user.email;
        const userID = email.split("@")[0];
        this.setState({ userID: userID }, () => {
          this.pullFromDatabase();
        });
      }
    });
  };

  // called after acquiring userID
  // pulls all details from database
  pullFromDatabase = () => {
    firebase
      .firestore()
      .collection("user-information")
      .doc(this.state.userID)
      .get()
      .then((doc) => {
        if (doc.exists) {
          // if (doc.data().concentration !== "Yet To Declare") {
          this.setState({
            concentrationPickerValue: doc.data().concentration,
          });
          this.setState({
            initialConcentrationPickerValue: doc.data().concentration,
          });
          // }
          // if (doc.data().second_concentration !== "Yet To Declare") {
          this.setState({
            secondConcentrationPickerValue: doc.data().second_concentration,
          });
          this.setState({
            initialSecondConcentrationPickerValue: doc.data()
              .second_concentration,
          });
          // }
          if (doc.data().concentration === undefined) {
            this.setState({ concentrationPickerValue: "Click to Choose" });
          }
          if (doc.data().second_concentration === undefined) {
            this.setState({
              secondConcentrationPickerValue: "Click to Choose",
            });
          }
          if (
            !(
              doc.data().concentration === "Yet To Declare" ||
              doc.data().concentration === "Click to Choose" ||
              doc.data().concentration === undefined
            )
          ) {
            if (doc.data().concentration_1_req === undefined) {
              if (doc.data().concentration.split(" - ")[1].charAt(0) === "S") {
                this.setState({ concentrationOneReqPickerValue: "17 " });
                this.setState({ initialConcentrationOneReqPickerValue: "17" });
              } else if (
                doc.data().concentration.split(" - ")[1].charAt(0) === "A"
              ) {
                this.setState({ concentrationOneReqPickerValue: "12" });
                this.setState({ initialConcentrationOneReqPickerValue: "12" });
              } else {
                this.setState({ concentrationOneReqPickerValue: "N/A" });
                this.setState({ initialConcentrationOneReqPickerValue: "N/A" });
              }
            } else {
              this.setState({
                concentrationOneReqPickerValue: doc.data().concentration_1_req,
              });
              this.setState({
                initialConcentrationOneReqPickerValue: doc.data()
                  .concentration_1_req,
              });
            }
          } else {
            this.setState({ concentrationOneReqPickerValue: "N/A" });
            this.setState({ initialConcentrationOneReqPickerValue: "N/A" });
          }

          if (
            !(
              doc.data().second_concentration === "Yet To Declare" ||
              doc.data().second_concentration === "Not Declaring" ||
              doc.data().second_concentration === "Click to Choose" ||
              doc.data().second_concentration === undefined
            )
          ) {
            if (doc.data().concentration_2_req === undefined) {
              if (
                doc.data().second_concentration.split(" - ")[1].charAt(0) ===
                "S"
              ) {
                this.setState({ concentrationTwoReqPickerValue: "17" });
                this.setState({ initialConcentrationTwoReqPickerValue: "17" });
              } else if (
                doc.data().second_concentration.split(" - ")[1].charAt(0) ===
                "A"
              ) {
                this.setState({ concentrationTwoReqPickerValue: "12" });
                this.setState({ initialConcentrationTwoReqPickerValue: "12" });
              } else {
                this.setState({ concentrationTwoReqPickerValue: "N/A" });
                this.setState({ initialConcentrationTwoReqPickerValue: "N/A" });
              }
            } else {
              this.setState({
                concentrationTwoReqPickerValue: doc.data().concentration_2_req,
              });
              this.setState({
                initialConcentrationTwoReqPickerValue: doc.data()
                  .concentration_2_req,
              });
            }
          } else {
            this.setState({ concentrationTwoReqPickerValue: "N/A" });
            this.setState({ initialConcentrationTwoReqPickerValue: "N/A" });
          }
          this.setState({ degreePickerValue: doc.data().degree });
          this.setState({ classYearPickerValue: doc.data().class_year });
          this.setState({
            semesterLevelPickerValue: doc.data().semester_level,
          });
          this.setState({ profilePicture: doc.data().profile_picture_url });
        } else {
          console.log("no data accquired");
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  componentDidMount() {
    this.getUserID();
    this.props.navigation.addListener("willFocus", () => this.getUserID());
  }

  determineNumberOfReq1 = (concentrationOne) => {
    if (
      !(
        concentrationOne === "Yet To Declare" ||
        concentrationOne === "Click to Choose"
      )
    ) {
      if (concentrationOne.split(" - ")[1].charAt(0) === "S") {
        this.setState({ concentrationOneReqPickerValue: "17" });
      } else if (concentrationOne.split(" - ")[1].charAt(0) === "A") {
        this.setState({ concentrationOneReqPickerValue: "12" });
      } else {
        this.setState({ concentrationOneReqPickerValue: "N/A" });
      }
    } else {
      this.setState({ concentrationOneReqPickerValue: "N/A" });
    }
  };

  determineNumberOfReq2 = (concentrationTwo) => {
    if (
      !(
        concentrationTwo === "Yet To Declare" ||
        concentrationTwo === "Not Declaring" ||
        concentrationTwo === "Click to Choose"
      )
    ) {
      if (concentrationTwo.split(" - ")[1].charAt(0) === "S") {
        this.setState({ concentrationTwoReqPickerValue: "17" });
      } else if (concentrationTwo.split(" - ")[1].charAt(0) === "A") {
        this.setState({ concentrationTwoReqPickerValue: "12" });
      } else {
        this.setState({ concentrationTwoReqPickerValue: "N/A" });
      }
    } else {
      this.setState({ concentrationTwoReqPickerValue: "N/A" });
    }
  };

  // custom method that takes in 2 params
  // it determines the degree based on chosen concentrations
  determineDegree = (concentrationOne, concentrationTwo) => {
    var concentrationOneDegree;
    var concentrationTwoDegree;
    if (
      !(
        concentrationOne === "Yet To Declare" ||
        concentrationOne === "Click to Choose"
      )
    ) {
      concentrationOneDegree = concentrationOne.split(" - ")[1].charAt(0);
    }
    if (
      !(
        concentrationTwo === "Yet To Declare" ||
        concentrationTwo === "Not Declaring" ||
        concentrationTwo === "Click to Choose"
      )
    ) {
      concentrationTwoDegree = concentrationTwo.split(" - ")[1].charAt(0);
    }
    if (concentrationOneDegree === "S" || concentrationTwoDegree === "S") {
      this.setState({ degreePickerValue: "Sc.B." });
    } else if (
      concentrationOneDegree === "A" ||
      concentrationTwoDegree === "A"
    ) {
      this.setState({ degreePickerValue: "A.B." });
    } else {
      this.setState({ degreePickerValue: "Yet To Declare" });
    }
  };

  ShowHideConcentrationPicker = () => {
    if (this.state.concentrationPickerVisible == true) {
      this.setState({ concentrationPickerVisible: false });
    } else {
      this.setState({ concentrationPickerVisible: true });
    }
    this.setState({ degreePickerVisible: false });
    this.setState({ classYearPickerVisible: false });
    this.setState({ semesterLevelPickerVisible: false });
    this.setState({ secondConcentrationPickerVisible: false });
    this.setState({ concentrationOneReqPickerVisible: false });
    this.setState({ concentrationTwoReqPickerVisible: false });
  };

  ShowHideConcentrationReqPicker = () => {
    if (this.state.concentrationOneReqPickerVisible == true) {
      this.setState({ concentrationOneReqPickerVisible: false });
    } else {
      this.setState({ concentrationOneReqPickerVisible: true });
    }
    this.setState({ concentrationPickerVisible: false });
    this.setState({ degreePickerVisible: false });
    this.setState({ classYearPickerVisible: false });
    this.setState({ semesterLevelPickerVisible: false });
    this.setState({ secondConcentrationPickerVisible: false });
    this.setState({ concentrationTwoReqPickerVisible: false });
  };

  ShowHideSecondConcentrationPicker = () => {
    if (this.state.secondConcentrationPickerVisible == true) {
      this.setState({ secondConcentrationPickerVisible: false });
    } else {
      this.setState({ secondConcentrationPickerVisible: true });
    }
    this.setState({ concentrationPickerVisible: false });
    this.setState({ degreePickerVisible: false });
    this.setState({ classYearPickerVisible: false });
    this.setState({ concentrationOneReqPickerVisible: false });
    this.setState({ concentrationTwoReqPickerVisible: false });
    this.setState({ semesterLevelPickerVisible: false });
  };

  ShowHideSecondConcentrationReqPicker = () => {
    if (this.state.concentrationTwoReqPickerVisible == true) {
      this.setState({ concentrationTwoReqPickerVisible: false });
    } else {
      this.setState({ concentrationTwoReqPickerVisible: true });
    }
    this.setState({ degreePickerVisible: false });
    this.setState({ classYearPickerVisible: false });
    this.setState({ semesterLevelPickerVisible: false });
    this.setState({ secondConcentrationPickerVisible: false });
  };

  ShowHideDegreePicker = () => {
    if (this.state.degreePickerVisible == true) {
      this.setState({ degreePickerVisible: false });
    } else {
      this.setState({ degreePickerVisible: true });
    }
    this.setState({ concentrationPickerVisible: false });
    this.setState({ classYearPickerVisible: false });
    this.setState({ semesterLevelPickerVisible: false });
    this.setState({ secondConcentrationPickerVisible: false });
  };

  ShowHideClassYearPicker = () => {
    if (this.state.classYearPickerVisible == true) {
      this.setState({ classYearPickerVisible: false });
    } else {
      this.setState({ classYearPickerVisible: true });
    }
    this.setState({ degreePickerVisible: false });
    this.setState({ concentrationPickerVisible: false });
    this.setState({ semesterLevelPickerVisible: false });
    this.setState({ secondConcentrationPickerVisible: false });
  };

  ShowHideSemesterLevelPicker = () => {
    if (this.state.semesterLevelPickerVisible == true) {
      this.setState({ semesterLevelPickerVisible: false });
    } else {
      this.setState({ semesterLevelPickerVisible: true });
    }
    this.setState({ degreePickerVisible: false });
    this.setState({ classYearPickerVisible: false });
    this.setState({ concentrationPickerVisible: false });
    this.setState({ secondConcentrationPickerVisible: false });
  };

  defaultConcentration = () => {
    if (
      this.state.concentrationPickerValue === "Click to Choose" ||
      this.state.concentrationPickerValue === undefined
    ) {
      this.setState({ concentrationPickerValue: "Yet To Declare" });
    }
    if (this.state.concentrationPickerValue === "Yet To Declare") {
      this.setState({ secondConcentrationPickerValue: "Yet To Declare" });
      this.setState({ degreePickerValue: "Yet To Declare" });
      this.setState({ concentrationTwoReqPickerValue: "N/A" });
    }
  };

  defaultSecondConcentration = () => {
    if (
      this.state.secondConcentrationPickerValue === "Click to Choose" ||
      this.state.concentrationPickerValue === undefined
    ) {
      this.setState({ secondConcentrationPickerValue: "Yet To Declare" });
    }
    // if (this.state.concentrationPickerValue === "Yet To Declare") {
    //   this.setState({ secondConcentrationPickerValue: "Click to Choose" });
    //   this.setState({ degreePickerValue: "Click to Choose" });
    // }
  };

  defaultDegree = () => {
    if (this.state.degreePickerValue === "Click to Choose") {
      this.setState({ degreePickerValue: "Yet To Declare" });
    }
  };

  defaultClassYear = () => {
    if (this.state.classYearPickerValue === "Click to Choose") {
      this.setState({ classYearPickerValue: "2021" });
    }
  };

  defaultSemesterLevel = () => {
    if (this.state.semesterLevelPickerValue === "Click to Choose") {
      this.setState({ semesterLevelPickerValue: "S01" });
    }
    if (this.state.semesterLevelPickerValue === "S0NaN") {
      this.setState({ semesterLevelPickerValue: "S01" });
    }
  };

  // lets the user choose a custom dp from their camera roll
  handlePickProfilePicture = async () => {
    UserPermissions.getCameraPermission();

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      this.setState({ profilePicture: result.uri });
    }
  };

  // when user hits done, chosen information is written to database
  writeToDatabase = () => {
    this.setState({ dataChanged: true });
    firebase
      .firestore()
      .collection("user-information")
      .doc(this.state.userID)
      .update({
        concentration: this.state.concentrationPickerValue,
        concentration_1_req:
          this.state.concentrationOneReqPickerValue === "N/A"
            ? this.state.concentrationOneReqPickerValue
            : this.state.concentrationOneReqPickerValue,
        second_concentration: this.state.secondConcentrationPickerValue,
        concentration_2_req:
          this.state.concentrationTwoReqPickerValue === "N/A"
            ? this.state.concentrationTwoReqPickerValue
            : this.state.concentrationTwoReqPickerValue,
        degree: this.state.degreePickerValue,
        class_year: this.state.classYearPickerValue,
        semester_level: this.state.semesterLevelPickerValue,
        profile_picture_url: this.state.profilePicture,
      });
  };

  navigateToNextScreen = () => {
    if (
      this.state.concentrationPickerValue !== "Click to Choose" &&
      this.state.degreePickerValue !== "Click to Choose" &&
      this.state.classYearPickerValue !== "Click to Choose" &&
      this.state.semesterLevelPickerValue !== "Click to Choose"
    ) {
      this.writeToDatabase();
      if (
        this.state.concentrationPickerValue !==
        this.state.initialConcentrationPickerValue
      ) {
        this.resetDatabase(true, false);
      }
      if (
        this.state.secondConcentrationPickerValue !==
        this.state.initialSecondConcentrationPickerValue
      ) {
        this.resetDatabase(false, true);
      }
      this.props.navigation.navigate("TabNavigator");
      this.props.navigation.dispatch(DrawerActions.openDrawer());
    } else {
      alert("Please Choose All Values");
    }
  };

  resetDatabase = (resetConcentration1, resetConcentration2) => {
    firebase
      .firestore()
      .collection("user-information")
      .doc(this.state.userID)
      .collection("course-information")
      .doc("Semesters List")
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.setState({ semestersList: doc.data()["semestersList"] });
          let allCourses = [];
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
                  allCourses.push(doc.data());
                  for (let i = 0; i < allCourses.length; i++) {
                    for (
                      let j = 0;
                      j < Object.keys(allCourses[i]).length;
                      j++
                    ) {
                      if (
                        resetConcentration1 &&
                        this.getPropertyByIndex(allCourses[i], j)
                      ) {
                        firebase
                          .firestore()
                          .collection("user-information")
                          .doc(this.state.userID)
                          .collection("course-information")
                          .doc(this.state.semestersList[i])
                          .set(
                            {
                              [this.getPropertyByIndex(allCourses[i], j)[
                                "course_code"
                              ]]: { concentration_1_requirement: false },
                            },
                            { merge: true }
                          );
                      }
                      if (
                        resetConcentration2 &&
                        this.getPropertyByIndex(allCourses[i], j)
                      ) {
                        firebase
                          .firestore()
                          .collection("user-information")
                          .doc(this.state.userID)
                          .collection("course-information")
                          .doc(this.state.semestersList[i])
                          .set(
                            {
                              [this.getPropertyByIndex(allCourses[i], j)[
                                "course_code"
                              ]]: { concentration_2_requirement: false },
                            },
                            { merge: true }
                          );
                      }
                    }
                  }
                }
              });
          }
        }
      });
  };

  getPropertyByIndex = (obj, index) => {
    return obj[Object.keys(obj)[index]];
  };

  render() {
    return (
      <React.Fragment>
        <View style={styles.wrapContainer}>
          <ScrollView
            contentContainerStyle={profileStyles.container}
            ref={(node) => (this.scroll = node)}
            scrollEnabled={false}
          >
            {/* /*–––––––––––––––––––––––––BACK BUTTON–––––––––––––––––––––––––*/}
            <TouchableOpacity
              style={styles.backArrow}
              onPress={() => {
                if (true) {
                  Alert.alert(
                    "Changes Not Saved",
                    "Are you sure you want to exit without saving your changes to your profile?",
                    [
                      {
                        text: "Exit",
                        style: "destructive",
                        onPress: () => {
                          this.props.navigation.navigate("UserProfileScreen");
                        },
                      },
                      {
                        text: "Go Back",
                      },
                    ],
                    { cancelable: false }
                  );
                } else {
                  this.props.navigation.dispatch(DrawerActions.openDrawer());
                }
              }}
            >
              <Icon name="ios-arrow-dropleft" color="#fafafa" size={40} />
            </TouchableOpacity>
            <Text style={styles.title}>Edit Profile</Text>
            {/* /*–––––––––––––––––––––––––PROFILE PICTURE–––––––––––––––––––––––––*/}
            <View style={styles.profilePictureContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.profilePicturePlaceholder}
                onPress={this.handlePickProfilePicture}
              >
                {this.state.profilePicture ===
                "./../assets/dp-placeholder.jpg" ? (
                  <Image
                    source={require("./../assets/dp-placeholder.jpg")}
                    style={styles.profilePicture}
                  ></Image>
                ) : (
                  <Image
                    source={{ uri: this.state.profilePicture }}
                    style={styles.profilePicture}
                  ></Image>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.changeProfilePictureContainer}
                onPress={this.handlePickProfilePicture}
              >
                <Text style={styles.changeProfilePictureText}>
                  Change Profile Picture
                </Text>
              </TouchableOpacity>
            </View>
            {/* /*–––––––––––––––––––––––––FORM 1 - CONCENTRATION–––––––––––––––––––––––––*/}
            <View style={profileStyles.form1}>
              <View style={{ flexDirection: "row" }}>
                <Text style={profileStyles.inputTitle}>Concentration</Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[profileStyles.inputTitle, { textAlign: "right" }]}
                  >
                    Credits
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={profileStyles.chooseConcentration}
                  onPress={() => {
                    this.ShowHideConcentrationPicker();
                    this.scroll.scrollTo({ y: 500 });
                  }}
                >
                  <Text
                    style={{
                      color: "#fafafa",
                      fontSize: 13,
                    }}
                  >
                    {this.state.concentrationPickerValue}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: "5%" }}></TouchableOpacity>
                <TouchableOpacity
                  style={profileStyles.chooseConcentrationReq}
                  onPress={() => {
                    this.ShowHideConcentrationReqPicker();
                    this.scroll.scrollTo({ y: 500 });
                  }}
                >
                  <Text
                    style={{
                      color: "#fafafa",
                      fontSize: 13,
                    }}
                  >
                    {this.state.concentrationOneReqPickerValue}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* /*–––––––––––––––––––––––––CONCENTRATION PICKER–––––––––––––––––––––––––*/}
            {this.state.concentrationPickerVisible ? (
              <React.Fragment>
                <Picker
                  style={profileStyles.concentrationPicker}
                  selectedValue={this.state.concentrationPickerValue}
                  onValueChange={(itemValue) => {
                    this.setState({ concentrationPickerValue: itemValue });
                  }}
                  itemStyle={{ color: "#fafafa", borderColor: "#fafafa" }}
                >
                  {completeConcentrationsList.map((concentration, index) => {
                    return (
                      <Picker.Item
                        key={index}
                        label={concentration}
                        value={concentration}
                      ></Picker.Item>
                    );
                  })}
                </Picker>
                <TouchableOpacity
                  style={profileStyles.cancelButton}
                  onPress={() => {
                    this.ShowHideConcentrationPicker();
                    this.determineDegree(
                      this.state.concentrationPickerValue,
                      this.state.secondConcentrationPickerValue
                    );
                    this.determineNumberOfReq1(
                      this.state.concentrationPickerValue
                    );
                    this.defaultConcentration();
                  }}
                >
                  <Text style={profileStyles.cancelButtonText}>DONE</Text>
                </TouchableOpacity>
              </React.Fragment>
            ) : null}
            {this.state.concentrationOneReqPickerVisible ? (
              <React.Fragment>
                <Picker
                  style={profileStyles.concentrationPicker}
                  selectedValue={this.state.concentrationOneReqPickerValue}
                  onValueChange={(itemValue) => {
                    this.setState({
                      concentrationOneReqPickerValue: itemValue,
                    });
                  }}
                  itemStyle={{ color: "#fafafa", borderColor: "#fafafa" }}
                >
                  {numberOfReqList.map((numberOfReq, index) => {
                    return (
                      <Picker.Item
                        key={index}
                        label={numberOfReq}
                        value={numberOfReq}
                      ></Picker.Item>
                    );
                  })}
                </Picker>
                <TouchableOpacity
                  style={profileStyles.cancelButton}
                  onPress={() => {
                    this.ShowHideConcentrationReqPicker();
                    // this.determineDegree(
                    //   this.state.concentrationPickerValue,
                    //   this.state.secondConcentrationPickerValue
                    // );
                    // this.defaultConcentration();
                  }}
                >
                  <Text style={profileStyles.cancelButtonText}>DONE</Text>
                </TouchableOpacity>
              </React.Fragment>
            ) : null}
            {/* /*–––––––––––––––––––––––––SECOND CONCENTRATION–––––––––––––––––––––––––*/}
            {/* /*–––––––––––––––––––––––––FORM 12 - CONCENTRATION–––––––––––––––––––––––––*/}
            <View style={profileStyles.form12}>
              <View style={{ flexDirection: "row" }}>
                <Text style={profileStyles.inputTitle}>
                  Second Concentration
                </Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[profileStyles.inputTitle, { textAlign: "right" }]}
                  >
                    Credits
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={profileStyles.chooseConcentration}
                  onPress={() => {
                    this.ShowHideSecondConcentrationPicker();
                    this.scroll.scrollTo({ y: 500 });
                  }}
                >
                  <Text
                    style={{
                      color: "#fafafa",
                      fontSize: 13,
                    }}
                  >
                    {this.state.secondConcentrationPickerValue}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: "5%" }}></TouchableOpacity>
                <TouchableOpacity
                  style={profileStyles.chooseConcentrationReq}
                  onPress={() => {
                    this.ShowHideSecondConcentrationReqPicker();
                    this.scroll.scrollTo({ y: 500 });
                  }}
                >
                  <Text
                    style={{
                      color: "#fafafa",
                      fontSize: 13,
                    }}
                  >
                    {this.state.concentrationTwoReqPickerValue}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* /*–––––––––––––––––––––––––SECOND CONCENTRATION PICKER–––––––––––––––––––––––––*/}
            {this.state.secondConcentrationPickerVisible ? (
              <React.Fragment>
                <Picker
                  style={profileStyles.concentrationPicker}
                  selectedValue={this.state.secondConcentrationPickerValue}
                  onValueChange={(itemValue) => {
                    this.setState({
                      secondConcentrationPickerValue: itemValue,
                    });
                  }}
                  itemStyle={{ color: "#fafafa", borderColor: "#fafafa" }}
                >
                  {completeSecondConcentrationsList.map(
                    (concentration, index) => {
                      return (
                        <Picker.Item
                          key={index}
                          label={concentration}
                          value={concentration}
                        ></Picker.Item>
                      );
                    }
                  )}
                </Picker>
                <TouchableOpacity
                  style={profileStyles.cancelButton}
                  onPress={() => {
                    this.ShowHideSecondConcentrationPicker();
                    this.determineDegree(
                      this.state.concentrationPickerValue,
                      this.state.secondConcentrationPickerValue
                    );
                    this.determineNumberOfReq2(
                      this.state.secondConcentrationPickerValue
                    );
                    this.defaultConcentration();
                    // this.defaultSecondConcentration();
                  }}
                >
                  <Text style={profileStyles.cancelButtonText}>DONE</Text>
                </TouchableOpacity>
              </React.Fragment>
            ) : null}
            {this.state.concentrationTwoReqPickerVisible ? (
              <React.Fragment>
                <Picker
                  style={profileStyles.concentrationPicker}
                  selectedValue={this.state.concentrationTwoReqPickerValue}
                  onValueChange={(itemValue) => {
                    this.setState({
                      concentrationTwoReqPickerValue: itemValue,
                    });
                  }}
                  itemStyle={{ color: "#fafafa", borderColor: "#fafafa" }}
                >
                  {numberOfReqList.map((numberOfReq, index) => {
                    return (
                      <Picker.Item
                        key={index}
                        label={numberOfReq}
                        value={numberOfReq}
                      ></Picker.Item>
                    );
                  })}
                </Picker>
                <TouchableOpacity
                  style={profileStyles.cancelButton}
                  onPress={() => {
                    this.ShowHideSecondConcentrationReqPicker();
                    // this.determineDegree(
                    //   this.state.concentrationPickerValue,
                    //   this.state.secondConcentrationPickerValue
                    // );
                    // this.defaultConcentration();
                  }}
                >
                  <Text style={profileStyles.cancelButtonText}>DONE</Text>
                </TouchableOpacity>
              </React.Fragment>
            ) : null}
            {/* /*–––––––––––––––––––––––––FORM 2 - DEGREE–––––––––––––––––––––––––*/}
            <View style={profileStyles.form2}>
              <Text style={profileStyles.inputTitle}>Degree</Text>
              <TouchableOpacity
                style={profileStyles.chooseConcentration}
                onPress={this.ShowHideDegreePicker}
              >
                <Text
                  style={{
                    color: "#fafafa",
                    fontSize: 13,
                  }}
                >
                  {this.state.degreePickerValue}
                </Text>
              </TouchableOpacity>
            </View>
            {/* /*–––––––––––––––––––––––––DEGREE PICKER–––––––––––––––––––––––––*/}
            {this.state.degreePickerVisible ? (
              <React.Fragment>
                <Picker
                  style={profileStyles.concentrationPicker}
                  selectedValue={this.state.degreePickerValue}
                  onValueChange={(itemValue) => {
                    this.setState({ degreePickerValue: itemValue });
                  }}
                  itemStyle={{ color: "#fafafa", borderColor: "#fafafa" }}
                >
                  <Picker.Item
                    label="Yet To Declare"
                    value="Yet To Declare"
                  ></Picker.Item>
                  <Picker.Item label="A.B." value="A.B."></Picker.Item>
                  <Picker.Item label="Sc.B." value="Sc.B."></Picker.Item>
                </Picker>
                <TouchableOpacity
                  style={profileStyles.cancelButton}
                  onPress={() => {
                    this.ShowHideDegreePicker();
                    this.determineDegree(
                      this.state.concentrationPickerValue,
                      this.state.secondConcentrationPickerValue
                    );
                    this.defaultDegree();
                  }}
                >
                  <Text style={profileStyles.cancelButtonText}>DONE</Text>
                </TouchableOpacity>
              </React.Fragment>
            ) : null}
            {/* /*–––––––––––––––––––––––––FORM 3 - CLASS YEAR–––––––––––––––––––––––––*/}
            <View style={profileStyles.form3}>
              <Text style={profileStyles.inputTitle}>Class Year</Text>
              <TouchableOpacity
                style={profileStyles.chooseConcentration}
                onPress={this.ShowHideClassYearPicker}
              >
                <Text
                  style={{
                    textTransform: "capitalize",
                    color: "#fafafa",
                    fontSize: 13,
                  }}
                >
                  {this.state.classYearPickerValue}
                </Text>
              </TouchableOpacity>
            </View>
            {/* /*–––––––––––––––––––––––––CLASS YEAR PICKER–––––––––––––––––––––––––*/}
            {this.state.classYearPickerVisible ? (
              <React.Fragment>
                <Picker
                  style={profileStyles.concentrationPicker}
                  selectedValue={this.state.classYearPickerValue}
                  onValueChange={(itemValue) => {
                    this.setState({ classYearPickerValue: itemValue });
                  }}
                  itemStyle={{ color: "#fafafa", borderColor: "#fafafa" }}
                >
                  <Picker.Item label="2021" value="2021"></Picker.Item>
                  <Picker.Item label="2022" value="2022"></Picker.Item>
                  <Picker.Item label="2023" value="2023"></Picker.Item>
                  <Picker.Item label="2024" value="2024"></Picker.Item>
                </Picker>
                <TouchableOpacity
                  style={profileStyles.cancelButton}
                  onPress={() => {
                    this.ShowHideClassYearPicker();
                  }}
                >
                  <Text style={profileStyles.cancelButtonText}>DONE</Text>
                </TouchableOpacity>
              </React.Fragment>
            ) : null}
          </ScrollView>
          {/* /*–––––––––––––––––––––––––LET'S GO BUTTON–––––––––––––––––––––––––*/}
          <CustomButton
            title="Done"
            onPress={() => {
              this.navigateToNextScreen();
            }}
          ></CustomButton>
        </View>
      </React.Fragment>
    );
  }
}

/*–––––––––––––––––––––––––CUSTOM BUTTON COMPONENT–––––––––––––––––––––––––*/
const CustomButton = ({ onPress, title }) => (
  <TouchableOpacity
    onPress={onPress}
    style={profileStyles.customButtonContainer}
    activeOpacity={0.8}
  >
    <Text style={profileStyles.customButtonText}>{title}</Text>
  </TouchableOpacity>
);

// styling for the whole screen in general
const styles = StyleSheet.create({
  wrapContainer: {
    backgroundColor: "#E53935",
    flex: 1,
  },
  container: {
    backgroundColor: "#E53935",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#fafafa",
    fontWeight: "bold",
    alignSelf: "center",
    fontSize: 40,
    position: "absolute",
    top: "8%",
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
  customButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
    borderRadius: 15,
    paddingVertical: 17,
    paddingHorizontal: 12,
    width: "80%",
    position: "absolute",
    bottom: 40,
  },
  customButtonText: {
    fontSize: 18,
    color: "#E53935",
    fontWeight: "bold",
    alignSelf: "center",
  },
  profilePictureContainer: {
    position: "absolute",
    top: "16.5%",
    justifyContent: "center",
    alignItems: "center",
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePicturePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fafafa",
    justifyContent: "center",
    alignItems: "center",
  },
  changeProfilePictureContainer: {
    position: "absolute",
    top: "110%",
    width: 150,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  changeProfilePictureText: {
    color: "#fafafa",
    fontSize: 12,
    fontWeight: "500",
  },
  backArrow: {
    position: "absolute",
    top: "6%",
    left: "6%",
  },
});

// styling for all the forms/pickers
const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E53935",
    alignItems: "center",
    justifyContent: "center",
  },
  form1: {
    position: "absolute",
    top: "38%",
    width: 0.8 * Dimensions.get("window").width,
  },
  form12: {
    position: "absolute",
    top: "50%",
    width: 0.8 * Dimensions.get("window").width,
  },
  form2: {
    position: "absolute",
    top: "62%",
    width: 0.8 * Dimensions.get("window").width,
  },
  form3: {
    position: "absolute",
    top: "74%",
    width: 0.8 * Dimensions.get("window").width,
  },
  form4: {
    position: "absolute",
    top: "86%",
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
  customButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
    borderRadius: 15,
    paddingVertical: 17,
    paddingHorizontal: 12,
    width: "80%",
    position: "absolute",
    bottom: 40,
    zIndex: 3,
    left: "10%",
  },
  customButtonText: {
    fontSize: 18,
    color: "#E53935",
    fontWeight: "bold",
    alignSelf: "center",
  },
  chooseConcentration: {
    borderBottomColor: "#fafafa",
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: "80%",
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  chooseConcentrationReq: {
    borderBottomColor: "#fafafa",
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: "16%",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  concentrationPicker: {
    position: "absolute",
    top: "53%",
    width: "82%",
    backgroundColor: "#E53935",
    zIndex: 1,
    height: 250,
    borderColor: "#fafafa",
  },
  cancelButton: {
    position: "absolute",
    top: "53%",
    right: 28,
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
});

export default EditProfileScreen;
