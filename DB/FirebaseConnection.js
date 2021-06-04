var firebaseConfig = {
    apiKey: "AIzaSyC1cONsvt4SDrZ2HA_plCkLys_79Qm8lTY",
    authDomain: "mainshop-d1b89.firebaseapp.com",
    databaseURL: "https://mainshop-d1b89-default-rtdb.firebaseio.com",
    projectId: "mainshop-d1b89",
    storageBucket: "mainshop-d1b89.appspot.com",
    messagingSenderId: "730036057826",
    appId: "1:730036057826:web:e7dbf43ef98de62abc90bb",
    measurementId: "G-NRWMQ49T6E"
  };

  
  const firebase = require("firebase/app");
  require("firebase/firestore");

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

module.exports = db;
