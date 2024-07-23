import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Text } from 'react-native';
import { auth, db } from '../configfirebase';
import { collection, where, query, getDocs, and } from 'firebase/firestore';
import EnrollmentRequests from './Request';

const EnrollmentScreen = () => {
  const [reqs, setReqs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const req = collection(db, "EnrollReq");
      const q = query(req, and(where("profID", "==", auth.currentUser.uid), where("status", "==", false)));
      const querySnapshot = await getDocs(q);
      const fetchedStates = [];
      querySnapshot.forEach((doc) => {
        if (!fetchedStates.includes(doc.data())) {
          fetchedStates.push({ docID: doc.id, data: doc.data() });
        }
      });
      setReqs(fetchedStates);
    } catch (e) {
      console.log('Error fetching data:', e.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        {reqs.length === 0 ? (
          <Text style={styles.noRequestsText}>No new enrollment requests</Text>
        ) : (
          reqs.map((item, index) => (
            <EnrollmentRequests key={index} requests={item} />
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  noRequestsText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 18,
    color: '#333',
  },
});

export default EnrollmentScreen;
