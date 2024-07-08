import React from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function Navbar() {
    const styles = StyleSheet.create({
        container: {
          padding:"5%",
          width:"100%",
          display:"flex",
          justifyContent: 'center',
        },
      });
    return (
      <View style={styles.container}>
        <Text style={{fontSize:30,margin:10}}>Hi shiva!</Text>
        <StatusBar style="auto" />
      </View>
    );
  }