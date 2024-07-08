import React, { useState, useEffect } from 'react';
import { View, Text, RefreshControl, ScrollView, TextInput,TouchableOpacity } from 'react-native';
import { auth, db } from '../configfirebase';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

function MarkAttendence() {
  const [role, setRole] = useState("");
  const [classDetails, setClassDetails] = useState([]);
  const [upclassDetails, setupClassDetails] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = await ReactNativeAsyncStorage.getItem("userDetails");
        const userData = JSON.parse(storedData);
        setRole(userData.role);
      } catch (e) {
        console.log('Error fetching data:', e.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (role === 'student') {
          const res = collection(db, "EnrollReq");
          const q = query(res, where("studentID", "==", auth.currentUser.uid), where("status", "==", true));
          const querySnapshot = await getDocs(q);
          const fetchedStates = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data().subjectID;
            fetchedStates.push(data);
            console.log("in Enroll " + data);
          });
          setSubjects(fetchedStates);
        } else {
          const res = collection(db, "RegisteredSubjets");
          const q = query(res, where("ProfID", "==", auth.currentUser.uid));
          const querySnapshot = await getDocs(q);
          const fetchedStates = [];
          querySnapshot.forEach((doc) => {
            const id = doc.id;
            fetchedStates.push(id);
          });
          setSubjects(fetchedStates);
        }
      } catch (e) {
        console.log('Error fetching data:', e.message);
      }
    };
    fetchData();
  }, [role]); // Include role in the dependency array

  const fetchClasses = async () => {
    try {
      const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });
      const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const currentWeekday = weekdays[new Date().getDay()];

      // Only execute the Firestore query if subjects array is not empty
      if (subjects.length > 0) {
        const q = query(collection(db, 'schdules'),
          where("weekDay", "==", currentWeekday),
          where("subID", "in", subjects),
          where("endTime", ">", currentTime),
          orderBy("startTime")
        );

        const querySnapshot = await getDocs(q);
        const classes = [];
        const upcoming = [];
        querySnapshot.forEach((doc) => {
          if (doc.data().startTime < currentTime) {
            classes.push(doc.data());
          } else {
            upcoming.push(doc.data());
          }
          console.log("classes  =" + JSON.stringify(doc.data()));
        });
        setClassDetails(classes);
        setupClassDetails(upcoming);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [subjects]); // Include subjects in the dependency array

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchClasses();
    setRefreshing(false);
  }, [refreshing]);

  return (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      <View style={{ flex: 1 ,padding:10}}>
        <View>
          <Text style={{fontSize:20}}>Ongoing Classes:</Text>
          {upclassDetails.length === 0 && <View><Text>No ongoing Classes</Text></View>}
          {upclassDetails.map((classDetail, index) => (
            <View key={index} style={{backgroundColor:"#fff",margin:5}}>
              <View style={{ display: "flex",flexDirection:"row", justifyContent: "space-between", margin: 10 }}>
                <Text style={{fontSize:15}}>{classDetail.subName}</Text>
                <Text style={{ color: "blue" }}>03:56</Text>
              </View>
              <View style={{ display: "flex",flexDirection:"row", justifyContent: "space-between", margin: 20 }}>
                <TextInput
                 style={{minWidth:20,
                 }}
                keyboardType="numeric" placeholder='Enter Code'  />
                <TouchableOpacity>
                <Ionicons name="checkmark-done" size={24} color="green" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        <View>
          {upclassDetails.length === 0 &&  <Text>Upcoming Classes</Text>}
          {upclassDetails.length === 0 && <View><Text>No Upcoming Classes</Text></View>}
          { upclassDetails.length === 0 &&  upclassDetails.map((classDetail, index) => (
            <View key={index}>
              <Text>Subject ID: {classDetail.subID}</Text>
              <Text>Subject Name: {classDetail.subName}</Text>
              <Text>Weekday: {classDetail.weekDay}</Text>
              <Text>Start Time: {classDetail.startTime}</Text>
              <Text>End Time: {classDetail.endTime}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

export default MarkAttendence;
