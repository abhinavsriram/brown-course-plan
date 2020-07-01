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
} from "react-native";
import { Header } from "react-native-elements";

/*–––––––––––––––––––––––––FIREBASE IMPORT–––––––––––––––––––––––––*/
import firebase from "firebase";
import "firebase/firestore";

/*–––––––––––––––––––––––––CUSTOM IMPORTS–––––––––––––––––––––––––*/
import SemesterCard from "./../components/SemesterCard";
import AddSemesterCard from "./../components/AddSemesterCard";

/*–––––––––––––––––––––––––ICONS IMPORT–––––––––––––––––––––––––*/
import Icon from "react-native-vector-icons/Ionicons";

/*–––––––––––––––––––––––––DASHBOARD SCREEN COMPONENT–––––––––––––––––––––––––*/
class DashboardScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      semestersList: [],
      isModalVisible: false,
      semesterPickerVisible: false,
      semesterPickerValue: "Click to Choose",
      yearPickerVisible: false,
      yearPickerValue: "Click to Choose",
      errorMessage: null,
      userID: "",
    };
  }

  getUserID = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const email = user.email;
        const userID = email.split("@")[0];
        this.setState({ userID: userID }, () => {
          this.pullSemestersFromDatabase();
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

  /*–––––––––––––––––––––––––RENDER METHOD–––––––––––––––––––––––––*/
  render() {
    return (
      <View style={{ flex: 1 }}>
        {/* /*–––––––––––––––––––––––––HEADER–––––––––––––––––––––––––*/}
        <Header
          backgroundColor="#4E342E"
          leftComponent={{ icon: "menu", color: "#fff", size: 30 }}
          centerComponent={<Text style={styles.title}>Dashboard</Text>}
        ></Header>
        {/* /*–––––––––––––––––––––––––SCROLL VIEW–––––––––––––––––––––––––*/}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.container}
        >
          {/* /*–––––––––––––––––––––––––debugging buttons–––––––––––––––––––––––––*/}
          {/* <View style={{ flexDirection: "row" }}>
            <Button
              title="Sign Out"
              color="#4E342E"
              onPress={() => {
                this.props.navigation.navigate("LandingScreen");
                firebase.auth().signOut();
              }}
            ></Button>
          </View> */}
          {/* /*–––––––––––––––––––––––––CARDS–––––––––––––––––––––––––*/}
          <View>
            {/* this is the pop-up that always exists but remains invisible until add semester is clicked */}
            <this.AddSemesterPopUp></this.AddSemesterPopUp>
            {/* this function returns semester cards based on the number the user has created */}
            {this.state.semestersList.map((semester) => {
              return (
                <SemesterCard
                  key={Math.random()}
                  title={semester}
                ></SemesterCard>
              );
            })}
            {/* this is the add semester card that always exists at the end of all semesters added */}
            <AddSemesterCard
              onPress={() => this.ShowHidePopUp()}
            ></AddSemesterCard>
          </View>
        </ScrollView>
      </View>
    );
  }
}

/*–––––––––––––––––––––––––CUSTOM BUTTON COMPONENT–––––––––––––––––––––––––*/
const CreateProfileButton = ({ onPress, title }) => (
  <TouchableOpacity
    onPress={onPress}
    style={popUpStyles.createProfileButtonContainer}
    activeOpacity={0.8}
  >
    <Text style={popUpStyles.createProfileButtonText}>{title}</Text>
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
