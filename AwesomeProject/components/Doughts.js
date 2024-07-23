import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import FileUpload from './FileUpload';
import ReactNativeAsyncStorage from"@react-native-async-storage/async-storage";
import AssignmentList from './AssignmentList';
import { auth,db } from '../configfirebase';
import { useState } from 'react';
function Doughts() {
   const [role,setRole]=useState("");
   const [regSubs,setRegSubs]=React.useState([]);
   
   React.useEffect(()=>{
     const fetchData = async () => {
       try {
         const storedData=await ReactNativeAsyncStorage.getItem("userDetails");
         const userData = JSON.parse(storedData);
         setRole(userData.role);
       } catch (e) {
         console.log('Error fetching data:', e.message);
       }
     };
     fetchData(); 
   },[]);


  return (
    <ScrollView style={styles.container}>
      
      <View style={styles.section}>
        <AssignmentList role={role}/>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
});

export default Doughts;
