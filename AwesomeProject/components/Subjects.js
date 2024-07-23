import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, RefreshControl } from 'react-native';
import RegisteredSubjects from './RegisteredSubjects';
import { AntDesign } from '@expo/vector-icons';
import { auth, db } from '../configfirebase';
import { collection, where, query, getDocs } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import EnrolledSubjects from './Enrolledsubs';

const Subjects = () => {
  const nav = useNavigation();
  const [role, setRole] = useState("");
  const [regSubs, setRegSubs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    setRefreshing(true);
    try {
      const storedData = await ReactNativeAsyncStorage.getItem("userDetails");
      const userData = JSON.parse(storedData);
      setRole(userData.role);

      if (userData.role === 'student') {
        const res = collection(db, "EnrollReq");
        const q = query(res, where("studentID", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const fetchedStates = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const { subjectID, status, regret } = data;
          fetchedStates.push({
            subID: subjectID,
            enrollment: status,
            regret,
          });
        });
        setRegSubs(fetchedStates);
      } else {
        const res = collection(db, "RegisteredSubjets");
        const q = query(res, where("ProfID", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const fetchedStates = [];
        querySnapshot.forEach((doc) => {
          const { id } = doc;
          const data = doc.data();
          const startDate = data.startDate.toDate().toLocaleDateString();
          const endDate = data.endDate.toDate().toLocaleDateString();
          fetchedStates.push({
            sID: id,
            data: {
              ...data,
              startDate,
              endDate,
            },
          });
        });
        setRegSubs(fetchedStates);
      }
    } catch (e) {
      console.log('Error fetching data:', e.message);
    } finally {
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchData} />}
    >
      <TouchableOpacity
        style={styles.registernew}
        onPress={() => {
          role === "student"
            ? nav.navigate("Subject Enrollment")
            : nav.navigate("Subject Registration");
        }}
      >
        <Text style={{ fontSize: 20 }}>
          {role === "student" ? "Enroll For New Subject" : "Register For New Subject"}
        </Text>
        <AntDesign name="arrowright" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>{role === "student" ? "Enrolled Subjects" : "Registered Subjects"}</Text>
      {role === "student" && <EnrolledSubjects subjects={regSubs} />}
      {role === "teacher" && <RegisteredSubjects subjects={regSubs} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
    textAlign: "center",
  },
  registernew: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
  },
});

export default Subjects;
