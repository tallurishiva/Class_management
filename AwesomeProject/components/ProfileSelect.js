import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet,ToastAndroid} from 'react-native';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { realtimeDB } from '../configfirebase';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
const ProfileSelect = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const nav=useNavigation();
  const selectRole = (role) =>{
    setSelectedRole(role);
  };
  console.log("realtimeDB :"+JSON.stringify(realtimeDB));
  const movelogin=()=>{
    if(selectRole===null)
     ToastAndroid.show("Plese select Your Profile",4000);
    else{
       nav.navigate("Login",{profile:selectedRole});
    }
  }
  return (
    <View style={styles.container}>
    <View style={{flex:1,justifyContent:"center"}}>
      <Text style={styles.title}>Select Your Profile</Text>
      <View style={styles.profileContainer}>
        <TouchableOpacity
          style={[
            styles.profileOption,
            selectedRole === 'student' && styles.selectedProfile,
          ]}
          onPress={() => selectRole('student')}
        >
          <Image
            source={require('./studentpic.png')}
            style={styles.profileImage}
          />
          <Text style={styles.profileText}>Student</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.profileOption,
            selectedRole === 'teacher' && styles.selectedProfile,
          ]}
          onPress={() => selectRole('teacher')}
        >
          <Image
            source={require('./teacherspic.png')}
            style={styles.profileImage}
          />
          <Text style={styles.profileText}>Teacher</Text>
        </TouchableOpacity>
      </View>
      </View>
      <TouchableOpacity 
        onPress={movelogin}
       style={{backgroundColor:"lightblue",width:"100%",height:"10%",borderTopEndRadius:20,borderTopLeftRadius:20,display:"flex",alignItems:"center",justifyContent:"flex-end",flexDirection:"row"}}>
      <View style={{display:"flex",alignItems:"center",justifyContent:"flex-end",flexDirection:"row"}}>
      <Text style={{fontSize:20}}>Login/Signup</Text>
      <AntDesign name="arrowright" size={36} color="black" />
      </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent:"space-between"
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign:"center",
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  profileOption: {
    alignItems: 'center',
    margin:20
  },
  selectedProfile: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 5,
    padding: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 0,
    marginBottom: 10,
  },
  profileText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedRoleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default ProfileSelect;
