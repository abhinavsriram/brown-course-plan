import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Alert,
  Switch,
  Modal,
} from "react-native";

import { Header } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";

import { Foundation } from "@expo/vector-icons";

import UserPermissions from "../utilities/UserPermissions.js";
import * as ImagePicker from "expo-image-picker";

import firebase from "firebase";
import "firebase/firestore";

class MyProfileScreenDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      profilePicture: "./../assets/dp-placeholder.jpg",
      name: "",
      aboutMe: "",
      concentration: "",
      currentClasses: "",
      recommendedClassesFall: "",
      recommendedClassesSpring: "",
      currentSemesterData: {},
      currentSemesterCourses: [],
      userData: {
        class_year: "0...",
        first_name: "Loading...",
        last_name: "",
      },
      isAboutMeEnabled: false,
      isEmailEnabled: false,
      isConcentrationEnabled: false,
      isCurrentClassesEnabled: false,
      isClassSchedule1Enabled: false,
      isClassSchedule2Enabled: false,
      isTimeEnabled: false,
      is4YearPlanEnabled: false,
      changesMade: false,
      isPrivacySettingsModalVisible: false,
    };
  }

  getUserID = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const email = user.email;
        const userID = email.split("@")[0];
        this.setState({ email: email });
        this.setState({ userID: userID }, () => {
          this.getUserInformation();
          this.getCurrentSemesterData();
          this.getCurrentSemesterCourses();
        });
      } else {
      }
    });
  };

  getUserInformation = () => {
    firebase
      .firestore()
      .collection("user-information")
      .doc(this.state.userID)
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.setState({ userData: doc.data() }, () => {
            this.setState({
              profilePicture: this.state.userData["profile_picture_url"],
            });
            if (this.state.userData["about_me"]) {
              this.setState({ aboutMe: this.state.userData["about_me"] });
            }
            if (this.state.userData["recommended_fall"]) {
              if (this.state.userData["recommended_fall"] === "") {
                this.setState({
                  recommendedClassesFall: "",
                });
              } else {
                this.setState({
                  recommendedClassesFall: this.state.userData[
                    "recommended_fall"
                  ],
                });
              }
            }
            if (this.state.userData["recommended_spring"]) {
              if (this.state.userData["recommended_spring"] === "") {
                this.setState({
                  recommendedClassesSpring: "",
                });
              } else {
                this.setState({
                  recommendedClassesSpring: this.state.userData[
                    "recommended_spring"
                  ],
                });
              }
            }
            if (this.state.userData["sharing_information"]) {
              this.setState(
                {
                  sharingInformation: this.state.userData[
                    "sharing_information"
                  ],
                },
                () => {
                  if (this.state.sharingInformation[0] !== undefined) {
                    this.setState({
                      isAboutMeEnabled: this.state.sharingInformation[0],
                    });
                  } else {
                    this.setState({
                      isAboutMeEnabled: true,
                    });
                  }
                  if (this.state.sharingInformation[1] !== undefined) {
                    this.setState({
                      isEmailEnabled: this.state.sharingInformation[1],
                    });
                  } else {
                    this.setState({
                      isEmailEnabled: true,
                    });
                  }
                  if (this.state.sharingInformation[2] !== undefined) {
                    this.setState({
                      isConcentrationEnabled: this.state.sharingInformation[2],
                    });
                  } else {
                    this.setState({
                      isConcentrationEnabled: true,
                    });
                  }
                  if (this.state.sharingInformation[3] !== undefined) {
                    this.setState({
                      isCurrentClassesEnabled: this.state.sharingInformation[3],
                    });
                  } else {
                    this.setState({
                      isCurrentClassesEnabled: true,
                    });
                  }
                  if (this.state.sharingInformation[4] !== undefined) {
                    this.setState({
                      isClassSchedule1Enabled: this.state.sharingInformation[4],
                    });
                  } else {
                    this.setState({
                      isClassSchedule1Enabled: true,
                    });
                  }
                  if (this.state.sharingInformation[5] !== undefined) {
                    this.setState({
                      isClassSchedule2Enabled: this.state.sharingInformation[5],
                    });
                  } else {
                    this.setState({
                      isClassSchedule2Enabled: true,
                    });
                  }
                  if (this.state.sharingInformation[6] !== undefined) {
                    this.setState({
                      isTimeEnabled: this.state.sharingInformation[6],
                    });
                  } else {
                    this.setState({
                      isTimeEnabled: true,
                    });
                  }
                  if (this.state.sharingInformation[7] !== undefined) {
                    this.setState({
                      is4YearPlanEnabled: this.state.sharingInformation[7],
                    });
                  } else {
                    this.setState({
                      is4YearPlanEnabled: true,
                    });
                  }
                }
              );
            }
          });
        }
      });
  };

  getPropertyByIndex = (obj, index) => {
    return obj[Object.keys(obj)[index]];
  };

  getCurrentSemesterData = () => {
    firebase
      .firestore()
      .collection("user-information")
      .doc(this.state.userID)
      .collection("course-information")
      .doc("Spring 2020")
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.setState({ currentSemesterData: doc.data() }, () => {
            this.getCurrentSemesterCourses();
          });
        } else {
          this.setState({ currentSemesterData: [] });
        }
      });
  };

  getCurrentSemesterCourses = () => {
    var toReturn = [];
    for (
      var i = 0;
      i < Object.keys(this.state.currentSemesterData).length;
      i++
    ) {
      if (
        !this.getPropertyByIndex(this.state.currentSemesterData, i)["shopping"]
      ) {
        toReturn.push(
          this.getPropertyByIndex(this.state.currentSemesterData, i)[
            "course_code"
          ]
        );
      }
      if (i === Object.keys(this.state.currentSemesterData).length - 1) {
        this.setState({ currentSemesterCourses: toReturn });
      }
    }
  };

  componentDidMount() {
    this.getUserID();
  }

  writeToDatabase = () => {
    let sharingInformation = [
      this.state.isAboutMeEnabled,
      this.state.isEmailEnabled,
      this.state.isConcentrationEnabled,
      this.state.isCurrentClassesEnabled,
      this.state.isClassSchedule1Enabled,
      this.state.isClassSchedule2Enabled,
      this.state.isTimeEnabled,
      this.state.is4YearPlanEnabled,
    ];
    firebase
      .firestore()
      .collection("user-information")
      .doc(this.state.userID)
      .set(
        {
          recommended_fall: this.state.recommendedClassesFall,
          recommended_spring: this.state.recommendedClassesSpring,
          sharing_information: sharingInformation,
          about_me: this.state.aboutMe,
          profile_picture_url: this.state.profilePicture,
        },
        { merge: true }
      );
    this.setState({ changesMade: false });
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
      this.writeToDatabase();
    }
  };

  privacySettingsModal = () => (
    <View style={privacyStyles.container}>
      <Modal visible={this.state.isPrivacySettingsModalVisible}>
        <View style={privacyStyles.container}>
          <Header
            backgroundColor="#4E342E"
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  this.showHidePrivacyModal();
                }}
              >
                <Ionicons name="ios-arrow-back" color="#fafafa" size={35} />
              </TouchableOpacity>
            }
            centerComponent={<Text style={privacyStyles.title}>Privacy</Text>}
          ></Header>
          <View style={{ width: "90%" }}>
            <Text
              style={{
                color: "dimgrey",
                fontWeight: "500",
                fontStyle: "italic",
                padding: 15,
              }}
            >
              This information will be displayed to other users as they look for
              fellow concentrators and study buddies. Use the toggles to choose
              which information you'd like to share.
            </Text>

            <View style={{ marginLeft: 10 }}>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={privacyStyles.attributeContainer1}
                  disabled={true}
                >
                  <Text style={privacyStyles.attributeTextTitle}>
                    About Me:
                  </Text>
                  <Text style={privacyStyles.attributeText} numberOfLines={1}>
                    {this.state.userData["about_me"]}
                  </Text>
                </TouchableOpacity>
                <View style={privacyStyles.switchButton1}>
                  <Switch
                    trackColor={{ false: "#fafafa", true: "#30d158" }}
                    thumbColor={this.state.isAboutMeEnabled ? "#fff" : "#fff"}
                    ios_backgroundColor="#fafafa"
                    onValueChange={(value) => {
                      this.setState({ isAboutMeEnabled: value });
                      this.setState({ changesMade: true });
                    }}
                    value={this.state.isAboutMeEnabled}
                  />
                </View>
              </View>

              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={privacyStyles.attributeContainer}
                  disabled={true}
                >
                  <Text style={privacyStyles.attributeTextTitle}>Contact:</Text>
                  <Text style={privacyStyles.attributeText} numberOfLines={1}>
                    {this.state.userData["email"]}
                  </Text>
                </TouchableOpacity>
                <View style={privacyStyles.switchButton}>
                  <Switch
                    trackColor={{ false: "#fafafa", true: "#30d158" }}
                    thumbColor={this.state.isEmailEnabled ? "#fff" : "#fff"}
                    ios_backgroundColor="#fafafa"
                    onValueChange={(value) => {
                      this.setState({ isEmailEnabled: value });
                      this.setState({ changesMade: true });
                    }}
                    value={this.state.isEmailEnabled}
                  />
                </View>
              </View>

              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={privacyStyles.attributeContainer}
                  disabled={true}
                >
                  <Text style={privacyStyles.attributeTextTitle}>
                    Concentration(s):
                  </Text>
                  <Text style={privacyStyles.attributeText} numberOfLines={1}>
                    {this.state.userData["concentration"]}
                  </Text>
                </TouchableOpacity>
                <View style={privacyStyles.switchButton}>
                  <Switch
                    trackColor={{ false: "#fafafa", true: "#30d158" }}
                    thumbColor={
                      this.state.isConcentrationEnabled ? "#fff" : "#fff"
                    }
                    ios_backgroundColor="#fafafa"
                    onValueChange={(value) => {
                      this.setState({ isConcentrationEnabled: value });
                      this.setState({ changesMade: true });
                    }}
                    value={this.state.isConcentrationEnabled}
                  />
                </View>
              </View>

              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={privacyStyles.attributeContainer}
                  disabled={true}
                >
                  <Text style={privacyStyles.attributeTextTitle}>
                    Classes I Am Taking:
                  </Text>
                  <Text style={privacyStyles.attributeText} numberOfLines={1}>
                    {this.state.currentSemesterCourses.length !== 0
                      ? this.state.currentSemesterCourses.join(", ")
                      : "N/A"}
                  </Text>
                </TouchableOpacity>
                <View style={privacyStyles.switchButton}>
                  <Switch
                    trackColor={{ false: "#fafafa", true: "#30d158" }}
                    thumbColor={
                      this.state.isCurrentClassesEnabled ? "#fff" : "#fff"
                    }
                    ios_backgroundColor="#fafafa"
                    onValueChange={(value) => {
                      this.setState({ isCurrentClassesEnabled: value });
                      this.setState({ changesMade: true });
                    }}
                    value={this.state.isCurrentClassesEnabled}
                  />
                </View>
              </View>

              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={privacyStyles.attributeContainer}
                  disabled={true}
                >
                  <Text style={privacyStyles.attributeTextTitle}>
                    Classes I Recommend (Fall):
                  </Text>
                  <Text style={privacyStyles.attributeText} numberOfLines={1}>
                    {this.state.recommendedClassesFall}
                  </Text>
                </TouchableOpacity>
                <View style={privacyStyles.switchButton}>
                  <Switch
                    trackColor={{ false: "#fafafa", true: "#30d158" }}
                    thumbColor={
                      this.state.isClassSchedule1Enabled ? "#fff" : "#fff"
                    }
                    ios_backgroundColor="#fafafa"
                    onValueChange={(value) => {
                      this.setState({ isClassSchedule1Enabled: value });
                      this.setState({ changesMade: true });
                    }}
                    value={this.state.isClassSchedule1Enabled}
                  />
                </View>
              </View>

              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={privacyStyles.attributeContainer}
                  disabled={true}
                >
                  <Text style={privacyStyles.attributeTextTitle}>
                    Classes I Recommend (Spring):
                  </Text>
                  <Text style={privacyStyles.attributeText} numberOfLines={1}>
                    {this.state.recommendedClassesSpring}
                  </Text>
                </TouchableOpacity>
                <View style={privacyStyles.switchButton}>
                  <Switch
                    trackColor={{ false: "#fafafa", true: "#30d158" }}
                    thumbColor={
                      this.state.isClassSchedule2Enabled ? "#fff" : "#fff"
                    }
                    ios_backgroundColor="#fafafa"
                    onValueChange={(value) => {
                      this.setState({ isClassSchedule2Enabled: value });
                      this.setState({ changesMade: true });
                    }}
                    value={this.state.isClassSchedule2Enabled}
                  />
                </View>
              </View>

              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={[privacyStyles.attributeContainer, {}]}
                  disabled={true}
                >
                  <Text style={privacyStyles.attributeTextTitle}>
                    Time Zone:
                  </Text>
                  <Text
                    style={[
                      privacyStyles.attributeText,
                      { fontStyle: "italic" },
                    ]}
                    numberOfLines={1}
                  >
                    {new Date().toLocaleTimeString() +
                      " (" +
                      Intl.DateTimeFormat()
                        .resolvedOptions()
                        .timeZone.replace("_", " ") +
                      ") "}
                  </Text>
                </TouchableOpacity>
                <View style={privacyStyles.switchButton}>
                  <Switch
                    trackColor={{ false: "#fafafa", true: "#30d158" }}
                    thumbColor={this.state.isTimeEnabled ? "#fff" : "#fff"}
                    ios_backgroundColor="#fafafa"
                    onValueChange={(value) => {
                      this.setState({ isTimeEnabled: value });
                      this.setState({ changesMade: true });
                    }}
                    value={this.state.isTimeEnabled}
                  />
                </View>
              </View>

              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={privacyStyles.attributeContainer}
                  disabled={true}
                >
                  <Text style={privacyStyles.attributeTextTitle}>
                    4 Year Course Plan
                  </Text>
                  <Text style={privacyStyles.attributeText} numberOfLines={1}>
                    {""}
                  </Text>
                </TouchableOpacity>
                <View style={privacyStyles.switchButton}>
                  <Switch
                    trackColor={{ false: "#fafafa", true: "#30d158" }}
                    thumbColor={this.state.is4YearPlanEnabled ? "#fff" : "#fff"}
                    ios_backgroundColor="#fafafa"
                    onValueChange={(value) => {
                      this.setState({ is4YearPlanEnabled: value });
                      this.setState({ changesMade: true });
                    }}
                    value={this.state.is4YearPlanEnabled}
                  />
                </View>
              </View>

              {this.state.changesMade ? (
                <View>
                  <TouchableOpacity
                    style={privacyStyles.attributeContainer2}
                    onPress={() => {
                      this.createAlert();
                    }}
                  >
                    <Text
                      style={[
                        privacyStyles.attributeTextTitle,
                        { color: "white", fontSize: 17 },
                      ]}
                    >
                      Confirm Changes
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );

  showHidePrivacyModal = () => {
    if (this.state.isPrivacySettingsModalVisible) {
      this.setState({ isPrivacySettingsModalVisible: false });
    } else {
      this.setState({ isPrivacySettingsModalVisible: true });
    }
  };

  createAlert = () => {
    if (this.state.changesMade) {
      Alert.alert(
        "Change Information",
        "Are you sure that you want to make these changes?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => {
              {
                this.writeToDatabase();
                this.showHidePrivacyModal();
              }
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        "No Changes Made",
        "You did not make any changes to the information you are sharing.",
        [
          {
            text: "OK",
          },
        ],
        { cancelable: false }
      );
    }
  };

  render() {
    return (
      <React.Fragment>
        <this.privacySettingsModal></this.privacySettingsModal>
        <Header
          backgroundColor="#4E342E"
          centerComponent={<Text style={styles.title}>My Profile</Text>}
        >
          <TouchableOpacity
            style={styles.trigger}
            onPress={() => {
              this.props.navigation.navigate("TabNavigator");
            }}
          >
            <Ionicons name={"ios-arrow-back"} size={35} color={"white"} />
          </TouchableOpacity>
        </Header>

        <ScrollView contentContainerStyle={styles.mainContainer}>
          <TouchableOpacity
            style={styles.privacyButton}
            onPress={() => {
              this.getUserID();
              this.showHidePrivacyModal();
            }}
          >
            <Ionicons name={"ios-settings"} size={27} color={"#4E342E"} />
            <Text style={styles.privacyButtonText}>Privacy</Text>
          </TouchableOpacity>

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

          <View style={styles.nameContainer}>
            <Text style={styles.nameStyle}>
              {this.state.userData["first_name"] +
                " " +
                this.state.userData["last_name"] +
                " '" +
                this.state.userData["class_year"].split("0")[1]}
            </Text>
            <Text style={styles.emailStyle}>{this.state.email}</Text>
          </View>
          <View style={styles.spacer}>
            <Text style={{ color: "#fff" }}>Spacer Text</Text>
          </View>

          <View style={styles.aboutMe}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.subheading}>About Me</Text>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  left: 0.81 * Dimensions.get("window").width,
                }}
                onPress={() => {
                  Alert.prompt("About Me", "Character Limit: 140", [
                    {
                      text: "Confirm",
                      onPress: (str) => {
                        this.setState({ aboutMe: str });
                        this.setState({ changesMade: true });
                        this.writeToDatabase();
                      },
                    },
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                  ]);
                }}
              >
                <Foundation name="pencil" size={20} color="#4E342E" />
              </TouchableOpacity>
            </View>
            <Text style={styles.content}>{this.state.aboutMe}</Text>
          </View>
          <View style={styles.spacer}>
            <Text style={{ color: "#fff" }}>Spacer Text</Text>
          </View>

          <View style={styles.aboutMe}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.subheading}>Concentration(s)</Text>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  left: 0.81 * Dimensions.get("window").width,
                }}
                onPress={() => {
                  this.props.navigation.navigate("EditProfileScreen");
                }}
              >
                <Foundation name="pencil" size={20} color="#4E342E" />
              </TouchableOpacity>
            </View>
            <Text style={styles.content}>
              {this.state.userData["concentration"]}
            </Text>
            <Text style={styles.content}>
              {this.state.userData["second_concentration"] &&
              this.state.userData["second_concentration"] !== "Yet To Declare"
                ? this.state.userData["second_concentration"]
                : null}
            </Text>
          </View>
          <View style={styles.spacer}>
            <Text style={{ color: "#fff" }}>Spacer Text</Text>
          </View>

          <View style={styles.aboutMe}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.subheading}>Classes I Am Taking</Text>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  left: 0.81 * Dimensions.get("window").width,
                }}
                onPress={() => {
                  this.props.navigation.navigate("TabNavigator");
                }}
              >
                <Foundation name="pencil" size={20} color="#4E342E" />
              </TouchableOpacity>
            </View>
            <Text style={styles.content}>
              {this.state.currentSemesterCourses.length !== 0
                ? this.state.currentSemesterCourses.join(", ")
                : "N/A"}
            </Text>
          </View>
          <View style={styles.spacer}>
            <Text style={{ color: "#fff" }}>Spacer Text</Text>
          </View>

          <View style={styles.aboutMe}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.subheading}>Classes I Recommend (Fall)</Text>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  left: 0.81 * Dimensions.get("window").width,
                }}
                onPress={() => {
                  Alert.prompt(
                    "Classes I Recommend",
                    "Enter Classes As A Comma Separated List Like ECON 0110, CSCI 0150, ...",
                    [
                      {
                        text: "Confirm",
                        onPress: (str) => {
                          this.setState({ recommendedClassesFall: str });
                          this.setState({ changesMade: true });
                          this.writeToDatabase();
                        },
                      },
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                    ]
                  );
                }}
              >
                <Foundation name="pencil" size={20} color="#4E342E" />
              </TouchableOpacity>
            </View>
            <Text style={styles.content}>
              {this.state.recommendedClassesFall}
            </Text>
          </View>
          <View style={styles.spacer}>
            <Text style={{ color: "#fff" }}>Spacer Text</Text>
          </View>

          <View style={styles.aboutMe}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.subheading}>
                Classes I Recommend (Spring)
              </Text>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  left: 0.81 * Dimensions.get("window").width,
                }}
                onPress={() => {
                  Alert.prompt(
                    "Classes I Recommend",
                    "Enter Classes As A Comma Separated List Like ECON 0110, CSCI 0150, ...",
                    [
                      {
                        text: "Confirm",
                        onPress: (str) => {
                          this.setState({ recommendedClassesSpring: str });
                          this.setState({ changesMade: true });
                          this.writeToDatabase();
                        },
                      },
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                    ]
                  );
                }}
              >
                <Foundation name="pencil" size={20} color="#4E342E" />
              </TouchableOpacity>
            </View>
            <Text style={styles.content}>
              {this.state.recommendedClassesSpring}
            </Text>
          </View>
          <View style={styles.spacer}>
            <Text style={{ color: "#fff" }}>Spacer Text</Text>
          </View>

          <View style={styles.aboutMe}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.subheading}>My Time Zone</Text>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  left: 0.81 * Dimensions.get("window").width,
                }}
                onPress={() => {
                  Alert.alert(
                    "Time Zone",
                    "Automatically Determined Based on Phone's Time Zone",
                    [
                      {
                        text: "Ok",
                        style: "cancel",
                      },
                    ],
                    { cancelable: false }
                  );
                }}
              >
                <Foundation name="pencil" size={20} color="#4E342E" />
              </TouchableOpacity>
            </View>
            <Text style={styles.content}>
              {new Date().toLocaleTimeString() +
                " (" +
                Intl.DateTimeFormat()
                  .resolvedOptions()
                  .timeZone.replace("_", " ") +
                ") "}
            </Text>
            <Text style={styles.content}>
              {new Date().toLocaleTimeString("en-US", {
                timeZone: "America/New_York",
              }) + " (Providence, RI) "}
            </Text>
          </View>
          <View style={styles.spacer}>
            <Text style={{ color: "#fff" }}>Spacer Text</Text>
          </View>

          <View style={styles.aboutMe}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.subheading}>My 4 Year Course Plan</Text>
            </View>
            <CustomButton
              style={bigPictureStyles.summaryButtonContainer}
              textStyle={bigPictureStyles.summaryButtonText}
              title={"Click To View"}
              //   onPress={() => {
              //     this.showHideBigPicturePopUp();
              //     this.getAcademicObjective();
              //     this.getPieChartData();
              //   }}
            ></CustomButton>
          </View>
          <View style={styles.spacer}>
            <Text style={{ color: "#fff" }}>Spacer Text</Text>
          </View>
          <View style={styles.spacer}>
            <Text style={{ color: "#fff" }}>Spacer Text</Text>
          </View>
        </ScrollView>
      </React.Fragment>
    );
  }
}

