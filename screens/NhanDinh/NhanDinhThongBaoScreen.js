import _ from "lodash";

import React, { Component } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  ListView,
  Alert
} from "react-native";
import * as firebase from "firebase";
import {
  Text,
  Card,
  Tile,
  Icon,
  //  ListItem,
  Avatar
} from "react-native-elements";
import { ListItem } from "../ListItem";
const log = () => console.log("this is an example method");
const list1 = [
  {
    title: "Hợp đồng đến hạn",
    icon: "contact-phone",
    subtitle: "Có 25 hợp đồng đến hạn ký lại ",
    color: "red"
  },
  {
    title: "Thiết bị quá hạn kiểm định",
    icon: "layers",
    subtitle: "Có 25 hợp đồng đến hạn ký lại ",
    color: "brown"
  },
  {
    title: "Công tơ vận hành quá tải",
    icon: "flash-on",
    subtitle: "Có 20 công tơ vận hành quá tải",
    color: "blue"
  },
  {
    title: "Ký mua CSPK",
    icon: "attach-money",
    subtitle: "Có 10 khách hàng cảnh báo ký mua CSPK",
    color: "green"
  },
  {
    title: "Áp giá",
    icon: "speaker-notes-off",
    subtitle: "Có 10 khách hàng áp sai giá",
    color: "gray"
  }
];
export default class NhanDinhThongBaoScreen extends React.PureComponent {
  static navigationOptions = {
    title: "Thông báo"
  };
  constructor() {
    super();

    this.state = {
      notification: {},
      userID: "",
      notificationsAvailable: [],
      error: "",
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

  updateIndex(selectedIndex) {
    this.setState({ selectedIndex });
  }
  _card(el) {
    console.log("el", el);
    var { navigate } = this.props.navigation;
    navigate("NhanDinhThongBaoChiTietScreen", {
      data: el
    });
    // if (el.page != undefined) {
    //   var { navigate } = this.props.navigation;
    //   navigate(el.page);
    // } else {
    //   Alert.alert("Thông báo!", "Chức năng chưa được khởi tạo");
    // }
  }
  renderRow(rowData, sectionID) {
    return (
      <ListItem
        key={sectionID}
        onPress={this._card.bind(this, rowData)}
        title={rowData.BODY}
        subtitle={rowData.subtitle}
        leftIcon={{ name: rowData.icon, color: rowData.color, size: 50 }}
        color={rowData.color}
        chevron
        bottomDivider
        titleStyle={{ color: "black", fontWeight: "bold", marginBottom: 20 }}
        subtitleStyle={{ color: "black" }}
      />
    );
  }
  // render() {
  //   return (
  //     <View style={styles.list}>
  //       <ListView
  //         renderRow={this.renderRow}
  //         dataSource={this.state.dataSource}
  //       />
  //     </View>
  //   );
  // }
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
                key={i}
                title={this.state.notificationsAvailable[keys].title}
                onPress={this._card.bind(this, this.state.notificationsAvailable[keys])}
                subtitle={this.state.notificationsAvailable[keys].BODY}
                leftIcon={{ name: this.state.notificationsAvailable[keys].icon, color: this.state.notificationsAvailable[keys].color, size: 30 }}
                chevron
                bottomDivider
                titleStyle={{ color: "black", fontWeight: "bold", marginBottom: 15 }}
                subtitleStyle={{ color: "black" }}
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
    flex: 1
  },
  list: {
    // marginTop: 20,
    borderTopWidth: 1,
    borderColor: "gray",
    backgroundColor: "#fff"
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#FD6B78"
  },
  heading: {
    color: "white",
    marginTop: 10,
    fontSize: 22
  },
  fonts: {
    marginBottom: 8
  },
  user: {
    flexDirection: "row",
    marginBottom: 6
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10
  },
  name: {
    fontSize: 16,
    marginTop: 5
  },
  social: {
    flexDirection: "row",
    justifyContent: "center"
  },
  subtitleView: {
    flexDirection: "row",
    paddingLeft: 10,
    paddingTop: 5
  },
  ratingImage: {
    height: 19.21,
    width: 100
  },
  ratingText: {
    paddingLeft: 10,
    color: "grey"
  }
});
