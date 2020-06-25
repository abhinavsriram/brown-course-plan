/*–––––––––––––––––––––––––REACT IMPORTS–––––––––––––––––––––––––*/
import React, { Component } from "react";
import {
  View,
  Text,
  Picker,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

/*–––––––––––––––––––––––––DATA IMPORT–––––––––––––––––––––––––*/
import completeConcentrationsList from "./../data/ConcentrationsList.js";

/*–––––––––––––––––––––––––FIREBASE IMPORT–––––––––––––––––––––––––*/
import firebase from "firebase";
import "firebase/firestore";

/*–––––––––––––––––––––––––CREATE PROFILE SCREEN 2 COMPONENT–––––––––––––––––––––––––*/
class CreateProfileScreen2 extends Component {
  state = {
    concentrationPickerValue: "Click to Choose",
    concentrationPickerVisible: false,
    degreePickerValue: "Click to Choose",
    degreePickerVisible: false,
    classYearPickerValue: "Click to Choose",
    classYearPickerVisible: false,
    semesterLevelPickerValue: "Click to Choose",
    semesterLevelPickerVisible: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      userID: this.props.navigation.state.params.userID,
    };
  }

  writeToDatabase = () => {
    firebase
      .firestore()
      .collection("user-information")
      .doc(this.state.userID)
      .update({
        concentration: this.state.concentrationPickerValue,
        degree: this.state.degreePickerValue,
        class_year: this.state.classYearPickerValue,
        semester_level: this.state.semesterLevelPickerValue,
      });
  };

  // returns true if semester is spring and false if semester is fall
  // fall semester: beginning of july to end of december
  // spring Semester: beginning of january to end of june
  isFallOrSpring = () => {
    var currDate = new Date();
    return currDate.getMonth() >= 0 && currDate.getMonth() <= 5;
  };

  determineSemesterLevel = (gradYear) => {
    var currDate = new Date();
    var currYear = currDate.getFullYear();
    var yearDiff = gradYear - currYear;
    if (!this.isFallOrSpring()) {
      if (gradYear - currYear <= 0) {
        return "Click to Choose";
      } else if (gradYear - currYear > 4) {
        return "Click to Choose";
      } else if (yearDiff !== 0) {
        return "S0" + (9 - yearDiff * 2);
      } else {
        return "S0" + 1;
      }
    } else {
      if (gradYear - currYear < 0) {
        return "Click to Choose";
      } else if (gradYear - currYear >= 4) {
        return "Click to Choose";
      } else if (gradYear === currYear) {
        return "S0" + 8;
      } else if (yearDiff !== 0) {
        return "S0" + (8 - yearDiff * 2);
      } else {
        return "S0" + 2;
      }
    }
  };

  navigateToNextScreen = () => {
    if (
      this.state.concentrationPickerValue !== "Click to Choose" &&
      this.state.degreePickerValue !== "Click to Choose" &&
      this.state.classYearPickerValue !== "Click to Choose" &&
      this.state.semesterLevelPickerValue !== "Click to Choose"
    ) {
      this.props.navigation.navigate("VerificationScreen");
    } else {
      alert("Please Choose All Values");
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
  };

  defaultConcentration = () => {
    if (this.state.concentrationPickerValue === "Click to Choose") {
      this.setState({ concentrationPickerValue: "Yet to Declare" });
    }
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
    if (this.state.semesterLevelPickerValue === "S0Nan") {
      this.setState({ semesterLevelPickerValue: "S01" });
    }
  };

  /*–––––––––––––––––––––––––RENDER METHOD–––––––––––––––––––––––––*/
  render() {
    return (
      <View style={profileStyles.container}>
        {/* /*–––––––––––––––––––––––––FORM 1 - CONCENTRATION–––––––––––––––––––––––––*/}
        <View style={profileStyles.form1}>
          <Text style={profileStyles.inputTitle}>Concentration</Text>
          <TouchableOpacity
            style={profileStyles.chooseConcentration}
            onPress={this.ShowHideConcentrationPicker}
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
                this.defaultConcentration();
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
                this.defaultClassYear();
                this.setState({
                  semesterLevelPickerValue: this.determineSemesterLevel(
                    this.state.classYearPickerValue
                  ),
                });
              }}
            >
              <Text style={profileStyles.cancelButtonText}>DONE</Text>
            </TouchableOpacity>
          </React.Fragment>
        ) : null}
        {/* /*–––––––––––––––––––––––––FORM 4 - SEMESTER LEVEL–––––––––––––––––––––––––*/}
        <View style={profileStyles.form4}>
          <Text style={profileStyles.inputTitle}>Semester Level</Text>
          <TouchableOpacity
            style={profileStyles.chooseConcentration}
            onPress={this.ShowHideSemesterLevelPicker}
          >
            <Text
              style={{
                textTransform: "capitalize",
                color: "#fafafa",
                fontSize: 13,
              }}
            >
              {this.state.semesterLevelPickerValue}
            </Text>
          </TouchableOpacity>
        </View>
        {/* /*–––––––––––––––––––––––––SEMESTER LEVEL PICKER–––––––––––––––––––––––––*/}
        {this.state.semesterLevelPickerVisible ? (
          <React.Fragment>
            <Picker
              style={profileStyles.concentrationPicker}
              selectedValue={this.state.semesterLevelPickerValue}
              onValueChange={(itemValue) => {
                this.setState({ semesterLevelPickerValue: itemValue });
              }}
              itemStyle={{ color: "#fafafa", borderColor: "#fafafa" }}
            >
              <Picker.Item label="S01" value="S01"></Picker.Item>
              <Picker.Item label="S02" value="S02"></Picker.Item>
              <Picker.Item label="S03" value="S03"></Picker.Item>
              <Picker.Item label="S04" value="S04"></Picker.Item>
              <Picker.Item label="S05" value="S05"></Picker.Item>
              <Picker.Item label="S06" value="S06"></Picker.Item>
              <Picker.Item label="S07" value="S07"></Picker.Item>
              <Picker.Item label="S08" value="S08"></Picker.Item>
            </Picker>
            <TouchableOpacity
              style={profileStyles.cancelButton}
              onPress={() => {
                this.ShowHideSemesterLevelPicker();
                this.defaultSemesterLevel();
              }}
            >
              <Text style={profileStyles.cancelButtonText}>DONE</Text>
            </TouchableOpacity>
          </React.Fragment>
        ) : null}
        {/* /*–––––––––––––––––––––––––LET'S GO BUTTON–––––––––––––––––––––––––*/}
        <CreateProfileButton
          title="Let's Go"
          onPress={() => {
            this.writeToDatabase();
            this.navigateToNextScreen();
          }}
        ></CreateProfileButton>
      </View>
    );
  }
}

