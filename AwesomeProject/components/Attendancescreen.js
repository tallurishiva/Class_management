import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Button, StyleSheet } from 'react-native';
import { collection, query, where, getDocs,addDoc } from 'firebase/firestore';
import { db } from '../configfirebase';
import { Alert } from 'react-native';
const AttendanceScreen = ({ route, navigation }) => {
  const { subject, subname, subid } = route.params;
  const [students, setStudents] = useState([]);
  const [enrolls, setEnrolls] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [visibleStudent, setVisibleStudent] = useState(null);
  
  useEffect(() => {
    const fetchEnrolledStudents = async () => {
      try {
        const res = collection(db, "EnrollReq");
        const q = query(res, where("subjectID", "==", subject), where("status", "==", true));
        const querySnapshot = await getDocs(q);
        const fetchedStudentIDs = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data().studentID;
          fetchedStudentIDs.push(data);
        });
        setStudents(fetchedStudentIDs);
      } catch (e) {
        console.log('Error fetching data:', e.message);
      }
    };
    fetchEnrolledStudents();
  }, [subject]);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (students.length === 0) return;
      try {
        const res = collection(db, "users");
        const q = query(res, where("uid", "in", students));
        const querySnapshot = await getDocs(q);
        const fetchedStudents = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedStudents.push(data);
        });
        setEnrolls(fetchedStudents);
      } catch (e) {
        console.log('Error fetching data:', e.message);
      }
    };
    fetchStudentDetails();
  }, [students]);

  useEffect(() => {
    const initialAttendance = {};
    const currentDate = new Date().toISOString(); 
    enrolls.forEach(student => {
      initialAttendance[student.uid] = {
        rollNumber: student.rollNumber,
        subjectID: subject,
        uid: student.uid,
        status: 'absent',
        date: currentDate,
      };
    });
  
    setAttendance(initialAttendance);
  }, [enrolls, subject]);
  
  const toggleAttendance = (studentId, status,index) => {
    setAttendance((prevState) => ({
      ...prevState,
      [studentId]: {
        ...prevState[studentId],
        status: status,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      const attendanceCollection = collection(db, "Attendance");
      await Promise.all(
        Object.values(attendance).map(async (record) => {
          await addDoc(attendanceCollection, record);
        })
      );

      const presentCount = Object.values(attendance).filter(record => record.status === 'present').length;
      const absentCount = Object.values(attendance).filter(record => record.status === 'absent').length;
      const totalCount = Object.values(attendance).length;
      const presentPercentage = (presentCount / totalCount) * 100;
      const absentPercentage = (absentCount / totalCount) * 100;

      Alert.alert(
        "Attendance Summary",
        `Present: ${presentCount} (${presentPercentage.toFixed(2)}%)\nAbsent: ${absentCount} (${absentPercentage.toFixed(2)}%)`,
        [
          { text: "OK", onPress: () => navigation.goBack() }
        ]
      );
    } catch (e) {
      console.log('Error saving attendance:', e.message);
    }
  };

  const toggleStudentVisibility = (studentId) => {
    setVisibleStudent((prevId) => (prevId === studentId ? null : studentId));
  };

  const RenderItem = ({ item,index }) => (
    <View style={styles.studentItem}>
      <TouchableOpacity onPress={() => toggleStudentVisibility(item.uid)}>
        <Text style={styles.studentRollNumber}>{item.rollNumber}</Text>
      </TouchableOpacity>
      {visibleStudent === item.uid && (
        <View style={styles.studentNameContainer}>
          <Text style={styles.studentName}>{item.name}</Text>
        </View>
      )}
      <View style={styles.attendanceButtons}>
        <TouchableOpacity
          style={[styles.button]}
          onPress={() => toggleAttendance(item.uid, 'present',index)}
        >
          <Text style={styles.buttonText}>✔</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button]}
          onPress={() => toggleAttendance(item.uid, 'absent',index)}
        >
          <Text style={styles.buttonText}>X</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{subname}</Text>
      {enrolls.map((item,index) => (
        <RenderItem key={item.uid} item={item} index={index}/>
      ))}
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: 'bold',
    backgroundColor: "#fff",
    color: '#333',
    padding: 10,
  },
  list: {
    marginBottom: 16,
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
    justifyContent: 'space-between',
  },
  studentRollNumber: {
    fontSize: 20,
    color: '#000',
  },
  studentNameContainer: {
    marginTop: 8,
  },
  studentName: {
    fontSize: 16,
    color: '#555',
  },
  attendanceButtons: {
    flexDirection: 'row',
  },
  button: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 4,
    backgroundColor: '#ccc',
  },
  present: {
    backgroundColor: 'green',
  },
  absent: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default AttendanceScreen;
