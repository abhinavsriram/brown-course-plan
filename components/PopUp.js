import React, { Component } from "react";

import { Modal, Button, View, Text, StyleSheet } from "react-native";

import SwitchSelector from "react-native-switch-selector";
import { TouchableOpacity } from "react-native-gesture-handler";

class PopUp extends Component {
  state = {
    isModalVisible: false,
    gradeMode: "abc",
    concentrationRequirement: "yes",
    writRequirement: "yes",
    fullhalfCredit: "full",
  };

  setDefaultValues = () => {
    this.setState({ gradeMode: "abc" });
    this.setState({ concentrationRequirement: "yes" });
    this.setState({ writRequirement: "yes" });
    this.setState({ fullhalfCredit: "full" });
  };

  printResults = () => {
    console.log("gradeMode is", this.state.gradeMode);
    console.log(
      "concentrationRequirement is",
      this.state.concentrationRequirement
    );
    console.log("writRequirement is", this.state.writRequirement);
    console.log("fullhalfCredit is", this.state.fullhalfCredit);
  };

  render() {
    return (
      <View style={styles.container}>
        <Button
          title="Click"
          onPress={() => {
            this.setState({ isModalVisible: true });
          }}
        />
        <Modal animationType={"fade"} visible={this.state.isModalVisible}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.title}>Course Details</Text>
            </View>
            <View style={styles.content}>
              <View style={styles.rowContent}>
                <View style={styles.itemContainer}>
                  <Text style={styles.item}>Grade Mode</Text>
                  <SwitchSelector
                    initial={1}
                    textColor={"#4E342E"}
                    selectedColor={"white"}
                    buttonColor={"#4E342E"}
                    borderColor={"#4E342E"}
                    hasPadding
                    options={[
                      { label: "S/NC", value: "snc" },
                      { label: "A/B/C/NC", value: "abc" },
                    ]}
                    style={styles.item}
                    onPress={(value) => this.setState({ gradeMode: value })}
                  />
                </View>
              </View>
              <View style={styles.rowContent}>
                <View style={styles.itemContainer}>
                  <Text style={styles.item}>Concentration Requirement</Text>
                  <SwitchSelector
                    initial={1}
                    textColor={"#4E342E"}
                    selectedColor={"white"}
                    buttonColor={"#4E342E"}
                    borderColor={"#4E342E"}
                    hasPadding
                    options={[
                      { label: "No", value: "no" },
                      { label: "Yes", value: "yes" },
                    ]}
                    style={styles.item}
                    onPress={(value) =>
                      this.setState({ concentrationRequirement: value })
                    }
                  />
                </View>
              </View>
              <View style={styles.rowContent}>
                <View style={styles.itemContainer}>
                  <Text style={styles.item}>WRIT Requirement</Text>
                  <SwitchSelector
                    initial={1}
                    textColor={"#4E342E"}
                    selectedColor={"white"}
                    buttonColor={"#4E342E"}
                    borderColor={"#4E342E"}
                    hasPadding
                    options={[
                      { label: "No", value: "no" },
                      { label: "Yes", value: "yes" },
                    ]}
                    style={styles.item}
                    onPress={(value) =>
                      this.setState({ writRequirement: value })
                    }
                  />
                </View>
              </View>
              <View style={styles.rowContent}>
                <View style={styles.itemContainer}>
                  <Text style={styles.item}>Full Credit/Half Credit</Text>
                  <SwitchSelector
                    initial={1}
                    textColor={"#4E342E"}
                    selectedColor={"white"}
                    buttonColor={"#4E342E"}
                    borderColor={"#4E342E"}
                    hasPadding
                    options={[
                      { label: "0.5", value: "half" },
                      { label: "1", value: "full" },
                    ]}
                    style={styles.item}
                    onPress={(value) =>
                      this.setState({ fullhalfCredit: value })
                    }
                  />
                </View>
              </View>
            </View>
            <Button
              title="Done"
              color="#fff"
              onPress={() => {
                this.setState({ isModalVisible: false });
                this.setDefaultValues();
                this.printResults();
              }}
            />
          </View>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    flex: 1,
    backgroundColor: "#4E342E",
    // marginTop: "15%",
    // marginBottom: "15%",
    // marginLeft: "10%",
    // marginRight: "10%",
    // borderRadius: 25,
    padding: 20,
  },
  header: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    color: "white",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rowContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  itemContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: "white",
    marginBottom: 4,
  },
});

export default PopUp;
