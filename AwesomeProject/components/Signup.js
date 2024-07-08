import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  Pressable
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import GoogleSvgIcon from '../assets/GoogleSvgIcon.js';
import CustomButton from '../Interactives/CustomButton';
import InputField from '../Interactives/InputField';
import { useNavigation } from '@react-navigation/native';
import { auth,db } from '../configfirebase';
import { collection, addDoc } from "firebase/firestore";
import Spinner from 'react-native-loading-spinner-overlay'; 
import {getAuth,createUserWithEmailAndPassword,sendEmailVerification,GoogleAuthProvider,signInWithPopup} from "firebase/auth";
const SignupScreen = ({ route }) => {
const nav=useNavigation();
  const [UserName,setUserName]=React.useState("");
  const [Password,setPassword]=React.useState("");
  const [isLoading,setisLoading]=React.useState(false);
  const [ConfirmPassword,setConfirmPassword]=React.useState("");
  const { profile } = route.params;
  const signup=async()=>{
      if(UserName && Password){
        try{
          setisLoading(true);
            const responce=await createUserWithEmailAndPassword(auth,
                UserName,Password
            )
            setisLoading(false);
          //   const docRef = await addDoc(collection(db, "users"),{
          //     first: "Ada",
          //     last: "Lovelace",
          //     born: 1815
          //   });
          // console.log("Document written with ID: ", docRef.id);
           const user=responce.user;
           if(user){
               await sendEmailVerification(user);
               Alert.alert('Verification email sent! Please check your inbox.');

           }
                 //nav.navigate("Login");
        }
        catch(e){
           setisLoading(false);
            Alert.alert("error");
            console.log(e);
        }
      }
  }
  const googlesignin=async ()=>{
    Alert.alert("sorry!\n not yet included");
  }
  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
       <Spinner
        visible={isLoading}
        textContent={'CheckIng IN...'}
        textStyle={{ color: '#FFF' }}
      />
    <View style={{paddingHorizontal: 25}}>
      <View style={{alignItems: 'center',overflow:"hidden"}}>
        <Image
         source={profile === 'student' ? require('./studentpic.png') : require('./teacherspic.png')}
          height={200}
          width={200}
          style={{height:200,width:200}}
        />
      </View>
      <Text
        style={{
          fontSize: 28,
          fontWeight: '500',
          color: '#333',
          marginBottom: 30,
        }}>
        SignUp
      </Text>
      <InputField
        label={'Email ID'}
        icon={
          <MaterialIcons
          name="alternate-email"
          size={20}
          color="#666"
          style={{marginRight: 5}}
        />
        }
        onChange={setUserName}
        keyboardType="email-address"
      />

       <InputField
        label={'Password'}
        icon={
            <EvilIcons
            name="lock"
            size={25}
            color="#666"
            style={{marginRight: 5}}
          />}
        inputType="password"
        onChange={setPassword}
        fieldButtonFunction={() => {}}
      />
      <InputField
        label={'Confirm Password'}
        icon={
          <EvilIcons
          name="lock"
          size={25}
          color="#666"
          style={{marginRight: 5}}
        />
        }
        inputType="password"
        onChange={setConfirmPassword}
        fieldButtonFunction={() => {}}
      />
      <CustomButton label={"Create"} onPress={signup}/>
      <Text style={{textAlign: 'center', color: '#666', marginBottom: 30}}>
        Or, SignUp with ...
      </Text>

      <View
        style={{
          flexDirection: 'row',
          alignItems:"center",
          justifyContent: 'center',
          marginBottom: 30,
        }}>
        <TouchableOpacity
          onPress={googlesignin} 
          style={{
            borderColor: '#ddd',
            borderWidth: 2,
            borderRadius: 10,
            paddingHorizontal: 30,
            paddingVertical: 10,
            display:"flex",
            flexDirection:"row",
            gap:10
          }}>
          <GoogleSvgIcon height={24} width={24} color="#fff"/>
          <Text style={{fontSize:15}}>Continue with Google</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 30,
        }}>
        <Text>Already a Member?</Text>
        <TouchableOpacity onPress={() => nav.navigate('Login',{profile:profile})}>
          <Text style={{color: '#AD40AF', fontWeight: '700'}}> Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  </SafeAreaView>
  );
};

export default SignupScreen;