import { where, query, getDocs, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { db, auth } from '../configfirebase';
import PdfDetails from './PdfDetails';
const AssignmentDetails = ({ route }) => {
  const { assignment } = route.params;
  const [assign, setAssign] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  console.log(assignment)
  const fetchData = async () => {
    setRefreshing(true);
    try {
      const res = collection(db, "files");
      const q = query(res,  where("subjectID", "==", assignment.subject));
      const querySnapshot = await getDocs(q);
      const fetchedStates = [];
      querySnapshot.forEach((doc) => {
        const id = doc.id;
        const data = doc.data();
        data["id"] = id;
        console.log("id  "+id);
        fetchedStates.push(data);
      });
      setAssign(fetchedStates);
    } catch (e) {
      console.log('Error fetching data:', e.message);
    } finally {
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    fetchData();
  };
  
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
    {assign.length==0 && <View>
        <Text>No Assignments Submitted</Text>
      </View>}
    {
      assign.map((item) => (
        <PdfDetails item={item} />
      ))
    }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  card: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    marginBottom: 15,
  },
});

export default AssignmentDetails;
