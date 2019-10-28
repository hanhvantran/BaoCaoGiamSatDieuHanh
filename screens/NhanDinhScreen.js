import _ from "lodash";
import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Alert,
  Platform,
  StatusBar
} from "react-native";
import Dashboard from "react-native-dashboard";
export default class NhanDinhScreen extends React.PureComponent {
  static navigationOptions = {
    // title: null,
    header: null
  };

  constructor() {
    super();
    this.state = {
      orientation: "",
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
  render() {
    const items1 = [
      {
        name: "Kinh Doanh",
        background: "#3498db",
        icon: "line-chart",
        color: "red",
        page: "NhanDinhKinhDoanhScreen"
      },
      {
        name: "Giám Sát",
        background: "#ef0202",
        icon: "camera",
        color: "red",
        page: "NhanDinhGiamSatScreen"
      },
      {
        name: "Trạm Công Cộng",
        background: "#efcf02",
        icon: "modx",
        color: "red",
        page: "NhanDinhTramCongCongScreen"
      },
      {
        name: "Tiết Kiệm Điện",
        background: "#efcf02",
        icon: "money",
        color: "red",
        page: "NhanDinhTietKiemDienScreen"
      },
      {
        name: "Đo Đếm",
        background: "#efcf02",
        icon: "flask",
        color: "red",
        page: "NhanDinhDoDoemScreen"
      },
      {
        name: "Thông Báo",
        background: "#efcf02",
        icon: "bell",
        color: "red",
        page: "NhanDinhThongBaoScreen"
      }
    ];
    return (
      <View
        style={
          this.state.screenheight > this.state.screenwidth
            ? styles.container
            : styles.container2
        }
      >
        {Platform.OS === "ios" && <StatusBar barStyle="default" />}
        <View style={styles.chartBlock}>
          <Dashboard
            items={items1}
            card={this._card}
            column={2}
            row={3}
            color="red"
            type="true"
            size={60}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
    paddingTop: 30
  },
  container2: {
    flex: 1,
    backgroundColor: "#ecf0f1",
    paddingTop: 0
  },
  chartBlock: {
    flex: 1,
    justifyContent: "center"
  }
});
