import React from 'react';
import { View, Text, StyleSheet,Dimensions,Button ,Pressable} from 'react-native';
import Togglecomp from './Togglecomp';
import {
    LineChart,BarChart,PieChart,ProgressChart,ContributionGraph,StackedBarChart } from "react-native-chart-kit";
const AttendanceStats = ({ attendedClasses, totalClasses }) => {
  // Calculate attendance percentage
  const attendancePercentage = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;
  const [overall,setoverall]=React.useState(true);
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43]
      }
    ]
  };
  
  const chartConfig = {
    backgroundGradientFrom: "white",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "white",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };
  return (
    <View style={{flex:1}}>
    <View style={styles.btngroup}>
     {/* <Button color="black" width="30%" style={{width:100}} onPress={()=>{setoverall(true)}} title='OverAll'/>
      <Button color="green" style={{ width: 200 }} onPress={()=>{setoverall(false)}} title="SubjectWise"/> */}
      <Button title='show' ></Button>
    </View>
    <View style={styles.barChart}>
    {overall && <View>
       <BarChart
       data={data}
       width={Dimensions.get('window').width-20}
        height={250}
       yAxisLabel="%"
       chartConfig={chartConfig}
       verticalLabelRotation={30} />
     </View>}
     {!overall && <View>
     <LineChart
     data={data}
     width={Dimensions.get('window').width-20}
     height={250}
     verticalLabelRotation={30}
     chartConfig={chartConfig}
     bezier />
     </View>}
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 8,
    marginVertical: 10,
  },
  barChart:{
       backgroundColor:"white",
       padding:10,
       margin:10,
       overflow:"scroll",

  },
  btngroup:{
     display:"flex",
     backgroundColor:"black",
     width:"100%",
     flexDirection:"row",
     alignItems:"center",
     gap:10,
     width:100,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statValue: {
    fontSize: 16,
    color: '#007bff', // Blue color for attendance percentage
  },
});

export default AttendanceStats;