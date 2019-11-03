import React from "react";
import {
  StyleSheet,
  Text,
  Alert,
  View,
  AsyncStorage,
  ScrollView,
  StatusBar,
  Dimensions
} from "react-native";
import ModalSelector from "react-native-modal-selector";
import urlBaoCao from "../../../networking/services";
//import { getTenDonVi } from "../../../data/dmdonvi";

import ChartView from "react-native-highcharts";
import Spinner from "react-native-loading-spinner-overlay";

export default class KiemTraVienScreen extends React.PureComponent {
  static navigationOptions = {
    title: "Kiểm tra viên"
  };
  constructor(props) {
    super(props);
    this.state = {
      FULLNAME: "",
      MA_DVICTREN: "",
      MA_DVIQLY: "",
      TEN_DVIQLY: "",
      TEN_DVIQLY2: "",
      USERID: 0,
      USERNAME: "",
      CAP_DVI: "",
      SelectedDonVi: "",
      listDonVi: [],
      listDaTa: [],
      orientation: "",
      screenheight: Dimensions.get("window").height,
      screenwidth: Dimensions.get("window").width,
      spinner: false
    };
  }
  _bootstrapAsync = async () => {
    try {
      AsyncStorage.getItem("UserInfomation").then(user_data_json => {
        let userData = JSON.parse(user_data_json);
        if (userData == undefined) {
          var { navigate } = this.props.navigation;
          navigate("LoginScreen");
        } else {
          this.setState({
            FULLNAME: userData.fullname,
            MA_DVICTREN: userData.mA_DVICTREN,
            MA_DVIQLY: userData.mA_DVIQLY,
            TEN_DVIQLY: userData.mA_DVIQLY + " - " + userData.teN_DVIQLY,
            TEN_DVIQLY2: userData.teN_DVIQLY2,
            USERID: userData.userid,
            USERNAME: userData.username,
            CAP_DVI: userData.caP_DVI,
            SelectedDonVi: userData.mA_DVIQLY,
            spinner: false
          });

          this.get_Info_Dvi_ChaCon(userData.mA_DVIQLY, userData.caP_DVI);
          this.callMultiAPI(userData.mA_DVIQLY);
        }
      });
    } catch (error) {
      Alert.alert("AsyncStorage error", error.message);
    }
  };

  componentDidMount() {
    this._bootstrapAsync();
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
  get_Info_Dvi_ChaCon = (Donvi, CapDonVi) => {
    let capDonVi = Donvi == "PB" ? 0 : CapDonVi == 2 ? 4 : 3;
    return fetch(
      urlBaoCao.get_Info_Dvi_ChaCon +
        "?MaDonVi=" +
        Donvi +
        "&CapDonVi=" +
        capDonVi +
        ""
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson && responseJson.length > 0) {
          this.setState(
            {
              listDonVi: responseJson
            },
            function() {
              // In this block you can do something with new state.
            }
          );
        } else {
          this.setState({ spinner: false });
          Alert.alert("Thông báo", "Không có dữ liệu!");
        }
      })
      .catch(error => {
        this.setState({ spinner: false });
        Alert.alert("Lỗi kết nối!", error.toString());
      });
  };

  callMultiAPI = async vMaDonVi => {
    this.setState({
      spinner: true
    });
    let param1 = "?MaDonVi=" + vMaDonVi;

    const urls = [urlBaoCao.GET_SoLuongKiemTraVien + param1];
    Promise.all(
      urls.map(url =>
        fetch(url)
          .then(this.checkStatus)
          .then(this.parseJSON)
          .catch(error => {
            this.setState({ spinner: false });
            Alert.alert("Loi: " + url.replace(urlBaoCao.IP, ""), error.message);
          })
      )
    ).then(data => {
      this.setState({
        spinner: false,
        SelectedDonVi: vMaDonVi,
        listDaTa: data[0]
      });
    });
  };
  checkStatus(response) {
    if (response.ok) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }

  parseJSON(response) {
    return response.json();
  }
  renderTabBar() {
    return <StatusBar hidden />;
  }
  onChangedDonVi(itemValue) {
    this.callMultiAPI(itemValue.key);
  }
  render() {
    const width = this.state.screenwidth;
    const options = {
      global: {
        useUTC: false
      },
      lang: {
        thousandsSep: ".",
        numericSymbols: [" N", " Tr", " Tỉ", " 1000Tỉ", " Triệu tỉ", " Tỉ tỉ"]
      }
      // lang: {
      //   decimalPoint: ",",
      //   thousandsSep: "."
      // },
    };
    let vTong = 0;
    if (
      this.state.listDaTa &&
      !Array.isArray(this.state.listDaTa) &&
      this.state.listDaTa.Series != null
    ) {
      for (let i = 0; i < this.state.listDaTa.Series[0].data.length; i++) {
        vTong = vTong + this.state.listDaTa.Series[0].data[i];
      }
    }
    var conf2 = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "Số lượng kiểm tra viên"
      },
      yAxis: {
        title: {
          text: "Người"
        }
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories:
          this.state.listDaTa && !Array.isArray(this.state.listDaTa)
            ? this.state.listDaTa.Categories
            : []
      },
      series: [
        {
          name: "Số lượng kiểm tra viên " + " - Tổng: " + vTong.toString(),
          data:
            this.state.listDaTa && !Array.isArray(this.state.listDaTa)
              ? this.state.listDaTa.Series[0].data
              : []
        }
      ],
      plotOptions: {
        column: {
          dataLabels: {
            format: "{point.y:,.0f} ",
            enabled: true
          }
        }
      },
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500
            }
          }
        ]
      }
    };
    let listDonViQuanLy = [];
    {
      this.state.listDonVi.map((item, key) =>
        listDonViQuanLy.push({
          key: item.mA_DVIQLY,
          label: item.teN_DVIQLY,
          value: item.mA_DVIQLY
        })
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <Spinner
          visible={this.state.spinner}
          textContent={"Đang lấy dữ liệu..."}
          textStyle={styles.spinnerTextStyle}
        />
        <View style={styles.filter}>
          <Text>Đơn vị:</Text>
          <ModalSelector
            data={listDonViQuanLy}
            style={{ width: 170, marginTop: -5 }}
            initValue={this.state.TEN_DVIQLY2}
            onChange={option => {
              this.onChangedDonVi(option);
            }}
            //  alert(`${option.label} (${option.key}) nom nom nom`);
          />
        </View>
        <View style={styles.chart}>
          <ScrollView
            key={Math.random()}
            style={{
              backgroundColor: "white"
            }}
          >
            <View>
              <ChartView
                style={{ height: 500, width: width }}
                config={conf2}
                options={options}
                originWhitelist={[""]}
                javaScriptEnabled={true}
                domStorageEnabled={true}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  },
  filter: {
    height: 60,
    paddingTop: 10,
    paddingLeft: 5,
    paddingBottom: 10,
    backgroundColor: "#fff",
    flexDirection: "row"
  },
  chart: {
    flex: 1,
    backgroundColor: "white"
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  }
});
