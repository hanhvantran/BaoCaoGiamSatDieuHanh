import React from "react";
import { StyleSheet, Image, Text, View, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Touchable from "react-native-platform-touchable";

export default class ExpoLinksScreen extends React.Component {
  static navigationOptions = {
    title: "Lots of features here"
  };
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View>
        <Text style={styles.optionsTitleText}>Điện thương phẩm</Text>

        <Touchable
          style={styles.option}
          background={Touchable.Ripple("#ccc", false)}
          onPress={this._handlePressDocs}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={styles.optionIconContainer}>
              <Image
                source={require("./assets/images/expo-icon.png")}
                resizeMode="contain"
                fadeDuration={0}
                style={{ width: 20, height: 20, marginTop: 1 }}
              />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>Theo 5 thành phần phụ tải</Text>
            </View>
          </View>
        </Touchable>

        <Touchable
          background={Touchable.Ripple("#ccc", false)}
          style={styles.option}
          onPress={this._handlePressSlack}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={styles.optionIconContainer}>
              <Image
                source={require("./assets/images/slack-icon.png")}
                fadeDuration={0}
                style={{ width: 20, height: 20 }}
              />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>Join us on Slack</Text>
            </View>
          </View>
        </Touchable>

        <Touchable
          style={styles.option}
          background={Touchable.Ripple("#ccc", false)}
          onPress={this._handlePressForums}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={styles.optionIconContainer}>
              <Ionicons name="ios-chatboxes" size={22} color="#ccc" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>
                Ask a question on the Expo forums
              </Text>
            </View>
          </View>
        </Touchable>
      </View>
    );
  }

  _handlePressSlack = () => {
    console.log('abc', this.props)
    console.log('abc1', JSON.stringify(this.props))
    this.props.navigation.navigation('Details_Activity');
  };

  _handlePressDocs = () => { Alert.alert("Lỗi kết nối!", "loi");
  console.log('abc', this.props)
  console.log('abc', JSON.stringify(this.props))
  this.props.navigation.navigation('Details_Activity');
  };

  _handlePressForums = () => { Alert.alert("Lỗi kết nối!", "loi");
  console.log('abc', this.props)
  console.log('abc', JSON.stringify(this.props))
  this.props.navigation.navigation('Details_Activity');
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15
  },
  optionsTitleText: {
    fontSize: 16,
    marginLeft: 15,
    marginTop: 9,
    marginBottom: 12
  },
  optionIconContainer: {
    marginRight: 9
  },
  option: {
    backgroundColor: "#fdfdfd",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EDEDED"
  },
  optionText: {
    fontSize: 15,
    marginTop: 1
  }
});
