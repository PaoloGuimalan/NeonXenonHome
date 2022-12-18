import { View, Text, Animated, StyleSheet, ImageBackground, ToastAndroid, Platform, BackHandler, Image, ScrollView, TouchableOpacity, TextInput, NativeModules, Linking } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { WebView } from 'react-native-webview'
import IonIcon from 'react-native-vector-icons/Ionicons'
import MatIcon from 'react-native-vector-icons/MaterialIcons'
import AntIcon from 'react-native-vector-icons/AntDesign'
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'

const WebPWA = ({label, urlPWA}) => {

  const [errorStatus, seterrorStatus] = useState(false);
  const [desktopMode, setdesktopMode] = useState(false);
  const [redirectStatus, setredirectStatus] = useState(false);

  const [menuToggle, setmenuToggle] = useState(false);

  let webRef;

  const switchMode = (modebool) => {
    setdesktopMode(!modebool);
  }

  return (
    <View style={styles.mainView}>
      <View style={{backgroundColor: "transparent", width: "auto", position: "absolute", zIndex: 1, top: 2, left: 2, opacity: 1, flex: 1, flexDirection: "row", flexWrap: "wrap"}}>
        <TouchableOpacity onPress={() => { setmenuToggle(!menuToggle) }} style={{backgroundColor: "black", width: 35, height: 30, justifyContent: "center", alignItems: "center", borderRadius: 5, opacity: 1, marginRight: 5, marginBottom: 5}}>
          <MatIcon name='menu' style={{color: "white", fontSize: 20}} />
        </TouchableOpacity>
        {menuToggle? (
          <View style={{backgroundColor: "black", width: "95%", maxWidth: 250, opacity: 1, borderRadius: 5, height: "auto", padding: 5, paddingBottom: 10}}>
            <View style={{width: "100%", flex: 1, flexDirection: "row", alignItems: "center", marginBottom: 10}}>
              <IonIcon name='md-settings-outline' style={{color: "white", marginRight: 5, fontSize: 15}} />
              <Text style={{color: "white", fontSize: 13, fontWeight: "bold"}}>Settings</Text>
            </View>
            <TouchableOpacity onPress={() => { webRef && webRef.reload() }} style={{flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "transparent", height: 20, marginBottom: 0, marginLeft: 5}}>
              <IonIcon name='reload' style={{color: "white", marginRight: 5, fontSize: 15}} />
              <Text style={{color: "white", fontSize: 12}}>Reload</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { webRef && webRef.goBack() }} style={{flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "transparent", height: 20, marginBottom: 0, marginLeft: 5}}>
              <AntIcon name='back' style={{color: "white", marginRight: 5, fontSize: 15}} />
              <Text style={{color: "white", fontSize: 12}}>Go Back</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { switchMode(desktopMode) }} style={{flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "transparent", height: 20, marginBottom: 0, marginLeft: 5}}>
              {desktopMode? (
                <AntIcon name='mobile1' style={{color: "white", marginRight: 5, fontSize: 15}} />
              ) : (
                <AntIcon name='iconfontdesktop' style={{color: "white", marginRight: 5, fontSize: 15}} />
              )}
              <Text style={{color: "white", fontSize: 12}}>{desktopMode? "Switch to Mobile Mode" : "Switch to Desktop Mode"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setredirectStatus(!redirectStatus) }} style={{flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "transparent", height: 20, marginBottom: 0, marginLeft: 5}}>
              {redirectStatus? (
                <MCIcon name='alert-octagon-outline' style={{color: "white", marginRight: 3, fontSize: 17}} />
              ) : (
                <MCIcon name='arrow-right-bold-hexagon-outline' style={{color: "white", marginRight: 3, fontSize: 17}} />
              )}
              <Text style={{color: "white", fontSize: 12}}>{redirectStatus? "Disable Redirects": "Enable Redirects"}</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
      {/* <TouchableOpacity onPress={() => { switchMode(desktopMode) }} style={{backgroundColor: "black", width: "50%", justifyContent: "center", alignItems: 'center', height: 30, position: "absolute", zIndex: 1, alignSelf: "center", borderRadius: 5, borderWidth: 1, borderColor: "grey"}}>
        <Text style={{color: "white"}}>{desktopMode? "Desktop" : "Mobile"}</Text>
      </TouchableOpacity> */}
      {errorStatus? (
        <View style={{width: "100%", height: "100%", flex: 1, justifyContent: "center", alignItems: "center"}}>
            <ScrollView style={{width: "100%", height: "100%", flexGrow: 1}} contentContainerStyle={{flexGrow: 1, justifyContent: "center", alignItems: "center"}}>
                <IonIcon name='warning' size={100} color="white" />
                <Text style={{color: "white", fontSize: 12, fontWeight: "bold", marginBottom: 15}}>Unable to Open {label}</Text>
                <Text style={{color: "white", fontSize: 10, width: "90%", maxWidth: 300, textAlign: "justify"}}>Please note that Progressive Web Apps need an Internet Connection to access. Once Connection is stablished in your end, close and restart the PWA.</Text>
            </ScrollView>
        </View>
      ) : (
        <WebView
            ref={(ref) => { webRef = ref }} 
            key={desktopMode}
            nestedScrollEnabled={true}
            allowsFullscreenVideo={true}
            allowsInlineMediaPlayback={true}
            originWhitelist={['intent://', 'https://', 'http://']}
            javaScriptCanOpenWindowsAutomatically={false} 
            onShouldStartLoadWithRequest={request => {
              // console.log(request)
                if(redirectStatus){
                  return true;
                }
                else{
                    if (request.url.split('/')[2].includes(urlPWA.split('/')[0]) || request.url.split('/')[2].includes(urlPWA.split('.')[1])) {
                    // console.log(request.url.split('/')[2])
                        return true;
                    } else {
                        // console.log(request.url.split('/')[2])
                        if(Platform.OS === 'android'){
                          ToastAndroid.show(`Redirect Haulted`, ToastAndroid.SHORT)
                          // console.log(result)
                        }
                        else{
                              alert(`Redirect Haulted`)
                        }
                        return false;
                    }
                }
             }}
            setSupportMultipleWindows={false}
            source={{uri: urlPWA}} 
            // userAgent="Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:76.0) Gecko/20100101 Firefox/76.0"
            userAgent={desktopMode? "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:76.0) Gecko/20100101 Firefox/76.0" : "Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3714.0 Mobile Safari/537.36"} 
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
        opacity: 1
    }
})

export default WebPWA