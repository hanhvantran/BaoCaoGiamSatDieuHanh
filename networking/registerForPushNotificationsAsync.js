import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
//import * as firebase from "firebase";
import urlBaoCao from "../networking/services";
/*
firebase.initializeApp({
    apiKey: "AIzaSyC0ig_Xf3vWb50G7PxA8NinNocEhPqq6uM",
    authDomain: "baocaogiamsatdieuhanh.firebaseapp.com",
    databaseURL: "https://baocaogiamsatdieuhanh.firebaseio.com",
    projectId: "baocaogiamsatdieuhanh",
    storageBucket: "baocaogiamsatdieuhanh.appspot.com",
    messagingSenderId: "398286399580",
    appId: "1:398286399580:web:edf2a70af0b3c997"
});*/
export default (async function registerForPushNotificationsAsync() {
  // Android remote notification permissions are granted during the app
  // install, so this will only ask on iOS
  let { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

  // Stop here if the user did not grant permissions
  if (status !== "granted") {
    return;
  }
  // Get the token that uniquely identifies this device
  let token = await Notifications.getExpoPushTokenAsync();
  // if (firebase.auth().currentUser != null) {
  //   email = firebase.auth().currentUser.email;
  //   userID = firebase.auth().currentUser.uid;

  //   firebase
  //     .database()
  //     .ref("/users/" + userID)
  //     .update({ token: token });
  //   return fetch(
  //     "http://10.170.215.68/APIGiamSat/api/UpdateToKen" +
  //       "?pToKen=" +
  //       token +
  //       "&pEmail=" +
  //       email +
  //       ""
  //   )
  //     .then(response => response.json())
  //     .then(responseJson => {
  //      // console.log("UpdateToKen:", "OK");
  //     })
  //     .catch(error => {
  //     //  console.log("UpdateToKen:", error);
  //     });
  // }
});