/*–––––––––––––––––––––––––CUSTOM BUTTON COMPONENT–––––––––––––––––––––––––*/
const CreateProfileButton = ({ onPress, title }) => (
  <TouchableOpacity
    onPress={onPress}
    style={profileStyles.createProfileButtonContainer}
    activeOpacity={0.8}
  >
    <Text style={profileStyles.createProfileButtonText}>{title}</Text>
  </TouchableOpacity>
);

const inputWidth = 0.8 * Dimensions.get("window").width;

/*–––––––––––––––––––––––––STYLING–––––––––––––––––––––––––*/
const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E53935",
    alignItems: "center",
    justifyContent: "center",
  },
  form1: {
    position: "absolute",
    top: "10%",
    width: inputWidth,
  },
  form2: {
    position: "absolute",
    top: "22%",
    width: inputWidth,
  },
  form3: {
    position: "absolute",
    top: "34%",
    width: inputWidth,
  },
  form4: {
    position: "absolute",
    top: "46%",
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
    width: "80%",
    position: "absolute",
    bottom: 40,
    zIndex: 3,
  },
  createProfileButtonText: {
    fontSize: 18,
    color: "#E53935",
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
    backgroundColor: "#E53935",
    zIndex: 1,
    height: 250,
    borderColor: "#fafafa",
  },
  cancelButton: {
    position: "absolute",
    top: "55%",
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
});

export default CreateProfileScreen2;
