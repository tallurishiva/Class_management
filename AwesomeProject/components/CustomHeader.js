import React from 'react';
import { View, TextInput, StyleSheet,Image ,Text,TouchableOpacity} from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import icon library
import { DrawerActions } from '@react-navigation/native';

const CustomHeader = ({ navigation,route }) => {
  const handleClick = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={[styles.container, { width:35,height: 35 }]} onPress={handleClick}>
      <Image source={require('./profileimg.png') } style={styles.image} />
      </TouchableOpacity>
      <View style={{display:"flex"}}>
      <Text style={{fontSize: 20,
          fontWeight: 'bold',
          color: 'black'}}>{route.name}</Text>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 50, // Half of the width and height to make it circular
        backgroundColor:"black",
        margin:5,
        marginTop:15,
      },
      image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
      },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap:12,
    alignContent:"center",
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 15,
    paddingBottom:5,
    margin:0
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
});

export default CustomHeader;
