/*–––––––––––––––––––––––––REACT IMPORTS–––––––––––––––––––––––––*/
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  Keyboard,
  Modal,
  Picker,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { Header } from "react-native-elements";

/*–––––––––––––––––––––––––FIREBASE IMPORT–––––––––––––––––––––––––*/
import * as firebase from "firebase";
import "firebase/firestore";

/*–––––––––––––––––––––––––ICONS IMPORT–––––––––––––––––––––––––*/
import Icon from "react-native-vector-icons/Ionicons";

/*–––––––––––––––––––––––––CUSTOM IMPORTS–––––––––––––––––––––––––*/
import CourseData from "./../data/CourseData.json";
import StopWordsList from "./../data/StopWordsList";
import CourseCard from "../components/CourseCardSearch";
import CourseList from "./../data/CourseList";

/*–––––––––––––––––––––––––SEARCH SCREEN COMPONENT–––––––––––––––––––––––––*/
class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      searchBoxValue: "",
      navigation: this.props.navigation,
      yOffset: 0,
      isModalVisible: false,
      semesterPickerValue: "Spring 2020",
      semesterPickerVisible: false,
      currentSemesterCode: 0,
    };
  }

  // getPropertyByIndex = (obj, index) => {
  //   return obj[Object.keys(obj)[index]];
  // };

  // createKeywordArrayHelper = (toSplit) => {
  //   const keywordArray = [];
  //   let currKeyword = "";
  //   toSplit.split("").forEach((toSplitChar) => {
  //     currKeyword += toSplitChar;
  //     keywordArray.push(currKeyword);
  //   });
  //   return keywordArray;
  // };

  // createKeywordArrayOneCourse = (toSplit) => {
  //   const [courseCode, courseName, courseInstr] = toSplit;
  //   const keywordArrayCourseCodeWithSpace = this.createKeywordArrayHelper(
  //     courseCode.toLowerCase()
  //   );
  //   const keywordArrayCourseCodeWithoutSpace = this.createKeywordArrayHelper(
  //     courseCode.toLowerCase().split(" ").join("")
  //   );
  //   const keywordArrayCourseNameWithStopWords = this.createKeywordArrayHelper(
  //     courseName.toLowerCase()
  //   );
  //   const tempValue = courseName
  //     .toLowerCase()
  //     .split(" ")
  //     .filter((xYz) => !StopWordsList.includes(xYz))
  //     .map((currWord) => this.createKeywordArrayHelper(currWord));
  //   const keywordArrayCourseNameWithoutStopWords = [].concat(...tempValue);
  //   const keywordArrayCourseInstrFullName = this.createKeywordArrayHelper(
  //     courseInstr.toLowerCase()
  //   );
  //   const keywordArrayCourseInstrLastName = this.createKeywordArrayHelper(
  //     courseInstr.toLowerCase().split(" ").pop()
  //   );
  //   return [
  //     ...new Set([
  //       "",
  //       ...keywordArrayCourseCodeWithSpace,
  //       ...keywordArrayCourseCodeWithoutSpace,
  //       ...keywordArrayCourseNameWithStopWords,
  //       ...keywordArrayCourseNameWithoutStopWords,
  //       ...keywordArrayCourseInstrFullName,
  //       ...keywordArrayCourseInstrLastName,
  //     ]),
  //   ];
  // };

  // createKeywordArrayAllCourses = () => {
  //   let courseKeywordsList = [];
  //   for (let i = 0; i < Object.keys(CourseData[1]).length; i++) {
  //     const courseCode = this.getPropertyByIndex(CourseData[1], i)[
  //       "Course_Code"
  //     ];
  //     const courseName = this.getPropertyByIndex(CourseData[1], i)[
  //       "Course Name"
  //     ];
  //     const courseInstr = this.getPropertyByIndex(CourseData[1], i)[
  //       "Course Instructor"
  //     ];
  //     const courseKeyword = this.createKeywordArrayOneCourse([
  //       courseCode,
  //       courseName,
  //       courseInstr,
  //     ]);
  //     courseKeywordsList.push(courseKeyword);
  //   }
  //   return courseKeywordsList;
  // };

  // createFullDatabase = () => {
  //   const courseKeywordsList = this.createKeywordArrayAllCourses();
  //   for (let i = 0; i < Object.keys(CourseData[1]).length; i++) {
  //     this.getPropertyByIndex(CourseData[1], i)["Keywords"] =
  //       courseKeywordsList[i];
  //   }
  //   return CourseData[1];
  // };

  // writeToFirestore = (data) => {
  //   if (data && typeof data === "object") {
  //     Object.keys(data).forEach((docKey) => {
  //       firebase
  //         .firestore()
  //         .collection("summer-2020")
  //         .doc(docKey)
  //         .set(data[docKey])
  //         .then((res) => {
  //           console.log("document " + docKey + " successfully written!");
  //         })
  //         .catch((error) => {
  //           console.error("error writing document: ", error);
  //         });
  //     });
  //   }
  // };

  // call onKeyPress={() => this.writeToFirestore(this.createFullDatabase())} to upload information
  // change collection name withtin writeToFirestore
  // change index appropriately (CourseData[index])

  searchEngine = async (searchInput, currentSemester) => {
    var hyphenate = currentSemester.replace(/ /g, "-");
    var collection = hyphenate.toLowerCase();
    if (CourseList.includes(searchInput.toUpperCase())) {
      searchInput = searchInput + " ";
    }
    const querySnapshot = await firebase
      .firestore()
      .collection(collection)
      .where("Keywords", "array-contains", searchInput.toLowerCase())
      .orderBy("Course_Code")
      .limit(10)
      .get();
    const result = querySnapshot.docs;
    var localSearchResults = [];
    result.forEach((course) => {
      localSearchResults.push(course.get("Course_Code"));
    });
    this.setState({ searchResults: localSearchResults });
  };

  searchEngineStartAfter = async (
    searchInput,
    searchResultNum,
    currentSemester
  ) => {
    var hyphenate = currentSemester.replace(/ /g, "-");
    var collection = hyphenate.toLowerCase();
    if (CourseList.includes(searchInput.toUpperCase())) {
      searchInput = searchInput + " ";
    }
    const querySnapshot = await firebase
      .firestore()
      .collection(collection)
      .where("Keywords", "array-contains", searchInput.toLowerCase())
      .orderBy("Course_Code")
      .limit(10 * searchResultNum)
      .get();
    const result = querySnapshot.docs;
    var localSearchResults = [];
    result.forEach((course) => {
      localSearchResults.push(course.get("Course_Code"));
    });
    this.setState({ searchResults: localSearchResults });
  };

  lazyLoading = () => {
    var y = this.state.searchResults.length / 10;
    if (y < 4) {
      if (this.state.yOffset > 575 * y) {
        this.searchEngineStartAfter(
          this.state.searchBoxValue,
          y + 1,
          this.state.semesterPickerValue
        );
      }
    }
  };

  ShowHideSemesterPicker = () => {
    Keyboard.dismiss();
    this.setState({ searchResults: [] });
    if (this.state.semesterPickerVisible == true) {
      this.setState({ semesterPickerVisible: false });
    } else {
      this.setState({ semesterPickerVisible: true });
    }
  };

  defaultSemesterValue = () => {
    if (this.state.semesterPickerValue === "Click to Choose") {
      this.setState({ semesterPickerValue: "Spring 2020" });
    }
  };

  pickSemester = () => {
    switch (this.state.semesterPickerValue) {
      case "Spring 2020":
        this.setState({ currentSemesterCode: 0 });
        break;
      case "Summer 2020":
        this.setState({ currentSemesterCode: 1 });
        break;
    }
  };

  componentDidMount() {
    switch (this.state.semesterPickerValue) {
      case "Spring 2020":
        this.setState({ currentSemesterCode: 0 });
        break;
      case "Summer 2020":
        this.setState({ currentSemesterCode: 1 });
        break;
    }
  }

  createCards = () => {
    return this.state.searchResults.map((courseCode, index) => {
      return (
        <CourseCard
          onPress={() => { this.CourseInformationPopUp(courseCode); this.ShowHidePopUp() }}
          key={index}
          navigation={this.props.navigation}
          courseCode={courseCode}
          courseName={
            CourseData[this.state.currentSemesterCode][courseCode][
            "Course Name"
            ]
          }
          instructor={
            CourseData[this.state.currentSemesterCode][courseCode][
            "Course Instructor"
            ]
          }
          meetingTime={
            CourseData[this.state.currentSemesterCode][courseCode][
            "Course Meeting Time"
            ]
          }
          semesterCode={this.state.currentSemesterCode}
        ></CourseCard>
      );
    });
  };

  ShowHidePopUp = () => {
    if (this.state.isModalVisible === true) {
      this.setState({ isModalVisible: false });
    } else {
      this.setState({ isModalVisible: true });
    }
  };


  render() {
    return (
      <View style={styles.container}>
        {/* /*–––––––––––––––––––––––––HEADER–––––––––––––––––––––––––*/}
        <Header
          backgroundColor="#4E342E"
          leftComponent={{ icon: "menu", color: "#fff", size: 30 }}
          centerComponent={<Text style={styles.title}>Search</Text>}
        ></Header>
        {/* /*–––––––––––––––––––––––––SEARCH BOX–––––––––––––––––––––––––*/}
        <View style={styles.searchBox}>
          <Icon name="ios-search" size={20} />
          <TextInput
            placeholder="Course Code, Name, Instructor"
            placeholderTextColor="dimgrey"
            style={styles.textInput}
            onChangeText={(text) => {
              this.pickSemester();
              this.setState({ searchBoxValue: text }, async () => {
                await this.searchEngine(
                  this.state.searchBoxValue,
                  this.state.semesterPickerValue
                );
              });
              this.setState({ semesterPickerVisible: false });
            }}
            value={this.state.searchBoxValue}
            autoCorrect={false}
          />
        </View>
        {/* /*–––––––––––––––––––––––––SEMESTER PICKER BOX–––––––––––––––––––––––––*/}
        <TouchableOpacity
          onPress={() => this.ShowHideSemesterPicker()}
          style={styles.searchBox}
        >
          <Icon name="ios-arrow-dropdown" size={20} />
          <Text style={styles.textInput}>{this.state.semesterPickerValue}</Text>
        </TouchableOpacity>
        {/* /*–––––––––––––––––––––––––SEMESTER PICKER–––––––––––––––––––––––––*/}
        {this.state.semesterPickerVisible ? (
          <React.Fragment>
            <Picker
              style={styles.concentrationPicker}
              selectedValue={this.state.semesterPickerValue}
              onValueChange={(itemValue) => {
                this.setState({ semesterPickerValue: itemValue });
              }}
              itemStyle={{ color: "#333333", borderColor: "#fafafa" }}
            >
              <Picker.Item label="Fall 2017" value="Fall 2017"></Picker.Item>
              <Picker.Item
                label="Winter 2017"
                value="Winter 2017"
              ></Picker.Item>
              <Picker.Item
                label="Spring 2018"
                value="Spring 2018"
              ></Picker.Item>
              <Picker.Item
                label="Summer 2018"
                value="Summer 2018"
              ></Picker.Item>
              <Picker.Item label="Fall 2018" value="Fall 2018"></Picker.Item>
              <Picker.Item
                label="Winter 2018"
                value="Winter 2018"
              ></Picker.Item>
              <Picker.Item
                label="Spring 2019"
                value="Spring 2019"
              ></Picker.Item>
              <Picker.Item
                label="Summer 2019"
                value="Summer 2019"
              ></Picker.Item>
              <Picker.Item label="Fall 2019" value="Fall 2019"></Picker.Item>
              <Picker.Item
                label="Winter 2019"
                value="Winter 2019"
              ></Picker.Item>
              <Picker.Item
                label="Spring 2020"
                value="Spring 2020"
              ></Picker.Item>
              <Picker.Item
                label="Summer 2020"
                value="Summer 2020"
              ></Picker.Item>
              <Picker.Item label="Fall 2020" value="Fall 2020"></Picker.Item>
              <Picker.Item
                label="Winter 2020"
                value="Winter 2020"
              ></Picker.Item>
            </Picker>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                this.ShowHideSemesterPicker();
                this.defaultSemesterValue();
                this.pickSemester();
              }}
            >
              <Text style={styles.cancelButtonText}>DONE</Text>
            </TouchableOpacity>
          </React.Fragment>
        ) : null}
        {/* /*–––––––––––––––––––––––––SCROLL VIEW–––––––––––––––––––––––––*/}
        <ScrollView
          contentContainerStyle={styles.text}
          showsVerticalScrollIndicator={"false"}
          keyboardDismissMode={"on-drag"}
          onScroll={(event) =>
            this.setState(
              { yOffset: event.nativeEvent.contentOffset.y },
              () => {
                this.lazyLoading();
              }
            )
          }
          scrollEventThrottle={0}
        >
          {this.createCards()}
        </ScrollView>
        <CourseInformationPopUp
          courseCode={"CSCI 0160"}></CourseInformationPopUp>
      </View>
    );
  }
}

