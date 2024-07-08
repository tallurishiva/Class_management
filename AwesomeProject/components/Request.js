import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { auth,db } from '../configfirebase';
import { FontAwesome6 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { collection,where,query,getDocs,doc,getDoc,addDoc, and,updateDoc } from 'firebase/firestore';

const EnrollmentRequests = ({ requests }) => {
  const [user,setUser]=React.useState({});
  const [statusMsg,setStatusMsg]=React.useState("");
  React.useEffect(()=>{
    const fetchData = async () => {
        try {
          const req = collection(db, "users");
          const q=query(req,where("uid","==",requests.data.studentID));
          const querySnapshot =await getDocs(q);
          querySnapshot.forEach((doc) => {
             setUser(doc.data());
          });
        } catch (e) {
          console.log('Error fetching data:', e.message);
        }
      };
  
      fetchData(); 
  },[]);

  const handleAccept = async() => {
    try {
      const req = collection(db, "EnrollReq");
      const q=doc(req,requests.docID);
      const newData={
        status:true
      }
      await updateDoc(q,newData);
      setStatusMsg("Accepted");
      console.log('Document successfully updated!');
    } catch (e) {
      console.log('Error fetching data:', e.message);
    }
  };

 
  const handleReject = async() => {
    try {
      const req = collection(db, "EnrollReq");
      const q=doc(req,requests.docID);
      const newData={
        regret:true
      }
      await updateDoc(q,newData);
      console.log('Document successfully updated!');
      setStatusMsg("Regreted");
    } catch (e) {
      console.log('Error fetching data:', e.message);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.requestContainer}>
            <Text style={styles.requestText}>Student Name:{user.name}</Text>
            <Text style={styles.requestText}>Semester: {requests.data.semester}</Text>
            <Text style={styles.requestText}>Roll Number:{user.rollNumber}</Text>
            <View style={styles.buttonContainer}>
              {statusMsg=="" && <TouchableOpacity
                style={[styles.button, { backgroundColor: 'green' }]}
                onPress={handleAccept}
              >
                <FontAwesome6 name="check" size={24} color="white" />
              </TouchableOpacity>}
              {statusMsg=="" && <TouchableOpacity
                style={[styles.button, { backgroundColor: 'red' }]}
                onPress={handleReject}
              >
                <Entypo name="cross" size={24} color="white" />
              </TouchableOpacity>}
              {statusMsg!="" && <TouchableOpacity
                style={[styles.button, { backgroundColor: 'gray' }]}
                onPress={handleReject}
                disabled
              >
                <Text>{statusMsg}</Text>
              </TouchableOpacity>}
            </View>
            </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  requestContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    margin:10
  },
  requestText: {
    fontSize: 18,
    marginBottom: 5,
    fontStyle:"italic",
  },
  buttonContainer: {
    flexDirection: 'row',
    gap:10,
    marginTop: 10,
    justifyContent:"flex-end"
  },
  button: {
    padding: 10,
    borderRadius:30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EnrollmentRequests;
