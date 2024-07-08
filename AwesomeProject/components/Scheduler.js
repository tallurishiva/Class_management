import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { auth, db } from '../configfirebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Subscheduler from './Subscheduler';

export default function Scheduler() {
  const [subs, setSubs] = useState([]);
  const nav = useNavigation();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const subCollection = collection(db, "RegisteredSubjets");
        const q = query(
          subCollection,
          where("ProfID", "==", auth.currentUser.uid),where("endDate",">=",new Date())
        );
      
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot.docs);
        const fetchedSubs = [];
        querySnapshot.forEach((doc) => {
          fetchedSubs.push({ subID: doc.id, subData: doc.data() });
          console.log(doc.id);
        });

        setSubs(fetchedSubs);
      } catch (error) {
        console.log('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  return subs.length === 0 ? (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ textAlign: "center" }}>No Registered Subjects Found</Text>
      <TouchableOpacity style={{ margin: 20 }} onPress={() => { nav.navigate("Subject Registration") }}>
        <Text style={{ color: "blue" }}>Register Here</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <ScrollView contentContainerStyle={styles.container}>
      {subs.map((item, index) => (
        <Subscheduler key={index} subject={item} />
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 6,
  },
});
