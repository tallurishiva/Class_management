import React from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function Footer() {
    const styles = StyleSheet.create({
        container: {
          padding:"5%",
          width:"100%",
          backgroundColor:"black",
          display:"flex",
          alignItems: 'center',
          justifyContent: 'center',
        },
      });
    return (
      <View style={styles.container}>
        <Text style={{color:"#fff",fontSize:20}}>Footer</Text>
        <StatusBar style="auto" />
      </View>
    );
  }