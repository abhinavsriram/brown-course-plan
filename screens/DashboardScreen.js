/*–––––––––––––––––––––––––REACT IMPORTS–––––––––––––––––––––––––*/
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
  Button,
  Alert,
} from "react-native";
import { Header } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "react-navigation-drawer";

/*–––––––––––––––––––––––––FIREBASE IMPORT–––––––––––––––––––––––––*/
import firebase from "firebase";
import "firebase/firestore";

/*–––––––––––––––––––––––––CUSTOM IMPORTS–––––––––––––––––––––––––*/
import SemesterCard from "./../components/SemesterCard";
import AddSemesterCard from "./../components/AddSemesterCard";
import CourseList from "./../data/CourseList";
import CoursePiece from "./../components/CoursePiece";
import SemesterPiece from "./../components/SemesterPiece";

/*–––––––––––––––––––––––––ICONS IMPORT–––––––––––––––––––––––––*/
import Icon from "react-native-vector-icons/Ionicons";
import courseList from "./../data/CourseList";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

/*–––––––––––––––––––––––––DASHBOARD SCREEN COMPONENT–––––––––––––––––––––––––*/
class DashboardScreen extends Component {
  constructor(props) {
    super(props);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.state = {
      semestersList: [],
      isModalVisible: false,
      semesterPickerVisible: false,
      semesterPickerValue: "Click to Choose",
      yearPickerVisible: false,
      yearPickerValue: "Click to Choose",
      errorMessage: null,
      userID: "",
      triggerDrawer: false,
      isSummaryVisible: false,
      firstName: "",
      degree: "",
      concentration_1: "",
      concentration_2: "",
      refresh: false,
    };
  }

