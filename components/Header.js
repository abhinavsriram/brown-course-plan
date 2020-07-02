import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import DrawerTrigger from './DrawerTrigger'

class Header extends React.Component {
  render() {
    return (
      <View style={styles.header}>
        <DrawerTrigger />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 40,
    backgroundColor: 'whitesmoke'
  }
});

export default Header;