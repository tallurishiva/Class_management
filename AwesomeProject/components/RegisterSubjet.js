import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { auth,db } from '../configfirebase';
import { collection,where,query,getDocs,doc,getDoc,addDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import ReactNativeAsyncStorage from"@react-native-async-storage/async-storage";

const SubjectRegistration = () => {
  const [subjectName, setSubjectName] = useState('');
  const [branch, setBranch] = useState('');
  const [batch, setBatch] = useState('');
  const [semester, setSemester] = useState('');
  const [section, setSection] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [error, setError] = useState('');
  const [branchs,setBranchs]=useState([]);
  const sems=["1-1","1-2","2-1","2-2","3-1","3-2","4-1","4-2"];
  const secs=["Regular","Idp","Iddmp"];
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData=await ReactNativeAsyncStorage.getItem("userDetails");
        const userData = JSON.parse(storedData);
        const branch = collection(db, "branches");
        const q=query(branch,where("collegeID","==",userData.collegeName))
        const querySnapshot =await getDocs(q);
        const fetchedStates = [];
        querySnapshot.forEach((doc) => {
          if(!fetchedStates.includes(doc.data().branch)){
          fetchedStates.push({branchID:doc.id,branchName:doc.data().branch});
           console.log(doc.data().branch);}
        });
        setBranchs(fetchedStates);
      } catch (e) {
        console.log('Error fetching data:', e.message);
      }
    };

    fetchData(); 
  }, []);
  const handleRegisterSubject = async () => {
    try {
      const  res= collection(db, "RegisteredSubjets");
      const subData={
         ProfID:auth.currentUser.uid,
         subject:subjectName,
         branch:branch,
         batch:batch,
         semester:semester,
         section:section,
         startDate:startDate,
         endDate:endDate
      }
      const result=await addDoc(res, subData);
      console.log("successfully added with "+JSON.stringify(result));
    } catch (e) {
      console.log('Error fetching data:', e.message);
    }
  };

  const validateInputs = () => {
    return !!subjectName && !!branch && !!batch && !!semester && !!section;
  };

  const showStartDatePickerModal = () => {
    setShowStartDatePicker(true);
  };

  const showEndDatePickerModal = () => {
    setShowEndDatePicker(true);
  };

  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === 'ios'); // Hide the picker on iOS after selection
    setStartDate(currentDate);
  };

  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === 'ios'); // Hide the picker on iOS after selection
    setEndDate(currentDate);
  };
  
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Subject Name"
        value={subjectName}
        onChangeText={setSubjectName}
      />

      <TextInput
        style={styles.input}
        placeholder="Batch (e.g., 2021-2025)"
        value={batch}
        onChangeText={setBatch}
      />
    
    <Picker
        style={styles.input}
        selectedValue={branch}
        onValueChange={(itemValue) => setBranch(itemValue)}
      >
      <Picker.Item label="Select Branch" value="" />
        {branchs.map((collegeName, index) => (
          <Picker.Item key={index} label={collegeName.branchName} value={collegeName.branchID} />
        ))}
      </Picker>

      <Picker
        style={styles.input}
        selectedValue={section}
        onValueChange={(itemValue) => setSection(itemValue)}
      >
      <Picker.Item label="Select Section" value="" />
        {secs.map((sec, index) =>(
          <Picker.Item key={index} label={sec} value={sec} />
        ))}
      </Picker>
      <Picker
        style={styles.input}
        selectedValue={semester}
        onValueChange={(itemValue) => setSemester(itemValue)}
      >
      <Picker.Item label="Select Semester" value="" />
        {sems.map((sem, index) => (
          <Picker.Item key={index} label={sem} value={sem}/>
        ))}
      </Picker>
      <TouchableOpacity style={styles.dateInputContainer} onPress={showStartDatePickerModal}>
        <Text style={styles.dateInputLabel}>Start Date:</Text>
        <Text style={styles.dateText}>{startDate.toDateString()}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.dateInputContainer} onPress={showEndDatePickerModal}>
        <Text style={styles.dateInputLabel}>End Date:</Text>
        <Text style={styles.dateText}>{endDate.toDateString()}</Text>
      </TouchableOpacity>

      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}
       
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity  style={{
        backgroundColor: 'rgb(0,0,0)',
        padding: 20,
        borderRadius: 10,
        marginBottom: 30,
        marginTop:10,
      }} onPress={handleRegisterSubject}>
      <Text style={{
          textAlign: 'center',
          fontWeight: '700',
          fontSize: 16,
          color: '#fff',
        }}>Register</Text>
      </TouchableOpacity>
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
    margin: 20,
    textAlign: 'center',
    color: 'black',
  },
  input: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray', // Border color: gray
    borderRadius: 5,
    color: 'black', // Text color: black
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop:10
  },
  dateInputLabel: {
    color: 'black', // Text color: black
  },
  dateText: {
    color: 'blue', // Text color: blue
  },
  errorText: {
    color: 'red', // Text color: red
    marginBottom: 10,
  },
});

export default SubjectRegistration;
