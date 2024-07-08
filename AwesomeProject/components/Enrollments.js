import React from 'react';
import { View, StyleSheet,ScrollView } from 'react-native';
import { auth,db } from '../configfirebase';
import { collection,where,query,getDocs,doc,getDoc,addDoc, and } from 'firebase/firestore';
import EnrollmentRequests from './Request';
const EnrollmentScreen = () => {
  const [reqs,setReqs]=React.useState([]);
  React.useEffect(()=>{
    const fetchData = async () => {
        try {
          const req = collection(db, "EnrollReq");
          const q=query(req,and(where("profID","==",auth.currentUser.uid),where("status","==",false),where("regret","==",false)));
          const querySnapshot =await getDocs(q);
          const fetchedStates = [];
          querySnapshot.forEach((doc) => {
            if(!fetchedStates.includes(doc.data())){
            fetchedStates.push({docID:doc.id,data:doc.data()});
           }
          });
          setReqs(fetchedStates);
        } catch (e) {
          console.log('Error fetching data:', e.message);
        }
      };
      fetchData();
  },[]);
 

  return (
    <ScrollView>
    <View style={styles.container}>
    {reqs.map((item,index)=>(
        <EnrollmentRequests
        requests={item}
      />
    ))}
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',    
  },
});

export default EnrollmentScreen;
