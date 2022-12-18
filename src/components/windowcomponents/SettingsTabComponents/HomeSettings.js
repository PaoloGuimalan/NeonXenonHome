import { View, Text, Animated, StyleSheet, ImageBackground, ToastAndroid, Platform, BackHandler, Image, ScrollView, TouchableOpacity, TextInput, NativeModules, Linking } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { openDatabase } from 'react-native-sqlite-storage';
import { SET_PWA_LIST } from '../../../redux/types';
import { useDispatch, useSelector } from 'react-redux';

const HomeSettings = () => {
  return (
    <View style={{backgroundColor: "transparent", flex: 1, width: "100%", padding: 5}}>
      <Text style={{color: "white", fontWeight: "bold", fontSize: 13}}>HomeSettings</Text>
    </View>
  )
}

export default HomeSettings