/*–––––––––––––––––––––––––CUSTOM BUTTON 2 COMPONENT–––––––––––––––––––––––––*/
const CustomButton = ({ onPress, title, style, textStyle }) => (
  <TouchableOpacity onPress={onPress} style={style} activeOpacity={0.8}>
    <Text style={textStyle}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    color: "#fafafa",
    fontWeight: "700",
    letterSpacing: 1,
  },
  profilePictureContainer: {
    position: "absolute",
    top: "3%",
    justifyContent: "center",
    alignItems: "center",
  },
  profilePicture: {
    width: 125,
    height: 125,
    borderRadius: 125 / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePicturePlaceholder: {
    width: 125,
    height: 125,
    borderRadius: 125 / 2,
    backgroundColor: "#fafafa",
    justifyContent: "center",
    alignItems: "center",
  },
  changeProfilePictureContainer: {
    position: "absolute",
    top: "105%",
    width: 150,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  changeProfilePictureText: {
    color: "dimgrey",
    fontSize: 12,
    fontWeight: "500",
  },
  nameContainer: {
    marginTop: 180,
    alignItems: "center",
  },
  nameStyle: {
    color: "#4E342E",
    fontWeight: "600",
    fontSize: 26,
  },
  emailStyle: {
    color: "#4E342E",
    fontWeight: "500",
    fontSize: 14,
    padding: 4,
    marginBottom: 5,
  },
  spacer: {
    backgroundColor: "#fff",
    width: "100%",
    height: 10,
  },
  aboutMe: {
    // marginRight: "auto",
    padding: 7,
    borderColor: "#E3E3E3",
    borderWidth: 3,
    borderRadius: 15,
    width: "90%",
  },
  subheading: {
    color: "#4E342E",
    fontWeight: "700",
    fontStyle: "italic",
    textAlign: "center",
    fontSize: 21,
    marginBottom: 4,
  },
  content: {
    color: "#4E342E",
  },
  privacyButton: {
    position: "absolute",
    right: 10,
    top: 5,
    alignItems: "center",
  },
  privacyButtonText: {
    fontSize: 11,
    color: "#4E342E",
  },
});

