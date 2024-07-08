import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import LoginSVG from '../assets/GoogleSvgIcon.js';
import GoogleSvgIcon from '../assets/GoogleSvgIcon.js';
import CustomButton from '../Interactives/CustomButton';
import InputField from '../Interactives/InputField';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { auth,db } from '../configfirebase';
import { collection,query,where, getDocs,addDoc } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
const LoginScreen = ({ route }) =>{
const [UserName,setUserName]=React.useState("");
const [Profile,setProfile]=React.useState('student');
const [Password,setPassword]=React.useState("");
const [isLoading,setisLoading]=React.useState(false);
const nav=useNavigation();
const { profile } = route.params;
const handleLogin = async () =>{
  try {
   setisLoading(true);
    const userCredential = await signInWithEmailAndPassword(auth, UserName, Password);
    const user = userCredential.user;
    if (user){
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('uid', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      setisLoading(false);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        await ReactNativeAsyncStorage.setItem('userDetails', JSON.stringify(userData));
        nav.navigate("MainHome");
        console.log('User details stored successfully:', userData);
      }
      else if(profile=='student')
      nav.navigate("Register",{role:profile});
      else{
        nav.navigate("RegisterTutor",{role:profile});
      }
    }
  } catch (error) {
    setisLoading(false);
    console.error('Error signing in:', error);
    Alert.alert('Failed to sign in. Please check your credentials.');
  }
};
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
        //   fontFamily: 'Roboto-Medium',
          fontSize: 28,
          fontWeight: '500',
          color: '#333',
          marginBottom: 30,
        }}>
        Login
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
          />
          }
        inputType="password"
        onChange={setPassword}
        fieldButtonLabel={"Forgot?"}
        fieldButtonFunction={() => {}}
      />
      
      <CustomButton label={"Login"} onPress={handleLogin} />

      <Text style={{textAlign: 'center', color: '#666', marginBottom: 30}}>
        Or, login with ...
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems:"center",
          justifyContent: 'center',
          marginBottom: 30,
        }}>
        <TouchableOpacity
          onPress={() => {}}
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
        <Text>New to the app?</Text>
        <TouchableOpacity onPress={() => nav.navigate('Signup',{profile:profile})}>
          <Text style={{color: '#AD40AF', fontWeight: '700'}}> Register</Text>
        </TouchableOpacity>
      </View>
    </View>
   
  </SafeAreaView>
  );
};

export default LoginScreen;