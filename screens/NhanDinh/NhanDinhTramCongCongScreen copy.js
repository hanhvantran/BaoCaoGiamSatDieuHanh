import React from "react";
import { ScrollView, StyleSheet, View, Alert, Text } from "react-native";
import { List, ListItem, Button } from "react-native-elements";
import * as firebase from "firebase";

export default class NhanDinhTramCongCongScreen extends React.PureComponent {
  static navigationOptions = {
    title: "Trạm Công Cộng"
  };
  constructor(props) {
    super(props);

    this.state = {
      notification: {},
      userID: "",
      notificationsAvailable: [],
      error: ""
    };
  }

  componentDidMount() {
    let notificationPath =
      "/users/" + firebase.auth().currentUser.uid + "/notifications";
    firebase
      .database()
      .ref(notificationPath)
      .orderByKey()
      .on("value", snapshot => {
        this.setState({
          notificationsAvailable: snapshot.val()
        });
      });
  }

  render() {
    console.log(
      "this.state.notificationsAvailable",
      this.state.notificationsAvailable
    );
    let Page1 = [];
    if (this.state.notificationsAvailable != null) {
      Page1 = ({ label }) => (
        <View style={styles.chart}>
          <ScrollView
            key={Math.random()}
            style={{
              backgroundColor: "white"
            }}
          >
            {Object.keys(this.state.notificationsAvailable).map((keys, i) => (
              <ListItem
                roundAvatar
                avatar={{
                  uri:
                    "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg"
                }}
                key={i}
                title={this.state.notificationsAvailable[keys].content}
              />
            ))}
          </ScrollView>
        </View>
      );
    } else {
      Page1 = ({ label }) => <View style={styles.chart}></View>;
    }
    return <Page1 label="Page #1" />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  }
});
