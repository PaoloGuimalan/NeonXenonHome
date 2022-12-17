import { View, Text, StyleSheet, ImageBackground, ToastAndroid, Platform, BackHandler, Image, ScrollView, TouchableOpacity, TextInput, NativeModules } from 'react-native'
import React, { useState, useEffect } from 'react'
import { openDatabase } from 'react-native-sqlite-storage'
import NeXeBg from '../../resources/imgs/neonlightsbg2.jpg'
import NeonBgV2Landscape from '../../resources/imgs/DefaultBgV2Landscape.jpg'
import NeonBgV2Portrait from '../../resources/imgs/DefaultBgV2Portrait.jpg'
import PWAIcon from '../../resources/imgs/pwaIcon.png'
import { useDispatch, useSelector } from 'react-redux'
import { SET_APPS, SET_APP_FLOATER, SET_DRAGGABLE_WINDOW, SET_PWA_LIST } from '../../redux/types'
import WebPWA from '../windowcomponents/WebPWA'
import DraggableIndex from '../draggablecomponents/DraggableIndex'
import PWAInfo from '../windowcomponents/PWAInfo'

const db = openDatabase({
    name: "neonxenonhomedb"
})

const Desktop = () => {

  //const [appShortcuts, setappShortcuts] = useState([]);

  const appShortcuts = useSelector(state => state.apps);
  const pwalist = useSelector(state => state.pwalist);
  const arrComponents = useSelector(state => state.draggablewindow);
  const orientationstatus = useSelector(state => state.orientationstatus)
  const dispatch = useDispatch();

  useEffect(() => {
    homeAppsInit()
    PWAInit();
  },[])

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

  const homeAppsInit = () => {
    db.transaction(txn => {
        txn.executeSql(`SELECT * FROM desktopShortcuts WHERE appCategory = ?`,
        ["Home"],
        (sqlTxn, res) => {
            var arr = []
            for(var i = 0; i < res.rows.length; i++){
                // console.log(res.rows.length)
                arr.push(res.rows.item(i))
                if(i+1 == res.rows.length){
                    // console.log(res.rows.item(i).bookName)
                    //console.log(arr)
                    //setappShortcuts(arr);
                    dispatch({type: SET_APPS, apps: arr});
                }
            }
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

  const openApp = (appdir) => {
    try{
      NativeModules.InstalledApps.launchApplication(appdir);
    }
    catch(err){
      alert(err.message);
    }
  }

  const holdAppsOption = (apps, evt, appstate) => {
    var appName = apps.appName;
    var appCom = apps.appCom
    var appBase = apps.appBase

    //setappFloaterData({appname: appName, appcom: appCom, appbase: appBase, appstate: appstate})
    dispatch({type: SET_APP_FLOATER, appfloater: {appname: appName, appcom: appCom, appbase: appBase, appstate: appstate}})
    // console.log(`${appName}: x: ${evt.nativeEvent.locationX}, y: ${evt.nativeEvent.locationY}`);
  }

  const openPWA = (label, Component) => {
    dispatch({type: SET_DRAGGABLE_WINDOW, draggablewindow: [
        ...arrComponents,
        {
        instance: arrComponents.length + 1,
        maximized: false,
        component: <DraggableIndex instance={arrComponents.length + 1} label={label} Component={Component} />
      }]
    })
  }

  const holdPWAOption = (id, name, Component) => {
    dispatch({type: SET_DRAGGABLE_WINDOW, draggablewindow: [
        ...arrComponents,
        {
        instance: arrComponents.length + 1,
        maximized: false,
        component: <DraggableIndex instance={arrComponents.length + 1} label={`${name} Info`} Component={Component} />
      }]
    })
  }

  return (
    <View style={styles.mainView}>
        <ImageBackground blurRadius={0} source={orientationstatus? NeonBgV2Landscape : NeonBgV2Portrait} style={styles.imagebackgroundstyle}>
            <View style={styles.viewShortcuts}>
                {appShortcuts.map((apps, i) => {
                    return(
                        <TouchableOpacity key={i} onPress={() => { openApp(apps.appCom) }} delayLongPress={500} onLongPress={(evt) => { holdAppsOption(apps, evt, "HomeTop") }}>
                            <View style={styles.viewAppsIndv}>
                                <Image source={{uri: "data:image/png;base64," + apps.appBase}} style={styles.logoMenuStyle} />
                                <Text style={styles.AppIndvLabel} numberOfLines={2}>{apps.appName}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                })}
                {/* {pwalist.map((apps, i) => {
                    return(
                        <TouchableOpacity key={i} onPress={() => { openPWA(apps.pwaName, <WebPWA label={apps.pwaName} urlPWA={apps.pwaUrl} />) }} delayLongPress={500} onLongPress={(evt) => { holdPWAOption(apps.id, apps.pwaName, <PWAInfo id={apps.id} name={apps.pwaName} icon={PWAIcon} />) }}>
                            <View style={styles.viewAppsIndv}>
                                <Image source={PWAIcon} style={styles.logoMenuStyle} />
                                <Text style={styles.AppIndvLabel} numberOfLines={2}>{apps.pwaName}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                })} */}
            </View>
        </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
    mainView:{
        flex: 1,
        backgroundColor: "transparent"
    },
    viewShortcuts:{
        flex: 1,
        flexDirection: "column",
        flexWrap: "wrap",
        paddingTop: 20
    },
    imagebackgroundstyle:{
        width: "100%",
        height: "100%",
        flex: 1,
        resizeMode: "contain"
    },
    viewAppsIndv:{
        backgroundColor: "transparent",
        width: 60,
        justifyContent: "center",
        alignItems: "center",
        margin: 5,
        height: 75
      },
      AppIndvLabel:{
        fontSize: 12,
        marginTop: 5,
        textAlign: "center",
        color: "white",
        height: 25
      },
      logoMenuStyle:{
        width: 40,
        height: 40
      }
})

export default Desktop