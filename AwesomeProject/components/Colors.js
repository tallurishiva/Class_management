import React from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function Colors(props){
    const styles = StyleSheet.create({
        container: {
          flex:1,
          height:100,
          margin:10,
          backgroundColor:props.color,
          display:"flex",
          alignItems: 'center',
          justifyContent: 'center',
        },
      });
    return (
      <View style={styles.container}>
        <Text >{props.color}</Text>
        <StatusBar style="auto" />
      </View>
    );
  }