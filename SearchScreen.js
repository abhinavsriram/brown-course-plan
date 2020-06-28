import React, { Component } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import { TextInput } from "react-native-gesture-handler";
import { Header } from "react-native-elements";

import * as firebase from "firebase";
import "firebase/firestore";

class SearchScreen extends Component {

  // state = {
  //   keywordArray: []
  // }

  // createKeywordArrayHelper = (toSplit) => {
  //   const keywordArray = [];
  //   let currKeyword = "";
  //   toSplit.split("").forEach((toSplitChar) => {
  //     currKeyword += toSplitChar;
  //     keywordArray.push(currKeyword);
  //   });
  //   return keywordArray;
  // }

  // createKeywordArray = (toSplit) => {
  //   const [courseCode, courseName, courseInstr,] = toSplit;
  //   const keywordArrayCourseCodeWithSpace =
  //     this.createKeywordArrayHelper(courseCode.toLowerCase());
  //   const keywordArrayCourseCodeWithoutSpace =
  //     this.createKeywordArrayHelper(courseCode.split(" ").join("").toLowerCase());
  //   const keywordArrayCourseName =
  //     this.createKeywordArrayHelper(courseName.toLowerCase());
  //   const keywordArrayCourseInstrFullName =
  //     this.createKeywordArrayHelper(courseInstr.toLowerCase());
  //   const keywordArrayCourseInstrLastName =
  //     this.createKeywordArrayHelper(courseInstr.split(" ").pop().toLowerCase());
  //   return [
  //     ...new Set([
  //       "",
  //       ...keywordArrayCourseCodeWithSpace,
  //       ...keywordArrayCourseCodeWithoutSpace,
  //       ...keywordArrayCourseName,
  //       ...keywordArrayCourseInstrFullName,
  //       ...keywordArrayCourseInstrLastName,
  //     ])
  //   ];
  // };

  // readFromDatabase = () => {
  //   this.setState(
  //     {
  //       keywordArray: [...this.state.keywordArray, "AFRI 1020C"],
  //     })
  //   var courseName = "";
  //   var courseInstr = "";
  //   let flag = false;
  //   firebase
  //     .firestore()
  //     .collection("spring-2020")
  //     .doc("AFRI 1020C")
  //     .get()
  //     .then((doc) => {
  //       if (doc.exists) {
  //         courseName = doc.data()["Course Name"];
  //         courseInstr = doc.data()["Course Instructor"];
  //         this.setState(
  //           {
  //             keywordArray: [...this.state.keywordArray, courseName, courseInstr],
  //           }
  //         )
  //       } else {
  //         console.log("Error");
  //       }
  //     });
  // };

  // writeToDatabase = () => {
  //   this.readFromDatabase();
  //   setTimeout(() => firebase
  //     .firestore()
  //     .collection("spring-2020")
  //     .doc("AFRI 1020C")
  //     .set({
  //       Course_Code: "AFRI 1020C",
  //       Keywords: this.createKeywordArray(this.state.keywordArray)
  //     }, { merge: true }), 10000)
  // };

  // searchEngine = async (searchInput) => {
  //   const querySnapshot = await
  //     firebase
  //       .firestore()
  //       .collection("spring-2020")
  //       .where("Keywords", "array-contains", searchInput.toLowerCase())
  //       .orderBy("Course_Code")
  //       .get();
  //   console.log(querySnapshot.docs[0].get("Course Name"));
  // }
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
    const keywordArrayCourseCodeWithSpace = this.createKeywordArrayHelper(courseCode.toLowerCase());
    const keywordArrayCourseCodeWithoutSpace = this.createKeywordArrayHelper(courseCode.toLowerCase().split(" ").join(""));
    const keywordArrayCourseNameWithStopWords = this.createKeywordArrayHelper(courseName.toLowerCase());
    const tempValue = courseName.toLowerCase().split(" ").filter(xYz => !stopWordsList.includes(xYz)).map(currWord => this.createKeywordArrayHelper(currWord));
    const keywordArrayCourseNameWithoutStopWords = [].concat(...tempValue);
    const keywordArrayCourseInstrFullName = this.createKeywordArrayHelper(courseInstr.toLowerCase());
    const keywordArrayCourseInstrLastName = this.createKeywordArrayHelper(courseInstr.toLowerCase().split(" ").pop());
    return [
      ...new Set([
        "",
        ...keywordArrayCourseCodeWithSpace,
        ...keywordArrayCourseCodeWithoutSpace,
        ...keywordArrayCourseNameWithStopWords,
        ...keywordArrayCourseNameWithoutStopWords,
        ...keywordArrayCourseInstrFullName,
        ...keywordArrayCourseInstrLastName,
      ])
    ];
  };

  createKeywordArrayAllCourses = () => {
    let courseKeywordsList = [];
    for (let i = 0; i < Object.keys(CourseData).length; i++) {
      const courseCode = this.getPropertyByIndex(CourseData, i)["Course Code"];
      const courseName = this.getPropertyByIndex(CourseData, i)["Course Name"];
      const courseInstr = this.getPropertyByIndex(CourseData, i)["Course Instructor"];
      const courseKeyword = this.createKeywordArrayOneCourse([courseCode, courseName, courseInstr]);
      courseKeywordsList.push(courseKeyword);
    };
    return courseKeywordsList;
  };

  createFullDatabase = () => {
    const courseKeywordsList = this.createKeywordArrayAllCourses();
    for (let i = 0; i < Object.keys(CourseData).length; i++) {
      this.getPropertyByIndex(CourseData, i)["Keywords"] = courseKeywordsList[i];
    };
    return CourseData;
  };

  writeToFirestore = () => {
    const admin = require('./node_modules/firebase-admin');
    const serviceAccount = require("./data/serviceAccountKey.json");
    // const data = require("./data.json");
    const data = this.createFullDatabase();
    const collectionKey = "spring-2020"; //name of the collection
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://brown-cp.firebaseio.com"
    });
    const firestore = admin.firestore();
    const settings = { timestampsInSnapshots: true };
    firestore.settings(settings);
    if (data && (typeof data === "object")) {
      Object.keys(data).forEach(docKey => {
        firestore.collection(collectionKey).doc(docKey).set(data[docKey]).then((res) => {
          console.log("Document " + docKey + " successfully written!");
        }).catch((error) => {
          console.error("Error writing document: ", error);
        });
      });
    }
  };

  // writeToFirestore = () => {
  //   firebase
  //   .firestore()
  //   .collection("spring-2020")
  //   .set
  // }

  render() {
    return (
      <View style={styles.container}>
        <Button
          title="Click Here"
          onPress={() => this.writeToFirestore()}
        >
        </Button>
      </View>
    );
  }
};

// render() {
//   return (
//     <View style={styles.container}>
//       <Header
//         backgroundColor="#4E342E"
//         leftComponent={{ icon: "menu", color: "#fff", size: 30 }}
//         centerComponent={<Text style={styles.title}>Search</Text>}
//       ></Header>
//       <View style={styles.searchBox}>
//         <Icon name="ios-search" size={20} />
//         <TextInput
//           placeholder="Course Code, Name, Field, Instructor "
//           placeholderTextColor="dimgrey"
//           style={styles.textInput}
//           onKeyPress={async () => await this.searchEngine("AF")}
//         />
//       </View>
//       <ScrollView contentContainerStyle={styles.text}></ScrollView>
//     </View>
//   );
// }
// }

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
