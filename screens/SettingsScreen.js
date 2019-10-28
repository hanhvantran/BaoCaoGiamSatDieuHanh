import React from "react";
import {
  SectionList,
  Image,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Alert
} from "react-native";
import Constants from "expo-constants";
import { Button, Icon } from "react-native-elements";
import ButtonCustom from "../components/ButtonCustom";

export default class SettingsScreen extends React.PureComponent {
  static navigationOptions = {
    title: null,
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      FULLNAME: "",
      MA_DVICTREN: "",
      MA_DVIQLY: "",
      TEN_DVIQLY: "",
      USERID: 0,
      USERNAME: "",
      CAP_DVI: "",
      changedPage: null
    };
  }
  componentDidMount() {
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    try {
      // console.log("this.props.navigation", this.props.navigation);
      // this.setState({ changedPage: this.props.navigation });
      // console.log("this.state.changedPage", this.state.changedPage);
      AsyncStorage.getItem("UserInfomation").then(user_data_json => {
        let userData = JSON.parse(user_data_json);
        if (userData == undefined) {
          var { navigate } = this.props.navigation;
          //  navigate("Main");
          navigate("Main");
        } else {
          this.setState({
            FULLNAME: userData.fullname,
            MA_DVICTREN: userData.mA_DVICTREN,
            MA_DVIQLY: userData.mA_DVIQLY,
            TEN_DVIQLY: userData.mA_DVIQLY + " - " + userData.teN_DVIQLY,
            USERID: userData.userid,
            USERNAME: userData.username,
            CAP_DVI: userData.caP_DVI
          });
        }
      });
    } catch (error) {
      Alert.alert("AsyncStorage error", error.message);
    }
  };
  _handleLogoutPress = async () => {
    try {
      await AsyncStorage.clear();
      this.props.navigation.navigate("LoginScreen");
    } catch (error) {
      Alert.alert("AsyncStorage error", error.message);
    }
  };
  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    const { manifest } = Constants;
    const sections = [
      { data: [{ value: this.state.TEN_DVIQLY }], title: "Đơn vị" },
      { data: [{ value: this.state.USERNAME }], title: "Tài khoản" },
      { data: [{ value: manifest.sdkVersion }], title: "sdkVersion" },
      { data: [{ value: manifest.privacy }], title: "privacy" },
      { data: [{ value: manifest.version }], title: "version" },
      { data: [{ value: manifest.orientation }], title: "orientation" },
      {
        data: [{ value: manifest.primaryColor, type: "color" }],
        title: "primaryColor"
      },
      {
        data: [{ value: manifest.splash && manifest.splash.image }],
        title: "splash.image"
      },
      {
        data: [
          {
            value: manifest.splash && manifest.splash.backgroundColor,
            type: "color"
          }
        ],
        title: "splash.backgroundColor"
      },
      {
        data: [
          {
            value: manifest.splash && manifest.splash.resizeMode
          }
        ],
        title: "splash.resizeMode"
      },
      {
        data: [
          {
            value:
              manifest.ios && manifest.ios.supportsTablet ? "true" : "false"
          }
        ],
        title: "ios.supportsTablet"
      }
      // {
      //   data: [
      //     {
      //       value:
      //         manifest.ios && manifest.ios.supportsTablet ? "true" : "false",
      //       type: "Switch"
      //     }
      //   ],
      //   title: "Đăng xuất"
      // }
    ];

    return (
      <View style={styles.chart}>
        {/* <Card title="CARD WITH DIVIDER"> */}
        {/* </Card> */}

        <SectionList
          style={styles.container}
          renderItem={this._renderItem}
          renderSectionHeader={this._renderSectionHeader}
          stickySectionHeadersEnabled={true}
          keyExtractor={(item, index) => index}
          ListHeaderComponent={ListHeader}
          sections={sections}
          // ListFooterComponent={this._renderFooter}
        />
        <ButtonCustom label="Đăng xuất" onPress={this._handleLogoutPress} />
      </View>
    );
  }
  // _renderFooter = () => {
  //   //View to set in Footer
  //   return (
  //     <SectionContent>
  //       <Text style={styles.sectionContentText}>Đăng xuất</Text>
  //       <Button>ok</Button>
  //     </SectionContent>
  //   );
  // };
  _renderSectionHeader = ({ section }) => {
    return <SectionHeader title={section.title} />;
  };

  _renderItem = ({ item }) => {
    if (item.type === "color") {
      return (
        <SectionContent>
          {item.value && <Color value={item.value} />}
        </SectionContent>
      );
    } else if (item.type === "Switch") {
      return <SectionContent />;
    } else {
      return (
        <SectionContent>
          <Text style={styles.sectionContentText}>{item.value}</Text>
        </SectionContent>
      );
    }
  };
}
const ListHeader = () => {
  const { manifest } = Constants;

  return (
    <View style={styles.titleContainer}>
      <View style={styles.titleIconContainer}>
        <AppIconPreview iconUrl={manifest.iconUrl} />
      </View>
      <View style={styles.titleTextContainer}>
        <Text style={styles.nameText} numberOfLines={1}>
          {manifest.name}
        </Text>

        <Text style={styles.slugText} numberOfLines={1}>
          {manifest.slug}
        </Text>

        <Text style={styles.descriptionText}>{manifest.description}</Text>
      </View>
    </View>
  );
};

const SectionHeader = ({ title }) => {
  if (title == "Đăng xuất") {
    return (
      <View style={styles.sectionHeaderContainer}>
        <Button
          Icon={{
            name: "sign-out",
            size: 15,
            color: "white"
          }}
          title="Đăng xuất"
          onPress={this._handleLogoutPress}
        />
      </View>
    );
  } else {
    return (
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeaderText}>{title}</Text>
      </View>
    );
  }
};

const SectionContent = props => {
  return <View style={styles.sectionContentContainer}>{props.children}</View>;
};

const AppIconPreview = ({ iconUrl }) => {
  if (!iconUrl) {
    iconUrl =
      "https://s3.amazonaws.com/exp-brand-assets/ExponentEmptyManifest_192.png";
  }

  return (
    <Image
      source={{ uri: iconUrl }}
      style={{ width: 64, height: 64 }}
      resizeMode="cover"
    />
  );
};

const Color = ({ value }) => {
  if (!value) {
    return <View />;
  } else {
    return (
      <View style={styles.colorContainer}>
        <View style={[styles.colorPreview, { backgroundColor: value }]} />
        <View style={styles.colorTextContainer}>
          <Text style={styles.sectionContentText}>{value}</Text>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 15
  },
  titleContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: "row"
  },
  titleIconContainer: {
    marginRight: 15,
    paddingTop: 2
  },
  sectionHeaderContainer: {
    backgroundColor: "#fbfbfb",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ededed"
  },
  sectionHeaderText: {
    fontSize: 14
  },
  sectionContentContainer: {
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 15
  },
  sectionContentText: {
    color: "#808080",
    fontSize: 14
  },
  nameText: {
    fontWeight: "600",
    fontSize: 18
  },
  slugText: {
    color: "#a39f9f",
    fontSize: 14,
    backgroundColor: "transparent"
  },
  descriptionText: {
    fontSize: 14,
    marginTop: 6,
    color: "#4d4d4d"
  },
  colorContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  colorPreview: {
    width: 17,
    height: 17,
    borderRadius: 2,
    marginRight: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc"
  },
  colorTextContainer: {
    flex: 1
  },
  chart: { flex: 1 }
});
