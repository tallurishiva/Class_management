import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,ScrollView } from 'react-native';
import {AntDesign,FontAwesome5} from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import LoginScreen from './components/Login';
import Doughts from './components/Doughts';
import MarkAttendence from './components/MarkAttendence';
import CustomHeader from './components/CustomHeader';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CompressedCalendar from './components/Calender';
import Notifications from './components/Notifications';
import AttendanceStats from './components/Stats';
export default function Main({navigation}) {
  const Tab = createBottomTabNavigator();
  return (
     <Tab.Navigator
       screenOptions={({ route }) => ({
        header: () => <CustomHeader navigation={navigation} route={route} />,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home'
          } else if (route.name === 'Notifications') {
            iconName =  'notification';
          }
          else if(route.name=== 'Stats'){
             return <FontAwesome5 name="chart-bar" size={size} color={color} />
          }
          else if(route.name=== 'Doubts'){
            return <Entypo name="hand" size={24} color={color}/>
         }
         else if(route.name=== 'Mark'){
          return  <Feather name="check-circle" size={36} color={color} />
        }
          return <Entypo name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
       headerStyle:{
        
       },
       headerTintColor: 'black'
      })}
      >
       <Tab.Screen name="Home" component={CompressedCalendar} />
       <Tab.Screen name="Doubts" component={Doughts} />
       <Tab.Screen name="Mark" component={MarkAttendence} />
       <Tab.Screen name="Stats" component={AttendanceStats}/>
       <Tab.Screen name="Notifications" component={Notifications} />
     </Tab.Navigator>
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
