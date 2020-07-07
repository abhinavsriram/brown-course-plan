import React from "react";
import { View, StyleSheet } from "react-native";

import ScreenName from "../components/ScreenName.js";

import Header from "../components/Header.js";

export default class ScreenOne extends React.Component {
  static navigationOptions = {};

  render() {
    return (
      <React.Fragment>
        <Header />
        <View style={styles.container}>
          <ScreenName name={"Screen One"} />
        </View>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
