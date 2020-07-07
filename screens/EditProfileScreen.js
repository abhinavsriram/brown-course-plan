import React, { Component } from "react";
import {
  Dimensions,
  Image,
  Picker,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import UserPermissions from "./../utilities/UserPermissions.js";
import * as ImagePicker from "expo-image-picker";
import { DrawerActions } from "react-navigation-drawer";

import Icon from "react-native-vector-icons/Ionicons";

import completeConcentrationsList from "./../data/ConcentrationsList.js";
import completeSecondConcentrationsList from "./../data/SecondConcentrationsList";

import firebase from "firebase";
import "firebase/firestore";

class EditProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      concentrationPickerValue: "Click to Choose",
      concentrationPickerVisible: false,
      secondConcentrationPickerValue: "Click to Choose",
      secondConcentrationPickerVisible: false,
      degreePickerValue: "Click to Choose",
      degreePickerVisible: false,
      classYearPickerValue: "Click to Choose",
      classYearPickerVisible: false,
      semesterLevelPickerValue: "Click to Choose",
      semesterLevelPickerVisible: false,
      userID: "",
      profilePicture: "./../assets/dp-placeholder.jpg",
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
          if (doc.data().concentration !== "Yet To Declare") {
            this.setState({
              concentrationPickerValue: doc.data().concentration,
            });
          }
          if (doc.data().second_concentration) {
            if (doc.data().second_concentration !== "Yet To Declare") {
              this.setState({
                secondConcentrationPickerValue: doc.data().second_concentration,
              });
            }
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
  };

  ShowHideSecondConcentrationPicker = () => {
    if (this.state.secondConcentrationPickerVisible == true) {
      this.setState({ secondConcentrationPickerVisible: false });
    } else {
      this.setState({ secondConcentrationPickerVisible: true });
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
  };

  defaultSecondConcentration = () => {
    if (
      this.state.secondConcentrationPickerValue === "Click to Choose" ||
      this.state.concentrationPickerValue === undefined
    ) {
      this.setState({ secondConcentrationPickerValue: "Yet To Declare" });
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
    firebase
      .firestore()
      .collection("user-information")
      .doc(this.state.userID)
      .update({
        concentration: this.state.concentrationPickerValue,
        second_concentration: this.state.secondConcentrationPickerValue,
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
      this.props.navigation.navigate("TabNavigator");
      this.props.navigation.dispatch(DrawerActions.openDrawer());
    } else {
      alert("Please Choose All Values");
    }
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
                this.props.navigation.dispatch(DrawerActions.openDrawer());
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
                <Image
                  source={{ uri: this.state.profilePicture }}
                  style={styles.profilePicture}
                ></Image>
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
              <Text style={profileStyles.inputTitle}>Concentration</Text>
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
                    this.determineDegree(
                      this.state.concentrationPickerValue,
                      this.state.secondConcentrationPickerValue
                    );
                  }}
                >
                  <Text style={profileStyles.cancelButtonText}>DONE</Text>
                </TouchableOpacity>
              </React.Fragment>
            ) : null}
            {/* /*–––––––––––––––––––––––––SECOND CONCENTRATION–––––––––––––––––––––––––*/}
            {/* /*–––––––––––––––––––––––––FORM 12 - CONCENTRATION–––––––––––––––––––––––––*/}
            <View style={profileStyles.form12}>
              <Text style={profileStyles.inputTitle}>Second Concentration</Text>
              <TouchableOpacity
                style={profileStyles.chooseConcentration}
                onPress={this.ShowHideSecondConcentrationPicker}
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
                    this.defaultSecondConcentration();
                    this.determineDegree(
                      this.state.concentrationPickerValue,
                      this.state.secondConcentrationPickerValue
                    );
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
                    this.determineDegree(
                      this.state.concentrationPickerValue,
                      this.state.secondConcentrationPickerValue
                    );
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
    width: Dimensions.get("window").width,
  },
  form12: {
    position: "absolute",
    top: "50%",
    width: Dimensions.get("window").width,
  },
  form2: {
    position: "absolute",
    top: "62%",
    width: Dimensions.get("window").width,
  },
  form3: {
    position: "absolute",
    top: "74%",
    width: Dimensions.get("window").width,
  },
  form4: {
    position: "absolute",
    top: "86%",
    width: Dimensions.get("window").width,
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
    width: "100%",
    paddingVertical: 14,
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
    top: "52%",
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

export default EditProfileScreen;
