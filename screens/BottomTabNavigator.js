/*–––––––––––––––––––––––––REACT IMPORTS–––––––––––––––––––––––––*/
import React from "react";
import { createBottomTabNavigator } from "react-navigation-tabs";

/*–––––––––––––––––––––––––CUSTOM IMPORTS–––––––––––––––––––––––––*/
import GradesScreen from "./GradesScreen";
import CalendarScreen from "./CalendarScreen";
import RequirementsScreen from "./RequirementsScreen";
import SearchScreen from "./SearchScreen";
import DashboardScreen from "./DashboardScreen";

/*–––––––––––––––––––––––––ICONS IMPORT–––––––––––––––––––––––––*/
import Icon from "react-native-vector-icons/Ionicons";

/*–––––––––––––––––––––––––BOTTOM TAB NAVIGATOR COMPONENT–––––––––––––––––––––––––*/
export default createBottomTabNavigator(
  {
    Grades: {
      screen: GradesScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-folder-open" color={tintColor} size={40} />
        ),
      },
    },
    Calendar: {
      screen: CalendarScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-calendar" color={tintColor} size={40} />
        ),
      },
    },
    Dashboard: {
      screen: DashboardScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-filing" color={tintColor} size={40} />
        ),
      },
    },
    Requirements: {
      screen: RequirementsScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-list" color={tintColor} size={40} />
        ),
      },
    },
    Search: {
      screen: SearchScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-search" color={tintColor} size={38} />
        ),
      },
    },
  },
  /*–––––––––––––––––––––––––STYLING–––––––––––––––––––––––––*/
  {
    tabBarOptions: {
      activeTintColor: "#89655D",
      inactiveTintColor: "white",
      labelStyle: {
        fontSize: 11,
        fontWeight: "400",
      },
      style: {
        height: 75,
        backgroundColor: "#4E342E",
      },
      showLabel: false,
    },
    initialRouteName: "Dashboard",
  }
);
