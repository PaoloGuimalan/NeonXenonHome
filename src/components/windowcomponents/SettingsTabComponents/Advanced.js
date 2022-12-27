import { View, Text, Animated, StyleSheet, ImageBackground, ToastAndroid, Platform, BackHandler, Image, ScrollView, TouchableOpacity, TextInput, NativeModules, Linking } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { openDatabase } from 'react-native-sqlite-storage';
import { SET_PWA_LIST } from '../../../redux/types';
import { useDispatch, useSelector } from 'react-redux';

const db = openDatabase({
  name: "neonxenonhomedb"
})

const Advanced = () => {

  const createNotificationTable = () => {
    db.transaction(txn => {
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS notifStorage (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          notifID VARCHAR(225), 
          app VARCHAR(225), 
          audioContentsURI TEXT, 
          bigText TEXT,
          extraInfoText TEXT, 
          icon BLOB, 
          iconLarge BLOB, 
          image BLOB, 
          imageBackgroundURI BLOB, 
          subText TEXT, 
          summaryText TEXT, 
          text TEXT, 
          time VARCHAR(255), 
          title TEXT, 
          titleBig TEXT
          )`,
        [],
        (sqlTxn, res) => {
          // console.log("table created successfully");
          if(Platform.OS === 'android'){
            ToastAndroid.show("Notification Initialized", ToastAndroid.SHORT)
          }
          else{
              alert("Notification Initialized")
          }
          createGroupMessagesNotif()
        },
        error => {
          console.log("error on creating table " + error.message);
          if(Platform.OS === 'android'){
            ToastAndroid.show("Error Creating Database!", ToastAndroid.SHORT)
          }
          else{
              alert("Error Creating Database!")
          }
        },
      );
    });
  };

  const createGroupMessagesNotif = () => {
    db.transaction(txn => {
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS notifGroupStorage (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          notifID VARCHAR(225), 
          text VARCHAR(225), 
          title VARCHAR(225)
          )`,
        [],
        (sqlTxn, res) => {
          // console.log("table created successfully");
          if(Platform.OS === 'android'){
            ToastAndroid.show("Group Notification Initialized", ToastAndroid.SHORT)
          }
          else{
              alert("Group Notification Initialized")
          }
        },
        error => {
          console.log("error on creating table " + error.message);
          if(Platform.OS === 'android'){
            ToastAndroid.show("Error Creating Database!", ToastAndroid.SHORT)
          }
          else{
              alert("Error Creating Database!")
          }
        },
      );
    });
  };

  return (
    <View style={{backgroundColor: "transparent", flex: 1, width: "100%", padding: 5}}>
      <Text style={{color: "white", fontWeight: "bold", fontSize: 13}}>Advanced</Text>
      <View style={{backgroundColor: "transparent", padding: 10}}>
        <Text style={{color: "white", fontSize: 12, fontWeight: "bold"}}>System Data</Text>
        <View style={{backgroundColor: "transparent", padding: 10}}>
          <Text style={{color: "white", fontSize: 11}}>Desktop Shortcuts</Text>
          <View style={{width: "100%", backgroundColor: "transparent", flex: 1, marginTop: 5, flexDirection: "row", flexWrap: "wrap"}}>
            <TouchableOpacity style={{backgroundColor: "grey", width: 50, height: 20, justifyContent: "center", alignItems: "center", borderRadius: 3, marginRight: 5, marginTop: 5}}>
              <Text style={{color: "white", fontSize: 11}}>Initialize</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{backgroundColor: "orange", width: 50, height: 20, justifyContent: "center", alignItems: "center", borderRadius: 3, marginRight: 5, marginTop: 5}}>
              <Text style={{color: "white", fontSize: 11}}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{backgroundColor: "red", width: 50, height: 20, justifyContent: "center", alignItems: "center", borderRadius: 3, marginRight: 5, marginTop: 5}}>
              <Text style={{color: "white", fontSize: 11}}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{backgroundColor: "transparent", padding: 10}}>
          <Text style={{color: "white", fontSize: 11}}>PWAs</Text>
          <View style={{width: "100%", backgroundColor: "transparent", flex: 1, marginTop: 5, flexDirection: "row", flexWrap: "wrap"}}>
            <TouchableOpacity style={{backgroundColor: "grey", width: 50, height: 20, justifyContent: "center", alignItems: "center", borderRadius: 3, marginRight: 5, marginTop: 5}}>
              <Text style={{color: "white", fontSize: 11}}>Initialize</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{backgroundColor: "orange", width: 50, height: 20, justifyContent: "center", alignItems: "center", borderRadius: 3, marginRight: 5, marginTop: 5}}>
              <Text style={{color: "white", fontSize: 11}}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{backgroundColor: "red", width: 50, height: 20, justifyContent: "center", alignItems: "center", borderRadius: 3, marginRight: 5, marginTop: 5}}>
              <Text style={{color: "white", fontSize: 11}}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{backgroundColor: "transparent", padding: 10}}>
          <Text style={{color: "white", fontSize: 11}}>Notifications</Text>
          <View style={{width: "100%", backgroundColor: "transparent", flex: 1, marginTop: 5, flexDirection: "row", flexWrap: "wrap"}}>
            <TouchableOpacity onPress={() => { createNotificationTable() }} style={{backgroundColor: "grey", width: 50, height: 20, justifyContent: "center", alignItems: "center", borderRadius: 3, marginRight: 5, marginTop: 5}}>
              <Text style={{color: "white", fontSize: 11}}>Initialize</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{backgroundColor: "orange", width: 50, height: 20, justifyContent: "center", alignItems: "center", borderRadius: 3, marginRight: 5, marginTop: 5}}>
              <Text style={{color: "white", fontSize: 11}}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{backgroundColor: "red", width: 50, height: 20, justifyContent: "center", alignItems: "center", borderRadius: 3, marginRight: 5, marginTop: 5}}>
              <Text style={{color: "white", fontSize: 11}}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default Advanced