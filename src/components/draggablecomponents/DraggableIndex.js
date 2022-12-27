import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { DragResizeBlock } from '../../libraries/drag-resize/index';
import { WebView } from 'react-native-webview'
import IonIcon from 'react-native-vector-icons/Ionicons'
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useDispatch, useSelector } from 'react-redux';
import { SET_DRAGGABLE_WINDOW } from '../../redux/types';

const DraggableIndex = ({instance, label, Component}) => {
 
  const arrComponents = useSelector(state => state.draggablewindow);
  const dispatch = useDispatch();

  const [maximizedStatus, setmaximizedStatus] = useState(false);

  const closeWindow = () => {
    var arrDeletionModification = []

    for(var i = 0; i < arrComponents.length; i++){
        // console.log(arrComponents[i]);
        if(arrComponents[i].instance != instance){
            arrDeletionModification.push(arrComponents[i])
        }
    }
    dispatch({type: SET_DRAGGABLE_WINDOW, draggablewindow: arrDeletionModification})
  }

  const maximizeWindow = () => {
    // alert("Maximize");
    var arrDeletionModification = []

    for(var i = 0; i < arrComponents.length; i++){
        // console.log(arrComponents[i]);
        if(arrComponents[i].instance != instance){
            arrDeletionModification.push(arrComponents[i])
        }
        else{
          setmaximizedStatus(!arrComponents[i].maximized);
          arrDeletionModification.push({...arrComponents[i], maximized: !arrComponents[i].maximized})
        }
    }
    dispatch({type: SET_DRAGGABLE_WINDOW, draggablewindow: arrDeletionModification})

  }

  const minimizeWindow = () => {
    var arrDeletionModification = []

    for(var i = 0; i < arrComponents.length; i++){
        // console.log(arrComponents[i]);
        if(arrComponents[i].instance != instance){
            arrDeletionModification.push(arrComponents[i])
        }
        else{
          arrDeletionModification.push({...arrComponents[i], minimized: !arrComponents[i].minimized})
        }
    }
    dispatch({type: SET_DRAGGABLE_WINDOW, draggablewindow: arrDeletionModification})
  }

  return (
    <View style={{backgroundColor: "transparent", width: "100%", height: "100%", borderRadius: 5, paddingTop: 30, borderWidth: 1, borderColor: "grey", opacity: 0.9}}>
        <View style={{backgroundColor: "transparent", width: "100%", height: "100%", borderRadius: 5, position: "absolute", top: 0}}>
          <View style={{backgroundColor: "black", opacity: 1, width: "100%", height: 30, justifyContent: "center", paddingLeft: 0, paddingRight: 0}}>
            <View style={{flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                <Text style={{color: "white", fontSize: 12, paddingLeft: 10, flex: 1}} numberOfLines={1}>{label}</Text>
                <View style={{flex: 0, flexDirection: "row", height: "100%", width: 120}}>
                  <TouchableOpacity onPress={() => { minimizeWindow() }} style={{backgroundColor: "transparent", width: 40, height: "100%", justifyContent: "center", alignItems: "center"}}>
                      <MCIcon name='window-minimize' color="white" size={20} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { maximizeWindow() }} style={{backgroundColor: "transparent", width: 40, height: "100%", justifyContent: "center", alignItems: "center"}}>
                      {maximizedStatus? <MCIcon name='window-restore' color="white" size={20} /> : <MCIcon name='window-maximize' color="white" size={20} />}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { closeWindow() }} style={{backgroundColor: "red", width: 40, height: "100%", justifyContent: "center", alignItems: "center"}}>
                    <IonIcon name='close' color="white" size={20} />
                </TouchableOpacity>
                </View>
            </View>
          </View>
          <View style={{backgroundColor: "transparent", width: "100%", height: "100%"}}>
            {/* <WebView source={{uri: 'https://vscode.dev/'}} userAgent="Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3714.0 Mobile Safari/537.36" /> */}
            {Component}
          </View>
        </View>
      </View>
  )
}

export default DraggableIndex