  getUserID = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const email = user.email;
        const userID = email.split("@")[0];
        this.setState({ userID: userID }, () => {
          this.pullSemestersFromDatabase();
          this.getNameFromDatabase();
          this.getAcademicObjective();
        });
      } else {
      }
    });
  };

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

  componentDidMount() {
    this.getUserID();
    // var randomColor = require("randomcolor");
    // const colors = randomColor({
    //   count: 95,
    //   luminosity: "dark",
    // });
    // console.log(colors);
    this.props.navigation.addListener("willFocus", () => this.getUserID());
  }

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

  sortSemestersChronologically = (list) => {
    const len = list.length;
    let years = [];
    for (let i = 0; i < len; i++) {
      const year = list[i].split(" ")[1];
      years.push(year);
    }
    let uniqueYears = [...new Set(years)];
    const result = this.bubbleSort1(years, list);
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
      const partFinalResult = this.bubbleSort2(semesters, wholeStringList);
      finalResult = [...finalResult, ...partFinalResult];
    }
    return finalResult;
  };

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

  bubbleSort1 = (arr, mainArr) => {
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

  bubbleSort2 = (arr, mainArr) => {
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

  CreateSemesterCard = () => {
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

  ShowHidePopUp = () => {
    if (this.state.isModalVisible === true) {
      this.setState({ isModalVisible: false });
    } else {
      this.setState({ isModalVisible: true });
    }
  };

  ShowHideSemesterPicker = () => {
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

  ShowHideYearPicker = () => {
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

  performRemainingActions = () => {
    const currentChoice =
      this.state.semesterPickerValue + " " + this.state.yearPickerValue;
    if (this.state.semestersList.includes(currentChoice)) {
      this.setState({ errorMessage: "You Have Already Added This Semester" });
      this.setState({ isModalVisible: true });
    } else {
      if (
        this.state.semesterPickerValue !== "Click to Choose" &&
        this.state.yearPickerValue !== "Click to Choose"
      ) {
        this.setState({ isModalVisible: false });
        this.CreateSemesterCard();
        this.resetPickers();
        this.setState({ errorMessage: null });
      } else {
        this.setState({ errorMessage: "Please Choose All Values" });
        this.setState({ isModalVisible: true });
      }
    }
  };

  AddSemesterPopUp = () => (
    <View style={popUpStyles.popUpContainer}>
      <Modal animationType={"fade"} visible={this.state.isModalVisible}>
        <View style={popUpStyles.modal}>
          {/* /*–––––––––––––––––––––––––BACK BUTTON–––––––––––––––––––––––––*/}
          <TouchableOpacity
            style={popUpStyles.backArrow}
            onPress={() => {
              this.ShowHidePopUp();
              this.setState({ errorMessage: null });
            }}
          >
            <Icon name="ios-arrow-dropleft" color="#fafafa" size={40} />
          </TouchableOpacity>
          <View style={popUpStyles.header}>
            <Text style={popUpStyles.popUpTitle}>Semester Details</Text>
          </View>
          {/* /*–––––––––––––––––––––––––ERROR MESSAGE–––––––––––––––––––––––––*/}
          <View style={popUpStyles.errorMessage}>
            {this.state.errorMessage && (
              <Text style={popUpStyles.errorMessageText}>
                {this.state.errorMessage}
              </Text>
            )}
          </View>
          {/* /*–––––––––––––––––––––––––FORM 1 - SEMESTER–––––––––––––––––––––––––*/}
          <View style={popUpStyles.form1}>
            <Text style={popUpStyles.inputTitle}>Semester</Text>
            <TouchableOpacity
              style={popUpStyles.chooseConcentration}
              onPress={this.ShowHideSemesterPicker}
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
                style={popUpStyles.concentrationPicker}
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
                style={popUpStyles.cancelButton}
                onPress={() => {
                  this.ShowHideSemesterPicker();
                  this.defaultSemesterValue();
                }}
              >
                <Text style={popUpStyles.cancelButtonText}>DONE</Text>
              </TouchableOpacity>
            </React.Fragment>
          ) : null}
          {/* /*–––––––––––––––––––––––––FORM 2 - YEAR–––––––––––––––––––––––––*/}
          <View style={popUpStyles.form2}>
            <Text style={popUpStyles.inputTitle}>Year</Text>
            <TouchableOpacity
              style={popUpStyles.chooseConcentration}
              onPress={this.ShowHideYearPicker}
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
                style={popUpStyles.concentrationPicker}
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
                style={popUpStyles.cancelButton}
                onPress={() => {
                  this.ShowHideYearPicker();
                  this.defaultYearValue();
                }}
              >
                <Text style={popUpStyles.cancelButtonText}>DONE</Text>
              </TouchableOpacity>
            </React.Fragment>
          ) : null}
          {/* /*–––––––––––––––––––––––––ADD SEMESTER BUTTON–––––––––––––––––––––––––*/}
          <CreateProfileButton
            title="Add Semester"
            onPress={() => {
              this.setState({ isModalVisible: false });
              this.performRemainingActions();
            }}
          ></CreateProfileButton>
        </View>
      </Modal>
    </View>
  );

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

  createRow2Semesters = () => {
    var results = [];
    for (let i = 4; i < 8; i++) {
      if (this.state.semestersList[i]) {
        results.push(
          <SemesterPiece
            key={Math.random()}
            title={this.state.semestersList[i]}
            navprops={this.props}
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

  createRow3Semesters = () => {
    var results = [];
    for (let i = 8; i < 12; i++) {
      if (this.state.semestersList[i]) {
        results.push(
          <SemesterPiece
            key={Math.random()}
            title={this.state.semestersList[i]}
            navprops={this.props}
          ></SemesterPiece>
        );
      }
    }
    return results;
  };

  getNameFromDatabase = () => {
    firebase
      .firestore()
      .collection("user-information")
      .doc(this.state.userID)
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.setState({ firstName: doc.data().first_name + "'s" });
        } else {
          console.log("no data accquired");
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  ShowHideSummaryPopUp = () => {
    if (this.state.semestersList[0]) {
      if (this.state.isSummaryVisible) {
        this.setState({ isSummaryVisible: false });
      } else {
        this.setState({ isSummaryVisible: true });
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
            } else {
              this.setState({
                concentration_2: "",
              });
            }
          }
        } else {
          console.log("no data accquired");
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  SummaryPopUp = () => (
    <View style={summaryStyles.container}>
      <Modal visible={this.state.isSummaryVisible}>
        <View style={summaryStyles.container}>
          <Header
            backgroundColor="#4E342E"
            leftComponent={
              <TouchableOpacity onPress={() => this.ShowHideSummaryPopUp()}>
                <Icon name="ios-arrow-back" color="#fafafa" size={35} />
              </TouchableOpacity>
            }
            centerComponent={
              <Text style={summaryStyles.title}>The Big Picture</Text>
            }
          ></Header>
          <Text style={summaryStyles.academicObjectiveTitle}>
            Academic Objective
          </Text>
          <Text style={summaryStyles.academicObjective}>
            {this.state.degree}
          </Text>
          <Text style={summaryStyles.academicObjectivePt2}>
            {this.state.concentration_1 + this.state.concentration_2}
          </Text>
          <ScrollView
            // contentContainerStyle={summaryStyles.container}
            directionalLockEnabled={true}
            scrollEnabled={false}
          >
            <View style={summaryStyles.container}>
              <View style={summaryStyles.row1}>
                {this.createRow1Semesters()}
              </View>
              <View style={summaryStyles.row2}>
                {this.createRow2Semesters()}
              </View>
              {/* <View style={summaryStyles.row3}>{this.createRow3Semesters()}</View> */}
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

  /*–––––––––––––––––––––––––RENDER METHOD–––––––––––––––––––––––––*/
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
              this.props.navigation.dispatch(DrawerActions.openDrawer());
              this.setState({ triggerDrawer: true });
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
            <CustomButton
              style={summaryStyles.summaryButtonContainer}
              textStyle={summaryStyles.summaryButtonText}
              title={"The Big Picture"}
              onPress={() => {
                this.ShowHideSummaryPopUp();
                this.getAcademicObjective();
              }}
            ></CustomButton>
            {/* this is the pop-up that always exists but remains invisible until add semester is clicked */}
            <this.AddSemesterPopUp></this.AddSemesterPopUp>
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
            {/* this is the add semester card that always exists at the end of all semesters added */}
            <AddSemesterCard
              onPress={() => this.ShowHidePopUp()}
            ></AddSemesterCard>
            <this.SummaryPopUp></this.SummaryPopUp>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const summaryStyles = StyleSheet.create({
  container: {
    flex: 1,
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
    top: "14%",
  },
  row2: {
    flex: 1,
    flexDirection: "row",
    top: "7%",
  },
  // row3: {
  //   flex: 1,
  //   flexDirection: "row",
  //   top: "7%",
  // },
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
    fontWeight: "bold",
    fontStyle: "italic",
    margin: 7,
    fontSize: 15,
  },
  academicObjective: {
    position: "absolute",
    top: "13.9%",
    zIndex: 5,
    color: "#4E342E",
    marginHorizontal: 20,
    fontSize: 13,
  },
  academicObjectivePt2: {
    position: "absolute",
    top: "16%",
    zIndex: 5,
    color: "#4E342E",
    marginHorizontal: 20,
    fontSize: 13,
  },
});

/*–––––––––––––––––––––––––CUSTOM BUTTON COMPONENT–––––––––––––––––––––––––*/
const CreateProfileButton = ({ onPress, title }) => (
  <TouchableOpacity
    onPress={onPress}
    style={popUpStyles.createProfileButtonContainer}
    activeOpacity={0.6}
  >
    <Text style={popUpStyles.createProfileButtonText}>{title}</Text>
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
});

const inputWidth = 0.8 * Dimensions.get("window").width;

/*–––––––––––––––––––––––––POP-UP SCREEN STYLING–––––––––––––––––––––––––*/
const popUpStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4E342E",
    alignItems: "center",
    justifyContent: "center",
  },
  form1: {
    position: "absolute",
    top: "30%",
    width: inputWidth,
  },
  form2: {
    position: "absolute",
    top: "45%",
    width: inputWidth,
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
    width: inputWidth,
    justifyContent: "center",
    alignItems: "center",
  },
  errorMessageText: {
    flex: 1,
    color: "#fafafa",
  },
});

export default DashboardScreen;
