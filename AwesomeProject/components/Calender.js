import React from 'react';
import { StyleSheet,View ,SafeAreaView,Text} from 'react-native';
import { Calendar,CalendarProvider,Agenda,Horizontalcalendar} from 'react-native-calendars';
import { startOfWeek, endOfWeek, isSameWeek, format } from 'date-fns';

const CompressedCalendar = () => {
    const sessionsApril2024 = [];
for (let day = 1; day <= 30; day++) { 
  const date = `2024-04-${day.toString().padStart(2, '0')}`;

  const session = {
    date: date,
    title: `Day ${day} Session`,
    description: `Description for Day ${day} Session`,
    location: 'Meeting Room',
    startTime: '10:00 AM',
    endTime: '11:00 AM'
  };

  // Push session to sessions array
  sessionsApril2024.push(session);
}
      const renderAgendaItem = (item) => {
        return (
          <View style={styles.itemdox}>
            <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>{item.location}</Text>
            <Text>{`${item.startTime} - ${item.endTime}`}</Text>
          </View>
        );
      };
      const agendaItems = {};
    sessionsApril2024.forEach((session) => {
    const date = session.date;
    if (!agendaItems[date]) {
      agendaItems[date] = [];
    }
    agendaItems[date].push(session);
  });
     const renderEmptyDate=() => {
    console.log('Rendering empty date');
    return <View style={{ padding: 10 }}><Text>No sessions planned</Text></View>;
  }
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
     <Agenda 
     scrollEnabled
     items={agendaItems}
     
     renderItem={(item) => renderAgendaItem(item)}
     renderEmptyDate={renderEmptyDate}
     rowHasChanged={(r1, r2) => r1.title !== r2.title} />
    </SafeAreaView>
  );
};

export default CompressedCalendar;
const styles = StyleSheet.create({
    itemdox: {
      backgroundColor:"lightblue",
      padding:20,
      margin:10,
      borderRadius:20,
    },
});