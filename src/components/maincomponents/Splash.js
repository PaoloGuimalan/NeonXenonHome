import { View, Text, StyleSheet, ImageBackground, Image, BackHandler, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import LogoNeon from '../../resources/imgs/NeXeLogo.png';
import LogoNeonV2 from '../../resources/imgs/NeonLogo_V2.png'
import NeonTextV2 from '../../resources/imgs/NeonTextV2.png';
import NeXeBg from '../../resources/imgs/neonlightsbg2.jpg'
import NeonBgV2Landscape from '../../resources/imgs/DefaultBgV2Landscape.jpg'
import NeonBgV2Portrait from '../../resources/imgs/DefaultBgV2Portrait.jpg'
import { openDatabase } from 'react-native-sqlite-storage'
import { useDispatch, useSelector } from 'react-redux';
import { SET_ORIENTATION_STATUS } from '../../redux/types';

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

  const orientationstatus = useSelector(state => state.orientationstatus)

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

  return (
    <View style={styles.mainView}>
      <ImageBackground blurRadius={20} source={orientationstatus? NeonBgV2Landscape : NeonBgV2Portrait} style={styles.imagebackgroundstyle}>
        <Image source={LogoNeonV2} style={styles.logoStyle} />
        <Image source={NeonTextV2} style={styles.logoTextStyle} />
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
  },
  logoTextStyle:{
    width: "100%",
    height: "100%",
    maxWidth: 200,
    maxHeight: 50,
    resizeMode: "contain"
  }
})

export default Splash