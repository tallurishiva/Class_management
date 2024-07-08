
//-------------------------------------
import React from 'react';
import { View, Text, FlatList, StyleSheet,SafeAreaView } from 'react-native';
import CustomButton from "../Interactives/CustomButton";
import {auth,app} from '../configfirebase';
import { useNavigation } from '@react-navigation/native';
import {getAuth,signOut} from 'firebase/auth';
const Notifications = () => {
  const nav=useNavigation();
  // Dummy notification data (replace with your actual data)
  const notifications = [
    {
      id: '1',
      title: 'New Message',
      message: 'You have received a new message from John.',
      timestamp: '2024-04-01T09:30:00Z'
    },
    {
      id: '2',
      title: 'Reminder',
      message: 'Don\'t forget to attend the meeting at 2 PM.',
      timestamp: '2024-04-02T14:00:00Z'
    },
    {
      id: '3',
      title: 'Event Invitation',
      message: 'You are invited to the company party next Friday!',
      timestamp: '2024-04-05T18:00:00Z'
    },
    {
      id: '4',
      title: 'Deadline Approaching',
      message: 'Project deadline is coming up. Please submit your work by Wednesday.',
      timestamp: '2024-04-08T12:00:00Z'
    },
    {
      id: '5',
      title: 'New Task Assigned',
      message: 'You have a new task assigned to you. Check your task list for details.',
      timestamp: '2024-04-12T10:00:00Z'
    },
    {
      id: '6',
      title: 'Feedback Request',
      message: 'Please provide feedback on the latest product update.',
      timestamp: '2024-04-15T16:30:00Z'
    },
    {
      id: '7',
      title: 'Upcoming Holiday',
      message: 'Office will be closed for the holiday next Monday.',
      timestamp: '2024-04-18T00:00:00Z'
    },
    {
      id: '8',
      title: 'Team Meeting Reminder',
      message: 'Team meeting scheduled for Thursday afternoon.',
      timestamp: '2024-04-20T15:00:00Z'
    },
    {
      id: '9',
      title: 'System Maintenance',
      message: 'Scheduled system maintenance on Saturday morning. Expect downtime.',
      timestamp: '2024-04-25T08:00:00Z'
    },
    {
      id: '10',
      title: 'Feedback Deadline',
      message: 'Last day to submit feedback for the new website design.',
      timestamp: '2024-04-30T23:59:59Z'
    }
    // Add more notification objects as needed
  ];
  // Render each notification item
  const renderNotificationItem = ({ item }) => {
    return (
      <View style={styles.notificationContainer}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTimestamp}>{formatTimestamp(item.timestamp)}</Text>
      </View>
    );
  };
  // const signout=async()=>{
  //     //console.log(getAuth(app).currentUser.uid);
  //     await getAuth(app).signOut().then(console.log("logout"));
  //   //   console.log("------------------------");
  //     if(getAuth(app))
  //     console.log(getAuth(app).currentUser);
  //   else{
  //     console.log("logout");
  //   }
  //     nav.navigate("Login");
  // }
  // Helper function to format timestamp (e.g., '2024-04-01T09:30:00Z' -> 'Apr 1, 2024, 9:30 AM')
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <SafeAreaView>
    <FlatList
      data={notifications}
      renderItem={renderNotificationItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
    />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  notificationContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  notificationMessage: {
    fontSize: 16,
    marginBottom: 8,
  },
  notificationTimestamp: {
    fontSize: 14,
    color: '#888',
  },
});

export default Notifications;
