import { View, Text, StyleSheet, ImageBackground, ToastAndroid, Platform, BackHandler, Image, ScrollView, TouchableOpacity, TextInput, NativeModules } from 'react-native'
import React, { useState, useEffect } from 'react'
import { openDatabase } from 'react-native-sqlite-storage'
import NeXeBg from '../../resources/imgs/neonlightsbg2.jpg'
import { useDispatch, useSelector } from 'react-redux'
import { SET_APPS, SET_APP_FLOATER } from '../../redux/types'

const db = openDatabase({
    name: "neonxenonhomedb"
})

const Desktop = () => {

  //const [appShortcuts, setappShortcuts] = useState([]);

  const appShortcuts = useSelector(state => state.apps);
  const dispatch = useDispatch();

  useEffect(() => {
    homeAppsInit()
  },[])

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

  return (
    <View style={styles.mainView}>
        <ImageBackground blurRadius={0} source={NeXeBg} style={styles.imagebackgroundstyle}>
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
        flex: 1
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