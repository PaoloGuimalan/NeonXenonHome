import { View, Text, StyleSheet, ImageBackground, Image, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import LogoNeon from '../../resources/imgs/NeXeLogo.png';
import { openDatabase } from 'react-native-sqlite-storage'

const db = openDatabase({
  name: "neonxenonhomedb"
})

const Splash = () => {

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', function() {
      // console.log("hello");
      // navigation.popToTop()
      return true;
    });
  }, [])

  return (
    <View style={styles.mainView}>
      <ImageBackground blurRadius={20} source={{uri: "https://w0.peakpx.com/wallpaper/305/169/HD-wallpaper-street-light-streets-fog.jpg"}} style={styles.imagebackgroundstyle}>
        <Image source={LogoNeon} style={styles.logoStyle} />
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  mainView:{
    backgroundColor: "black",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
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
  logoStyle:{
    width: "100%",
    height: "100%",
    maxWidth: 150,
    maxHeight: 150
  }
})

export default Splash