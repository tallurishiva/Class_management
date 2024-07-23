import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AssignmentCard = ({ item ,role}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if(role!="student")
    navigation.navigate('AssignmentDetails', { assignment: item });
    else{
      navigation.navigate('Fileupload', { assignment: item });
    }
  };
  return (
    <TouchableOpacity onPress={handlePress} style={styles.card}>
      <Text style={styles.subject}>{item.name}</Text>
      <Text style={styles.topic}>{item.topic.length > 30 ? `${item.topic.substr(0, 30)}...` : item.topic}</Text>
      <Text style={styles.date}>Due Date: {new Date(item.endDate.seconds * 1000).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    elevation: 3, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  subject: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  topic: {
    fontSize: 16,
    color: '#666',
  },
  date: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
});

export default AssignmentCard;
