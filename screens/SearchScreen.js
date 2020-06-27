/*–––––––––––––––––––––––––REACT IMPORTS–––––––––––––––––––––––––*/
import React, { Component } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { Header } from "react-native-elements";

/*–––––––––––––––––––––––––FIREBASE IMPORT–––––––––––––––––––––––––*/
import * as firebase from "firebase";
import "firebase/firestore";

/*–––––––––––––––––––––––––ICONS IMPORT–––––––––––––––––––––––––*/
import Icon from "react-native-vector-icons/Ionicons";

/*–––––––––––––––––––––––––CUSTOM IMPORTS–––––––––––––––––––––––––*/
import courseData from "./../data/spring2020CourseInformation.json";

/*–––––––––––––––––––––––––SEARCH SCREEN COMPONENT–––––––––––––––––––––––––*/
class SearchScreen extends Component {
  state = {
    searchValue: "",
  };

  // 1614

  getPropertyByIndex = (obj, index) => {
    return obj[Object.keys(obj)[index]];
  };

  createKeywordArrayMaster = () => {
    let courseCodeList = [];
    let courseNameList = [];
    let courseInstrList = [];
    for (let i = 0; i < Object.keys(courseData).length; i++) {
      const courseCode = this.getPropertyByIndex(courseData, i)["Course Code"];
      const courseName = this.getPropertyByIndex(courseData, i)["Course Name"];
      const courseInstr = this.getPropertyByIndex(courseData, i)[
        "Course Instr"
      ];
      courseCodeList.push(courseCode);
      courseNameList.push(courseName);
      courseInstrList.push(courseInstr);
    }
    // loop
    // course.keywords = createKeywordArray([courseCodeList[i], courseNameList[i], courseInstrList[i]])

    // for (let j = 100; j < 500; j++) {
    //   this.writeToDatabase(courseCodeList[j]);
    // }
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

  createKeywordArray = (toSplit) => {
    const [courseCode, courseName, courseInstr] = toSplit;
    const keywordArrayCourseCodeWithSpace = this.createKeywordArrayHelper(
      courseCode.toLowerCase()
    );
    const keywordArrayCourseCodeWithoutSpace = this.createKeywordArrayHelper(
      courseCode.split(" ").join("").toLowerCase()
    );
    const keywordArrayCourseName = this.createKeywordArrayHelper(
      courseName.toLowerCase()
    );
    const keywordArrayCourseInstrFullName = this.createKeywordArrayHelper(
      courseInstr.toLowerCase()
    );
    const keywordArrayCourseInstrLastName = this.createKeywordArrayHelper(
      courseInstr.split(" ").pop().toLowerCase()
    );
    return [
      ...new Set([
        "",
        ...keywordArrayCourseCodeWithSpace,
        ...keywordArrayCourseCodeWithoutSpace,
        ...keywordArrayCourseName,
        ...keywordArrayCourseInstrFullName,
        ...keywordArrayCourseInstrLastName,
      ]),
    ];
  };

  readFromDatabase = (courseCode) => {
    const keywordArray = [];
    keywordArray.push(courseCode);
    var courseName = "";
    var courseInstr = "";
    firebase
      .firestore()
      .collection("spring-2020")
      .doc(courseCode)
      .get()
      .then((doc) => {
        if (doc.exists) {
          courseName = doc.data()["Course Name"];
          courseInstr = doc.data()["Course Instructor"];
          keywordArray.push(courseName);
          keywordArray.push(courseInstr);
        } else {
          console.log("Error");
        }
      });
    return keywordArray;
  };

  writeToDatabase = (courseCode) => {
    const keywordArray = this.readFromDatabase(courseCode);
    setTimeout(() => {
      firebase
        .firestore()
        .collection("spring-2020")
        .doc(courseCode)
        .set(
          {
            Keywords: this.createKeywordArray(keywordArray),
          },
          { merge: true }
        );
    }, 5000);
  };

  searchEngine = async (searchInput) => {
    const querySnapshot = await firebase
      .firestore()
      .collection("spring-2020")
      .where("Keywords", "array-contains", searchInput.toLowerCase())
      .orderBy("Course_Code")
      .get();
    const result = querySnapshot.docs;
    result.forEach((course) => {
      console.log(course.get("Course_Code"));
    });
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
            placeholder="Course Code, Name, Field, Instructor "
            placeholderTextColor="dimgrey"
            style={styles.textInput}
            onChangeText={(text) => this.setState({ searchValue: text })}
            value={this.state.searchValue}
            onKeyPress={async () => {
              await this.searchEngine(this.state.searchValue);
            }}
            // onKeyPress={() => this.createKeywordArrayMaster()}
          />
        </View>
        <ScrollView contentContainerStyle={styles.text}></ScrollView>
      </View>
    );
  }
}

/*–––––––––––––––––––––––––SEARCH SCREEN STYLING–––––––––––––––––––––––––*/
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
    flex: 1,
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
