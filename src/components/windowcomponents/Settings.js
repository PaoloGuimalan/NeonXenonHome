import { View, Text, Animated, StyleSheet, ImageBackground, ToastAndroid, Platform, BackHandler, Image, ScrollView, TouchableOpacity, TextInput, NativeModules, Linking } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import PWASettings from './SettingsTabComponents/PWASettings'
import HomeSettings from './SettingsTabComponents/HomeSettings'
import Advanced from './SettingsTabComponents/Advanced'

const SettingsTabStack = createNativeStackNavigator()

const Settings = ({navigation}) => {

  const [screenView, setscreenView] = useState("HomeSettings")

  const Screener = ({name, state, component}) => {
    if(name == state){
        return(
            component
        )
    }
    else{
        return null;
    }
  }

  return (
    <View style={styles.mainView}>
      <View style={{backgroundColor: "transparent", width: "100%", height: "100%", flex: 1}}>
        <Text style={{color: "white", fontSize: 15, padding: 10, fontWeight: "bold"}}>Settings</Text>
        <View style={{backgroundColor: "transparent", width: "100%", flex: 1, flexDirection: "row", justifyContent: "center", paddingBottom: 15}}>
            <View style={{backgroundColor: "transparent", width: "35%", borderRightWidth: 1, borderColor: "grey", paddingLeft: 10, paddingBottom: 0}}>
                <ScrollView fadingEdgeLength={50}>
                    <TouchableOpacity onPress={() => { setscreenView("HomeSettings") }} style={{backgroundColor: "transparent", width: "100%", padding: 5, marginBottom: 5}}>
                        <Text style={{fontSize: 12, color: "white"}}>Home Settings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setscreenView("PWASettings") }} style={{backgroundColor: "transparent", width: "100%", padding: 5, marginBottom: 5}}>
                        <Text style={{fontSize: 12, color: "white"}}>PWA Settings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setscreenView("Advanced") }} style={{backgroundColor: "transparent", width: "100%", padding: 5, marginBottom: 5}}>
                        <Text style={{fontSize: 12, color: "white"}}>Advanced</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
            <View style={{backgroundColor: "transparent", width: "65%"}}>
                <ScrollView fadingEdgeLength={50} contentContainerStyle={{flexGrow: 1}}>
                    <Screener name='HomeSettings' state={screenView} component={<HomeSettings />} />
                    <Screener name='PWASettings' state={screenView} component={<PWASettings />} />
                    <Screener name='Advanced' state={screenView} component={<Advanced />} />
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
        opacity: 1
    }
})

export default Settings