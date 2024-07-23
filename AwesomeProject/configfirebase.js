// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDyVzOCQ_DaRXHgCVmq9ovxJtNgftGnvjY",
    authDomain: "newcheckin-ad47b.firebaseapp.com",
    projectId: "newcheckin-ad47b",
    storageBucket: "newcheckin-ad47b.appspot.com",
    messagingSenderId: "772461871795",
    appId: "1:772461871795:web:cd1393387a83de267ea6c6",
    databaseURL: "https://newcheckin-ad47b-default-rtdb.firebaseio.com",
    measurementId: "G-XNRNL6528V"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);
const realtimeDB=getDatabase(app);
const storage = getStorage(app);
export {auth,app,db,realtimeDB,storage};
//export auth ;