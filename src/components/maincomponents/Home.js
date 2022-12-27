import { AppRegistry, View, Text, Animated, StyleSheet, ImageBackground, ToastAndroid, Platform, BackHandler, Image, ScrollView, TouchableOpacity, TextInput, NativeModules, Linking, FlatList, PermissionsAndroid, Dimensions } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import IonIcon from 'react-native-vector-icons/Ionicons'
import AntIcon from 'react-native-vector-icons/AntDesign'
import MatIcon from 'react-native-vector-icons/MaterialIcons'
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import EntIcon from 'react-native-vector-icons/Entypo'
import LogoNeon from '../../resources/imgs/NeXeLogo.png';
import LogoNeonV2 from '../../resources/imgs/NeonLogo_V2.png'
import NeXeBg from '../../resources/imgs/neonlightsbg2.jpg'
import NeonBgV2Landscape from '../../resources/imgs/DefaultBgV2Landscape.jpg'
import NeonBgV2Portrait from '../../resources/imgs/DefaultBgV2Portrait.jpg'
import Desktop from '../tabcomponents/Desktop';
import { openDatabase } from 'react-native-sqlite-storage'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { SET_APPS, SET_APPS_WINDOW, SET_APP_FLOATER, SET_DATE_TIME_DATA, SET_DRAGGABLE_WINDOW, SET_NEWS_DATA, SET_NOTIFICATIONS_LIST, SET_ORIENTATION_STATUS, SET_PWA_LIST, SET_TASKBAR_APPS, SET_WEATHER } from '../../redux/types';
import IntentLauncher, { IntentConstant } from 'react-native-intent-launcher'
import Axios from 'axios'
import { newsDataState, weatherDataState } from '../../redux/actions';
import { DragResizeBlock } from '../../libraries/drag-resize/index';
import { WebView } from 'react-native-webview'
import DraggableIndex from '../draggablecomponents/DraggableIndex';
import Settings from '../windowcomponents/Settings';
import WebPWA from '../windowcomponents/WebPWA';
import PWAIcon from '../../resources/imgs/pwaIcon.png'
import PWAInfo from '../windowcomponents/PWAInfo'
import RNAndroidNotificationListener, { RNAndroidNotificationListenerHeadlessJsName }  from 'react-native-android-notification-listener'

let headlessNotificationListener;

/**
* AppRegistry should be required early in the require sequence
* to make sure the JS execution environment is setup before other
* modules are required.
*/
AppRegistry.registerHeadlessTask(
  RNAndroidNotificationListenerHeadlessJsName,
  () => headlessNotificationListener
)

const db = openDatabase({
  name: "neonxenonhomedb"
})

const TabStack = createNativeStackNavigator();

