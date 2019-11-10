import _ from "lodash";

import React, { Component } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  AsyncStorage,
  Alert
} from "react-native";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import { ListItem } from "../ListItem";
import urlBaoCao from "../../networking/services";
import Spinner from "react-native-loading-spinner-overlay";
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
      spinner: false,
      PToKen: ""
    };
  }
  _bootstrapAsync = async () => {
    try {
      AsyncStorage.getItem("UserToken").then(user_data_json => {
        let userData = user_data_json;
        if (userData == undefined) {
          var { navigate } = this.props.navigation;
          navigate("LoginScreen");
        } else {
          this.callMultiAPI(userData);
        }
      });
    } catch (error) {
      Alert.alert("AsyncStorage error", error.message);
    }
  };
  async registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== "granted") {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    // Stop here if the user did not grant permissions
    if (finalStatus !== "granted") {
      Alert.alert("Permission", "Permission denied!");
      return;
    }
    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    this.setState({
      PToKen: token
    });
    this.callMultiAPI();
  }
  componentDidMount() {
    this._bootstrapAsync();
  }
  callMultiAPI = UserToken => {
    this.setState({
      spinner: true
    });
    return fetch(urlBaoCao.sp_ThongBao + "?PToken=" + UserToken + "")
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson && responseJson.length > 0) {
          this.setState({
            notificationsAvailable: responseJson,
            spinner: false
          });
        } else {
          this.setState({
            spinner: false
          });
        }
      })
      .catch(error => {
        this.setState({
          spinner: false
        });
        Alert.alert("Lỗi kết nối!", error.toString());
      });
  };
  updateIndex(selectedIndex) {
    this.setState({ selectedIndex });
  }
  _card(el) {
    // console.log("el", el);
    let guidid = el.guidid;
    // console.log("guidid", guidid);
    fetch(urlBaoCao.sp_UpdateDaXem + "?PGuiID=" + guidid + "")
      .then(response => response.json())
      .then(responseJson => {
        //  console.log("sp_UpdateDaXem:", "OK");
      })
      .catch(error => {
        //  console.log("sp_UpdateDaXem:", error);
      });
    let number = 0;
    if (Number.isInteger(Notifications.getBadgeNumberAsync())) {
      number = Notifications.getBadgeNumberAsync();
      Notifications.setBadgeNumberAsync(number - 1);
      console.log("number1:", number);
    }
    var { navigate } = this.props.navigation;
    navigate("NhanDinhThongBaoChiTietScreen", {
      data: el
    });
  }
  renderRow(rowData, sectionID) {
    return (
      <ListItem
        key={sectionID}
        onPress={this._card.bind(this, rowData)}
        title={rowData.body}
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
    let Page1 = [];
    if (
      this.state.notificationsAvailable &&
      Array.isArray(this.state.notificationsAvailable) &&
      this.state.notificationsAvailable.length > 0
    ) {
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
                rightTitle={this.state.notificationsAvailable[keys].ngaY_TAO}
                onPress={this._card.bind(
                  this,
                  this.state.notificationsAvailable[keys]
                )}
                subtitle={this.state.notificationsAvailable[keys].body}
                leftIcon={{
                  name: this.state.notificationsAvailable[keys].icon,
                  color: this.state.notificationsAvailable[keys].color,
                  size: 30
                }}
                rightIcon={{
                  name: "fiber-new",
                  color:
                    this.state.notificationsAvailable[keys].dA_XEM == 0
                      ? "red"
                      : "white",
                  size:
                    this.state.notificationsAvailable[keys].dA_XEM == 0 ? 30 : 0
                }}
                chevron
                bottomDivider
                titleStyle={{
                  color: "black",
                  fontWeight: "bold",
                  marginBottom: 15,
                  fontSize: 13
                }}
                rightTitleStyle={{
                  color: "red",
                  marginBottom: 15,
                  fontSize: 10
                }}
                subtitleStyle={{ color: "black" }}
              />
            ))}
          </ScrollView>
        </View>
      );
    } else {
      Page1 = ({ label }) => <View style={styles.chart}></View>;
    }
    return (
      <View>
        <Spinner
          visible={this.state.spinner}
          textContent={"Đang lấy dữ liệu..."}
        />
        <Page1 label="Page #1" />
      </View>
    );
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
