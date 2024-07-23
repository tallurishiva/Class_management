import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { collection, doc, getDocs, where, query } from 'firebase/firestore';
import { db } from '../configfirebase';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const PdfDetails = ({ item }) => {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const res = collection(db, 'users');
        const q = query(res, where('uid', '==', item.userid));
        const querySnapshot = await getDocs(q);
        const fetchedStates = [];
        querySnapshot.forEach((doc) => {
          const id = doc.id;
          const data = doc.data();
          data['id'] = id;
          fetchedStates.push(data);
        });
        setStudent(fetchedStates[0]);
      } catch (error) {
        console.log('Error fetching student details:', error.message);
      }
    };

    fetchStudentDetails();
  }, [item.userid]);

  const openPdfInChrome = async () => {
    const supported = await Linking.canOpenURL(item.url);
    if (supported) {
      await Linking.openURL(item.url);
    } else {
      console.log(`Don't know how to open this URL: ${item.url}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {student && (
          <>
            <View style={styles.studentInfo}>
              <Text style={styles.value}>{student.name}</Text>
              <Text style={styles.value}>{student.rollNumber}</Text>
            </View>
            <TouchableOpacity onPress={openPdfInChrome}>
              <FontAwesome name="external-link" size={30} color="#900" />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin:10,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  card: {
    flexDirection: 'row',
    width: '90%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  studentInfo: {
    flexDirection: 'column',
  },
  value: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default PdfDetails;