const Home = ({navigation}) => {

  const makeid = (length) => {
      var result           = '';
      var characters       = '0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * 
  charactersLength));
    }
    return result;
  }

  headlessNotificationListener = async ({ notification }) => {
    /**
     * This notification is a JSON string in the follow format:
     *  {
     *      "app": string,
     *      "title": string,
     *      "titleBig": string,
     *      "text": string,
     *      "subText": string,
     *      "summaryText": string,
     *      "bigText": string,
     *      "audioContentsURI": string,
     *      "imageBackgroundURI": string,
     *      "extraInfoText": string,
     *      "groupedMessages": Array<Object> [
     *          {
     *              "title": string,
     *              "text": string
     *          }
     *      ]
     *  }
     */
  
    if (notification) {
        /**
         * Here you could store the notifications in a external API.
         * I'm using AsyncStorage here as an example.
         */
        // console.log(await JSON.parse(notification))
        saveNotif(await JSON.parse(notification))
    }
    // console.log(notification)
  }

  const clearNotifs = () => {
    db.transaction(txn => {
      txn.executeSql(`DELETE FROM notifStorage`,
      [],
      (sqlTxn, res) => {
        //console.log(res)
        if(res.rowsAffected > 0){
          initNotifications()
          if(Platform.OS === 'android'){
            ToastAndroid.show("Notifications cleared", ToastAndroid.SHORT)
          }
          else{
              alert("Notifications cleared")
          }
        }
        else{
          if(Platform.OS === 'android'){
            ToastAndroid.show("Notifications already empty", ToastAndroid.SHORT)
          }
          else{
              alert("Notifications already empty")
          }
        }
      },
      (error) => {
        if(Platform.OS === 'android'){
          ToastAndroid.show(`Error Clearing Notifications`, ToastAndroid.SHORT)
        }
        else{
            alert(`Error Clearing Notifications`)
        }
      })
    })

    // db.transaction(txn => {
    //   txn.executeSql(`SELECT * FROM notifStorage WHERE title = ?`,
    //   ["YouTube"],
    //   (sqlTxn, res) => {
    //     console.log(res.rows.raw())
    //     if(res.rowsAffected > 0){
    //       // clearGroupNotifs()
    //     }
    //     else{
    //       if(Platform.OS === 'android'){
    //         ToastAndroid.show("Notifications already empty", ToastAndroid.SHORT)
    //       }
    //       else{
    //           alert("Notifications already empty")
    //       }
    //     }
    //   },
    //   (error) => {
    //     if(Platform.OS === 'android'){
    //       ToastAndroid.show(`Error Clearing Notifications`, ToastAndroid.SHORT)
    //     }
    //     else{
    //         alert(`Error Clearing Notifications`)
    //     }
    //   })
    // })
  }

  const clearGroupNotifs = () => {
    db.transaction(txn => {
      txn.executeSql(`DELETE FROM notifGroupStorage`,
      [],
      (sqlTxn, res) => {
        //console.log(res)
        if(res.rowsAffected > 0){
          if(Platform.OS === 'android'){
            ToastAndroid.show("Notifications Cleared", ToastAndroid.SHORT)
            // console.log(notification.groupedMessages.length)
          }
          else{
              alert("Notifications Cleared")
          }
        }
        else{
          if(Platform.OS === 'android'){
            ToastAndroid.show("Unable to Clear Group Notifications", ToastAndroid.SHORT)
          }
          else{
              alert("Unable to Clear Group Notifications")
          }
        }
      },
      (error) => {
        if(Platform.OS === 'android'){
          ToastAndroid.show(`Error Clearing Group Notification`, ToastAndroid.SHORT)
        }
        else{
            alert(`Error Clearing Group Notification`)
        }
      })
    })
  }

  const saveNotif = (notification) => {

    const notifID = makeid(10);

    db.transaction(txn => {
      txn.executeSql(`INSERT INTO notifStorage (
        notifID, 
        app, 
        audioContentsURI, 
        bigText,
        extraInfoText, 
        icon, 
        iconLarge, 
        image, 
        imageBackgroundURI, 
        subText, 
        summaryText, 
        text, 
        time, 
        title, 
        titleBig
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        notifID, 
        notification.app, 
        notification.audioContentsURI, 
        notification.bigText,
        notification.extraInfoText, 
        notification.icon, 
        notification.iconLarge, 
        notification.image, 
        notification.imageBackgroundURI, 
        notification.subText, 
        notification.summaryText, 
        notification.text, 
        notification.time, 
        notification.title, 
        notification.titleBig
      ],
      (sqlTxn, res) => {
        //console.log(res)
        if(res.rowsAffected > 0){
          // if(Platform.OS === 'android'){
          //   ToastAndroid.show("New Notification", ToastAndroid.SHORT)
          //   // console.log(notification.groupedMessages.length)
          // }
          // else{
          //     alert("New Notification")
          // }

          if(notification.groupedMessages.length > 0){
            notification.groupedMessages.map((data, i) => {
              // saveGroupNotif(notifID, data)
            })
          }

          setTimeout(() => {
            initNotifications()
          }, 1000);
        }
        else{
          if(Platform.OS === 'android'){
            ToastAndroid.show("Cannot process Notification", ToastAndroid.SHORT)
          }
          else{
              alert("Cannot process Notification")
          }
        }
      },
      (error) => {
        if(Platform.OS === 'android'){
          ToastAndroid.show(`Error fetching Notification`, ToastAndroid.SHORT)
        }
        else{
            alert(`Error fetching Notification`)
        }
      })
    })
  }

  const saveGroupNotif = (notifID, notification) => {
    db.transaction(txn => {
      txn.executeSql(`INSERT INTO notifGroupStorage (
        notifID, 
        text, 
        title
      ) VALUES (?,?,?)`,
      [
        notifID, 
        notification.text, 
        notification.title
      ],
      (sqlTxn, res) => {
        //console.log(res)
        if(res.rowsAffected > 0){
          if(Platform.OS === 'android'){
            ToastAndroid.show("New Group Notification", ToastAndroid.SHORT)
          }
          else{
              alert("New Group Notification")
          }
        }
        else{
          if(Platform.OS === 'android'){
            ToastAndroid.show("Cannot process Group Notification", ToastAndroid.SHORT)
          }
          else{
              alert("Cannot process Group Notification")
          }
        }
      },
      (error) => {
        if(Platform.OS === 'android'){
          ToastAndroid.show(`Error fetching Group Notification`, ToastAndroid.SHORT)
        }
        else{
            alert(`Error fetching Group Notification`)
        }
      })
    })
  }

  useEffect(() => {
    // handleOnPressPermissionButton()
    checkNotifPermission().catch((err) => {
      console.log(err);
    })

    initNotifications()
  },[])

  const checkNotifPermission = async () => {
    const status = await RNAndroidNotificationListener.getPermissionStatus()
    console.log(status)
    if(status == "denied"){
      handleOnPressPermissionButton()
    }
    else{
      if(Platform.OS === 'android'){
        ToastAndroid.show("Notifications Running!", ToastAndroid.SHORT)
      }
      else{
          alert("Notifications Running!")
      }
    }
  }

  const handleOnPressPermissionButton = async () => {
    /**
     * Open the notification settings so the user
     * so the user can enable it
     */
    RNAndroidNotificationListener.requestPermission()
  }

  const initNotifications = () => {
    db.transaction(txn => {
      txn.executeSql(`SELECT * FROM notifStorage ORDER BY time DESC`,
      [],
      (sqlTxn, res) => {
        // console.log(res.rows.raw())
        dispatch({ type: SET_NOTIFICATIONS_LIST, notificationslist: res.rows.raw() })
      },
      (error) => {
        if(Platform.OS === 'android'){
          ToastAndroid.show(`Error Scanning Notifications`, ToastAndroid.SHORT)
        }
        else{
            alert(`Error Scanning Notifications`)
        }
      })
    })
  }

  //const [menuWindow, setmenuWindow] = useState(false);
  const menuWindow = useSelector(state => state.appswindow);
  const pwalist = useSelector(state => state.pwalist);
  const notificationslist = useSelector(state => state.notificationslist);
  const orientationstatus = useSelector(state => state.orientationstatus)
  const [appslist, setappslist] = useState([]);

  const [currentDate, setcurrentDate] = useState("00 / 00 / 0000");
  const [currentTime, setcurrentTime] = useState("00 : 00 : 00");
  const [dateTimeWindow, setdateTimeWindow] = useState(false);
  const [menuweatherWindow, setmenuweatherWindow] = useState(false);
  const [menuweatherNewsWindowStatus, setmenuweatherNewsWindowStatus] = useState(false);

  //enable scroll when taskbar apps are more than
  const [taskbarscroll, settaskbarscroll] = useState(false);
  const [appdrawer, setappdrawer] = useState("Apps");

  const [reRenderer, setreRenderer] = useState(false);

  const [minimizedList, setminimizedList] = useState(false);

  useEffect(() => {

  }, [reRenderer])

  // let arrComponents = [];
  //const [arrComponents, setarrComponents] = useState([]);
  const arrComponents = useSelector(state => state.draggablewindow);

  //const [appFloaterData, setappFloaterData] = useState({appname: "", appcom: "", appbase: "", appstate: ""});
  const appFloaterData = useSelector(state => state.appfloater);
  const datetimedata = useSelector(state => state.datetimedata);
  const taskbarapps = useSelector(state => state.taskbarapps);
  const weatherdata = useSelector(state => state.weather);
  const newsdata = useSelector(state => state.newsdata);

  const dispatch = useDispatch()

  useEffect(() => {
    Dimensions.addEventListener('change', () => {
      let dim = Dimensions.get('screen');
      if(dim.height > dim.width){
        dispatch({ type: SET_ORIENTATION_STATUS, orientationstatus: false })
      }
      else{
        dispatch({ type: SET_ORIENTATION_STATUS, orientationstatus: true })
      }
    })
  },[]);

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
    intervalMain()
  },[])

  const intervalMain = () => {
    const intervalSetter = setInterval(() => {
      dateTimeSetter();
      clearInterval(intervalSetter);
      intervalMain()
    }, 60000);
  }

  const dateTimeSetter = () => {
    const date = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const hours = new Date().getHours();
    const minutes = new Date().getMinutes();
    const seconds = new Date().getSeconds();

    setcurrentDate(`${month} / ${date} / ${year}`);
    setcurrentTime(`${hours < 10? `0${hours}` : hours} : ${minutes < 10? `0${minutes}` : minutes}`);
    //setcurrentTime(`${hours} : ${minutes} : ${seconds}`);
  }

  const [animVal, setanimVal] = useState(new Animated.Value(-400));
  const [animDT, setanimDT] = useState(new Animated.Value(-280));
  const [animMW, setanimMW] = useState(new Animated.Value(-400));

  const [appMenuMiniDrawer, setappMenuMiniDrawer] = useState(false);

  const animStyles = StyleSheet.create({
    viewAbsoluteWindow:{
      backgroundColor: "black",
      width: "90%",
      maxWidth: 500,
      height: "80%",
      maxHeight: 400,
      position: "absolute",
      bottom: animVal, //animVal or 60
      borderRadius: 5,
      opacity: 0.9,
      borderWidth: 1,
      borderColor: "#292929",
      zIndex: 2,
      paddingTop: 15
    },
    viewAbsoluteDateTimeWindow:{
      backgroundColor: "transparent",
      position: "absolute",
      width: "90%",
      height: "80%",
      zIndex: 1,
      maxWidth: 330,
      maxHeight: 500,
      bottom: 60,
      right: animDT, //animDT || 5
      borderRadius: 5,
      opacity: 0.9,
      borderWidth: 1,
      borderColor: "transparent",
      justifyContent: "center",
      alignItems: "center",
      paddingBottom: 0,
      flex: 1,
      flexDirection: "row"
    },
    viewWindowWeatherNews:{
      backgroundColor: "black", 
      width: "90%",
      maxWidth: 350,
      position: "absolute",
      zIndex: 1,
      height: "80%",
      maxHeight: 500,
      bottom: 60,
      left: animMW, //animMW
      borderRadius: 5,
      opacity: 0.9,
      borderWidth: 1,
      borderColor: "#292929",
      justifyContent: "center",
      alignItems: "center",
      paddingBottom: 10
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

  const menuWeatherHideOpen = () => {
    if(menuweatherWindow){
      setmenuweatherNewsWindowStatus(false);
      setTimeout(() => {
        closeMenuWeather()
        setmenuweatherWindow(false)
      },1000)
      // closeMenuWeather()
      // setmenuweatherWindow(false)
    }
    else{
      weatherCatcher()
      newsDataFetch()
      openMenuWeather()
      setmenuweatherWindow(true)
      setTimeout(() => {
        setmenuweatherNewsWindowStatus(true);
      },1000)
      // setmenuweatherNewsWindowStatus(true);
    }
  }

  const openMenuWeather = () => {
    Animated.timing(
      animMW,
      {
        toValue: 5,
        duration: 1000,
        useNativeDriver: false
      }
    ).start()
  }

  const closeMenuWeather = () => {
    Animated.timing(
      animMW,
      {
        toValue: -400,
        duration: 1000,
        useNativeDriver: false
      }
    ).start()
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
        toValue: -280,
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
                ToastAndroid.show("PWA's failed to Initialize", ToastAndroid.SHORT)
            }
            else{
                  alert("PWA's failed to Initialize")
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

  useEffect(() => {
    weatherCatcher();
    newsDataFetch();
  },[])

  const weatherCatcher = () => {
    Axios.get('http://api.weatherapi.com/v1/current.json?key=494c0f6d4c3f4b4b81b74942211108&q=Philippines&aqi=yes').then((response) => {
      // alert("Hello");
      // console.log(JSON.stringify(response.data, null, 4))
      dispatch({type: SET_WEATHER, weather: {
        icon: `https:${response.data.current.condition.icon}`,
        status: response.data.current.condition.text,
        location: `${response.data.location.name}, ${response.data.location.country}`,
        lastupdated: response.data.current.last_updated,
        temp_c: response.data.current.temp_c,
        temp_f: response.data.current.temp_f
      }})
    }).catch((err) => {
      // dispatch({type: SET_WEATHER, weatherdata: weatherDataState})
    })
  }

  const newsDataFetch = () => {
    Axios.get('https://newsapi.org/v2/top-headlines?country=ph&apiKey=96219def7ceb4da9ac0b1e545caeba1e')
    .then((response) => {
      // console.log(response.data.status)
      if(response.data.status == "ok"){
        // console.log(response.data.totalResults)
        dispatch({type: SET_NEWS_DATA, newsdata: {numbers: response.data.totalResults, articles: response.data.articles}})
      }
      else{
        // console.log("Unable to fetch News")
        dispatch({type: SET_NEWS_DATA, newsdata: newsDataState})
      }
    }).catch((err) => {
      // console.log(err.message);
      dispatch({type: SET_NEWS_DATA, newsdata: newsDataState})
    })
  }

  const openLink = (url) => {
    Linking.openURL(url)
  }

  const openDraggable = (instanceRemark, label, type, Component) => {
    // arrComponents.push({
    //   instance: instanceRemark,
    //   component: <DraggableIndex label={label} component={component} />
    // })
    // setarrComponents([
    //   ...arrComponents,
    //   {
    //   instance: instanceRemark,
    //   component: <DraggableIndex label={label} component={component} />
    // }])
    dispatch({type: SET_DRAGGABLE_WINDOW, draggablewindow: [
        ...arrComponents,
        {
        instance: arrComponents.length + 1,
        maximized: false,
        minimized: false,
        label: label,
        type: type,
        component: <DraggableIndex instance={arrComponents.length + 1} label={label} Component={Component} />
      }]
    })
  }

  const openPWA = (label, type, urlRef, Component) => {
    dispatch({type: SET_DRAGGABLE_WINDOW, draggablewindow: [
        ...arrComponents,
        {
        instance: arrComponents.length + 1,
        maximized: false,
        minimized: false,
        label: label,
        type: type,
        urlRef: urlRef,
        component: <DraggableIndex instance={arrComponents.length + 1} label={label} Component={Component} />
      }]
    })
  }

  const holdPWAOption = (id, name, type, urlRef, Component) => {
    dispatch({type: SET_DRAGGABLE_WINDOW, draggablewindow: [
        ...arrComponents,
        {
        instance: arrComponents.length + 1,
        maximized: false,
        minimized: false,
        label: name,
        type: type,
        urlRef: urlRef,
        component: <DraggableIndex instance={arrComponents.length + 1} label={`${name} Info`} Component={Component} />
      }]
    })
  }

  const openDrawerOptions = () => {
    setappMenuMiniDrawer(!appMenuMiniDrawer);
  }

  useEffect(() => {
    checkPermision();
  },[])

  async function checkPermision(){
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
    ]).then((result) => {
      if(Platform.OS === 'android'){
        ToastAndroid.show(`Welcome, all services are ready!`, ToastAndroid.SHORT)
        // console.log(result)
      }
      else{
            alert(`Welcome, all services are ready!`)
      }
    })
  }
  
  let existingTitle = [];
  
  const deleteSingleNotif = (id) => {
    db.transaction(txn => {
      txn.executeSql(`DELETE FROM notifStorage WHERE id = ?`,
      [id],
      (sqlTxn, res) => {
        //console.log(res)
        if(res.rowsAffected > 0){
          initNotifications()
        }
      },
      (error) => {
        if(Platform.OS === 'android'){
          ToastAndroid.show(`Error Clearing Notifications`, ToastAndroid.SHORT)
        }
        else{
            alert(`Error Clearing Notifications`)
        }
      })
    })
  }

  const unminimizeWindow = (instanceMin, minimizedstat) => {
    if(minimizedstat){
      var arrDeletionModification = []

      for(var i = 0; i < arrComponents.length; i++){
          // console.log(arrComponents[i]);
          if(arrComponents[i].instance != instanceMin){
              arrDeletionModification.push(arrComponents[i])
          }
          else{
            arrDeletionModification.push({...arrComponents[i], minimized: !arrComponents[i].minimized})
          }
      }
      dispatch({type: SET_DRAGGABLE_WINDOW, draggablewindow: arrDeletionModification})
    }
  }

  const NotificationDrawer = ({data}) => {

    const [triggerDelete, settriggerDelete] = useState(false);

    return(
      <TouchableOpacity
      delayLongPress={500}
      onLongPress={() => {
        // triggerDelete = !triggerDelete;
        settriggerDelete(!triggerDelete)
        // console.log(triggerDelete)
      }} style={{width: "100%"}}>
        <View style={{backgroundColor: "#292929", marginBottom: 5, minHeight: 65, flex: 1, flexDirection: "column", paddingLeft: 5, paddingRight: 5, borderRadius: 5, paddingBottom: 10}}>
          <View style={{flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, maxHeight: 20, backgroundColor: "transparent", marginBottom: 5}}>
            {data.icon? (
              <Image source={{uri: data.icon}} style={{width: 15, height: 15}} />
            ) : (
              <Image source={LogoNeonV2} style={{width: 15, height: 15}} />
            )}
            <Text style={{color: "white", marginLeft: 5, fontSize: 12, textAlignVertical: "center"}}>{data.app == "com.android.vending"? "System" : data.title}</Text>
            <View style={{flexGrow: 1, backgroundColor: "transparent", alignItems: "flex-end"}}>
              {data.iconLarge? (
                <Image source={{uri: data.iconLarge}} style={{width: 15, height: 15}} />
              ) : null}
            </View>
          </View>
          <View>
            <Text style={{color: "white", fontSize: 11, paddingLeft: 5, paddingRight: 5}}>{data.app == "com.android.vending"? `${data.subText} ${data.title}` : data.text}</Text>
          </View>
          {triggerDelete? (
            <View style={{backgroundColor: "transparent", marginTop: 10, flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
              <TouchableOpacity onPress={() => { deleteSingleNotif(data.id) }} style={{backgroundColor: "red", width: 30, height: 25, justifyContent: "center", alignItems: "center", borderRadius: 5}}>
                <MCIcon name='delete' style={{fontSize: 20, color: "white"}} />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.mainView}>
      <ImageBackground blurRadius={0} source={NeonBgV2Landscape} style={styles.imagebackgroundstyle}>
        {arrComponents.map((comps, i) => {
          return(
            <DragResizeBlock key={i} minWindow={comps.minimized} maxWindow={comps.maximized}>
              {comps.component}
            </DragResizeBlock>
          )
        })}
        <Animated.View style={animStyles.viewWindowWeatherNews}>
          <View style={{backgroundColor: "transparent", paddingTop: 5, height: 40, borderBottomWidth: 1, borderColor: "#292929", justifyContent: "center", alignItems: "center", width: "100%"}}>
            <Text style={{color: "white"}}>...</Text>
          </View>
          {/* <FlatList
            removeClippedSubviews
            initialNumToRender={5}
            ListHeaderComponent={() => (
              <View style={{backgroundColor: "transparent", width: "100%", padding: 5, paddingTop: 10}}>
                <Text style={{color: "white", fontSize: 15, fontWeight: "bold", marginBottom: 5}}>Weather</Text>
                <View style={{backgroundColor: "transparent", width: "100%", height: 80}}>
                  <View style={{backgroundColor: "transparent", flex: 1, width: "100%", height: "100%", flexDirection: "row", justifyContent: "center"}}>
                    <View style={{backgroundColor: "transparent", width: "40%", height: "100%", justifyContent: "center", alignItems: "center", borderRightWidth: 1, borderColor: "#292929"}}>
                      {weatherdata.icon != ""? (
                        <Image source={{uri: weatherdata.icon}} style={{width: 50, height: 50, marginBottom: -10}} />
                      ) : (
                        <View></View>
                      )}
                      <Text style={{color: "white", fontSize: 10, width: "100%", textAlign: "center", height: 30, textAlignVertical: "center"}} numberOfLines={2}>{weatherdata.status}</Text>
                    </View>
                    <View style={{backgroundColor: "transparent", width: "60%", height: "100%", justifyContent: "center", alignItems: "center"}}>
                      <Text style={{color: "white", fontSize: 12, fontWeight: "bold"}}>{weatherdata.location}</Text>
                      <Text style={{color: "white", fontSize: 10}}>{weatherdata.lastupdated}</Text>
                      <Text style={{color: "white", fontSize: 10}}>{weatherdata.temp_c} &#8451; | {weatherdata.temp_f} &#x2109;</Text>
                    </View>
                  </View>
                </View>
                <Text style={{color: "white", fontSize: 15, fontWeight: "bold", marginBottom: 15}}>News | {newsdata.numbers}</Text>
              </View>
            )}
            style={{backgroundColor: "transparent", flexGrow: 1, width: "100%", height: "100%", padding: 5}}
            data={newsdata.articles}
            keyExtractor={(data) => `${data.title}${data.publishedAt}`}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => { openLink(item.url) }} style={{backgroundColor: "transparent", width: "100%", marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderColor: "#292929"}}>
                <View style={{width: "100%"}}>
                  <Text style={{fontSize: 12, color: "white", fontWeight: "bold", marginBottom: 10}} numberOfLines={1}>{item.title}</Text>
                  <Text style={{fontSize: 11, color: "white", fontWeight: "bold"}} numberOfLines={2}>{item.source.name}</Text>
                  <Text style={{fontSize: 10, color: "white", marginBottom: 5}} numberOfLines={1}>{item.author}</Text>
                  {item.urlToImage? (
                    <Image source={{uri: item.urlToImage}} style={{width: "100%", height: 150}} />
                  ) : (
                    <View></View>
                  )}
                  <Text style={{fontSize: 10, color: "white", marginBottom: 5, textAlign: "justify", marginTop: 5}} numberOfLines={4}>{item.description}</Text>
                  <Text style={{fontSize: 10, color: "white", marginBottom: 5, textAlign: "left"}} numberOfLines={1}>{item.publishedAt}</Text>
                </View>
              </TouchableOpacity>
            )}
          /> */}
          <ScrollView fadingEdgeLength={100} style={{backgroundColor: "transparent", flexGrow: 1, width: "100%", height: "100%", padding: 5}}>
            <View style={{backgroundColor: "transparent", width: "100%", padding: 5, paddingTop: 10}}>
              <Text style={{color: "white", fontSize: 15, fontWeight: "bold", marginBottom: 5}}>Weather</Text>
              <View style={{backgroundColor: "transparent", width: "100%", height: 80}}>
                <View style={{backgroundColor: "transparent", flex: 1, width: "100%", height: "100%", flexDirection: "row", justifyContent: "center"}}>
                  <View style={{backgroundColor: "transparent", width: "40%", height: "100%", justifyContent: "center", alignItems: "center", borderRightWidth: 1, borderColor: "#292929"}}>
                    {weatherdata.icon != ""? (
                      <Image source={{uri: weatherdata.icon}} style={{width: 50, height: 50, marginBottom: -10}} />
                    ) : (
                      <View></View>
                    )}
                    <Text style={{color: "white", fontSize: 10, width: "100%", textAlign: "center", height: 30, textAlignVertical: "center"}} numberOfLines={2}>{weatherdata.status}</Text>
                  </View>
                  <View style={{backgroundColor: "transparent", width: "60%", height: "100%", justifyContent: "center", alignItems: "center"}}>
                    <Text style={{color: "white", fontSize: 12, fontWeight: "bold"}}>{weatherdata.location}</Text>
                    <Text style={{color: "white", fontSize: 10}}>{weatherdata.lastupdated}</Text>
                    <Text style={{color: "white", fontSize: 10}}>{weatherdata.temp_c} &#8451; | {weatherdata.temp_f} &#x2109;</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={{backgroundColor: "transparent", width: "100%", padding: 5, paddingTop: 5}}>
              <Text style={{color: "white", fontSize: 15, fontWeight: "bold", marginBottom: 15}}>News | {newsdata.numbers}</Text>
              {menuweatherNewsWindowStatus? (
                newsdata.articles.map((newslist, i) => {
                  return(
                    <TouchableOpacity onPress={() => { openPWA(`News | ${newslist.title}`, "News", newslist.url, <WebPWA label={`News | ${newslist.title}`} urlPWA={newslist.url} />) }} key={i} style={{backgroundColor: "transparent", width: "100%", marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderColor: "#292929"}}>
                      <View style={{width: "100%"}}>
                        <Text style={{fontSize: 12, color: "white", fontWeight: "bold", marginBottom: 10}} numberOfLines={1}>{newslist.title}</Text>
                        <Text style={{fontSize: 11, color: "white", fontWeight: "bold"}} numberOfLines={2}>{newslist.source.name}</Text>
                        <Text style={{fontSize: 10, color: "white", marginBottom: 5}} numberOfLines={1}>{newslist.author}</Text>
                        {newslist.urlToImage? (
                          <Image source={{uri: newslist.urlToImage}} style={{width: "100%", height: 150}} />
                        ) : (
                          <View></View>
                        )}
                        <Text style={{fontSize: 10, color: "white", marginBottom: 5, textAlign: "justify", marginTop: 5}} numberOfLines={4}>{newslist.description}</Text>
                        <Text style={{fontSize: 10, color: "white", marginBottom: 5, textAlign: "left"}} numberOfLines={1}>{newslist.publishedAt}</Text>
                      </View>
                    </TouchableOpacity>
                  )
                })
              ) : (
                <View></View>
              )}
            </View>
          </ScrollView>
        </Animated.View>
        <Animated.View style={animStyles.viewAbsoluteDateTimeWindow}>
          <View style={{
            backgroundColor: "transparent", 
            width: 50, 
            height: "100%",
            marginRight: 0
          }}>
              <View style={{
                backgroundColor: "transparent",
                flex: 1,
                flexDirection: "column",
                alignItems: "center"
              }}>
                <View style={{
                  backgroundColor: "black",
                  width: "100%",
                  height: 50,
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                  borderTopRightRadius: dateTimeWindow? 5 : 0,
                  borderBottomRightRadius: dateTimeWindow? 5 : 0,
                  borderWidth: 1,
                  borderColor: "#292929",
                  justifyContent: "center",
                  alignItems: "center"
                }}>
                  <EntIcon name='archive' style={{fontSize: 25, color: "white"}} />
                </View>
                <TouchableOpacity style={{
                  backgroundColor: "transparent",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: 'center'
                }} onPress={() => { setminimizedList(!minimizedList) }} >
                  {minimizedList? (
                    <AntIcon name='up' style={{fontSize: 20, color: "white"}} />
                  ) : (
                    <AntIcon name='down' style={{fontSize: 20, color: "white"}} />
                  )}
                </TouchableOpacity>
                {minimizedList? (
                  <View style={{
                    backgroundColor: "black",
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 5,
                    borderTopRightRadius: dateTimeWindow? 5 : 0,
                    borderBottomRightRadius: dateTimeWindow? 5 : 0,
                    borderWidth: 1,
                    borderColor: "#292929",
                    width: "100%",
                    flex: 1,
                    paddingTop: 10,
                    paddingBottom: 10
                  }}>
                    <ScrollView style={{
                      flex: 1,
                      flexGrow: 1,
                      flexDirection: "column"
                    }} contentContainerStyle={{
                      alignItems: "center"
                    }}>
                      {arrComponents.map((comps, i) => {
                        return(
                          <TouchableOpacity key={i} style={{
                            width: "100%",
                            justifyContent: "center",
                            alignItems: 'center'
                          }} onPress={() => { unminimizeWindow(comps.instance, comps.minimized) }}>
                            {comps.type == "PWA"? (
                              <View style={{
                                width: "100%",
                                height: 45,
                                justifyContent: "center",
                                alignItems: 'center'
                              }}>
                                <Image source={{uri: `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${comps.urlRef}&size=100`}} style={{
                                  width: 20,
                                  height: 20,
                                  position: "absolute",
                                  zIndex: 1,
                                  bottom: 0,
                                  right: 5
                                }} />
                                <Image source={PWAIcon} style={{
                                  width: 35,
                                  height: 35
                                }} />
                              </View>
                            ) : comps.type == "News"? (
                              <View style={{
                                width: "100%",
                                height: 45,
                                justifyContent: "center",
                                alignItems: 'center'
                              }}>
                                <Image source={{uri: `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${comps.urlRef.split("/")[2]}&size=100`}} style={{
                                  width: 20,
                                  height: 20,
                                  position: "absolute",
                                  zIndex: 1,
                                  bottom: 0,
                                  right: 5
                                }} />
                                <EntIcon name='news' style={{fontSize: 35, color: "white"}} />
                              </View>
                            ) : comps.type == "Uninstall"? (
                              <View style={{
                                width: "100%",
                                height: 45,
                                justifyContent: "center",
                                alignItems: 'center'
                              }}>
                                <Image source={{uri: `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${comps.urlRef}&size=100`}} style={{
                                  width: 20,
                                  height: 20,
                                  position: "absolute",
                                  zIndex: 1,
                                  bottom: 0,
                                  right: 5
                                }} />
                                <EntIcon name='uninstall' style={{fontSize: 35, color: "white"}} />
                              </View>
                            ) : comps.type == "System"? comps.label == "Settings"? (
                              <View style={{
                                width: "100%",
                                height: 45,
                                justifyContent: "center",
                                alignItems: 'center'
                              }}>
                                <IonIcon name='settings' size={35} color="white" />
                              </View>
                            ) : (
                              <View style={{
                                width: "100%",
                                height: 45,
                                justifyContent: "center",
                                alignItems: 'center'
                              }}>
                                <Image source={PWAIcon} style={{
                                  width: 35,
                                  height: 35
                                }} />
                              </View>
                            ) : (
                              <View style={{
                                width: "100%",
                                height: 45,
                                justifyContent: "center",
                                alignItems: 'center'
                              }}>
                                <Image source={PWAIcon} style={{
                                  width: 35,
                                  height: 35
                                }} />
                              </View>
                            )}
                          </TouchableOpacity>
                        )
                      })}
                    </ScrollView>
                  </View>
                ) : null}
              </View>
          </View>
          <View style={{
            width: "100%",
            flex: 1,
            flexDirection: "column",
            marginLeft: 5
          }}>
            <View style={{
              backgroundColor: "black", 
              marginBottom: 5, 
              width: "100%",
              height: "100%",
              borderRadius: 5,
              opacity: 1,
              borderWidth: 1,
              borderColor: "#292929",
              flex: 1,
              flexDirection: "column",
              paddingBottom: 5
            }}>
              <View style={{backgroundColor: "transparent", width: "100%", flex: 1, flexDirection: "row", maxHeight: 38, minHeight: 38, borderBottomWidth: 1, borderBottomColor: "#292929", alignItems: "center", padding: 10, justifyContent: "space-between"}}>
                <Text style={{color: "white", fontWeight: "bold"}}>Notifications</Text>
                <TouchableOpacity onPress={() => { clearNotifs() }} style={{backgroundColor: "#292929", width: 70, height: 25, justifyContent: 'center', alignItems: "center", borderRadius: 5}}>
                  <Text style={{color: "white", fontSize: 10}}>Clear</Text>
                </TouchableOpacity>
              </View>
              {notificationslist.length == 0? (
                <View style={{backgroundColor: "transparent", flex: 1, alignItems: "center", justifyContent: "center"}}>
                  <MatIcon name='notifications-none' style={{color: "grey", fontSize: 50}} />
                  <Text style={{color: "grey", marginTop: 5, fontSize: 10}}>No Notifications</Text>
                </View>
              ) : (
                <ScrollView style={{backgroundColor: "transparent", flexGrow: 1, padding: 5}}>
                  <View style={{backgroundColor: "transparent", flex: 1, flexDirection: "column", paddingBottom: 10}}>
                    {notificationslist.map((data, i) => {
                      if(data.app == "com.android.vending"){
                        if(!existingTitle.includes(data.title)){
                          existingTitle.push(data.title);
                          return(
                            <NotificationDrawer key={i} data={data} />
                          )
                        }
                      }
                      else{
                        return(
                          <NotificationDrawer key={i} data={data} />
                        )
                      }
                    })}
                  </View>
                </ScrollView>
              )}
            </View>
            <View style={{backgroundColor: "black", flex: 1, height: "100%", width: "100%", flexDirection: "row", padding: 10, 
              borderRadius: 5,
              opacity: 1,
              borderWidth: 1,
              borderColor: "#292929",
              width: "100%",
              minHeight: 85,
              maxHeight: 85}}>
              <View style={{backgroundColor: "transparent", width: "30%", alignItems: "center", justifyContent: "center", borderRightWidth: 1, borderColor: "#383838"}}>
                <Text style={{color: "white", fontSize: 20}}>{datetimedata.day}</Text>
                <Text style={{color: "white", fontSize: 11}}>{datetimedata.dayname}</Text>
              </View>
              <View style={{backgroundColor: "transparent", width: "70%", justifyContent: "center", alignItems: "center"}}>
                <Text style={{color: "white", fontSize: 15}}>{datetimedata.monthname} {datetimedata.year}</Text>
                <Text style={{color: "white", fontSize: 10}}>{currentDate}</Text>
                <Text style={{color: "white", fontSize: 10}}>{currentTime}</Text>
              </View>
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
          <View style={{borderColor: "grey", borderWidth: appMenuMiniDrawer? 1 : 0, borderRadius: 5, backgroundColor: "black", width: "100%", maxWidth: 120, height: appMenuMiniDrawer? "100%" : 0, maxHeight: 100, position: "absolute", zIndex: 1, bottom: 5, left: 100}}>
            <ScrollView style={{backgroundColor: "transparent"}} contentContainerStyle={{flexGrow: 1, justifyContent: "center", alignItems: "center"}}>
              <TouchableOpacity onPress={() => { setappdrawer("Apps") }} style={{backgroundColor: "transparent", width: "100%", paddingTop: 5, paddingBottom: 5}}>
                <View style={{backgroundColor: "transparent", flex: 1, flexDirection: "row", height: "100%", justifyContent: "flex-start", paddingLeft: 25}}>
                  <IonIcon name='apps' size={20} color="white" />
                  <Text style={{color: "white", fontSize: 13, textAlign: "center", textAlignVertical: "center", paddingLeft: 10}}>Apps</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setappdrawer("PWA") }} style={{backgroundColor: "transparent", width: "100%", paddingTop: 5, paddingBottom: 5}}>
                <View style={{backgroundColor: "transparent", flex: 1, flexDirection: "row", height: "100%", justifyContent: "flex-start", paddingLeft: 25}}>
                  <IonIcon name='logo-pwa' size={20} color="white" />
                  <Text style={{color: "white", fontSize: 13, textAlign: "center", textAlignVertical: "center", paddingLeft: 10}}>PWA</Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
          <View style={styles.flexedAbsoluteWindow}>
            <View style={styles.viewSearchBar}>
              <TextInput placeholder='Search an app' style={styles.searchInput} placeholderTextColor="grey" />
            </View>
            <View style={styles.viewAppsList}>
                <View style={{flex: 1}}>
                  {/* <View style={{width: "100%", backgroundColor: "transparent", height: 40}}>
                    <View style={{flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                      <TouchableOpacity onPress={() => { setappdrawer("Apps") }} style={{opacity: 0.9, height: "90%", borderRadius: 5, backgroundColor: appdrawer == "Apps"? "grey" : "transparent", width: 80, alignItems: "center", margin: 2, justifyContent: "center"}}>
                        <Text style={{fontWeight: "bold", color: "white", marginLeft: "5%", marginTop: 5, marginBottom: 5, textAlignVertical: "center"}}>Apps</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => { setappdrawer("PWA") }} style={{opacity: 0.9, height: "90%", borderRadius: 5, backgroundColor: appdrawer == "PWA"? "grey" : "transparent", width: 80, alignItems: "center", margin: 2, justifyContent: "center"}}>
                        <Text style={{fontWeight: "bold", color: "white", marginLeft: "5%", marginTop: 5, marginBottom: 5, textAlignVertical: "center"}}>PWA</Text>
                      </TouchableOpacity>
                    </View>
                  </View> */}
                  <Text style={{color: "white", paddingLeft: "5%", marginBottom: 5, marginTop: 5, fontSize: 13}}>{appdrawer}</Text>
                  {appdrawer == "Apps"? (
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
                  ) : (
                    <ScrollView style={styles.scrollApps} contentContainerStyle={styles.contentscrollApps} fadingEdgeLength={50}>
                      {pwalist.map((apps, i) => {
                        return(
                          <TouchableOpacity key={i} onPress={() => { openPWA(apps.pwaName, "PWA", apps.pwaUrl, <WebPWA label={apps.pwaName} urlPWA={apps.pwaUrl} />) }} delayLongPress={500} onLongPress={(evt) => { holdPWAOption(apps.id, apps.pwaName, "Uninstall", apps.pwaUrl, <PWAInfo id={apps.id} name={apps.pwaName} icon={PWAIcon} />) }}>
                            <View style={styles.viewAppsIndv}>
                                <Image source={PWAIcon} style={styles.logoMenuStyle} />
                                <Text style={styles.AppIndvLabel} numberOfLines={2}>{apps.pwaName}</Text>
                            </View>
                          </TouchableOpacity>
                        )
                      })}
                    </ScrollView>
                  )}
                </View>
            </View>
            <View style={styles.viewBottomAbsoluteWindow}>
              <View style={{backgroundColor: "transparent", width: "100%", height: "100%", flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                <View style={{backgroundColor: "transparent", height: "100%", width: 100, justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                  <TouchableOpacity onPress={() => { openDraggable("Settings", "Settings", "System", <Settings navigation={navigation} />) }} style={{width: 50, height: "100%", justifyContent: "center", alignItems: "center"}}>
                    <IonIcon name='settings' size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { openDrawerOptions() }} style={{width: 50, height: "100%", justifyContent: "center", alignItems: "center"}}>
                    <AntIcon name={appMenuMiniDrawer? 'close' : 'right'} size={20} color="white" />
                  </TouchableOpacity>
                </View>
                <View style={{backgroundColor: "transparent", height: "100%", width: 50, justifyContent: "center", alignItems: "center"}}>
                  <TouchableOpacity style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
                    <Text style={{color: "white"}}>...</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
              <TouchableOpacity onPress={() => { menuWeatherHideOpen() }} style={{backgroundColor: "transparent", flex: 1, height: "100%", width: "100%", justifyContent: "center", alignItems: "center"}}>
                <IonIcon name='menu' size={20} color="white"/>
              </TouchableOpacity>
            </View>
            <View style={styles.viewCenterTab}>
              <ScrollView style={{backgroundColor: "transparent", width: "100%", paddingTop: 0}} contentContainerStyle={{flexGrow: 1, flexDirection: "row", flexWrap: "wrap", justifyContent: "center"}} >
                <TouchableOpacity style={{margin: 5}} onPress={() => { windowHideOpen() }}>
                  <Image source={LogoNeonV2} style={styles.logoMenuStyle} />
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
    borderColor: "#292929",
    justifyContent: "center",
    alignItems: "center"
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