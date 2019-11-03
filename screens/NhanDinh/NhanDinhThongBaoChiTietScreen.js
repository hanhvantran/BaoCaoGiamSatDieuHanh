import _ from "lodash";

import React, { Component } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { ListItem } from "../ListItem";
export default class NhanDinhThongBaoChiTietScreen extends React.PureComponent {
  static navigationOptions = {
    title: "Thông báo  chi tiết"
  };
  constructor() {
    super();
  }
  render() {
    const { navigation } = this.props;
    const receive = navigation.getParam("data", "No data found!");
    let list1 = [];
    var mySplitResult = receive.content.split(";");
    for (let i = 0; i < mySplitResult.length; i++) {
      let x = i + 1 + ". " + mySplitResult[i];
      if (mySplitResult[i].length > 1) list1.push({ content: x });
    }
    return (
      <View style={styles.list}>
        {/* <ListView
          renderRow={this.renderRow}
          dataSource={receive}
        /> */}
        <ScrollView
          key={Math.random()}
          style={{
            backgroundColor: "white"
          }}
        >
          {Object.keys(list1).map((keys, i) => (
            <ListItem
              key={i}
              title={list1[keys].content}
              chevron
              bottomDivider
              titleStyle={{
                color: "black",
                marginBottom: 15,
                fontSize: 10
              }}
              subtitleStyle={{ color: "black" }}
            />
          ))}
        </ScrollView>
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