const CourseInformationPopUp = (courseCode) => (
  <View style={popUpStyles.container}>
    <Modal animationType={"fade"} visible={this.state.isModalVisible}>
      <View style={popUpStyles.modal}>
        <Header
          backgroundColor="#4E342E"
          leftComponent={
            <TouchableOpacity
              onPress={() =>
                this.ShowHidePopUp()
              }
            >
              <Icon name="ios-arrow-back" color="#fafafa" size={35} />
            </TouchableOpacity>
          }
          centerComponent={
            <Text style={popUpStyles.headerTitle}>{courseCode}</Text>
          }
        ></Header>
        <ScrollView contentContainerStyle={popUpStyles.scrollContainer}>
          <Text style={popUpStyles.courseName}>
            {
              CourseData[this.state.currentSemesterCode][courseCode][
              "Course Name"
              ]
            }
          </Text>
          <Text style={popUpStyles.semester}>{this.state.semester}</Text>
          {CourseData[this.state.currentSemesterCode][courseCode][
            "Course Capacity"
          ] !== "" && (
              <React.Fragment>
                <Text style={popUpStyles.subHeader}>Course Capacity:</Text>
                <Text style={popUpStyles.description}>
                  {
                    CourseData[this.state.currentSemesterCode][courseCode][
                    "Course Capacity"
                    ]
                  }
                </Text>
              </React.Fragment>
            )}
          {CourseData[this.state.currentSemesterCode][courseCode][
            "Course Description"
          ] !== "" && (
              <React.Fragment>
                <Text style={popUpStyles.subHeader}>Course Description:</Text>
                <Text style={popUpStyles.description}>
                  {
                    CourseData[this.state.currentSemesterCode][courseCode][
                    "Course Description"
                    ]
                  }
                </Text>
              </React.Fragment>
            )}
          {CourseData[this.state.currentSemesterCode][courseCode][
            "Course Restrictions"
          ] !== "" && (
              <React.Fragment>
                <Text style={popUpStyles.subHeader}>Course Restrictions:</Text>
                <Text style={popUpStyles.description}>
                  {
                    CourseData[this.state.currentSemesterCode][courseCode][
                    "Course Restrictions"
                    ]
                  }
                </Text>
              </React.Fragment>
            )}
          {CourseData[this.state.currentSemesterCode][courseCode][
            "Critical Review"
          ] !== "" && (
              <React.Fragment>
                <Text style={popUpStyles.subHeader}>Critical Review:</Text>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      CourseData[this.state.currentSemesterCode][courseCode][
                      "Critical Review"
                      ]
                    )
                  }
                >
                  <Text
                    style={{
                      textDecorationLine: "underline",
                      marginTop: 3,
                      color: "#757575",
                      fontSize: 17,
                    }}
                  >
                    {
                      CourseData[this.state.currentSemesterCode][courseCode][
                      "Critical Review"
                      ]
                    }
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
            )}
          {CourseData[this.state.currentSemesterCode][courseCode][
            "Exam Time"
          ] !== "" && (
              <React.Fragment>
                <Text style={popUpStyles.subHeader}>Final Exam:</Text>
                <Text style={popUpStyles.description}>
                  {
                    CourseData[this.state.currentSemesterCode][courseCode][
                    "Exam Time"
                    ]
                  }
                </Text>
              </React.Fragment>
            )}
          {CourseData[this.state.currentSemesterCode][courseCode][
            "Course Meeting Time"
          ] !== "" && (
              <React.Fragment>
                <Text style={popUpStyles.subHeader}>Schedule and Location:</Text>
                <Text style={popUpStyles.description}>
                  {
                    CourseData[this.state.currentSemesterCode][courseCode][
                    "Course Meeting Time"
                    ]
                  }
                </Text>
              </React.Fragment>
            )}
          {CourseData[this.state.currentSemesterCode][courseCode][
            "Course Instructor"
          ] !== "" && (
              <React.Fragment>
                <Text style={popUpStyles.subHeader}>Instructor:</Text>
                <Text style={popUpStyles.description}>
                  {
                    CourseData[this.state.currentSemesterCode][courseCode][
                    "Course Instructor"
                    ]
                  }
                </Text>
              </React.Fragment>
            )}
          {CourseData[this.state.currentSemesterCode][courseCode][
            "Section(s)"
          ] !== "" && (
              <React.Fragment>
                <Text style={popUpStyles.subHeader}>Sections:</Text>
                <Text style={popUpStyles.description}>
                  {
                    CourseData[this.state.currentSemesterCode][courseCode][
                    "Section(s)"
                    ]
                  }
                </Text>
              </React.Fragment>
            )}
          <Text style={popUpStyles.subHeader}>Grade Cutoffs:</Text>
          <Text style={popUpStyles.description}>Coming Soon...</Text>
          <View
            style={{ alignItems: "center", marginTop: 15, marginBottom: 10 }}
          >
            <CustomButton title="Add Course"></CustomButton>
          </View>
        </ScrollView>
      </View>
    </Modal>
  </View>
);

