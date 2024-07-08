import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Agenda } from 'react-native-calendars';

const CompressedCalendar = () => {
  // Define the event details
  const eventDetails = {
    subName: 'CNS',
    startTime: '1:00 PM',
    endTime: '3:00 PM',
    subID: 'PMWwp2KwLojihikk8Hkc',
  };

  const generateRecurringEvents = (startDate, endDate, dayOfWeek) => {
    const events = {};
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      if (currentDate.getDay() === dayOfWeek) {
        const dateString = currentDate.toISOString().split('T')[0];
        events[dateString] = [
          {
            name: eventDetails.subName,
            startTime: eventDetails.startTime,
            endTime: eventDetails.endTime,
            subID: eventDetails.subID,
          },
        ];
      }
      currentDate.setDate(currentDate.getDate() + 7); // Move to next week
    }

    return events;
  };

  // Define start and end date for the recurring events (March 2024 to May 2024)
  const startDate = new Date('2024-03-01');
  const endDate = new Date('2024-05-31');

  // Generate recurring events for every Monday
  const recurringEvents = generateRecurringEvents(startDate, endDate, 1); // 1 represents Monday

  return (
    <View style={styles.container}>
      <Agenda
        items={recurringEvents}
        renderItem={(item) => (
          <View style={styles.item}>
            <Text>{item.name}</Text>
            <Text>{item.startTime} - {item.endTime}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  item: {
    backgroundColor: '#F0F0F0',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
});

export default CompressedCalendar;
