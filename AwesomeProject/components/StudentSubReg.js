import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { auth,db } from '../configfirebase';
import { collection,where,query,getDocs,doc,getDoc,addDoc, and } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import ReactNativeAsyncStorage from"@react-native-async-storage/async-storage";

const StudentSubReg = () => {
  const [semester, setSemester] = useState('');
  const [error, setError] = useState('');
  const [subjects,setSubjects]=useState([]);
  const [subject,setSubject]=useState("");
  const [profID,setprofID]=useState('');
  const sems=["1-1","1-2","2-1","2-2","3-1","3-2","4-1","4-2"];
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData=await ReactNativeAsyncStorage.getItem("userDetails");
        const userData = JSON.parse(storedData);
        const subs = collection(db, "RegisteredSubjets");
        const q=query(subs,and(where("batch","==",userData.batch),where("branch","==",userData.branch),where("semester","==",semester),where("section","==",userData.section)));
        const querySnapshot =await getDocs(q);
        const fetchedStates = [];
        querySnapshot.forEach((doc) => {
          if(!fetchedStates.includes(doc.data().branch)){
          fetchedStates.push({regID:doc.id,subjectName:doc.data().subject,profID:doc.data().ProfID});
           console.log(doc.data().subject);}
        });
        setSubjects(fetchedStates);
      } catch (e) {
        console.log('Error fetching data:', e.message);
      }
    };

    fetchData(); 
  }, [semester]);
  const handleRegisterSubject = async () => {
    try {
      const  res= collection(db, "EnrollReq");
      const subData={
        subjectID:subject,
        studentID:auth.currentUser.uid,
        profID:profID,
        reqCreatedAt:new Date().toISOString(),
        status:false,
        semester:semester
      }
      const result=await addDoc(res, subData);
      console.log("successfully added with "+JSON.stringify(result));
    } catch (e) {
      console.log('Error fetching data:', e.message);
    }
  };

  const validateInputs = () => {
    return !!semester && !!subject;
  };
  
  return (
    <View style={styles.container}>
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

      <Picker
  style={styles.input}
  selectedValue={subject}
  onValueChange={(itemValue) => {
    const selectedSubject = subjects.find(sub => sub.regID === itemValue);
    if (selectedSubject) {
      setSubject(itemValue);
      setprofID(selectedSubject.profID);
    }
  }}
>
  <Picker.Item label="Select Subject" value="" />
  {subjects.map((sub, index) => (
    <Picker.Item key={index} label={sub.subjectName} value={sub.regID} />
  ))}
</Picker>

       
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
    borderColor: 'gray',
    borderRadius: 5,
    color: 'black',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop:10
  },
  dateInputLabel: {
    color: 'black', 
  },
  dateText: {
    color: 'blue', 
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default StudentSubReg;
