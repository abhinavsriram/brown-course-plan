import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Modal,
} from "react-native";

import { Header } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";

import firebase from "firebase";
import "firebase/firestore";

class UserProfileScreenNetwork extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      profilePicture: "",
      name: "",
      aboutMe: "",
      concentration: "",
      currentClasses: "",
      recommendedClassesFall: "",
      recommendedClassesSpring: "",
      currentSemesterData: {},
      currentSemesterCourses: [],
      timeZone: "",
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
      userID: this.props.navigation.state.params.userID,
    };
  }

  getUserID = () => {
    const email = this.state.userID + "@brown.edu";
    this.setState({ email: email }, () => {
      this.getUserInformation();
      this.getCurrentSemesterData();
      this.getCurrentSemesterCourses();
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
            if (this.state.userData["time_zone"]) {
              this.setState({ timeZone: this.state.userData["time_zone"] })
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

  render() {
    return (
      <React.Fragment>
        <Header
          backgroundColor="#4E342E"
          centerComponent={<Text style={styles.title}>My Profile</Text>}
        >
          <TouchableOpacity
            style={styles.trigger}
            onPress={() => {
              this.props.navigation.navigate("FindUsersConcentrationScreen");
            }}
          >
            <Ionicons name={"ios-arrow-back"} size={35} color={"white"} />
          </TouchableOpacity>
        </Header>

        <ScrollView contentContainerStyle={styles.mainContainer}>
          <View style={styles.profilePictureContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.profilePicturePlaceholder}
              onPress={this.handlePickProfilePicture}
              disabled={true}
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

          {this.state.isAboutMeEnabled ? (
            <React.Fragment>
              <View style={styles.aboutMe}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.subheading}>About Me</Text>
                </View>
                <Text style={styles.content}>{this.state.aboutMe}</Text>
              </View>
              <View style={styles.spacer}>
                <Text style={{ color: "#fff" }}>Spacer Text</Text>
              </View>
            </React.Fragment>
          ) : null}

          <React.Fragment>
            <View style={styles.aboutMe}>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.subheading}>Concentration(s)</Text>
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
          </React.Fragment>

          <React.Fragment>
            <View style={styles.aboutMe}>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.subheading}>Classes I Am Taking</Text>
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
          </React.Fragment>

          <React.Fragment></React.Fragment>
          <View style={styles.aboutMe}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.subheading}>Classes I Recommend (Fall)</Text>
            </View>
            <Text style={styles.content}>
              {this.state.recommendedClassesFall}
            </Text>
          </View>
          <View style={styles.spacer}>
            <Text style={{ color: "#fff" }}>Spacer Text</Text>
          </View>

          <React.Fragment>
            <View style={styles.aboutMe}>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.subheading}>
                  Classes I Recommend (Spring)
                </Text>
              </View>
              <Text style={styles.content}>
                {this.state.recommendedClassesSpring}
              </Text>
            </View>
            <View style={styles.spacer}>
              <Text style={{ color: "#fff" }}>Spacer Text</Text>
            </View>
          </React.Fragment>

          <React.Fragment>
            <View style={styles.aboutMe}>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.subheading}>My Time Zone</Text>
              </View>
              <Text style={styles.content}>
                {this.state.timeZone !== "" ? new Date().toLocaleTimeString("en-US", {
                  timeZone: this.state.timeZone,
                }) + " (" + this.state.timeZone.replace("_", " ") + ") " : null}
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
          </React.Fragment>

          <React.Fragment>
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
          </React.Fragment>
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

export default UserProfileScreenNetwork;
