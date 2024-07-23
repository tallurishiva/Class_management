import React, { useEffect, useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../configfirebase'; // Import your firebase configuration
import { format, startOfWeek, addDays, isSameWeek } from 'date-fns';

const CompressedCalendar = () => {
  const [schedule, setSchedule] = useState([]);
  const [agendaItems, setAgendaItems] = useState({});

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'schdules'));
        const scheduleData = [];
        querySnapshot.forEach((doc) => {
          //console.log()
          scheduleData.push({ id: doc.id, ...doc.data() });
        });
        setSchedule(scheduleData);
      } catch (e) {
        console.log('Error fetching schedule:', e.message);
      }
    };

    fetchSchedule();
  }, []);
   console.log("at  28  "+schedule)
  useEffect(() => {
    const formatScheduleForAgenda = (schedule) => {
      const today = new Date();
      const start = startOfWeek(today, { weekStartsOn: 1 }); // Assuming week starts on Monday
      const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
      const dayMap = {};

      days.forEach((date) => {
        dayMap[format(date, 'yyyy-MM-dd')] = [];
      });

      schedule.forEach((session) => {
        const sessionDate = getDateFromWeekday(session.weekDay);
        if (sessionDate && dayMap[format(sessionDate, 'yyyy-MM-dd')]) {
          dayMap[format(sessionDate, 'yyyy-MM-dd')].push(session);
        }
      });
      return dayMap;
    };

    const getDateFromWeekday = (weekDay) => {
      const today = new Date();
      const start = startOfWeek(today, { weekStartsOn: 1 });
      const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      const index = weekdays.indexOf(weekDay);

      if (index === -1) return null;

      return addDays(start, index);
    };

    const formattedSchedule = formatScheduleForAgenda(schedule);
    setAgendaItems(formattedSchedule);
  }, [schedule]);
   console.log(agendaItems);
  const renderAgendaItem = (item) => (
    <View style={styles.itemContainer}>
      <Text style={{ fontWeight: 'bold' }}>{item.subName}</Text>
      <Text>{`${item.startTime} - ${item.endTime}`}</Text>
    </View>
  );
  const renderEmptyDate = () => (
    <View style={styles.emptyContainer}>
      <Text>No sessions planned</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Agenda
        scrollEnabled
        items={agendaItems}
        renderItem={(item) => renderAgendaItem(item)}
        renderEmptyDate={renderEmptyDate}
        rowHasChanged={(r1, r2) => r1.id !== r2.id}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: 'lightblue',
    padding: 20,
    margin: 10,
    borderRadius: 20,
  },
  emptyContainer: {
    backgroundColor: 'rgb(220,220,220)',
    padding: 20,
    margin: 10,
    borderRadius: 20,
  }
});

export default CompressedCalendar;
