import React from "react";
import {
  StyleSheet,
  Image,
  Text,
  View,
  Alert,
  ScrollView,
  Dimensions,
  AsyncStorage,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Touchable from "react-native-platform-touchable";
import { ListItem } from "./ListItem";
import TouchableScale from "react-native-touchable-scale";
import ActionButton from "react-native-action-button";
import Dashboard from "react-native-dashboard";
import Icon from "react-native-vector-icons/Ionicons";


export default class KinhDoanhScreen extends React.PureComponent {
  static navigationOptions = {
    title: null,
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      selectedDashboard: true,
      screenheight: Dimensions.get("window").height,
      screenwidth: Dimensions.get("window").width
    };
  }
  componentDidMount() {
    this.getOrientation();
    Dimensions.addEventListener("change", () => {
      const { height, width } = Dimensions.get("window");
      this.setState({ screenheight: height, screenwidth: width });
      this.getOrientation();
    });
  }
  getOrientation = () => {
    if (this.refs.rootView) {
      if (Dimensions.get("window").width < Dimensions.get("window").height) {
        this.setState({ orientation: "portrait" });
      } else {
        this.setState({ orientation: "landscape" });
      }
    }
  };
  _card = el => {
    if (el.page != undefined) {
      var { navigate } = this.props.navigation;
      navigate(el.page);
    } else {
      Alert.alert("Thông báo!", "Chức năng chưa được khởi tạo");
    }
  };
  _selectedDashboard = () => {
    this.setState({ selectedDashboard: true });
  };

  _selectedListView = () => {
    this.setState({ selectedDashboard: false });
  };
  _handlePressLoadPage(value) {
    var { navigate } = this.props.navigation;
    navigate(value);
  }
  render() {
    const width = this.state.screenwidth;
    let varColum = width <= 500 ? 2 : 3;
    const list1 = [
      {
        name: "Điện thương phẩm",
        icon: "show-chart",
        linearGradientColors: ["#4CAF50", "#8BC34A"]
      }
    ];
    const list2 = [
      {
        name: "Theo dõi thu và nợ tiền điện",
        icon: "insert-chart",
        linearGradientColors: ["#FF9800", "#F44336"]
      }
    ];
    const list3 = [
      {
        name: "Doanh thu và giá bán điện",
        icon: "important-devices",
        linearGradientColors: ["#3F51B5", "#2196F3"]
      }
    ];
    const items1 = [
      {
        name: "Theo 5 thành phần phụ tải",
        background: "#3498db",
        icon: "signal",
        color: "red",
        page: "ThanhPhanPhuTai"
      },
      {
        name: "Theo cấp điện áp",
        background: "#ef0202",
        icon: "tasks",
        color: "red",
        page: "TheoCapDienAp"
      },
      {
        name: "Theo thời gian bán điện",
        background: "#efcf02",
        icon: "calendar",
        color: "red",
        page: "TheoThoiGianBanDien"
      },
      {
        name: "Thương phẩm so với kế hoạch giao",
        background: "#efcf02",
        icon: "th-list",
        color: "red",
        page: "ThuongPhamTheoKeHoachGiao"
      },
      {
        name: "Theo nhóm nghành nghề đặc thù",
        background: "#efcf02",
        icon: "list-alt",
        color: "red",
        page: "TheoNhomNghanhNghe"
      },
      { name: "", background: "#efcf02", icon: "unlock", color: "red" }
    ];
    const items2 = [
      {
        name: "Thu tiền điện so với kế hoạch",
        background: "#3498db",
        icon: "paypal",
        color: "red",
        page: "SoVoiKeHoach"
      },
      {
        name: "Khách hàng thanh lý nợ khó đòi",
        background: "#efcf02",
        icon: "th-list",
        color: "red",
        page: "KhachHangThanhLy"
      }
    ];
    if (varColum == 3)
      items2.push(
        "{ name: '', background: '#efcf02', icon: 'unlock', color: 'red', page:'' }"
      );
    const items3 = [
      {
        name: "Giá bán điện bình quân",
        background: "#3498db",
        icon: "life-saver",
        color: "red",
        page: "GiaBanDienBinhQuan"
      },
      {
        name: "KH thuộc đối tượng giám sát",
        background: "#ef0202",
        icon: "flag",
        color: "red",
        page: "KhachHangThuocDoiTuongGS"
      },
      {
        name: "KH khai thác 3 giá theo nhóm NN",
        background: "#ef0202",
        icon: "sitemap",
        color: "red",
        page: "KHKhaiThacBaGiaTheoNN"
      }
    ];
    if (varColum == 2)
      items3.push(
        "{ name: '', background: '#efcf02', icon: 'unlock', color: 'red' }"
      );
    let vDisplay1;
    if (this.state.selectedDashboard) {
      vDisplay1 = (
        <Dashboard
          items={items1}
          background={false}
          card={this._card}
          column={varColum}
          row={3}
        />
      );
    } else {
      vDisplay1 = (
        <View>
          <Touchable
            style={styles.option}
            background={Touchable.Ripple("#ccc", false)}
            onPress={this._handlePressLoadPage.bind(this, "ThanhPhanPhuTai")}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="ios-apps" size={22} />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>Theo 5 thành phần phụ tải</Text>
              </View>
            </View>
          </Touchable>

          <Touchable
            background={Touchable.Ripple("#ccc", false)}
            style={styles.option}
            onPress={this._handlePressLoadPage.bind(this, "TheoCapDienAp")}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="ios-cog" size={22} color="orange" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>Theo cấp điện áp</Text>
              </View>
            </View>
          </Touchable>

          <Touchable
            style={styles.option}
            background={Touchable.Ripple("#ccc", false)}
            onPress={this._handlePressLoadPage.bind(
              this,
              "TheoThoiGianBanDien"
            )}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="ios-help-buoy" size={22} color="brown" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>Theo thời gian bán điện</Text>
              </View>
            </View>
          </Touchable>
          <Touchable
            style={styles.option}
            background={Touchable.Ripple("#ccc", false)}
            onPress={this._handlePressLoadPage.bind(
              this,
              "ThuongPhamTheoKeHoachGiao"
            )}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="ios-paper" size={22} color="blue" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>
                  Thương phẩm so với kế hoạch giao
                </Text>
              </View>
            </View>
          </Touchable>
          <Touchable
            style={styles.option}
            background={Touchable.Ripple("#ccc", false)}
            onPress={this._handlePressLoadPage.bind(this, "TheoNhomNghanhNghe")}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="ios-chatboxes" size={22} color="green" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>
                  Theo nhóm nghành nghề đặc thù
                </Text>
              </View>
            </View>
          </Touchable>
        </View>
      );
    }
    let vDisplay2;
    if (this.state.selectedDashboard) {
      vDisplay2 = (
        <Dashboard
          items={items2}
          background={false}
          card={this._card}
          column={varColum}
          row={3}
        />
      );
    } else {
      vDisplay2 = (
        <View>
          <Touchable
            style={styles.option}
            background={Touchable.Ripple("#ccc", false)}
            onPress={this._handlePressLoadPage.bind(this, "SoVoiKeHoach")}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="ios-apps" size={22} />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>
                  Thu tiền điện so với kế hoạch
                </Text>
              </View>
            </View>
          </Touchable>

          <Touchable
            background={Touchable.Ripple("#ccc", false)}
            style={styles.option}
            onPress={this._handlePressLoadPage.bind(
              this,
              "KhachHangNoTienDien"
            )}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="ios-cog" size={22} color="orange" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>Khách hàng nợ tiền điện</Text>
              </View>
            </View>
          </Touchable>

          <Touchable
            style={styles.option}
            background={Touchable.Ripple("#ccc", false)}
            onPress={this._handlePressLoadPage.bind(this, "KhachHangCatDien")}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="ios-help-buoy" size={22} color="brown" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>Khách hàng cắt điện</Text>
              </View>
            </View>
          </Touchable>
          <Touchable
            style={styles.option}
            background={Touchable.Ripple("#ccc", false)}
            onPress={this._handlePressLoadPage.bind(this, "KhachHangThanhLy")}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="ios-paper" size={22} color="blue" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>
                  Khách hàng thanh lý nợ khó đòi
                </Text>
              </View>
            </View>
          </Touchable>
        </View>
      );
    }
    let vDisplay3;
    if (this.state.selectedDashboard) {
      vDisplay3 = (
        <Dashboard
          items={items3}
          background={false}
          card={this._card}
          column={varColum}
          row={3}
        />
      );
    } else {
      vDisplay3 = (
        <View>
          <Touchable
            style={styles.option}
            background={Touchable.Ripple("#ccc", false)}
            onPress={this._handlePressLoadPage.bind(this, "GiaBanDienBinhQuan")}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="ios-apps" size={22} />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>Giá bán điện bình quân</Text>
              </View>
            </View>
          </Touchable>

          <Touchable
            background={Touchable.Ripple("#ccc", false)}
            style={styles.option}
            onPress={this._handlePressLoadPage.bind(
              this,
              "KhachHangThuocDoiTuongGS"
            )}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="ios-cog" size={22} color="orange" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>
                  KH thuộc đối tượng giám sát
                </Text>
              </View>
            </View>
          </Touchable>

          <Touchable
            style={styles.option}
            background={Touchable.Ripple("#ccc", false)}
            onPress={this._handlePressLoadPage.bind(
              this,
              "KhachHangKhaiThacBaGia"
            )}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="ios-help-buoy" size={22} color="brown" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>
                  KH thuộc đối tượng khai thác 3 giá
                </Text>
              </View>
            </View>
          </Touchable>
          <Touchable
            style={styles.option}
            background={Touchable.Ripple("#ccc", false)}
            onPress={this._handlePressLoadPage.bind(this, "SoLuotKiemTraApGia")}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="ios-paper" size={22} color="blue" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>
                  Số lượt kiểm tra áp giá điện
                </Text>
              </View>
            </View>
          </Touchable>
          <Touchable
            style={styles.option}
            background={Touchable.Ripple("#ccc", false)}
            onPress={this._handlePressLoadPage.bind(this, "KetQuaKiemTraApGia")}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="ios-chatboxes" size={22} color="green" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>
                  Kết quả thực hiển kiểm tra áp giá
                </Text>
              </View>
            </View>
          </Touchable>
          <Touchable
            style={styles.option}
            background={Touchable.Ripple("#ccc", false)}
            onPress={this._handlePressLoadPage.bind(
              this,
              "KHKhaiThacBaGiaTheoNN"
            )}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="logo-buffer" size={22} color="gray" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>
                  KH khai thác 3 giá theo nhóm NN
                </Text>
              </View>
            </View>
          </Touchable>
        </View>
      );
    }
    let iconDashboard = Platform.OS === "ios" ? "ios-apps" : "md-apps";
    let iconListView = Platform.OS === "ios" ? "ios-list" : "md-list";
    return (
      <View style={styles.containerView}>
        <ActionButton style={{ zIndex: 999 }} buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item
            buttonColor="orange"
            title="Display ListView"
            onPress={this._selectedListView}
          >
            <Icon name={iconListView} style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="green"
            title="Display Dashboard"
            onPress={this._selectedDashboard}
          >
            <Icon name={iconDashboard} style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
        <ScrollView style={styles.container}>
          <View style={styles.chartBlock}>
            {list1.map((l, i) => (
              <ListItem
                component={TouchableScale}
                friction={90}
                tension={100}
                activeScale={0.95}
                leftIcon={{
                  name: l.icon,
                  color: "white"
                }}
                key={i}
                linearGradientProps={{
                  colors: l.linearGradientColors,
                  start: [1, 0],
                  end: [0.2, 0]
                }}
                ViewComponent={undefined}
                title={l.name}
                titleStyle={{ color: "white", fontWeight: "bold" }}
                subtitleStyle={{ color: "white" }}
                chevronColor="white"
                chevron
              />
            ))}
            {vDisplay1}
          </View>
          <View style={styles.chartBlock}>
            {list2.map((l, i) => (
              <ListItem
                component={TouchableScale}
                friction={90}
                tension={100}
                activeScale={0.95}
                leftIcon={{
                  name: l.icon,
                  color: "white"
                }}
                key={i}
                linearGradientProps={{
                  colors: l.linearGradientColors,
                  start: [1, 0],
                  end: [0.2, 0]
                }}
                ViewComponent={undefined}
                title={l.name}
                titleStyle={{ color: "white", fontWeight: "bold" }}
                subtitleStyle={{ color: "white" }}
                chevronColor="white"
                chevron
              />
            ))}
            {vDisplay2}
          </View>
          <View style={styles.chartBlock}>
            {list3.map((l, i) => (
              <ListItem
                component={TouchableScale}
                friction={90}
                tension={100}
                activeScale={0.95}
                leftIcon={{
                  name: l.icon,
                  color: "white"
                }}
                key={i}
                linearGradientProps={{
                  colors: l.linearGradientColors,
                  start: [1, 0],
                  end: [0.2, 0]
                }}
                ViewComponent={undefined}
                title={l.name}
                titleStyle={{ color: "white", fontWeight: "bold" }}
                subtitleStyle={{ color: "white" }}
                chevronColor="white"
                chevron
              />
            ))}
            {vDisplay3}
          </View>
        </ScrollView>
        {/* <View style={styles.wrapper}>
        
          <View style={styles.back}></View>
          <View style={styles.front}></View>
        </View>*/}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: "#ecf0f1"
  },
  containerView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F5FCFF"
  },
  optionsTitleText: {
    fontSize: 16,
    marginLeft: 15,
    marginTop: 9,
    marginBottom: 12
  },
  optionsTitlebackground: {
    backgroundColor: "#FF9800",
    paddingTop: 15,
    marginTop: 9
  },
  optionsTitlebackground2: {
    backgroundColor: "#FFD600",
    paddingTop: 15,
    marginTop: 9
  },
  optionsTitlebackground3: {
    backgroundColor: "#4CAF50",
    paddingTop: 15,
    marginTop: 9
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
  },
  chartBlock: {
    justifyContent: "center",
    marginBottom: -8
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white"
  },
  wrapper: {
    flex: 1
  },
  back: {
    width: 1000,
    height: 1000,
    backgroundColor: "blue",
    zIndex: 0
  },
  front: {
    position: "absolute",
    top: 25,
    left: 25,
    width: 500,
    height: 500,
    backgroundColor: "red",
    zIndex: 1
  }
});
