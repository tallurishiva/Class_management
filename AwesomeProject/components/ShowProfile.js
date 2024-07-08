import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView,Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Assuming you're using Expo for vector icons
import { db,auth } from '../configfirebase';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { collection,where,query,getDocs,doc,getDoc } from 'firebase/firestore';
const UserProfile = () => {
  const [userData,setUserData]=useState({});
  const [clgName,setClgName]=useState("");
  const [branch,setBranch]=useState("");
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res=await ReactNativeAsyncStorage.getItem("userDetails");
        const users = collection(db, "users");
        const q = query(users,where("uid","==",auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const fetchedStates = [];
        querySnapshot.forEach((doc) => {
          fetchedStates.push(doc.data());
        });
        const docRef = doc(db, 'Colleges', fetchedStates[0].collegeName);
        const docSnap = await getDoc(docRef);
        const docRe = doc(db, 'branches', fetchedStates[0].branch);
        const docSna = await getDoc(docRe);
         if (docSnap.exists()){
             const data = docSnap.data().collegeName;
             const branch=docSna.data().branch;
             setBranch(branch);
              setClgName(data);
        } else {
           console.log('Document not found');
        }
        setUserData(fetchedStates[0]);

      } catch (e) {
        console.log('Error fetching data:', e.message);
      }
    };

    fetchData(); // Call the async function immediately
  }, []);
  const [editingField, setEditingField] = useState(null); 
  const [editedValue, setEditedValue] = useState('');
  const handleEdit = (fieldName) => {
    //dont forgot to handle the changes in local storage(async storage)
    setEditingField(fieldName);
    setEditedValue(userData[fieldName]);
  };

  const handleSave = () => {
    // Handle save logic here (e.g., update user data in backend)
    console.log(`Saving new value for ${editingField}: ${editedValue}`);
    setEditingField(null); // Reset editing state after saving
  };

  const renderField = (label, value, fieldName,active) => {
    const isEditing = editingField === fieldName;

    return (
      <View key={fieldName} style={styles.fieldContainer}>
        <Text style={styles.label}>{label}</Text>
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.input}
              value={editedValue}
              onChangeText={setEditedValue}
            />
            <TouchableOpacity onPress={handleSave}>
              <MaterialIcons name="check" size={28} color="green" />
            </TouchableOpacity>
          </View>

        ) : (
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{value}</Text>
            <TouchableOpacity onPress={() => handleEdit(fieldName)} disabled={!active}>
              <MaterialIcons name="edit" size={24} color={!active?"gray":"blue"} />
            </TouchableOpacity>
          </View>
         )} 
         </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{width:"100%",padding:10}}>
      <Image source={require('./profileimg.png') } style={{height:100,width:100}} />
      </View>
      <Text style={styles.sectionTitle}>Personal Details</Text>
      {renderField('Name', userData.name, 'name',true)}
      {renderField('Email', userData.email, 'email',true)}
      {renderField('Phone Number', "+"+userData.phoneNumber, 'phoneNumber',true)}

      <Text style={styles.sectionTitle}>College Details</Text>
      {renderField('College Name', clgName, 'collegeName',false)}
      {renderField('Branch', branch, 'branch',false)}
      {renderField('Batch', userData.batch, 'batch',false)}
      {renderField('Section', userData.section, 'section',false)}

      <Text style={styles.sectionTitle}>Address</Text>
      {renderField('State', userData.state, 'state',true)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display:"flex",
    flexDirection:"column",
    padding:10,
    paddingLeft:30,
    paddingBottom:100,
    backgroundColor:"#fff"
  },
  sectionTitle: {
    display:"flex",
    flexDirection:"column",
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  fieldContainer: {
    display:"flex",
    flexDirection:"column",
    padding:10
  },
  label: {
    flex: 1,
    marginRight: 10,
    fontWeight: 'bold',
  },
  valueContainer: {
     display:"flex",
     flexDirection:"row",
     margin:3
  },
  value: {
    flex: 1,
    marginRight: 10,
   
  },
  editContainer: {
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
    margin:3
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});

export default UserProfile;
