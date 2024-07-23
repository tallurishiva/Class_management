import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  Platform,
  StyleSheet,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, onSnapshot } from 'firebase/firestore';
import { db, storage } from '../configfirebase';
import { Uploading } from '../filesmng/Uploading';
import { UploadingAndroid } from '../filesmng/UploadingAndroid';
import { auth } from '../configfirebase';

function FileUpload({ route }) {
  const [file, setFile] = useState('');
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState([]);
  console.log(route.params.assignment.id);
  useEffect(() => {
    const q = query(
      collection(db, 'files'),
      where('assignmentID', '==',route.params.assignment.id )
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedFiles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFiles(updatedFiles);
    });
    return () => unsubscribe();
  }, []);

  async function pickFile() {
    let result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
    });
    if (result.type !== 'cancel') {
      setFile(result.assets[0].uri);
      //console.log(result);
      await uploadFile(result.assets[0].uri, 'pdf');
    }
  }

  async function uploadFile(uri, fileType) {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `Stuff/${new Date().getTime()}_${fileType}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
          setProgress(progress.toFixed());
        },
        (error) => {
          console.log('Upload error:', error);
          // Handle upload error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log('File available at', downloadURL);
            await saveRecord(fileType, downloadURL, new Date().toISOString());
            setFile('');
          });
        }
      );
    } catch (error) {
      console.log('Fetch error:', error);
      // Handle fetch error
    }
  }

  async function saveRecord(fileType, url, createdAt) {
    try {
      const docRef = await addDoc(collection(db, 'files'), {
        fileType,
        url,
        createdAt,
        userid: auth.currentUser.uid,
        subjectID: route.params.assignment.subject,
        assignmentID:route.params.assignment.id
      });
      console.log('Document saved correctly', docRef.id);
    } catch (e) {
      console.log('Error saving document:', e);
    }
  }

  const handleDownload = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error('Failed to open URL:', err)
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={files}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.itemContent}>
              <Ionicons name="document" size={24} color="black" />
              <View style={styles.itemTextContainer}>
                <Text style={styles.itemText}>
                  {item.fileType === 'pdf' ? 'PDF File' : 'Unknown File'}
                </Text>
                <Text style={styles.itemUrl}>{item.url}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => handleDownload(item.url)}
            >
              <Ionicons name="download" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.contentContainer}
      />
      {file &&
        (Platform.OS === 'ios' ? (
          <Uploading file={file} progress={progress} />
        ) : (
          <UploadingAndroid file={file} progress={progress} />
        ))}
      <TouchableOpacity onPress={pickFile} style={styles.addButton}>
        <Ionicons name="document" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 5,
    borderRadius: 5,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTextContainer: {
    marginLeft: 10,
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemUrl: {
    fontSize: 12,
    color: 'gray',
  },
  downloadButton: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 90,
    right: 30,
    width: 44,
    height: 44,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
});

export default FileUpload;
