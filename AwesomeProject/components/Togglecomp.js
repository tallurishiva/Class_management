import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Togglecomp = () => {
  const [showComponent1, setShowComponent1] = useState(true);

  const toggleComponent = (component) => {
    if (component === 'component1') {
      setShowComponent1(true);
    } else {
      setShowComponent1(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, showComponent1 ? styles.activeButton : null]}
          onPress={() => toggleComponent('component1')}
        >
          <Text style={styles.buttonText}>Component 1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !showComponent1 ? styles.activeButton : null]}
          onPress={() => toggleComponent('component2')}
        >
          <Text style={styles.buttonText}>Component 2</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.componentContainer}>
        {showComponent1 ? (
          <View style={styles.component}>
            <Text>This is Component 1</Text>
          </View>
        ) : (
          <View style={styles.component}>
            <Text>This is Component 2</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
    backgroundColor: '#007bff',
  },
  activeButton: {
    backgroundColor: '#0056b3', // Darker shade when active
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  componentContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 20,
    borderRadius: 5,
  },
  component: {
    alignItems: 'center',
  },
});

export default Togglecomp;
