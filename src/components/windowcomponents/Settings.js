import { View, Text, Animated, StyleSheet, ImageBackground, ToastAndroid, Platform, BackHandler, Image, ScrollView, TouchableOpacity, TextInput, NativeModules, Linking } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import PWASettings from './SettingsTabComponents/PWASettings'

const SettingsTabStack = createNativeStackNavigator()

const Settings = ({navigation}) => {
  return (
    <View style={styles.mainView}>
      <View style={{backgroundColor: "transparent", width: "100%", height: "100%", flex: 1}}>
        <Text style={{color: "white", fontSize: 15, padding: 10, fontWeight: "bold"}}>Settings</Text>
        <View style={{backgroundColor: "transparent", width: "100%", flex: 1, flexDirection: "row", justifyContent: "center", paddingBottom: 15}}>
            <View style={{backgroundColor: "transparent", width: "35%", borderRightWidth: 1, borderColor: "grey", paddingLeft: 0, paddingBottom: 0}}>
                <ScrollView fadingEdgeLength={50}>
                    <TouchableOpacity style={{backgroundColor: "transparent", width: "100%", padding: 5, marginBottom: 5}}>
                        <Text style={{fontSize: 12, color: "white"}}>PWA Settings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor: "transparent", width: "100%", padding: 5, marginBottom: 5}}>
                        <Text style={{fontSize: 12, color: "white"}}>Home Settings</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
            <View style={{backgroundColor: "transparent", width: "65%"}}>
                <ScrollView fadingEdgeLength={50} contentContainerStyle={{flexGrow: 1}}>
                    <PWASettings />
                </ScrollView>
            </View>
        </View>
      </View>
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

export default Settings