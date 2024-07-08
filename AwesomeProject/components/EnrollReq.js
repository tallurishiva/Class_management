import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const SubjectEnrollmentRequest = () => {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [branch, setBranch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  // Mock data for subjects, semesters, and years (replace with actual data)
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology'];
  const semesters = ['1-1','1-2','2-1','2-2','3-1','3-2','4-1','4-2'];
  const batchs = [];
  for(let i=14;i<28;i++){
      batchs.push('20'+i+" - "+'20'+(i+4));
      batchs.push('20'+i+" - "+'20'+(i+5));
  }
  const handleEnrollmentRequest = () => {
    // Implement logic to submit enrollment request
    console.log('Enrollment Request:', { name, rollNumber, branch, selectedSubject, selectedSemester, selectedYear });
    // Reset form fields after submission
    setName('');
    setRollNumber('');
    setBranch('');
    setSelectedSubject('');
    setSelectedSemester('');
    setSelectedYear('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subject Enrollment Request</Text>

        <Picker
        style={styles.input}
        selectedValue={selectedSubject}
        onValueChange={(itemValue) => setSelectedSubject(itemValue)}
        >
        <Picker.Item label="Select Batch" value="" />
        {batchs.map((subject, index) => (
          <Picker.Item key={index} label={subject} value={subject} />
        ))}
       </Picker>

       <Picker
        style={styles.input}
        selectedValue={selectedSubject}
        onValueChange={(itemValue) => setSelectedSubject(itemValue)}
        >
        <Picker.Item label="Select Branch" value="" />
        {subjects.map((subject, index) => (
          <Picker.Item key={index} label={subject} value={subject} />
        ))}
      </Picker>


        <Picker
        style={styles.input}
        selectedValue={selectedSemester}
        onValueChange={(itemValue) => setSelectedSemester(itemValue)}
        >
        <Picker.Item label="Select Semester" value="" />
        {semesters.map((semester, index) => (
          <Picker.Item key={index} label={semester} value={semester} />
        ))}
      </Picker>

      <Picker
        style={styles.input}
        selectedValue={selectedSubject}
        onValueChange={(itemValue) => setSelectedSubject(itemValue)}
      >
        <Picker.Item label="Select Subject" value="" />
        {subjects.map((subject, index) => (
          <Picker.Item key={index} label={subject} value={subject} />
        ))}
      </Picker>
      <Button title="Submit Request" onPress={handleEnrollmentRequest} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default SubjectEnrollmentRequest;
