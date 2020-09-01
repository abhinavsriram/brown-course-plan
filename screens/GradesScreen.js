import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Header } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "react-navigation-drawer";
import { AdMobBanner } from "expo-ads-admob";

class GradesScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Header
          backgroundColor="#4E342E"
          centerComponent={<Text style={styles.title}>Grades</Text>}
        >
          <TouchableOpacity
            style={styles.trigger}
            onPress={() => {
              this.props.navigation.dispatch(DrawerActions.openDrawer());
            }}
          >
            <Ionicons name={"md-menu"} size={32} color={"white"} />
          </TouchableOpacity>
        </Header>
        <ScrollView
          contentContainerStyle={{ alignItems: "center", width: "80%" }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={"false"}
        >
          <View style={styles.comingSoonContainer}>
            <Text style={styles.comingSoonText}>Coming Soon....</Text>
          </View>
          {/* <AdMobBanner
            style={styles.banner1}
            bannerSize="largeBanner"
            adUnitID="ca-app-pub-3940256099942544/6300978111"
            testDeviceID="EMULATOR"
          />
          <AdMobBanner
            style={styles.banner2}
            bannerSize="largeBanner"
            adUnitID="ca-app-pub-3940256099942544/6300978111"
            testDeviceID="EMULATOR"
          />
          <AdMobBanner
            style={styles.banner3}
            bannerSize="largeBanner"
            adUnitID="ca-app-pub-3940256099942544/6300978111"
            testDeviceID="EMULATOR"
          />
          <AdMobBanner
            style={styles.banner4}
            bannerSize="largeBanner"
            adUnitID="ca-app-pub-3940256099942544/6300978111"
            testDeviceID="EMULATOR"
          /> */}
          {/* <AdMobBanner
            style={styles.banner5}
            bannerSize="largeBanner"
            adUnitID="ca-app-pub-3940256099942544/6300978111"
            testDeviceID="EMULATOR"
          />
          <Text
            style={{ color: "#4E342E", fontWeight: "500", fontStyle: "italic" }}
          >
            These advertisements are part of a revenue model we are testing
            that, at least initially, will only exist to cover running costs
            associated with the app. {"\n"} {"\n"}
            Alternatively we may charge a very small annual fee of $1 or $2 to
            cover these costs. Please let us know (through the Suggestions Page)
            which model you would prefer.
          </Text> */}
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
  title: {
    fontSize: 30,
    color: "#fafafa",
    fontWeight: "700",
    letterSpacing: 1,
  },
  comingSoonContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    top: 15,
  },
  comingSoonText: {
    color: "#4E342E",
    fontSize: 28,
    fontStyle: "italic",
    fontWeight: "bold",
    marginBottom: 10,
  },
  banner1: {
    alignContent: "center",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 20,
    // position: "absolute",
    // bottom: 20,
  },
  banner2: {
    alignContent: "center",
    alignItems: "center",
    marginBottom: 15,
    // position: "absolute",
    // bottom: 140,
  },
  banner3: {
    alignContent: "center",
    alignItems: "center",
    marginBottom: 15,
    // position: "absolute",
    // bottom: 260,
  },
  banner4: {
    alignContent: "center",
    alignItems: "center",
    marginBottom: 15,
    // position: "absolute",
    // bottom: 380,
  },
  banner5: {
    alignContent: "center",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 15,
    // position: "absolute",
    // bottom: 500,
  },
});

export default GradesScreen;
