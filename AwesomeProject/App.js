import { StyleSheet, Text, View,ScrollView } from 'react-native';
import {AntDesign,FontAwesome5} from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import 'react-native-gesture-handler';
import Schedular from './components/Scheduler';
import LoginScreen from './components/Login';
import ProfileSelect from './components/ProfileSelect';
import SubjectRegistration from './components/RegisterSubjet';
import SignupScreen from './components/Signup';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MyDrawer from './MainHome';
import TutorsInfo from './components/TutorsInfo';
import FileUpload from './components/FileUpload';
import AttendanceScreen from './components/Attendancescreen';
import RegistrationForm from './components/PersonalInfo';
import SubjectEnrollmentRequest from './components/EnrollReq';
import StudentSubReg from './components/StudentSubReg';
import AssignmentDetails from './components/AssignmentDetails';
//import Fileview from './filesmng/Fileview';
import EnrollmentScreen from './components/Enrollments';
export default function App() {
  const Stack = createStackNavigator();
   
  return (
     <NavigationContainer>
     <Stack.Navigator>
        <Stack.Screen name="Profile" component={ProfileSelect} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegistrationForm} options={{ headerShown: false }} />
        <Stack.Screen name="RegisterTutor" component={TutorsInfo} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainHome" component={MyDrawer}  options={{ headerShown: false }}/>
        <Stack.Screen name="Subject Registation" component={SubjectRegistration}/>
        <Stack.Screen name="Subject Enrollment" component={StudentSubReg}/>
        <Stack.Screen name="Mark Attendance" component={AttendanceScreen}/>
        <Stack.Screen name="AssignmentDetails" component={AssignmentDetails}  /> 
        <Stack.Screen name="Fileupload" component={FileUpload}/> 
     </Stack.Navigator>
   </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex:1,
    display:"flex",
    flexDirection:"column",
    alignItems: 'center',
    justifyContent:"space-between",
  },
});