/*–––––––––––––––––––––––––PRIVACY POP-UP STYLING–––––––––––––––––––––––––*/
const privacyStyles = StyleSheet.create({
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
  emailContainer: {
    position: "absolute",
    top: "17%",
    left: "40%",
  },
  attributeContainer2: {
    height: 50,
    backgroundColor: "#5ED483",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    padding: 10,
    marginRight: 10,
    marginBottom: 15,
  },
  attributeContainer1: {
    height: 50,
    width: "80%",
    backgroundColor: "#e3e3e3",
    marginTop: 10,
    borderRadius: 10,
    justifyContent: "center",
    padding: 10,
    marginBottom: 15,
  },
  attributeContainer: {
    width: "80%",
    backgroundColor: "#e3e3e3",
    marginBottom: 15,
    borderRadius: 10,
    justifyContent: "center",
    padding: 10,
  },
  switchButton1: {
    marginTop: 18,
    marginLeft: 7,
    marginBottom: 15,
  },
  switchButton: {
    marginLeft: 7,
    marginTop: 9,
    marginBottom: 15,
  },
  attributeTextTitle: {
    color: "dimgrey",
    fontWeight: "600",
    fontSize: 15,
  },
  attributeText: {
    color: "dimgrey",
    fontSize: 13,
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
    width: 0.8 * Dimensions.get("window").width,
    top: 5,
    zIndex: 3,
    marginBottom: 15,
    left: 10,
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

export default MyProfileScreenDashboard;
