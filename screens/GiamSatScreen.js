import _ from "lodash";
import React from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Platform,
  ListView,
  StatusBar,
  Dimensions,
  Alert
} from "react-native";
import { ListItem } from "./ListItem";
import TouchableScale from "react-native-touchable-scale";
import Dashboard from "react-native-dashboard";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";
import Touchable from "react-native-platform-touchable";
import { Ionicons } from "@expo/vector-icons";

const list1 = [
  {
    name: "Biểu đồ thực hiện công tác kiểm tra",
    icon: "insert-chart",
    subtitle: "Tháng, lũy kế",
    linearGradientColors: ["#4CAF50", "#8BC34A"]
  }
];
const list2 = [
  {
    name: "Biểu đồ thực hiện phòng tránh VPPL",
    icon: "insert-chart",
    // subtitle: "Tháng, lũy kế",
    linearGradientColors: ["#FFD600", "#FF9800"]
  }
];
const list3 = [
  {
    name: "Tình hình khai thác CSPK",
    icon: "insert-chart",
    //subtitle: "Tháng, lũy kế",
    linearGradientColors: ["#3F51B5", "#2196F3"]
  }
];
const list4 = [
  {
    name: "Biểu đồ kết quả giám sát HTĐĐ",
    icon: "insert-chart",
    // subtitle: "Tháng, lũy kế",
    linearGradientColors: ["#FF9800", "#F44336"]
  }
];
const list5 = [
  {
    name: "Biểu đồ khai thác hiệu suất trạm CC",
    icon: "insert-chart",
    //subtitle: "Tháng, lũy kế",
    linearGradientColors: ["#FD9800", "#8BC34A"]
  }
];
const list6 = [
  {
    name: "Biểu đồ tiết kiệm điện",
    icon: "insert-chart",
    // subtitle: "Tháng, lũy kế",
    linearGradientColors: ["#2196F3", "#3F51B5"]
  }
];
export default class GiamSatScreen extends React.PureComponent {
  static navigationOptions = {
    // title: null,
    header: null
  };
  constructor() {
    super();
    this.updateIndex = this.updateIndex.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.state = {
      orientation: "",
      screenheight: Dimensions.get("window").height,
      screenwidth: Dimensions.get("window").width,
      selectedDashboard: true
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
  updateIndex(selectedIndex) {
    this.setState({ selectedIndex });
  }

  renderRow(rowData, sectionID) {
    return (
      <ListItem
        key={sectionID}
        onPress={log}
        title={rowData.title}
        leftIcon={{ name: rowData.icon }}
        chevron
        bottomDivider
      />
    );
  }
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
  _handlePressChuyenTrang = name => {
    var { navigate } = this.props.navigation;
    navigate(name);
  };
  _handlePressLoadPage(value) {
    var { navigate } = this.props.navigation;
    navigate(value);
  }
  render() {
    const width = this.state.screenwidth;
    let varColum = width <= 500 ? 2 : 3;
    const items1 = [
      {
        name: "Kiểm tra HTĐĐ",
        background: "#3498db",
        icon: "user",
        color: "red",
        page: "KiemTraHTDD"
      },
      {
        name: "Kiểm tra áp giá",
        background: "#ef0202",
        icon: "edit",
        color: "red",
        page: "KetQuaKiemTraApGia"
      },
      {
        name: "Số lượng kiểm tra viên",
        background: "#efcf02",
        icon: "linux",
        color: "red",
        page: "KiemTraVien"
      }
    ];
    if (varColum == 2)
      items1.push(
        "{ name: '', background: '#efcf02', icon: 'unlock', color: 'red' }"
      );
    const items2 = [
      {
        name: "TBĐĐ quá hạn",
        background: "#3498db",
        icon: "gears",
        color: "red",
        page: "TBDDChuaThayThe"
      },
      {
        name: "HĐMBĐ quá hạn",
        background: "#ef0202",
        icon: "file-text-o",
        color: "red",
        page: "HDMBDChuaRaSoat"
      },
      {
        name: "Kiểm tra xử lý VPSDĐ",
        background: "#ef0202",
        icon: "balance-scale",
        color: "red",
        page: "KiemTraXuLyVPSDD"
      } /*,
      {
        name: "TBĐĐ đã thực hiện thay thế",
        background: "#efcf02",
        icon: "th",
        color: "red",
        page: "TBDDDaThayThe"
      },
      {
        name: "HĐMBĐ đã rà soát ký lại",
        background: "#efcf02",
        icon: "th-list",
        color: "red",
        page: "HDMBDDaRaSoat"
      },
      { name: "", background: "#efcf02", icon: "unlock", color: "red" },
      { name: "", background: "#efcf02", icon: "unlock", color: "red" }*/
    ];
    if (varColum == 2)
      items2.push(
        "{ name: '', background: '#efcf02', icon: 'unlock', color: 'red' }"
      );
    const items3 = [
      {
        name: "Kết quả bán CSPK",
        background: "#3498db",
        icon: "wpforms",
        color: "red",
        page: "KetQuaBanCSPK"
      },
      {
        name: "Chưa khai thác CSPK",
        background: "#3498db",
        icon: "flag",
        color: "red",
        page: "CanhBaoCanRaSoat"
      }
      //,{ name: "", background: "#efcf02", icon: "unlock", color: "red" }
    ];
    if (varColum == 3) {
      items3.push(
        "{ name: ' ', background: '#efcf02', icon: 'unlock', color: 'red' }"
      );
    }
    const items4 = [
      {
        name: "HTTĐĐ chưa niêm chì",
        background: "#3498db",
        icon: "pencil-square-o",
        color: "red",
        page: "KetQuaCapNhatChiNiem"
      },
      {
        name: "Công tơ quá tải",
        background: "#ef0202",
        icon: "bar-chart-o",
        color: "red",
        page: "KetQuaThayTheCongToQuaTai"
      },
      {
        name: "TBĐĐ được thay thế",
        background: "#efcf02",
        icon: "gears",
        color: "red",
        page: "KetQuaThayTheTBDD"
      },
      {
        name: "TBĐĐ cháy hỏng",
        background: "#efcf02",
        icon: "tasks",
        color: "red",
        page: "TBDDChayHong"
      }
    ];
    if (varColum == 3) {
      items4.push(
        "{ name: ' ', background: '#efcf02', icon: 'unlock', color: 'red' }"
      );
      items4.push(
        "{ name: ' ', background: '#efcf02', icon: 'unlock', color: 'red' }"
      );
    }
    const items5 = [
      {
        name: "Kết quả khai thác hiệu suất TBACC",
        background: "#3498db",
        icon: "tasks",
        color: "red",
        page: "KetQuaThayTheTBA"
      },
      {
        name: "Báo cáo tỷ lệ tổn thất điện năng",
        background: "#ef0202",
        icon: "file-text-o",
        color: "red",
        page: "TyLeTonThatDienNang"
      },
      {
        name: "Kết quả theo lộ trình giảm TTĐN",
        background: "#efcf02",
        icon: "windows",
        color: "red",
        page: "KetQuaTheoLoTrinhGiamTonThat"
      }
    ];
    if (varColum == 2)
      items5.push(
        "{ name: ' ', background: '#efcf02', icon: 'unlock', color: 'red' }"
      );
    const items6 = [
      {
        name: "Theo điện thương phẩm",
        background: "#3498db",
        icon: "truck",
        color: "red",
        page: "TheoDienThuongPham"
      },
      {
        name: "Sử dụng điện tiết kiệm",
        background: "#ef0202",
        icon: "money",
        color: "red",
        page: "SuDungDienTietKiem"
      }
      // ,{ name: "", background: "#efcf02", icon: "unlock", color: "red" }
    ];
    if (varColum == 3)
      items6.push(
        "{ name: '', background: '#efcf02', icon: 'unlock', color: 'red' }"
      );
    let iconDashboard = Platform.OS === "ios" ? "ios-apps" : "md-apps";
    let iconListView = Platform.OS === "ios" ? "ios-list" : "md-list";
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
            onPress={this._handlePressLoadPage.bind(this, "KiemTraHTDD")}
          >
            <View style={{ flexDirection: "row", marginLeft: -100 }}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="ios-apps" size={22} />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>Kiểm tra HTĐĐ</Text>
              </View>
            </View>
          </Touchable>

          <Touchable
            background={Touchable.Ripple("#ccc", false)}
            style={styles.option}
            onPress={this._handlePressLoadPage.bind(this, "KetQuaKiemTraApGia")}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="ios-cog" size={22} color="orange" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>Kiểm tra áp giá</Text>
              </View>
            </View>
          </Touchable>

          <Touchable
            style={styles.option}
            background={Touchable.Ripple("#ccc", false)}
            onPress={this._handlePressLoadPage.bind(this, "KiemTraVien")}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="ios-help-buoy" size={22} color="brown" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>Số lượng kiểm tra viên</Text>
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
            onPress={this._handlePressLoadPage.bind(this, "TBDDChuaThayThe")}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="ios-apps" size={22} />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>TBĐĐ quá hạn</Text>
              </View>
            </View>
          </Touchable>

          <Touchable
            background={Touchable.Ripple("#ccc", false)}
            style={styles.option}
            onPress={this._handlePressLoadPage.bind(this, "HDMBDChuaRaSoat")}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="ios-cog" size={22} color="orange" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>HĐMBĐ quá hạn</Text>
              </View>
            </View>
          </Touchable>

          <Touchable
            style={styles.option}
            background={Touchable.Ripple("#ccc", false)}
            onPress={this._handlePressLoadPage.bind(this, "KiemTraXuLyVPSDD")}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="ios-help-buoy" size={22} color="brown" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>Kiểm tra xử lý VPSDĐ</Text>
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
            onPress={this._handlePressLoadPage.bind(this, "KetQuaBanCSPK")}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="ios-apps" size={22} />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>Kết quả bán CSPK</Text>
              </View>
            </View>
          </Touchable>
          <Touchable
            background={Touchable.Ripple("#ccc", false)}
            style={styles.option}
            onPress={this._handlePressLoadPage.bind(this, "CanhBaoCanRaSoat")}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="ios-cog" size={22} color="orange" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>Chưa khai thác CSPK</Text>
              </View>
            </View>
          </Touchable>
        </View>
      );
    }
    let vDisplay4;
    if (this.state.selectedDashboard) {
      vDisplay4 = (
        <Dashboard
          items={items4}
          background={false}
          card={this._card}
          column={varColum}
          row={3}
        />
      );
    } else {
      vDisplay4 = (
        <View>
          <Touchable
            style={styles.option}
            background={Touchable.Ripple("#ccc", false)}
            onPress={this._handlePressLoadPage.bind(
              this,
              "KetQuaCapNhatChiNiem"
            )}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="ios-apps" size={22} />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>HTTĐĐ chưa niêm chì</Text>
              </View>
            </View>
          </Touchable>

          <Touchable
            background={Touchable.Ripple("#ccc", false)}
            style={styles.option}
            onPress={this._handlePressLoadPage.bind(
              this,
              "KetQuaThayTheCongToQuaTai"
            )}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="ios-cog" size={22} color="orange" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>Công tơ quá tải</Text>
              </View>
            </View>
          </Touchable>
          <Touchable
            style={styles.option}
            background={Touchable.Ripple("#ccc", false)}
            onPress={this._handlePressLoadPage.bind(this, "KetQuaThayTheTBDD")}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="ios-paper" size={22} color="blue" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>TBĐĐ được thay thế</Text>
              </View>
            </View>
          </Touchable>
          <Touchable
            style={styles.option}
            background={Touchable.Ripple("#ccc", false)}
            onPress={this._handlePressLoadPage.bind(this, "TBDDChayHong")}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="ios-chatboxes" size={22} color="green" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>TBĐĐ cháy hỏng</Text>
              </View>
            </View>
          </Touchable>
        </View>
      );
    }
    let vDisplay5;
    if (this.state.selectedDashboard) {
      vDisplay5 = (
        <Dashboard
          items={items5}
          background={false}
          card={this._card}
          column={varColum}
          row={3}
        />
      );
    } else {
      vDisplay5 = (
        <View>
          <Touchable
            style={styles.option}
            background={Touchable.Ripple("#ccc", false)}
            onPress={this._handlePressLoadPage.bind(this, "KetQuaThayTheTBA")}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="ios-apps" size={22} />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>
                  Kết quả khai thác hiệu suất TBACC
                </Text>
              </View>
            </View>
          </Touchable>

          <Touchable
            background={Touchable.Ripple("#ccc", false)}
            style={styles.option}
            onPress={this._handlePressLoadPage.bind(
              this,
              "TyLeTonThatDienNang"
            )}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="ios-cog" size={22} color="orange" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>
                  Báo cáo tỷ lệ tổn thất điện năng
                </Text>
              </View>
            </View>
          </Touchable>

          <Touchable
            style={styles.option}
            background={Touchable.Ripple("#ccc", false)}
            onPress={this._handlePressLoadPage.bind(
              this,
              "KetQuaTheoLoTrinhGiamTonThat"
            )}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="ios-help-buoy" size={22} color="brown" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>
                  Kết quả theo lộ trình giảm TTĐN
                </Text>
              </View>
            </View>
          </Touchable>
        </View>
      );
    }
    let vDisplay6;
    if (this.state.selectedDashboard) {
      vDisplay6 = (
        <Dashboard
          items={items6}
          background={false}
          card={this._card}
          column={varColum}
          row={3}
        />
      );
    } else {
      vDisplay6 = (
        <View>
          <Touchable
            style={styles.option}
            background={Touchable.Ripple("#ccc", false)}
            onPress={this._handlePressLoadPage.bind(this, "TheoDienThuongPham")}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="ios-apps" size={22} />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>Theo điện thương phẩm</Text>
              </View>
            </View>
          </Touchable>

          <Touchable
            background={Touchable.Ripple("#ccc", false)}
            style={styles.option}
            onPress={this._handlePressLoadPage.bind(this, "SuDungDienTietKiem")}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="ios-cog" size={22} color="orange" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>Sử dụng điện tiết kiệm</Text>
              </View>
            </View>
          </Touchable>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        {Platform.OS === "ios" && <StatusBar barStyle="default" />}
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
        <ScrollView>
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
                subtitle={l.subtitle}
                chevronColor="white"
                chevron
                containerStyle={{
                  marginHorizontal: 2,
                  marginVertical: 2,
                  borderRadius: 8
                }}
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
                subtitle={l.subtitle}
                chevronColor="white"
                chevron
                containerStyle={{
                  marginHorizontal: 2,
                  marginVertical: 2,
                  borderRadius: 8
                }}
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
                subtitle={l.subtitle}
                chevronColor="white"
                chevron
                containerStyle={{
                  marginHorizontal: 2,
                  marginVertical: 2,
                  borderRadius: 8
                }}
              />
            ))}
            {vDisplay3}
          </View>
          <View style={styles.chartBlock}>
            {list4.map((l, i) => (
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
                subtitle={l.subtitle}
                chevronColor="white"
                chevron
                containerStyle={{
                  marginHorizontal: 2,
                  marginVertical: 2,
                  borderRadius: 8
                }}
              />
            ))}
            <View style={styles.chartBlock}>{vDisplay4}</View>
          </View>
          <View style={styles.chartBlock}>
            {list5.map((l, i) => (
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
                subtitle={l.subtitle}
                chevronColor="white"
                chevron
                containerStyle={{
                  marginHorizontal: 2,
                  marginVertical: 2,
                  borderRadius: 8
                }}
              />
            ))}
            {vDisplay5}
          </View>
          <View style={styles.chartBlock}>
            {list6.map((l, i) => (
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
                subtitle={l.subtitle}
                chevronColor="white"
                chevron
                containerStyle={{
                  marginHorizontal: 2,
                  marginVertical: 2,
                  borderRadius: 8
                }}
              />
            ))}
            {vDisplay6}
          </View>
        </ScrollView>
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
  }
});
