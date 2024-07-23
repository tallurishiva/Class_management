
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button,FlatList, Platform, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { auth,db } from '../configfirebase';
import { collection,where,query,getDocs,doc,getDoc,addDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import ReactNativeAsyncStorage from"@react-native-async-storage/async-storage";

const CreateAssign = () => {
  const [subjectName, setSubjectName] = useState('');
  const [branch, setBranch] = useState('');
  const [batch, setBatch] = useState('');
  const [semester, setSemester] = useState('');
  const [name, setname] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [regsubs,setRegSubs]=useState([]);
  const [error, setError] = useState('');
  const [branchs,setBranchs]=useState([]);
  const [selectedSubject,setSelectedSubject]=useState(null);
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
           }
        });
        setBranchs(fetchedStates);
      } catch (e) {
        console.log('Error fetching data:', e.message);
      }
    };
    fetchData(); 
  }, []);
  React.useEffect(()=>{
    const fetchData = async () => {
        try {
    const res=collection(db,"RegisteredSubjets");
    const q=query(res,where("ProfID","==",auth.currentUser.uid));
    const querySnapshot =await getDocs(q);
    const fetchedStates = [];
    querySnapshot.forEach((doc) => {
      const  id  = doc.id;
      const data = doc.data();
      data["id"]=id;
      console.log(id);
      fetchedStates.push(data);
    });
    setRegSubs(fetchedStates);
}
catch(e){
    console.log('Error fetching data:', e.message);
}}
  fetchData();
  },[]);

  const handleRegisterSubject = async () => {
    try {
      const res= collection(db, "Assignments");
      const subData={
         ProfID:auth.currentUser.uid,
         subject:selectedSubject,
         name:name,
         topic:batch,
         endDate:startDate
      }
      const result=await addDoc(res, subData);
      console.log("successfully added with "+JSON.stringify(result));
    } catch (e) {
      console.log('Error fetching data:', e.message);
    }
  };



  const showStartDatePickerModal = () => {
    setShowStartDatePicker(true);
  };

  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === 'ios'); // Hide the picker on iOS after selection
    setStartDate(currentDate);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={{backgroundColor: selectedSubject==item.id?'rgb(211, 211, 211)':'#f8f8f8', padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 3,}}  onPress={() => handleSelect(item)} >
      <Text style={styles.subjectText}>{item.subject}</Text>
      <Text style={styles.detailsText}>Batch: {item.batch}</Text>
      <Text style={styles.detailsText}>Section: {item.section}</Text>
    </TouchableOpacity>
  );
  const handleSelect = (subject) => {
    setSelectedSubject(subject.id);
    setname(item.subject);
    console.log("Selected Subject:", subject.id);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Subject</Text>
      <View style={styles.list}>
     {regsubs.map((item) => (
    <View key={item.ProfID + item.subject}>
      {renderItem({ item })}
    </View>
     ))}
    </View>

      
      
      <TouchableOpacity style={{backgroundColor: '#f8f8f8', padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    
    elevation: 3,}} onPress={showStartDatePickerModal}>
        <Text style={styles.dateInputLabel}>Dead Line:</Text>
        <Text style={styles.dateText}>{startDate.toDateString()}</Text>
      </TouchableOpacity>
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}
   
       <TextInput
  style={[styles.input, { height: 100, textAlignVertical: 'top' }]} // Adjust height as needed
  placeholder="Topic or Question"
  value={batch}
  onChangeText={setBatch}
  multiline={true}
  numberOfLines={4}
/>
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
        }}>Submit</Text>
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
  card: {
   
  },
  subjectText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3478F6', // Highlight color
  },
  detailsText: {
    fontSize: 14,
    color: '#333',
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

export default CreateAssign;
