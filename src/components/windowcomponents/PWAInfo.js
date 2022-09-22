import { View, Text, Animated, StyleSheet, ImageBackground, ToastAndroid, Platform, BackHandler, Image, ScrollView, TouchableOpacity, TextInput, NativeModules, Linking } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { SET_PWA_LIST } from '../../redux/types';
import { openDatabase } from 'react-native-sqlite-storage';

const db = openDatabase({
    name: "neonxenonhomedb"
})

const PWAInfo = ({id, name, icon}) => {

  const PWAid = id;  

  const dispatch = useDispatch();

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

  const deletePWA = () => {
    db.transaction(txn => {
      txn.executeSql(`DELETE FROM PWAs WHERE id = ?`,
      [PWAid],
      (sqlTxn, res) => {
        //console.log(res)
        if(res.rowsAffected > 0){
          if(Platform.OS === 'android'){
            ToastAndroid.show(`${name} were uninstalled`, ToastAndroid.SHORT)
          }
          else{
              alert(`${name} were uninstalled`)
          }
          PWAInit();
        }
        else{
          if(Platform.OS === 'android'){
            ToastAndroid.show(`Cannot uninstall ${name}`, ToastAndroid.SHORT)
          }
          else{
              alert(`Cannot uninstall ${name}`)
          }
        }
      },
      (error) => {
        if(Platform.OS === 'android'){
          ToastAndroid.show(`Uninstall process failed`, ToastAndroid.SHORT)
        }
        else{
            alert(`Uninstall process failed`)
        }
      })
    })
  }

  return (
    <View style={styles.mainView}>
      <ScrollView style={{backgroundColor: "transparent", width: "100%", height: "100%", flexGrow: 1}} contentContainerStyle={{flexGrow: 1}}>
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Image source={icon} style={{width: "90%", maxWidth: 70, height: "90%", maxHeight: 70, marginBottom: 15}} />
            <Text style={{color: "white", fontSize: 12, fontWeight: "bold", marginBottom: 20}}>{name}</Text>
            <TouchableOpacity onPress={() => { deletePWA() }} style={{backgroundColor: "red", width: "90%", maxWidth: 120, height: 30, justifyContent: "center", alignItems: "center", borderRadius: 5, marginBottom: 10}}>
                <Text style={{backgroundColor: "transparent", color: "white", textAlign: "center", textAlignVertical: "center"}}>Uninstall</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    mainView:{
        backgroundColor: "black",
        width: "100%", 
        height: "100%",
        opacity: 0.9
    }
})

export default PWAInfo