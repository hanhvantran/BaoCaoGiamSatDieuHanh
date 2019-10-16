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
export default class NhanDinhThongBaoChiTietScreen extends React.PureComponent {
  static navigationOptions = {
    title: "Thông báo  chi tiết"
  };
  constructor() {
    super();
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.state = {
      selectedIndex: 0,
      value: 0.5,
      dataSource: ds.cloneWithRows(list1)
    };

    this.updateIndex = this.updateIndex.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  updateIndex(selectedIndex) {
    this.setState({ selectedIndex });
  }
  _card(el) {
    console.log("el", el);
    Alert.alert("Thông báo!", el.title);
    var { navigate } = this.props.navigation;
    navigate("NhanDinhDoDoemScreen");
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
        title={rowData.title}
        subtitle={rowData.subtitle}
        leftIcon={{ name: rowData.icon, color: rowData.color, size: 30 }}
        color={rowData.color}
        chevron
        bottomDivider
        titleStyle={{ color: "black", fontWeight: "bold" }}
        subtitleStyle={{ color: "black" }}
      />
    );
  }
  render() {
    const { navigation } = this.props;  
    const receive  = navigation.getParam('data', 'No data found!'); 
    console.log('receive:', receive); 
    return (
      <View style={styles.list}>
        <ListView
          renderRow={this.renderRow}
          dataSource={this.state.dataSource}
        />
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
