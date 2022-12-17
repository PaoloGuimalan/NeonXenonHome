/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ToastAndroid,
  Platform,
  Dimensions
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Home from './src/components/maincomponents/Home';
import Splash from './src/components/maincomponents/Splash';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { openDatabase } from 'react-native-sqlite-storage'
import { Provider, useDispatch } from 'react-redux';
import store from './src/redux/store';
import { SET_ORIENTATION_STATUS } from './src/redux/types';

const db = openDatabase({
  name: "neonxenonhomedb"
})

const MainStack = createNativeStackNavigator();

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [splashstatus, setsplashstatus] = useState(true);

  useEffect(() => {
    // setTimeout(() => {
    //   setsplashstatus(false);
    // }, 4000)
    initializeDatabase()
    // createNotificationTable()
    //createPWATables()
  },[])

  const initializeDatabase = () => {
    db.transaction(txn => {
      txn.executeSql(`SELECT DISTINCT tbl_name FROM sqlite_master where tbl_name='desktopShortcuts'`,[], (sqlTxn, res) => {
        // console.log(res.rows.length)
        if(res.rows.length == 0){
          createTables();
          createPWATables();
          createNotificationTable()
          setTimeout(() => {
            setsplashstatus(false);
          }, 4000)
        }
        else{
          setTimeout(() => {
            setsplashstatus(false);
          }, 4000)
        }
      },
      (error) => {
          console.log("error on creating table " + error.message);
          if(Platform.OS === 'android'){
            ToastAndroid.show("Error Initializing Database!", ToastAndroid.SHORT)
          }
          else{
              alert("Error Initializing Database!")
          }
      })
    })
  }

  const createNotificationTable = () => {
    db.transaction(txn => {
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS notifStorage (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          notifID VARCHAR(225), 
          app VARCHAR(225), 
          audioContentsURI TEXT, 
          bigText TEXT,
          extraInfoText TEXT, 
          icon BLOB, 
          iconLarge BLOB, 
          image BLOB, 
          imageBackgroundURI BLOB, 
          subText TEXT, 
          summaryText TEXT, 
          text TEXT, 
          time VARCHAR(255), 
          title TEXT, 
          titleBig TEXT
          )`,
        [],
        (sqlTxn, res) => {
          // console.log("table created successfully");
          if(Platform.OS === 'android'){
            ToastAndroid.show("Notification Initialized", ToastAndroid.SHORT)
          }
          else{
              alert("Notification Initialized")
          }
          createGroupMessagesNotif()
        },
        error => {
          console.log("error on creating table " + error.message);
          if(Platform.OS === 'android'){
            ToastAndroid.show("Error Creating Database!", ToastAndroid.SHORT)
          }
          else{
              alert("Error Creating Database!")
          }
        },
      );
    });
  };

  const createGroupMessagesNotif = () => {
    db.transaction(txn => {
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS notifGroupStorage (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          notifID VARCHAR(225), 
          text VARCHAR(225), 
          title VARCHAR(225)
          )`,
        [],
        (sqlTxn, res) => {
          // console.log("table created successfully");
          if(Platform.OS === 'android'){
            ToastAndroid.show("Group Notification Initialized", ToastAndroid.SHORT)
          }
          else{
              alert("Group Notification Initialized")
          }
        },
        error => {
          console.log("error on creating table " + error.message);
          if(Platform.OS === 'android'){
            ToastAndroid.show("Error Creating Database!", ToastAndroid.SHORT)
          }
          else{
              alert("Error Creating Database!")
          }
        },
      );
    });
  };

  const createTables = () => {
    db.transaction(txn => {
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS desktopShortcuts (id INTEGER PRIMARY KEY AUTOINCREMENT, appName VARCHAR(20), appCom TEXT, appBase BLOB, appCategory TEXT)`,
        [],
        (sqlTxn, res) => {
          // console.log("table created successfully");
          if(Platform.OS === 'android'){
            ToastAndroid.show("Desktop Initialized", ToastAndroid.SHORT)
          }
          else{
              alert("Desktop Initialized")
          }
        },
        error => {
          console.log("error on creating table " + error.message);
          if(Platform.OS === 'android'){
            ToastAndroid.show("Error Creating Database!", ToastAndroid.SHORT)
          }
          else{
              alert("Error Creating Database!")
          }
        },
      );
    });
  };

  const createPWATables = () => {
    db.transaction(txn => {
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS PWAs (id INTEGER PRIMARY KEY AUTOINCREMENT, pwaName VARCHAR(20), pwaUrl TEXT, pwaIcon BLOB, pwaExtra TEXT)`,
        [],
        (sqlTxn, res) => {
          // console.log("table created successfully");
          if(Platform.OS === 'android'){
            ToastAndroid.show("Desktop Initialized", ToastAndroid.SHORT)
          }
          else{
              alert("Desktop Initialized")
          }
        },
        error => {
          console.log("error on creating table " + error.message);
          if(Platform.OS === 'android'){
            ToastAndroid.show("Error Creating Database!", ToastAndroid.SHORT)
          }
          else{
              alert("Error Creating Database!")
          }
        },
      );
    });
  };

  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar hidden={true} />
        <MainStack.Navigator screenOptions={{cardStyle: { backgroundColor: 'black' }}}>
          <MainStack.Screen name='Home' component={splashstatus? Splash : Home} options={{headerShown: false}} />
        </MainStack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
