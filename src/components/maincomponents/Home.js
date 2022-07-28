import { View, Text, Animated, StyleSheet, ImageBackground, ToastAndroid, Platform, BackHandler, Image, ScrollView, TouchableOpacity, TextInput, NativeModules } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import IonIcon from 'react-native-vector-icons/Ionicons'
import LogoNeon from '../../resources/imgs/NeXeLogo.png';
import NeXeBg from '../../resources/imgs/neonlightsbg2.jpg'
import Desktop from '../tabcomponents/Desktop';
import { openDatabase } from 'react-native-sqlite-storage'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { SET_APPS, SET_APPS_WINDOW, SET_APP_FLOATER, SET_DATE_TIME_DATA, SET_TASKBAR_APPS } from '../../redux/types';
import IntentLauncher, { IntentConstant } from 'react-native-intent-launcher'

const db = openDatabase({
  name: "neonxenonhomedb"
})

const TabStack = createNativeStackNavigator();

const Home = () => {

  //const [menuWindow, setmenuWindow] = useState(false);
  const menuWindow = useSelector(state => state.appswindow);
  const [appslist, setappslist] = useState([]);

  const [currentDate, setcurrentDate] = useState("00 / 00 / 0000");
  const [currentTime, setcurrentTime] = useState("00 : 00 : 00");
  const [dateTimeWindow, setdateTimeWindow] = useState(false);

  //enable scroll when taskbar apps are more than
  const [taskbarscroll, settaskbarscroll] = useState(false);

  //const [appFloaterData, setappFloaterData] = useState({appname: "", appcom: "", appbase: "", appstate: ""});
  const appFloaterData = useSelector(state => state.appfloater);
  const datetimedata = useSelector(state => state.datetimedata);
  const taskbarapps = useSelector(state => state.taskbarapps);

  const dispatch = useDispatch()

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', function() {
      // console.log("hello");
      // navigation.popToTop()
      return true;
    });
  }, [])

  useEffect(() => {
    const appsResult = NativeModules.InstalledApps.getApps;
    const arr = appsResult.replace(/\[, ]/g, "[]").split("[]")
    arr.shift()
    arr.pop()
    arr.sort()

    setappslist(arr);

  },[])

  useEffect(() => {
    dateTimeSetter()
    setInterval(() => {
      dateTimeSetter();
    }, 60000);
  },[])

  const dateTimeSetter = () => {
    const date = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const hours = new Date().getHours();
    const minutes = new Date().getMinutes();
    const seconds = new Date().getSeconds();

    setcurrentDate(`${month} / ${date} / ${year}`);
    setcurrentTime(`${hours} : ${minutes}`);
    //setcurrentTime(`${hours} : ${minutes} : ${seconds}`);
  }

  const [animVal, setanimVal] = useState(new Animated.Value(-400));
  const [animDT, setanimDT] = useState(new Animated.Value(-250));

  const animStyles = StyleSheet.create({
    viewAbsoluteWindow:{
      backgroundColor: "black",
      width: "90%",
      maxWidth: 500,
      height: "80%",
      maxHeight: 400,
      position: "absolute",
      bottom: animVal,
      borderRadius: 5,
      opacity: 0.8,
      borderWidth: 1,
      borderColor: "#292929",
      zIndex: 2
    },
    viewAbsoluteDateTimeWindow:{
      backgroundColor: "black",
      position: "absolute",
      width: "90%",
      height: "90%",
      zIndex: 1,
      maxWidth: 200,
      maxHeight: 100,
      bottom: 60,
      right: animDT,
      borderRadius: 5,
      opacity: 0.8,
      borderWidth: 1,
      borderColor: "#292929",
      justifyContent: "center",
      alignItems: "center"
    }
  })

  useEffect(() => {
    closeWindowApps()
    closeDateTime()
  },[])

  const windowHideOpen = () => {
    //setmenuWindow(!menuWindow)
    if(menuWindow){
      closeWindowApps()
      //setmenuWindow(false);
      dispatch({type: SET_APPS_WINDOW, appswindow: false})
    }
    else{
      openWindowApps()
      //setmenuWindow(true);
      dispatch({type: SET_APPS_WINDOW, appswindow: true})
    }
  }

  const dateTimeHideOpen = () => {
    if(dateTimeWindow){
      closeDateTime()
      setdateTimeWindow(false)
    }
    else{
      dateTimeDataSetter();
      openDateTime()
      setdateTimeWindow(true)
    }
  }

  const openDateTime = () => {
    Animated.timing(
      animDT,
      {
        toValue: 5,
        duration: 1000,
        useNativeDriver: false
      }
    ).start()
  }

  const closeDateTime = () => {
    Animated.timing(
      animDT,
      {
        toValue: -250,
        duration: 1000,
        useNativeDriver: false
      }
    ).start()
  }

  const openWindowApps = () => {
    Animated.timing(
      animVal,
      {
        toValue: 60,
        duration: 1000,
        useNativeDriver: false
      }
    ).start();
  }

  const closeWindowApps = () => {
    Animated.timing(
      animVal,
      {
        toValue: -400,
        duration: 1000,
        useNativeDriver: false
      }
    ).start();
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
    var appName = apps.replace(/\"/g, "").split(",")[0]
    var appCom = apps.replace(/\"/g, "").split(",")[1]
    var appBase = apps.replace(/\"/g, "").split(",")[2]

    //setappFloaterData({appname: appName, appcom: appCom, appbase: appBase, appstate: appstate})
    dispatch({type: SET_APP_FLOATER, appfloater: {appname: appName, appcom: appCom, appbase: appBase, appstate: appstate}})
    // console.log(`${appName}: x: ${evt.nativeEvent.locationX}, y: ${evt.nativeEvent.locationY}`);
  }

  const addApptoHome = (stateprocess) => {
    if(stateprocess == "Adder"){
      db.transaction(txn => {
        txn.executeSql(`SELECT * FROM desktopShortcuts WHERE appName = ? AND appCategory = ?`,
        [appFloaterData.appname, "Home"],
        (sqlTxn, res) => {
          //console.log(res.rowsAffected)
          if(res.rows.length == 0){
            addApptoHomeProceed()
          }
          else{
            if(Platform.OS === 'android'){
              ToastAndroid.show("App already added", ToastAndroid.SHORT)
            }
            else{
                alert("App already added")
            }
          }
        },
        (error) => {
          if(Platform.OS === 'android'){
            ToastAndroid.show("Error scanning Home", ToastAndroid.SHORT)
          }
          else{
              alert("Error scanning Home")
          }
        })
      })
    }
    else{
      if(stateprocess == "HomeTop"){
        removeAppfromHome();
      }
      else{
        addApptoHome("Adder")
      }
    }

    //console.log(appFloaterData.appname)
  }

  const removeAppfromHome = () => {
    db.transaction(txn => {
      txn.executeSql(`DELETE FROM desktopShortcuts WHERE appName = ? AND appCategory = ?`,
      [appFloaterData.appname, "Home"],
      (sqlTxn, res) => {
        //console.log(res)
        if(res.rowsAffected > 0){
          if(Platform.OS === 'android'){
            ToastAndroid.show(`${appFloaterData.appname} removed from Home`, ToastAndroid.SHORT)
          }
          else{
              alert(`${appFloaterData.appname} removed from Home`)
          }
          homeAppsInit();
        }
        else{
          if(Platform.OS === 'android'){
            ToastAndroid.show("Cannot remove from Home", ToastAndroid.SHORT)
          }
          else{
              alert("Cannot remove from Home")
          }
        }
      },
      (error) => {
        if(Platform.OS === 'android'){
          ToastAndroid.show("Cannot add to Home", ToastAndroid.SHORT)
        }
        else{
            alert("Cannot add to Home")
        }
      })
    })
  }

  const addApptoHomeProceed = () => {
    db.transaction(txn => {
      txn.executeSql(`INSERT INTO desktopShortcuts (appName, appCom, appBase, appCategory) VALUES (?,?,?,?)`,
      [appFloaterData.appname, appFloaterData.appcom, appFloaterData.appbase, "Home"],
      (sqlTxn, res) => {
        //console.log(res)
        if(res.rowsAffected > 0){
          if(Platform.OS === 'android'){
            ToastAndroid.show(`${appFloaterData.appname} added to Home`, ToastAndroid.SHORT)
          }
          else{
              alert(`${appFloaterData.appname} added to Home`)
          }
          homeAppsInit();
        }
        else{
          if(Platform.OS === 'android'){
            ToastAndroid.show("Cannot add to Home", ToastAndroid.SHORT)
          }
          else{
              alert("Cannot add to Home")
          }
        }
      },
      (error) => {
        if(Platform.OS === 'android'){
          ToastAndroid.show("Cannot add to Home", ToastAndroid.SHORT)
        }
        else{
            alert("Cannot add to Home")
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
                    // console.log(arr)
                    //setappShortcuts(arr);
                    dispatch({type: SET_APPS, apps: arr});
                }
            }
            if(res.rows.length == 0){
              dispatch({type: SET_APPS, apps: arr});
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

  const dateTimeDataSetter = () => {
    var today = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthName = monthNames[today.getMonth()]
    const date = today.getDate()
    const year = today.getFullYear()
    const dayName = days[today.getDay()]

    dispatch({type: SET_DATE_TIME_DATA, datetimedata: { day: date, dayname: dayName, monthname: monthName, year: year }})
    //console.log(`${monthName} : ${date} : ${year}`)
  }

  const openAppInfo = () => {
    IntentLauncher.startActivity({
      action: 'android.settings.APPLICATION_DETAILS_SETTINGS',
      data: `package:${appFloaterData.appcom}`
    })
  }

  const addApptoTaskbar = (stateprocess) => {
    if(stateprocess == "Adder"){
      db.transaction(txn => {
        txn.executeSql(`SELECT * FROM desktopShortcuts WHERE appName = ? AND appCategory = ?`,
        [appFloaterData.appname, "Taskbar"],
        (sqlTxn, res) => {
          //console.log(res.rowsAffected)
          if(res.rows.length == 0){
            //addApptoHomeProceed()
            //console.log("No App")
            addApptoTaskbarProceed()
          }
          else{
            if(Platform.OS === 'android'){
              ToastAndroid.show("App already Pinned", ToastAndroid.SHORT)
            }
            else{
                alert("App already Pinned")
            }
          }
        },
        (error) => {
          if(Platform.OS === 'android'){
            ToastAndroid.show("Error scanning Taskbar", ToastAndroid.SHORT)
          }
          else{
              alert("Error scanning Taskbar")
          }
        })
      })
    }
    else{
      //removeAppfromHome();
      if(stateprocess == "Taskbar"){
        //removeAppfromHome();
        removeAppfromTaskbar()
      }
      else{
        addApptoTaskbar("Adder")
      }
    }

    //console.log(appFloaterData.appname)
  }

  const removeAppfromTaskbar = () => {
    db.transaction(txn => {
      txn.executeSql(`DELETE FROM desktopShortcuts WHERE appName = ? AND appCategory = ?`,
      [appFloaterData.appname, "Taskbar"],
      (sqlTxn, res) => {
        //console.log(res)
        if(res.rowsAffected > 0){
          if(Platform.OS === 'android'){
            ToastAndroid.show(`${appFloaterData.appname} was unpinned`, ToastAndroid.SHORT)
          }
          else{
              alert(`${appFloaterData.appname} was unpinned`)
          }
          taskbarAppsInit();
        }
        else{
          if(Platform.OS === 'android'){
            ToastAndroid.show("Cannot unpin from Taskbar", ToastAndroid.SHORT)
          }
          else{
              alert("Cannot unpin from Taskbar")
          }
        }
      },
      (error) => {
        if(Platform.OS === 'android'){
          ToastAndroid.show("Taskbar unpin failed", ToastAndroid.SHORT)
        }
        else{
            alert("Taskbar unpin failed")
        }
      })
    })
  }


  const addApptoTaskbarProceed = () => {
    db.transaction(txn => {
      txn.executeSql(`INSERT INTO desktopShortcuts (appName, appCom, appBase, appCategory) VALUES (?,?,?,?)`,
      [appFloaterData.appname, appFloaterData.appcom, appFloaterData.appbase, "Taskbar"],
      (sqlTxn, res) => {
        //console.log(res)
        if(res.rowsAffected > 0){
          if(Platform.OS === 'android'){
            ToastAndroid.show(`${appFloaterData.appname} pinned to Taskbar`, ToastAndroid.SHORT)
          }
          else{
              alert(`${appFloaterData.appname} pinned to Taskbar`)
          }
          //homeAppsInit();
          taskbarAppsInit()
        }
        else{
          if(Platform.OS === 'android'){
            ToastAndroid.show("Cannot be pinned to Taskbar", ToastAndroid.SHORT)
          }
          else{
              alert("Cannot be pinned to Taskbar")
          }
        }
      },
      (error) => {
        if(Platform.OS === 'android'){
          ToastAndroid.show("Cannot add to Home", ToastAndroid.SHORT)
        }
        else{
            alert("Cannot add to Home")
        }
      })
    })
  }

  useEffect(() => {
    taskbarAppsInit()
  },[])

  const taskbarAppsInit = () => {
    db.transaction(txn => {
        txn.executeSql(`SELECT * FROM desktopShortcuts WHERE appCategory = ?`,
        ["Taskbar"],
        (sqlTxn, res) => {
            var arr = []
            for(var i = 0; i < res.rows.length; i++){
                // console.log(res.rows.length)
                arr.push(res.rows.item(i))
                if(i+1 == res.rows.length){
                    // console.log(res.rows.item(i).bookName)
                    //console.log(arr)
                    //setappShortcuts(arr);
                    dispatch({type: SET_TASKBAR_APPS, taskbarapps: arr});
                }
            }
            if(res.rows.length == 0){
              dispatch({type: SET_TASKBAR_APPS, taskbarapps: arr});
            }
        },
        (error) => {
            if(Platform.OS === 'android'){
                ToastAndroid.show("Taskbar failed to Initalize", ToastAndroid.SHORT)
            }
            else{
                  alert("Taskbar failed to Initalize")
            }
        })
    })
  }

  const holdTaskAppsOption = (apps, evt, appstate) => {
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
        <Animated.View style={animStyles.viewAbsoluteDateTimeWindow}>
          <View style={{backgroundColor: "transparent", flex: 1, height: "100%", width: "100%", flexDirection: "row", padding: 10}}>
            <View style={{backgroundColor: "transparent", width: "30%", alignItems: "center", justifyContent: "center", borderRightWidth: 1, borderColor: "#383838"}}>
              <Text style={{color: "white", fontSize: 30}}>{datetimedata.day}</Text>
              <Text style={{color: "white", fontSize: 12}}>{datetimedata.dayname}</Text>
            </View>
            <View style={{backgroundColor: "transparent", width: "70%", justifyContent: "center", alignItems: "center"}}>
              <Text style={{color: "white", fontSize: 20}}>{datetimedata.monthname} {datetimedata.year}</Text>
              <Text style={{color: "white", fontSize: 10}}>{currentDate}</Text>
              <Text style={{color: "white", fontSize: 10}}>{currentTime}</Text>
            </View>
          </View>
        </Animated.View>
        {appFloaterData.appname != ""? (
          <View style={styles.viewFloater}>
            <View style={styles.viewFloaterTitle}>
              <Image source={{uri: "data:image/png;base64," + appFloaterData.appbase}} style={styles.iconAppFloat} />
              <Text style={styles.appFloaterLabelStyle} numberOfLines={2}>{appFloaterData.appname}</Text>
            </View>
            <View style={styles.appfloaterMenuMiddle}>
              <TouchableOpacity onPress={() => { openAppInfo() }} style={{backgroundColor: "transparent", paddingLeft: 0,height: 20, justifyContent: "center", alignItems: "center", marginTop: 5}}>
                <Text style={styles.appfloaterMenu}>App Info</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { addApptoHome(appFloaterData.appstate) }} style={{backgroundColor: "transparent", paddingLeft: 0,height: 20, justifyContent: "center", alignItems: "center"}}>
                <Text style={styles.appfloaterMenu}>{appFloaterData.appstate == "Adder"? "Add to Home" : appFloaterData.appstate == "HomeTop"? "Remove from Home" : "Add to Home"}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { addApptoTaskbar(appFloaterData.appstate) }} style={{backgroundColor: "transparent", paddingLeft: 0,height: 20, justifyContent: "center", alignItems: "center"}}>
                <Text style={styles.appfloaterMenu}>{appFloaterData.appstate == "Adder"? "Pin to Taskbar" : appFloaterData.appstate == "Taskbar"? "Remove from Taskbar" : "Pin to Taskbar"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{backgroundColor: "transparent", paddingLeft: 0,height: 20, justifyContent: "center", alignItems: "center"}}>
                <Text style={styles.appfloaterMenuUninstall}>Uninstall App</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.viewCloseFloater}>
              <TouchableOpacity onPress={() => { dispatch({type: SET_APP_FLOATER, appfloater: {appname: "", appcom: "", appbase: "", appstate: ""}}) }} style={{display: "flex", width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
                <Text style={styles.appfloaterMenu}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={{position: "absolute", top: 15, right: 5}}></View>
        )}
        <Animated.View style={animStyles.viewAbsoluteWindow}>
          <View style={styles.flexedAbsoluteWindow}>
            <View style={styles.viewSearchBar}>
              <TextInput placeholder='Search an app' style={styles.searchInput} placeholderTextColor="grey" />
            </View>
            <View style={styles.viewAppsList}>
              <Text style={{color: "white", marginLeft: "5%", marginTop: 5, marginBottom: 5}}>Apps</Text>
              <ScrollView style={styles.scrollApps} contentContainerStyle={styles.contentscrollApps} fadingEdgeLength={50}>
                {appslist.map((apps, i) => {
                  return(
                    <TouchableOpacity key={i} onPress={() => { openApp(apps.replace(/\"/g, "").split(",")[1]) }} delayLongPress={500} onLongPress={(evt) => { holdAppsOption(apps, evt, "Adder") }}>
                      <View style={styles.viewAppsIndv}>
                        <Image source={{uri: "data:image/png;base64," + apps.replace(/\"/g, "").split(",")[2]}} style={styles.logoMenuStyle} />
                        <Text style={styles.AppIndvLabel} numberOfLines={2}>{apps.replace(/\"/g, "").split(",")[0]}</Text>
                      </View>
                    </TouchableOpacity>
                  )
                })}
              </ScrollView>
            </View>
            <View style={styles.viewBottomAbsoluteWindow}>
              <Text>...</Text>
            </View>
          </View>
        </Animated.View>
        <View style={styles.viewDesktop}>
          <TabStack.Navigator screenOptions={{headerShown: false}}>
            <TabStack.Screen name='Desktop' component={Desktop} />
          </TabStack.Navigator>
        </View>
        <View style={styles.viewTaskBar}>
          <View style={styles.flexedTaskBar}>
            <View style={styles.viewCornerTabs}>
              <Text style={{color: "white", fontSize: 10}}>Weather</Text>
            </View>
            <View style={styles.viewCenterTab}>
              <ScrollView style={{backgroundColor: "transparent", width: "100%", paddingTop: 0}} contentContainerStyle={{flexGrow: 1, flexDirection: "row", flexWrap: "wrap", justifyContent: "center"}} >
                <TouchableOpacity style={{margin: 5}} onPress={() => { windowHideOpen() }}>
                  <Image source={LogoNeon} style={styles.logoMenuStyle} />
                </TouchableOpacity>
                {taskbarapps.map((taskapps, i) => {
                  return(
                    <TouchableOpacity key={i} style={{margin: 5, width: 40, height: 40, justifyContent: "center", alignItems: "center"}} onPress={() => { openApp(taskapps.appCom) }} delayLongPress={500} onLongPress={(evt) => { holdTaskAppsOption(taskapps, evt, "Taskbar") }}>
                      <Image source={{uri: "data:image/png;base64," + taskapps.appBase}} style={styles.logoTaskbarStyle} />
                    </TouchableOpacity>
                  )
                })}
              </ScrollView>
            </View>
            <View style={styles.viewCornerRightTabs}>
              <TouchableOpacity onPress={() => { dateTimeHideOpen(); }} style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "transparent", width: "100%", height: "100%"}}>
                <Text style={{color: "white", fontSize: 10}}>{currentDate}</Text>
                <Text style={{color: "white", fontSize: 10}}>{currentTime}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  mainView:{
    backgroundColor: "black",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%"
  },
  mainLabel:{
    color: "white"
  },
  imagebackgroundstyle:{
    width: "100%",
    height: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  viewDesktop:{
    backgroundColor: "transparent",
    flex: 1,
    height: "100%",
    width: "100%",
    opacity: 1
  },
  viewTaskBar:{
    height: 50,
    width: "100%",
    backgroundColor: "black",
    opacity: 0.8,
    borderTopWidth: 1,
    borderColor: "#292929",
    zIndex: 3
  },
  flexedTaskBar:{
    backgroundColor: "#0f0f0f",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center"
  },
  viewCornerTabs:{
    backgroundColor: "transparent",
    width: 70,
    borderRightWidth: 1,
    borderColor: "#292929",
    justifyContent: "center",
    alignItems: "center"
  },
  viewCornerRightTabs:{
    backgroundColor: "transparent",
    width: 70,
    borderLeftWidth: 1,
    borderColor: "#292929",
    justifyContent: "center",
    alignItems: "center"
  },
  viewCenterTab:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  scrollCenterTab:{
    justifyContent: "center",
    alignItems: "center"
  },
  logoMenuStyle:{
    width: 40,
    height: 40
  },
  logoTaskbarStyle:{
    width: 35,
    height: 35
  },
  flexedAbsoluteWindow:{
    backgroundColor: "transparent",
    flex: 1,
    alignItems: "center"
  },
  viewSearchBar:{
    backgroundColor: "transparent",
    width: "100%",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 5
  },
  searchInput:{
    borderWidth: 1,
    height: "90%",
    width: "90%",
    maxWidth: 300,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
    borderColor: "#383838",
    color: "white"
  },
  viewBottomAbsoluteWindow:{
    backgroundColor: "transparent",
    width: "100%",
    height: 50,
    borderTopWidth: 1,
    borderColor: "#292929"
  },
  viewAppsList:{
    flex: 1,
    backgroundColor: "transparent",
    width: "100%",
    paddingLeft: "5%",
    paddingRight: "5%"
  },
  scrollApps:{
    backgroundColor: "transparent", 
    paddingTop: 5
  },
  contentscrollApps:{
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    paddingBottom: 30
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
  viewFloater:{
    backgroundColor: "black",
    width: "90%",
    maxWidth: 150,
    height: "70%",
    maxHeight: 200,
    position: "absolute",
    top: 15,
    right: 5,
    borderRadius: 5,
    opacity: 0.8,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 10,
    zIndex: 3
  },
  viewFloaterTitle:{
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: "#383838"
  },
  appFloaterLabelStyle:{
    color: "white", 
    backgroundColor: "transparent", 
    width: 80, 
    marginLeft: 5, 
    height: 50,
    textAlignVertical: "center",
    fontSize: 13,
    textAlign: "center"
  },
  iconAppFloat:{
    width: 30,
    height: 30
  },
  appfloaterMenu:{
    color: "white",
    fontSize: 13
  },
  appfloaterMenuUninstall:{
    color: "red",
    fontSize: 13
  }, 
  viewCloseFloater:{
    backgroundColor: "#292929",
    justifyContent: "center",
    height: 30,
    alignItems: "center",
    borderRadius: 5,
    opacity: 0.9
  },
  appfloaterMenuMiddle:{
    flex: 1,
    width: "100%"
  }
})

export default Home