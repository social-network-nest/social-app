import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessagesScreen = () => (
  <View style={styles.container}>
    <Text>Messages Screen</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MessagesScreen;
