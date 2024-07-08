import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity,TextInput } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { auth, db } from '../configfirebase';
import { collection, query, where, getDocs ,addDoc} from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { Entypo } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
export default function Subscheduler({subject}){
    const [date, setDate] = useState(new Date());
    const [day,setday]=useState("");
    const WeekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const [showPickerone, setShowPickerone] = useState(false);
    const [showPickertwo, setShowPickertwo] = useState(false);
    const [timeone, setTimeone] = useState("");
    const [timetwo, setTimetwo] = useState("");
    const [add,setAdd]=useState(false); 
    const [schedules,setSchedules]=useState([]);
    const handleDateChangeone = (event, selectedDate) => {
        const currentDate = selectedDate.toLocaleTimeString() || date;
        setShowPickerone(false); 
        setTimeone(currentDate);
      };
      const handleDateChangetwo = (event, selectedDate) => {
        const currentDate = selectedDate.toLocaleTimeString() || date;
        setShowPickertwo(false); 
        setTimetwo(currentDate); 
      };
      const submit=async()=>{
          try{
            const usersCollection = collection(db, "schdules");
            console.log(day,timeone,timetwo);
            const userData = {
                 subID:subject.subID,
                 weekDay:day,
                 startTime:timeone,
                 endTime:timetwo,
                 subName:subject.subData.subject
              };
              await addDoc(usersCollection, userData);
              fetchData();
              setAdd(false);
          }
          catch(e){
            Alert.alert("Error! please Try Again");
            console.log(e.message);
          }
      }
      const fetchData = async () => {
        try {
          const subCollection = collection(db, "schdules");
          const q = query(
            subCollection,
            where("subID", "==", subject.subID)
          );
          const querySnapshot = await getDocs(q);
          console.log(querySnapshot.docs);
          const fetchedSubs = [];
          querySnapshot.forEach((doc) => {
            fetchedSubs.push({ sudID: doc.id, sudData: doc.data() });
          });
  
          setSchedules(fetchedSubs);
        } catch (error) {
          console.log('Error fetching data:', error.message);
        }
      };
    React.useEffect(()=>{
          fetchData();
    },[]);
     return (
         <View style={styles.container}>
            <View style={{padding:10,backgroundColor:"lightblue",}}>
                <Text style={{fontWeight:"bold",fontSize:20}}>{subject.subData.subject}</Text>
                <View style={{display:"flex",flexDirection:"row",justifyContent:"flex-start",gap:8,margin:3}}>
                    <Text>{subject.subData.semester}</Text>
                    <Text>{subject.subData.section}</Text>
                    <Text>{subject.subData.batch}</Text>
                </View>
                </View>
            <View style={{minHeight:100,backgroundColor:"#fff"}}>
            {schedules.length==0 && !add && <View style={{display:"flex",flexDirection:"row",justifyContent:"center",margin:10,alignItems:"center"}}><Text style={styles.Textstyle}>No Schedules found</Text></View>}
               {schedules.map((item)=>(<View style={{display:"flex",flexDirection:"row",justifyContent:"space-between",margin:10,alignItems:"center"}}>
                    <Text style={styles.Textstyle}>{item.sudData.weekDay}</Text>
                    <Text style={styles.Textstyle}>{item.sudData.startTime}</Text>
                    <Text style={styles.Textstyle}>{item.sudData.endTime}</Text>
                    <TouchableOpacity>
                    <AntDesign name="delete" size={18} color="red" />
                    </TouchableOpacity>
                </View>))}
                {add &&<View style={{display:"flex",flexDirection:"row",justifyContent:"space-between",margin:10,alignItems:"center"}}>
                <Picker
                   style={{width:107,margin:0}}
                   selectedValue={day}
                   onValueChange={(itemValue) => setday(itemValue)}
                >
                 <Picker.Item label="Day" value="" />
                        {WeekDays.map((day, index) => (
                    <Picker.Item key={index} label={day} value={day} />
                   ))}
                </Picker>
                    <View>
                    <TouchableOpacity onPress={()=>{setShowPickerone(true)}}>
                    <Text>From Time</Text>
                    </TouchableOpacity>
                    {showPickerone && <DateTimePicker
                    value={date}
                    mode="time"
                    display="spinner"
                    onChange={handleDateChangeone}
                    />}
                    </View>
                    <View>
                    <TouchableOpacity onPress={()=>{setShowPickertwo(true)}}>
                    <Text>To Time</Text>
                    </TouchableOpacity>
                    {showPickertwo && <DateTimePicker
                    value={date}
                    mode="time"
                    display="spinner"
                    onChange={handleDateChangetwo}
                    />}
                     </View>
                    <TouchableOpacity onPress={submit}>
                    <Ionicons name="checkmark" size={24} color="blue" />
                    </TouchableOpacity>
                </View>}
                <View style={{display:"flex",flexDirection:"row",justifyContent:"flex-end",margin:15}}>
                   <TouchableOpacity style={{display:"flex",flexDirection:"row",backgroundColor:"green",padding:8,gap:5,borderRadius:15,alignItems:"center"}} onPress={() => setAdd(!add)}>
                      <Text style={{fontSize:15,color:"#fff"}}>{add?"Cancel":"ADD"}</Text>{!add?<Ionicons name="add" size={18} color="white" />:<Entypo name="cross" size={18} color="white" />}
                    </TouchableOpacity>
                </View>
            </View>
         </View>
     );
}
const styles = StyleSheet.create({
    container: {
        margin:0,
        marginBottom:5,
        overflow:"hidden"
      },
     Textstyle:{
        fontSize:16,
     }
})