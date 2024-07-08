import React from 'react';
import { createDrawerNavigator ,DrawerContentScrollView,DrawerItemList} from '@react-navigation/drawer';
import { Text, View ,StyleSheet,TouchableOpacity,Image} from 'react-native';
import Main from './Main';
import UserProfile from './components/ShowProfile';
import { db } from './configfirebase';
import Scheduler from './components/Scheduler';
import Subjects from './components/Subjects';
import ReactNativeAsyncStorage from"@react-native-async-storage/async-storage";
import SubjectRegistration from './components/RegisterSubjet';
import { collection, query, where,getDocs } from "firebase/firestore";
import EnrollmentScreen from './components/Enrollments';
const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      {/* Custom Drawer Header */}
      <View style={{width:"100%",padding:10,marginBottom:20}}>
      <Image source={require('./components/profileimg.png') } style={{height:100,width:100}} />
      </View>

      {/* Drawer Items */}
      <DrawerItemList {...props} />

      {/* Custom Drawer Items */}
      <TouchableOpacity style={styles.customDrawerItem} onPress={() => alert('Settings pressed')}>
        <Text style={styles.customDrawerText}>Settings</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

function MyDrawer() {
  const Drawer=createDrawerNavigator();
  const [role,setRole]=React.useState("");
  React.useEffect(()=>{
    const featch=async()=>{
    try{
    const storedData=await ReactNativeAsyncStorage.getItem("userDetails");
    if (storedData) {
      const userData = JSON.parse(storedData);
      setRole(userData.role);
      console.log('Retrieved User Data:', userData);
    } else {
      console.log('No User Data found in AsyncStorage');
    }
    }
    catch(e){
       console.log(e);
    }
  }
  featch();
   },[]);
   return (
    <Drawer.Navigator drawerContent={CustomDrawerContent} initialRouteName="Main" drawerPosition="right" screenOptions={{ gestureEnabled: true,headerShown: false }}>
      <Drawer.Screen name="Main" component={Main} />
      <Drawer.Screen name="Profile" component={UserProfile} options={{headerShown: true}}/>
      <Drawer.Screen name="Subjects" component={Subjects} options={{headerShown: true}}/>
      {role=="teacher" && <Drawer.Screen name="Enrollments" component={EnrollmentScreen} options={{headerShown: true}}/>}
      {role=="teacher" && <Drawer.Screen name="Schedule" component={Scheduler} options={{headerShown: true}}/>}
    </Drawer.Navigator>
  );
}
const styles = StyleSheet.create({
  drawerHeader: {
    height: 150,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerHeaderText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  customDrawerItem: {
    padding: 15,
  },
  customDrawerText: {
    fontSize: 18,
    color: 'black',
  },
});
export default MyDrawer;