const CustomButton = ({ onPress, title }) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.customButtonContainer}
    activeOpacity={0.8}
  >
    <Text style={styles.customButtonText}>{title}</Text>
  </TouchableOpacity>
);

/*–––––––––––––––––––––––––STYLING–––––––––––––––––––––––––*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  searchBox: {
    marginTop: 10,
    height: 55,
    width: "90%",
    padding: 10,
    flexDirection: "row",
    backgroundColor: "#EBEBEB",
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 7,
    justifyContent: "center",
  },
  textInput: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 10,
    padding: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "dimgrey",
  },
  text: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    color: "#fafafa",
    fontWeight: "700",
    letterSpacing: 1,
  },
  concentrationPicker: {
    position: "absolute",
    top: "55%",
    width: "82%",
    backgroundColor: "#fff",
    zIndex: 1,
    height: 250,
    borderColor: "#fafafa",
  },
  cancelButton: {
    position: "absolute",
    top: "54%",
    right: 33,
    height: 50,
    width: 50,
    fontSize: 13,
    backgroundColor: "#fff",
    zIndex: 2,
  },
  cancelButtonText: {
    color: "dimgrey",
    fontSize: 11,
  },
});

const popUpStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  modal: {
    flex: 1,
    backgroundColor: "#4E342E",
    padding: 20,
    alignItems: "center",
  },
  scrollContainer: {
    backgroundColor: "#fff",
    padding: 14,
  },
  headerTitle: {
    fontSize: 30,
    color: "#fafafa",
    fontWeight: "700",
    letterSpacing: 1,
  },
  courseName: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#757575",
  },
  semester: {
    marginTop: 3,
    fontWeight: "bold",
    color: "#757575",
    fontSize: 23,
  },
  subHeader: {
    marginTop: 15,
    fontWeight: "bold",
    color: "#757575",
    fontSize: 20,
  },
  description: {
    marginTop: 3,
    color: "#757575",
    fontSize: 17,
  },
  customButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5ED483",
    borderRadius: 15,
    paddingVertical: 17,
    paddingHorizontal: 12,
    width: "80%",
  },
  customButtonText: {
    fontSize: 18,
    color: "#fafafa",
    fontWeight: "bold",
    alignSelf: "center",
  },
});

export default SearchScreen;
