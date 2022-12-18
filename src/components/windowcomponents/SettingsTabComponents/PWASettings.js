import { View, Text, Animated, StyleSheet, ImageBackground, ToastAndroid, Platform, BackHandler, Image, ScrollView, TouchableOpacity, TextInput, NativeModules, Linking } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { openDatabase } from 'react-native-sqlite-storage';
import { SET_PWA_LIST } from '../../../redux/types';
import { useDispatch, useSelector } from 'react-redux';

const db = openDatabase({
    name: "neonxenonhomedb"
})

const PWASettings = () => {

  const [PWAName, setPWAName] = useState("");
  const [PWAUrl, setPWAUrl] = useState("");

  const dispatch = useDispatch()

  const savePWA = () => {
    //downloadIcons()
    addPWAProcess(PWAName, PWAUrl, "default", "Home")
  }

  const addPWAProcess = (name, url, icon, extra) => {
    db.transaction(txn => {
      txn.executeSql(`INSERT INTO PWAs (pwaName, pwaUrl, pwaIcon, pwaExtra) VALUES (?,?,?,?)`,
      [name, url, icon, extra],
      (sqlTxn, res) => {
        //console.log(res)
        if(res.rowsAffected > 0){
            
          setPWAName("");
          setPWAUrl("");
          PWAInit();

          if(Platform.OS === 'android'){
            ToastAndroid.show(`${name} saved as PWA`, ToastAndroid.SHORT)
          }
          else{
              alert(`${name} saved as PWA`)
          }
          //homeAppsInit();
        }
        else{
          if(Platform.OS === 'android'){
            ToastAndroid.show("Cannot save PWA", ToastAndroid.SHORT)
          }
          else{
              alert("Cannot save PWA")
          }
        }
      },
      (error) => {
        if(Platform.OS === 'android'){
          ToastAndroid.show(`Error saving ${name}`, ToastAndroid.SHORT)
        }
        else{
            alert(`Error saving ${name}`)
        }
      })
    })
  }

  const PWAInit = () => {
    db.transaction(txn => {
        txn.executeSql(`SELECT * FROM PWAs WHERE pwaExtra = ?`,
        ["Home"],
        (sqlTxn, res) => {
            var arr = []
            for(var i = 0; i < res.rows.length; i++){
                // console.log(res.rows.length)
                arr.push(res.rows.item(i))
                if(i+1 == res.rows.length){
                    // console.log(res.rows.item(i).bookName)
                    // console.log(arr)
                    //setappShortcuts(arr);
                    dispatch({type: SET_PWA_LIST, pwalist: arr});
                }
            }
            if(res.rows.length == 0){
              dispatch({type: SET_PWA_LIST, pwalist: arr});
            }
            //console.log(arr)
        },
        (error) => {
            if(Platform.OS === 'android'){
                ToastAndroid.show("Home Shortcuts failed to Initalize", ToastAndroid.SHORT)
            }
            else{
                  alert("Home Shortcuts failed to Initalize")
            }
        })
    })
  }

  return (
    <View style={styles.mainView}>
      <Text style={{color: "white", fontSize: 13, fontWeight: "bold", marginBottom: 10}}>Progressive Web Apps Settings</Text>
      <Text style={{color: "white", fontSize: 11, marginBottom: 10}}>Add a new PWA</Text>
      <TextInput onChangeText={(e) => { setPWAName(e) }} defaultValue={PWAName} style={{padding: 0, paddingLeft: 5, paddingRight: 5, borderRadius: 5, borderWidth: 1, borderColor: "white", height: 30, width: "90%", fontSize: 11, color: "white", marginBottom: 10}} placeholderTextColor="white" placeholder='PWA Name' />
      <TextInput onChangeText={(e) => { setPWAUrl(e) }} defaultValue={PWAUrl} style={{padding: 0, paddingLeft: 5, paddingRight: 5, borderRadius: 5, borderWidth: 1, borderColor: "white", height: 30, width: "90%", fontSize: 11, color: "white", marginBottom: 10}} placeholderTextColor="white" placeholder='Input URL here' />
      <TouchableOpacity onPress={() => { savePWA() }}>
        <Text style={{color: "black", fontSize: 11, backgroundColor: "white", width: "90%", maxWidth: 70, height: 25, textAlign: "center", textAlignVertical: "center", borderRadius: 5}}>Process</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    mainView: {
        backgroundColor: "transparent",
        flex: 1,
        width: "100%",
        padding: 5
    }
})

export default PWASettings