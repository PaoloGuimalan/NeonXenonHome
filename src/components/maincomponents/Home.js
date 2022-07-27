import { View, Text, StyleSheet, ImageBackground, BackHandler, Image, ScrollView, TouchableOpacity, TextInput, NativeModules } from 'react-native'
import React, { useState, useEffect } from 'react'
import IonIcon from 'react-native-vector-icons/Ionicons'
import LogoNeon from '../../resources/imgs/NeXeLogo.png';

const Home = () => {

  const [menuWindow, setmenuWindow] = useState(false);
  const [appslist, setappslist] = useState([]);

  const [currentDate, setcurrentDate] = useState("00 / 00 / 0000");
  const [currentTime, setcurrentTime] = useState("00 : 00 : 00");

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
    setInterval(() => {
      dateTimeSetter();
    }, 1000);
  },[])

  const dateTimeSetter = () => {
    const date = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const hours = new Date().getHours();
    const minutes = new Date().getMinutes();
    const seconds = new Date().getSeconds();

    setcurrentDate(`${month} / ${date} / ${year}`);
    setcurrentTime(`${hours} : ${minutes} : ${seconds}`);
  }

  const animStyles = StyleSheet.create({
    viewAbsoluteWindow:{
      backgroundColor: "black",
      width: "90%",
      maxWidth: 500,
      height: "100%",
      maxHeight: 400,
      position: "absolute",
      bottom: menuWindow? 60 : -400,
      borderRadius: 5,
      opacity: 0.8,
      borderWidth: 1,
      borderColor: "#292929",
      zIndex: 2
    }
  })

  const openApp = (appdir) => {
    try{
      NativeModules.InstalledApps.launchApplication(appdir);
    }
    catch(err){
      alert(err.message);
    }
  }

  return (
    <View style={styles.mainView}>
      <ImageBackground blurRadius={0} source={{uri: "https://w0.peakpx.com/wallpaper/305/169/HD-wallpaper-street-light-streets-fog.jpg"}} style={styles.imagebackgroundstyle}>
        <View style={animStyles.viewAbsoluteWindow}>
          <View style={styles.flexedAbsoluteWindow}>
            <View style={styles.viewSearchBar}>
              <TextInput placeholder='Search an app' style={styles.searchInput} placeholderTextColor="grey" />
            </View>
            <View style={styles.viewAppsList}>
              <Text style={{color: "white", marginLeft: "5%", marginTop: 5, marginBottom: 5}}>Apps</Text>
              <ScrollView style={styles.scrollApps} contentContainerStyle={styles.contentscrollApps} fadingEdgeLength={50}>
                {appslist.map((apps, i) => {
                  return(
                    <TouchableOpacity key={i} onPress={() => { openApp(apps.replace(/\"/g, "").split(",")[1]) }}>
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
        </View>
        <View style={styles.viewDesktop}>
          <Text>...</Text>
        </View>
        <View style={styles.viewTaskBar}>
          <View style={styles.flexedTaskBar}>
            <View style={styles.viewCornerTabs}>
              <Text style={{color: "white", fontSize: 10}}>Weather</Text>
            </View>
            <View style={styles.viewCenterTab}>
              <TouchableOpacity onPress={() => { setmenuWindow(!menuWindow) }}>
                <Image source={LogoNeon} style={styles.logoMenuStyle} />
              </TouchableOpacity>
            </View>
            <View style={styles.viewCornerRightTabs}>
              <Text style={{color: "white", fontSize: 10}}>{currentDate}</Text>
              <Text style={{color: "white", fontSize: 10}}>{currentTime}</Text>
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
    borderColor: "#292929"
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
  }
})

export default Home