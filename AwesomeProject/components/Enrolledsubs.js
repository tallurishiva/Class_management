import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../configfirebase'; // Import your firebase configuration

const EnrolledSubjects = ({ subjects }) => {
  const [detailedSubjects, setDetailedSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjectDetails = async () => {
      try {
        const subjectDetails = [];
        for (const subject of subjects) {
          const docRef = doc(db, 'RegisteredSubjets', subject.subID);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            subjectDetails.push({
              ...data,
              id: docSnap.id,
              startDate: data.startDate ? data.startDate.toDate().toLocaleDateString() : 'N/A',
              endDate: data.endDate ? data.endDate.toDate().toLocaleDateString() : 'N/A'
            });
          } else {
            console.log(`No such document with ID: ${subject.subID}`);
          }
        }
        setDetailedSubjects(subjectDetails);
      } catch (e) {
        console.log('Error fetching subject details:', e.message);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectDetails();
  }, [subjects]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      {detailedSubjects.map((subject, index) => (
        <View key={index} style={styles.subjectContainer}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Subject Name:</Text>
            <Text style={styles.value}>{subject.subject || 'N/A'}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Enrollment:</Text>
            <Text style={styles.value}>{subjects[0].enrollment ? 'Enrolled' : 'Not Enrolled'}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Batch:</Text>
            <Text style={styles.value}>{subject.batch || 'N/A'}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Semester:</Text>
            <Text style={styles.value}>{subject.semester || 'N/A'}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Section:</Text>
            <Text style={styles.value}>{subject.section || 'N/A'}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Start Date:</Text>
            <Text style={styles.value}>{subject.startDate}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>End Date:</Text>
            <Text style={styles.value}>{subject.endDate}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  subjectContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'lightblue',
    borderRadius: 10,
  },
  fieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    color: 'black',
  },
  value: {
    color: 'blue',
  },
});

export default EnrolledSubjects;
