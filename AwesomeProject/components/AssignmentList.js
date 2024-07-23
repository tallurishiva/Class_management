import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, RefreshControl } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../configfirebase';
import CreateAssign from './CreateAssign';
import AssignmentCard from './AssignmentCard';

function AssignmentList({ role }) {
  const [assignments, setAssignments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, [role]);

  const fetchAssignments = async () => {
    try {
      setRefreshing(true);
      let fetchedAssignments = [];

      if (role === 'student') {
        const enrollReqQuery = query(collection(db, 'EnrollReq'), where('studentID', '==', auth.currentUser.uid));
        const enrollReqSnapshot = await getDocs(enrollReqQuery);
        const fetchedStates = enrollReqSnapshot.docs.map(doc => doc.data().subjectID);

        const assignmentsQuery = query(collection(db, 'Assignments'), where('subject', 'in', fetchedStates));
        const assignmentsSnapshot = await getDocs(assignmentsQuery);
        fetchedAssignments = assignmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } else {
        const assignmentsQuery = query(collection(db, 'Assignments'), where('ProfID', '==', auth.currentUser.uid));
        const assignmentsSnapshot = await getDocs(assignmentsQuery);
        fetchedAssignments = assignmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }

      setAssignments(fetchedAssignments);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    fetchAssignments();
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {role !== 'student' && <CreateAssign />}
      <View style={styles.assignmentContainer}>
        <Text style={styles.title}>Recent Assignments</Text>
        {assignments.length === 0 ? (
          <Text>No assignments found</Text>
        ) : (
          assignments.map((item) => (
            <AssignmentCard key={item.id} item={item} role={role} />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  assignmentContainer: {
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
  },
});

export default AssignmentList;
