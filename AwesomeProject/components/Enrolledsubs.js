import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EnrolledSubjects = ({ subjects }) => {
    //TODO completle the student and teach reg info
  return (
    <View style={styles.container}>
      {subjects.map((subject, index) => (
        <View key={index} style={styles.subjectContainer}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Subject Name:</Text>
            <Text style={styles.value}>{subject.subID}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Enrollment:</Text>
            <Text style={styles.value}>{subject.enrollment}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Batch:</Text>
            <Text style={styles.value}>{subject.batch}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Semester:</Text>
            <Text style={styles.value}>{subject.semester}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Section:</Text>
            <Text style={styles.value}>{subject.section}</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  subjectContainer: {
    marginBottom: 20,
    padding: 15
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
