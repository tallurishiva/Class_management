import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import { auth, db } from '../configfirebase';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import { StyleSheet,FlatList } from 'react-native';
function MarkAttendence() {
  const [role, setRole] = useState("");
  const [classDetails, setClassDetails] = useState([]);
  const [upclassDetails, setupClassDetails] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [subdata, setSubdata] = useState({});
  const [recentatt,setrecentatt]=useState([]);
  const nav = useNavigation();
  
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const storedData = await ReactNativeAsyncStorage.getItem("userDetails");
        const userData = JSON.parse(storedData);
        setRole(userData.role);
      } catch (e) {
        console.log('Error fetching data:', e.message);
      }
    };
    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        if (role === 'student') {
          const res = collection(db, "EnrollReq");
          const q = query(res, where("studentID", "==", auth.currentUser.uid), where("status", "==", true));
          const querySnapshot = await getDocs(q);
          const fetchedSubjects = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data().subjectID;
            fetchedSubjects.push(data);
          });
          setSubjects(fetchedSubjects);
          const col=collection(db,"Attendance");
          const qq = query(col, where("uid", "==", auth.currentUser.uid));
          const querySnapshotq = await getDocs(qq);
          const fetchedSubjectsq = [];
          querySnapshotq.forEach((doc) => {
            const data = doc.data();
            fetchedSubjectsq.push(data);
          });
          setrecentatt(fetchedSubjectsq);
        } else if (role === 'teacher') {
          const res = collection(db, "RegisteredSubjets");
          const q = query(res, where("ProfID", "==", auth.currentUser.uid));
          const querySnapshot = await getDocs(q);
          const fetchedSubjects = [];
          const subdataObj = {};
          querySnapshot.forEach((doc) => {
            const id = doc.id;
            subdataObj[id] = doc.data();
            fetchedSubjects.push(id);
          });
          setSubdata(subdataObj);
          setSubjects(fetchedSubjects);
        }
      } catch (e) {
        console.log('Error fetching data:', e.message);
      }
    };
    fetchSubjects();
  }, [role]);
  const RecentAttendance = ({ attendanceData,subdata }) => {
    // Helper function to format the date
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString() ;
    };
  
    // Helper function to get color based on status
    const getStatusColor = (status) => {
      return status === 'present' ? 'green' : 'red';
    };
     
    const renderItem = ({ item }) => (
      <View style={[styles.row, { backgroundColor: getStatusColor(item.status) }]}>
        <Text style={styles.cell}>{formatDate(item.date)}</Text>
        <Text style={styles.cell}>{item.rollNumber}</Text>
        <Text style={styles.cell}>{subdata[item.subjectID]}</Text>
        <Text style={styles.cell}>{item.status}</Text>
      </View>
    );
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Recent Attendance</Text>
        <FlatList
          data={attendanceData}
          renderItem={renderItem}
          keyExtractor={(item) => item.uid}
        />
      </View>
    );
  };
  
  console.log("at 75  "+recentatt);
  const fetchClasses = useCallback(async () => {
    try {
      const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });
      const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const currentWeekday = weekdays[new Date().getDay()];

      if (subjects.length > 0) {
        const q = query(
          collection(db, 'schdules'),
          where("subID", "in", subjects),
          where("weekDay", "==", currentWeekday)
        );
        const querySnapshot = await getDocs(q);
        const classes = [];
        querySnapshot.forEach((doc) => {
          classes.push(doc.data());
        });
        setClassDetails(classes);
        setupClassDetails(classes); // If you want to show upcoming classes here
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  }, [subjects]);
  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchClasses().finally(() => setRefreshing(false));
  }, [fetchClasses]);

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
      <View style={{ flex: 1, padding: 5 }}>
        {upclassDetails.length === 0 && <Text>No ongoing Classes</Text>}
        {upclassDetails.map((classDetail, index) => (
          <View key={index} style={{ backgroundColor: "#fff", margin: 5 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", margin: 10 }}>
              <Text style={{ fontSize: 20 }}>{classDetail.subName}</Text>
              <Text style={{ color: "blue" }}>
                {subdata[classDetail.subID]?.semester} {subdata[classDetail.subID]?.section}
              </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", margin: 10 }}>
              <Text style={{ fontSize: 15 }}>{subdata[classDetail.subID]?.batch}</Text>
            {role!=="student" && <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => nav.navigate('Mark Attendance', { subject: classDetail.subID, subname: classDetail.subName })}
            >
              <Text style={{ fontSize: 18 }}>Mark</Text>
              <Ionicons name="checkmark-done" size={24} color="green" />
            </TouchableOpacity>}
            {role ==="student" && <RecentAttendance attendanceData={recentatt} subdata={subdata}/>}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  cell: {
    flex: 1,
    padding: 2,
    textAlign: 'center',
    color: '#fff',
  },
});

export default MarkAttendence;
