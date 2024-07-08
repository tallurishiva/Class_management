import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet,KeyboardAvoidingView,ScrollView, ToastAndroid, Alert } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {db,auth} from "../configfirebase";
import { useNavigation } from '@react-navigation/native';
import { collection,query,where, getDocs,addDoc } from 'firebase/firestore';
import CustomButton from '../Interactives/CustomButton';
const RegistrationForm = ({route}) => {
  const nav=useNavigation();
  const { role } = route.params;
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState(''); // State selection
  const [college, setCollege] = useState(''); // College selection
  const [branch, setBranch] = useState('');
  const [roll,setRoll]=useState('');
  const [states,setStates]=useState([]);
  const [colleges,setColleges]=useState([]);
  const [branchs,setBranchs]=useState([]);
  const [section,setSection]=useState('');
  const [batch,setBatch]=useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const clgs = collection(db, "Colleges");
        const q = query(clgs);
        const querySnapshot = await getDocs(q);
        const fetchedStates = [];
        querySnapshot.forEach((doc) => {
          if(!fetchedStates.includes(doc.data().state)){
          fetchedStates.push(doc.data().state);
           console.log(doc.data().state);}
        });
        setStates(fetchedStates);
        setCollege('');
        setBranch('');
      } catch (e) {
        console.log('Error fetching data:', e.message);
      }
    };

    fetchData(); // Call the async function immediately
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const clgs = collection(db, "Colleges");
        const q = query(clgs,where("state","==",state));
        const querySnapshot = await getDocs(q);
        const fetchedStates = [];
        querySnapshot.forEach((doc) => {
          if(!fetchedStates.includes(doc.data().collegeName)){
          fetchedStates.push({clgID:doc.id,clgName:doc.data().collegeName});
           console.log(doc.data().collegeName);}
        });
        setColleges(fetchedStates);
        setBranch('');
      } catch (e) {
        console.log('Error fetching data:', e.message);
      }
    };

    fetchData(); 
  }, [state]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const clgs = collection(db, "branches");
        const q = query(clgs,where("collegeID","==",college));
        const querySnapshot = await getDocs(q);
        const fetchedStates = [];
        querySnapshot.forEach((doc) => {
          if(!fetchedStates.includes(doc.data().collegeName)){
          fetchedStates.push({branchID:doc.id,branchName:doc.data().branch});
           console.log(doc.data().branch);}
        });
        setBranchs(fetchedStates);
      } catch (e) {
        console.log('Error fetching data:', e.message);
      }
    };

    fetchData(); 
  }, [college]);

  const handleRegistration = async() => {
    if(name.length!=0 && phoneNumber.length!=0 && email.length!=0 && college.length!=0 && branch.length!=0 && batch.length!=0 && section.length!=0 && roll.length!=0){
    try {
      const usersCollection = collection(db, 'users');
      const userData = {
        name: name,
        uid:auth.currentUser.uid,
        phoneNumber:phoneNumber,
        email:email,
        state:state,
        collegeName:college,
        branch:branch,
        role:role,
        batch:batch,
        section:section,
        rollNumber:roll
      };
      await addDoc(usersCollection, userData);
    } catch (error) {
        Alert.alert("Error! please Try Again");
    }
    nav.navigate('MainHome');}
    else{
      Alert.alert(
        "Oops! 🙊",
        "Hold up! It looks like you forgot to fill in some fields. Let's complete the missing pieces! 🧩",
      );
    }
  };
  const sections=["Regular","IDP","IDDMP"];
  return (
    <KeyboardAvoidingView behavior="padding" style={{flex:1}}> 
    <View style={styles.container}>
    <ScrollView style={{flex:1,height:"100%"}}>
      <Text style={{flex:0.4,fontSize:20,fontWeight: '600',color:"black",textAlignVertical:"center",textAlign:"center",marginBottom:20,marginTop:20}}>Fill Your PersonalInfo</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <Picker
        style={styles.input}
        selectedValue={state}
        onValueChange={(itemValue) => setState(itemValue)}
      >
        <Picker.Item label="Select State" value="" />
        {states.map((stateName, index) => (
          <Picker.Item key={index} label={stateName} value={stateName} />
        ))}
      </Picker>
      <Picker
        style={styles.input}
        selectedValue={college}
        onValueChange={(itemValue) => setCollege(itemValue)}
      >
      <Picker.Item label="Select College" value="" />
        {colleges.map((collegeName, index) => (
          <Picker.Item key={index} label={collegeName.clgName} value={collegeName.clgID} />
        ))}
      </Picker>
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
        {sections.map((sec, index) => (
          <Picker.Item key={index} label={sec} value={sec} />
        ))}
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="2021-2025"
        value={batch}
        onChangeText={setBatch}
      />
      <TextInput
        style={styles.input}
        placeholder="College Roll number"
        value={roll}
        onChangeText={setRoll}
      />
     
      <CustomButton label="submit" onPress={handleRegistration} />
      </ScrollView>
    </View>
    </KeyboardAvoidingView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    display:"flex",
    flexDirection:"column",
    
  },
  picker: {
    height: 40, // Adjust the height of the Picker
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  input: {
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    backgroundColor:"#fff",
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default RegistrationForm;