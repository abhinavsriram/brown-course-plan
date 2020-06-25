import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ImageBackground,
} from "react-native";

import * as Google from "expo-google-app-auth";

import firebase from "firebase";

/*–––––––––––––––––––––––––LOGIN SCREEN COMPONENT–––––––––––––––––––––––––*/
class LoginScreen extends Component {
  state = {
    userID: "",
  };
  // primary function handling logic of google-sign-in
  onSignIn = (googleUser) => {
    var unsubscribe = firebase.auth().onAuthStateChanged(
      function (firebaseUser) {
        unsubscribe();
        if (!this.isUserEqual(googleUser, firebaseUser)) {
          var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
          );
          firebase
            .auth()
            .signInWithCredential(credential)
            .then(function (result) {
              console.log("Signed-In and Authenticated.");
              if (result.additionalUserInfo.isNewUser) {
                firebase
                  .database()
                  .ref(
                    "/user-information/" +
                      result.additionalUserInfo.profile.given_name +
                      result.additionalUserInfo.profile.family_name
                  )
                  .set({
                    gmail: result.user.email,
                    profile_picture: result.additionalUserInfo.profile.picture,
                    first_name: result.additionalUserInfo.profile.given_name,
                    last_name: result.additionalUserInfo.profile.family_name,
                    created_at: Date.now(),
                  });
              } else {
                firebase
                  .database()
                  .ref(
                    "/user-information/" +
                      result.additionalUserInfo.profile.given_name +
                      result.additionalUserInfo.profile.family_name
                  )
                  .update({
                    last_logged_in: Date.now(),
                  });
              }
            })
            .catch(function (error) {
              var errorCode = error.code;
              var errorMessage = error.message;
              var email = error.email;
              var credential = error.credential;
            });
        } else {
          console.log("Already Authenticated.");
        }
      }.bind(this)
    );
  };
  // secondary function checking if user is already logged in
  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          return true;
        }
      }
    }
    return false;
  };
  // sign-in pop up
  signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        // androidClientId: YOUR_CLIENT_ID_HERE,
        iosClientId:
          "717345530706-0f5t37g5tsouijmb4ec41mc84j5gttl3.apps.googleusercontent.com",
        scopes: ["profile", "email"],
      });
      if (result.type === "success") {
        this.onSignIn(result);
        this.setState({
          userID: result.user.givenName + result.user.familyName,
        });
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };
  /*–––––––––––––––––––––––––RENDER METHOD–––––––––––––––––––––––––*/
  render() {
    return (
      <View style={styles.wholeScreen}>
        <ImageBackground
          style={styles.backgroundImageStyle}
          source={require("./../assets/background-alt.png")}
        ></ImageBackground>
        <Text style={styles.title}>Brown Course Plan</Text>
        <GoogleLogInButton
          title="Sign In With Google"
          onPress={() => this.signInWithGoogleAsync()}
        ></GoogleLogInButton>
      </View>
    );
  }
}

/*–––––––––––––––––––––––––STYLING FOR HEADER AND LOG-IN BUTTON–––––––––––––––––––––––––*/
const styles = StyleSheet.create({
  wholeScreen: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  googleLogInButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4E342E",
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 12,
    width: "80%",
    position: "absolute",
    bottom: 40,
    left: 40,
  },
  googleLogInButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
  },
  googleLogo: {
    marginLeft: 5,
    width: 37,
    height: 40,
    resizeMode: "cover",
  },
  separatorSpace: {
    backgroundColor: "#4E342E",
    width: 33,
    height: 40,
  },
  title: {
    color: "#4E342E",
    fontWeight: "bold",
    alignSelf: "center",
    fontSize: 40,
    position: "absolute",
    top: "10%",
  },
  backgroundImageStyle: {
    flex: 1,
    position: "absolute",
    top: "20%",
    width: Dimensions.get("window").width,
    height: 0.6 * Dimensions.get("window").height,
  },
});

/*–––––––––––––––––––––––––LOG-IN BUTTON COMPONENT–––––––––––––––––––––––––*/
const GoogleLogInButton = ({ onPress, title }) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.googleLogInButtonContainer}
    activeOpacity={0.8}
  >
    <Image
      style={styles.googleLogo}
      source={require("./../assets/google-logo.png")}
    ></Image>
    <View style={styles.separatorSpace}></View>
    <Text style={styles.googleLogInButtonText}>{title}</Text>
  </TouchableOpacity>
);

/*–––––––––––––––––––––––––CREATING CARDS–––––––––––––––––––––––––*/

// an array that stores all the information that is to be displayed on each of the cards
const INFORMATION = [
  {
    id: "card-1",
    title: "Create a 4-Year Course Plan",
  },
  {
    id: "card-2",
    title: "Track Your Grades",
  },
  {
    id: "card-3",
    title: "Track Your Requirements",
  },
];

// component representing each of the "cards"
const Item = ({ title }) => (
  <View style={CardStyles.item}>
    <Text style={CardStyles.title}>{title}</Text>
  </View>
);

const cardWidth = 0.75 * Dimensions.get("window").width;

// components to be rendered i.e. the collection of cards as a flatlist
const Card = () => (
  <SafeAreaView style={CardStyles.container} alignItems={"center"}>
    <FlatList
      data={INFORMATION}
      renderItem={({ item }) => <Item title={item.title} />}
      keyExtractor={(item) => item.id}
      horizontal={true}
      decelerationRate={"fast"}
      showsHorizontalScrollIndicator={false}
    />
  </SafeAreaView>
);

/*–––––––––––––––––––––––––STYLING FOR CARDS–––––––––––––––––––––––––*/
const CardStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 125,
    marginLeft: 47,
  },
  item: {
    backgroundColor: "#26A69A",
    padding: 20,
    marginRight: 10,
    borderRadius: 20,
    width: cardWidth,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    color: "#fafafa",
    fontWeight: "500",
  },
});

export default LoginScreen;
