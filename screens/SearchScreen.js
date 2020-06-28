/*–––––––––––––––––––––––––REACT IMPORTS–––––––––––––––––––––––––*/
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  Keyboard,
} from "react-native";
import {
  TextInput,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { Header } from "react-native-elements";

/*–––––––––––––––––––––––––FIREBASE IMPORT–––––––––––––––––––––––––*/
import * as firebase from "firebase";
import "firebase/firestore";

/*–––––––––––––––––––––––––ICONS IMPORT–––––––––––––––––––––––––*/
import Icon from "react-native-vector-icons/Ionicons";

/*–––––––––––––––––––––––––CUSTOM IMPORTS–––––––––––––––––––––––––*/
import CourseData from "./../data/Spring2020CourseInformation.json";
import stopWordsList from "./../data/StopWordsList";
import CourseCard from "../components/CourseCardSearch";
import CourseList from "./../data/CourseList";

/*–––––––––––––––––––––––––SEARCH SCREEN COMPONENT–––––––––––––––––––––––––*/
class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      searchValue: "",
      navigation: this.props.navigation,
    };
  }

  getPropertyByIndex = (obj, index) => {
    return obj[Object.keys(obj)[index]];
  };

  createKeywordArrayHelper = (toSplit) => {
    const keywordArray = [];
    let currKeyword = "";
    toSplit.split("").forEach((toSplitChar) => {
      currKeyword += toSplitChar;
      keywordArray.push(currKeyword);
    });
    return keywordArray;
  };

  createKeywordArrayOneCourse = (toSplit) => {
    const [courseCode, courseName, courseInstr] = toSplit;
    const keywordArrayCourseCodeWithSpace = this.createKeywordArrayHelper(
      courseCode.toLowerCase()
    );
    const keywordArrayCourseCodeWithoutSpace = this.createKeywordArrayHelper(
      courseCode.toLowerCase().split(" ").join("")
    );
    const keywordArrayCourseNameWithStopWords = this.createKeywordArrayHelper(
      courseName.toLowerCase()
    );
    const tempValue = courseName
      .toLowerCase()
      .split(" ")
      .filter((xYz) => !stopWordsList.includes(xYz))
      .map((currWord) => this.createKeywordArrayHelper(currWord));
    const keywordArrayCourseNameWithoutStopWords = [].concat(...tempValue);
    const keywordArrayCourseInstrFullName = this.createKeywordArrayHelper(
      courseInstr.toLowerCase()
    );
    const keywordArrayCourseInstrLastName = this.createKeywordArrayHelper(
      courseInstr.toLowerCase().split(" ").pop()
    );
    return [
      ...new Set([
        "",
        ...keywordArrayCourseCodeWithSpace,
        ...keywordArrayCourseCodeWithoutSpace,
        ...keywordArrayCourseNameWithStopWords,
        ...keywordArrayCourseNameWithoutStopWords,
        ...keywordArrayCourseInstrFullName,
        ...keywordArrayCourseInstrLastName,
      ]),
    ];
  };

  createKeywordArrayAllCourses = () => {
    let courseKeywordsList = [];
    for (let i = 0; i < Object.keys(CourseData).length; i++) {
      const courseCode = this.getPropertyByIndex(CourseData, i)["Course_Code"];
      const courseName = this.getPropertyByIndex(CourseData, i)["Course Name"];
      const courseInstr = this.getPropertyByIndex(CourseData, i)[
        "Course Instructor"
      ];
      const courseKeyword = this.createKeywordArrayOneCourse([
        courseCode,
        courseName,
        courseInstr,
      ]);
      courseKeywordsList.push(courseKeyword);
    }
    return courseKeywordsList;
  };

  createFullDatabase = () => {
    const courseKeywordsList = this.createKeywordArrayAllCourses();
    for (let i = 0; i < Object.keys(CourseData).length; i++) {
      this.getPropertyByIndex(CourseData, i)["Keywords"] =
        courseKeywordsList[i];
    }
    return CourseData;
  };

  // call onKeyPress={() => this.writeToFirestore(this.createFullDatabase())} to upload information

  writeToFirestore = (data) => {
    if (data && typeof data === "object") {
      Object.keys(data).forEach((docKey) => {
        firebase
          .firestore()
          .collection("spring-2020")
          .doc(docKey)
          .set(data[docKey])
          .then((res) => {
            console.log("document " + docKey + " successfully written!");
          })
          .catch((error) => {
            console.error("error writing document: ", error);
          });
      });
    }
  };

  searchEngine = async (searchInput) => {
    if (CourseList.includes(searchInput.toUpperCase())) {
      searchInput = searchInput + " ";
    }
    const querySnapshot = await firebase
      .firestore()
      .collection("spring-2020")
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

  render() {
    return (
      <View style={styles.container}>
        <Header
          backgroundColor="#4E342E"
          leftComponent={{ icon: "menu", color: "#fff", size: 30 }}
          centerComponent={<Text style={styles.title}>Search</Text>}
        ></Header>
        <View style={styles.searchBox}>
          <Icon name="ios-search" size={20} />
          <TextInput
            placeholder="Course Code, Name, Instructor "
            placeholderTextColor="dimgrey"
            style={styles.textInput}
            onChangeText={(text) =>
              this.setState({ searchValue: text }, async () => {
                await this.searchEngine(this.state.searchValue);
              })
            }
            value={this.state.searchValue}
            autoCorrect={false}
          />
        </View>
        <ScrollView contentContainerStyle={styles.text}>
          {this.state.searchResults.map((courseCode, index) => {
            return (
              <CourseCard
                key={index}
                navigation={this.props.navigation}
                courseCode={courseCode}
                courseName={CourseData[courseCode]["Course Name"]}
                instructor={CourseData[courseCode]["Course Instructor"]}
                meetingTime={CourseData[courseCode]["Course Meeting Time"]}
              ></CourseCard>
            );
          })}
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
  },
  textInput: {
    flex: 1,
    alignSelf: "stretch",
    padding: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
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
});

export default SearchScreen;
