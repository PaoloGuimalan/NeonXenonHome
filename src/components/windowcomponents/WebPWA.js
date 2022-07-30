import { View, Text, Animated, StyleSheet, ImageBackground, ToastAndroid, Platform, BackHandler, Image, ScrollView, TouchableOpacity, TextInput, NativeModules, Linking } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { WebView } from 'react-native-webview'
import IonIcon from 'react-native-vector-icons/Ionicons'

const WebPWA = ({label, urlPWA}) => {

  const [errorStatus, seterrorStatus] = useState(false);

  return (
    <View style={styles.mainView}>
      {errorStatus? (
        <View style={{width: "100%", height: "100%", flex: 1, justifyContent: "center", alignItems: "center"}}>
            <ScrollView style={{width: "100%", height: "100%"}} contentContainerStyle={{flexGrow: 1, justifyContent: "center", alignItems: "center"}}>
                <IonIcon name='warning' size={100} color="white" />
                <Text style={{color: "white", fontSize: 12, fontWeight: "bold", marginBottom: 15}}>Unable to Open {label}</Text>
                <Text style={{color: "white", fontSize: 10, width: "90%", maxWidth: 300, textAlign: "justify"}}>Please note that Progressive Web Apps need an Internet Connection to access. Once Connection is stablished in your end, close and restart the PWA.</Text>
            </ScrollView>
        </View>
      ) : (
        <WebView 
            nestedScrollEnabled={true} 
            source={{uri: urlPWA}} 
            userAgent="Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3714.0 Mobile Safari/537.36" 
            onError={(e) => {
                // console.log(true);
                seterrorStatus(true);
            }}
        />
      )}
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

export default WebPWA