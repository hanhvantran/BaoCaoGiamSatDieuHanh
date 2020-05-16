import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';

import useCachedResources from './hooks/useCachedResources';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import LinkingConfiguration from './navigation/LinkingConfiguration';
import LoginScreen from "./LoginScreen";
const Stack = createStackNavigator();

export default function App(props) {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
        <NavigationContainer linking={LinkingConfiguration} headerMode="none" mode="modal">
          <Stack.Navigator  screenOptions={{headerShown:false}} headerMode="none">
          <Stack.Screen   options={{headerShown:false}}  name="LoginScreen" component={LoginScreen} />
            <Stack.Screen   options={{headerShown:false}}  name="Home" component={BottomTabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:-50
  },
});
// import React from "react";
// import { Platform, StatusBar, StyleSheet, View } from "react-native";
// import { AppLoading } from "expo";
// import * as Font from "expo-font";
// import { Asset } from "expo-asset";
// import { Ionicons } from "@expo/vector-icons";

// import AppNavigator from "./navigation/AppNavigator";

// // import * as firebase from 'firebase';
// // // Initialize Firebase
// // const firebaseConfig = {
// //     // ADD YOUR FIREBASE CREDENTIALS
// //     apiKey: "AIzaSyC0ig_Xf3vWb50G7PxA8NinNocEhPqq6uM",
// //     authDomain: "baocaogiamsatdieuhanh.firebaseapp.com",
// //     databaseURL: "https://baocaogiamsatdieuhanh.firebaseio.com",
// //     projectId: "baocaogiamsatdieuhanh",
// //     storageBucket: "baocaogiamsatdieuhanh.appspot.com",
// //     messagingSenderId: "398286399580",
// //     appId: "1:398286399580:web:edf2a70af0b3c997"
// // };
// // firebase.initializeApp(firebaseConfig);
// export default class App extends React.Component {
//   constructor(props) {
//     super(props);
//   }
//   state = {
//     isLoadingComplete: false
//   };
//   render() {
//     if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
//       return (
//         <AppLoading
//           startAsync={this._loadResourcesAsync}
//           onError={this._handleLoadingError}
//           onFinish={this._handleFinishLoading}
//         />
//       );
//     } else {
//       return (
//         <View style={styles.container}>
//           {Platform.OS === "ios" && <StatusBar barStyle="default" />}
//           <AppNavigator />
//         </View>
//       );
//     }
//   }
  
//   _loadResourcesAsync = async () => {
//     return Promise.all([
//       //  Asset.loadAsync([
//       //   require("./assets/images/robot-dev.png"),
//       //  require("./assets/images/robot-prod.png")
//       //  ]),
//      await Font.loadAsync({
//         // This is the font that we are using for our tab bar
//         ...Ionicons.font,
//         // We include SpaceMono because we use it in HomeScreen.js. Feel free
//         // to remove this if you are not using it in your app
//         "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf")
//       })
//     ]);
//   };
  

//   _handleLoadingError = error => {
//     // In this case, you might want to report the error to your error
//     // reporting service, for example Sentry
//     console.warn(error);
//   };

//   _handleFinishLoading = () => {
//     this.setState({ isLoadingComplete: true });
//   };
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff"
//   }
// });

