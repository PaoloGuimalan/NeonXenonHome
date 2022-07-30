import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { DragResizeBlock } from '../../libraries/drag-resize/index';
import { WebView } from 'react-native-webview'
import IonIcon from 'react-native-vector-icons/Ionicons'
import { useDispatch, useSelector } from 'react-redux';
import { SET_DRAGGABLE_WINDOW } from '../../redux/types';

const DraggableIndex = ({instance, label, component}) => {
 
  const arrComponents = useSelector(state => state.draggablewindow);
  const dispatch = useDispatch();

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

  return (
    <View style={{backgroundColor: "transparent", width: "100%", height: "100%", borderRadius: 5, paddingTop: 30, borderWidth: 1, borderColor: "grey", opacity: 0.9}}>
        <View style={{backgroundColor: "transparent", width: "100%", height: "100%", borderRadius: 5, position: "absolute", top: 0}}>
          <View style={{backgroundColor: "grey", width: "100%", height: 30, justifyContent: "center", paddingLeft: 0, paddingRight: 0}}>
            <View style={{flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                <Text style={{color: "white", fontSize: 12, paddingLeft: 10}}>{label}</Text>
                <TouchableOpacity onPress={() => { closeWindow() }} style={{backgroundColor: "red", width: 40, height: "100%", justifyContent: "center", alignItems: "center"}}>
                    <IonIcon name='close' color="white" size={20} />
                </TouchableOpacity>
            </View>
          </View>
          <View style={{backgroundColor: "white", width: "100%", height: "100%"}}>
            {/* <WebView source={{uri: 'https://vscode.dev/'}} userAgent="Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3714.0 Mobile Safari/537.36" /> */}
            <Text>{component}</Text>
          </View>
        </View>
      </View>
  )
}

export default DraggableIndex