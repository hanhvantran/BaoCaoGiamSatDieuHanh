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
import ChartView from "react-native-highcharts";
//import { getListTenDonVi, getTenDonVi } from "../../../data/dmdonvi";

import Spinner from "react-native-loading-spinner-overlay";
import { Card } from "react-native-elements";
export default class KetQuaBanCSPKScreen extends React.PureComponent {
  static navigationOptions = {
    title: "Kết quả bán CSPK"
  };
  _isMounted = false;
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
      SelectedDate:
        new Date().getMonth() + 1 <= 9
          ? "0" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear()
          : new Date().getMonth() + 1 + "/" + new Date().getFullYear(),
      listDonVi: [],
      listDaTa: [],
      listDate: [],
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
          if (this._isMounted) {
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
            this.callMultiAPI(this.state.SelectedDate, userData.mA_DVIQLY);
          }
        }
      });
    } catch (error) {
      Alert.alert("AsyncStorage error", error.message);
    }
  };
  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidMount() {
    _isMounted = true;
    this._bootstrapAsync();
    this.getOrientation();
    Dimensions.addEventListener("change", () => {
      const { height, width } = Dimensions.get("window");
      // this._isMounted &&
      if (this._isMounted) {
        this.setState({ screenheight: height, screenwidth: width });
      }
      this.getOrientation();
    });
    this.initListDate();
  }
  getOrientation = () => {
    if (this.refs.rootView) {
      if (Dimensions.get("window").width < Dimensions.get("window").height) {
        if (this._isMounted) {
          this.setState({ orientation: "portrait" });
        }
      } else {
        if (this._isMounted) {
          this.setState({ orientation: "landscape" });
        }
      }
    }
  };
  initListDate() {
    var arrayData = [];
    var year = new Date().getFullYear();
    var intitYear = year - 2;
    for (var i = intitYear; i <= year; i++) {
      for (var j = 1; j <= 12; j++) {
        var x = j <= 9 ? "0" + j + "/" + i : j + "/" + i;
        arrayData.push({ VALUE: x });
      }
    }
    return arrayData;
  }
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
          if (this._isMounted) {
            this.setState(
              {
                listDonVi: responseJson,
                listDate: this.initListDate()
              },
              function() {
                // In this block you can do something with new state.
              }
            );
          }
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
  callMultiAPI = async (vThangNam, vMaDonVi) => {
    this.setState({
      spinner: true
    });
    let Thang = vThangNam.split("/")[0];
    let Nam = vThangNam.split("/")[1];
    let param1 =
      "?MaDonVi=" + vMaDonVi + "&THANG=" + Thang + "&NAM=" + Nam + "";

    const urls = [urlBaoCao.sp_KetQuaBanCSPK + param1];
    //Alert.alert("Loi: " + urls);
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
        SelectedDate: vThangNam,
        listDaTa: data[0]
      });
    });
  };

  renderTabBar() {
    return <StatusBar hidden />;
  }
  onChangedDonVi(itemValue) {
    this.callMultiAPI(this.state.SelectedDate, itemValue.key);
  }
  onChangedDate(itemValue) {
    this.callMultiAPI(itemValue.key, this.state.SelectedDonVi);
    //this.setState({ SelectedDate: itemValue });
  }
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  numberWithCommasDecimal(x) {
    return x.toString().replace(".", ",");
  }
  render() {
    let list1 = [];
    let list2 = [];
    let list3 = [];
    let list4 = [];
    let PPhatTrienMoi = 0;
    let PSoLuong = 0;
    let PSoHoaDonVC = 0;
    let PTongTien = 0;
    if (
      this.state.listDaTa &&
      !Array.isArray(this.state.listDaTa) &&
      this.state.listDaTa.Series != null
    ) {
      for (let i = 0; i < this.state.listDaTa.Series[0].data.length; i++) {
        PSoLuong = PSoLuong + this.state.listDaTa.Series[0].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[6].data.length; i++) {
        PSoHoaDonVC = PSoHoaDonVC + this.state.listDaTa.Series[6].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[2].data.length; i++) {
        PTongTien = PTongTien + this.state.listDaTa.Series[2].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[3].data.length; i++) {
        PPhatTrienMoi = PPhatTrienMoi + this.state.listDaTa.Series[3].data[i];
      }
      list1.push(this.state.listDaTa.Series[0]);
      list2.push(this.state.listDaTa.Series[6]);
      list3.push(this.state.listDaTa.Series[2]);
      list4.push(this.state.listDaTa.Series[3]);
    }
    const width = this.state.screenwidth;
    const height = this.state.screenheight - 250;
    var conf1 = {
      chart: {
        type: "line",
        zoomType: "xy"
      },
      title: {
        text: "Khách hàng ký mua CSPK trong tháng"
      },
      yAxis: {
        title: {
          text: "Số lượng"
        }
      },
      plotOptions: {
        line: {
          dataLabels: {
            format: "{point.y:,.0f} ",
            enabled: true
          },
          colorByPoint: true
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
      series: list4,
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 200
            }
          }
        ]
      }
    };
    var conf2 = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "Số lượng khách hàng ký mua CSPK"
      },
      yAxis: {
        title: {
          text: "Số lượng"
        }
      },
      plotOptions: {
        column: {
          dataLabels: {
            format: "{point.y:,.0f} ",
            enabled: true
          }
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
      series: list1,
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 300
            }
          }
        ]
      }
    };
    var conf3 = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "Số hoá đơn VC trong tháng " + this.state.SelectedDate
      },
      yAxis: {
        title: {
          text: "Hoá đơn"
        }
      },
      plotOptions: {
        column: {
          dataLabels: {
            format: "{point.y:,.0f} ",
            enabled: true
          }
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
      series: list2,
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 300
            }
          }
        ]
      }
    };
    var conf4 = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "Doanh thu CSPK"
      },
      yAxis: {
        title: {
          text: "VNĐ"
        }
      },
      plotOptions: {
        column: {
          dataLabels: {
            format: "{point.y:,.0f} ",
            enabled: true
          }
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
      series: list3,
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 300
            }
          }
        ]
      }
    };
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
    let listThangNam = [];
    {
      this.state.listDate.map((item, key) =>
        listThangNam.push({
          key: item.VALUE,
          label: item.VALUE,
          value: item.VALUE
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
            style={{ width: 150, marginTop: -5 }}
            initValue={this.state.TEN_DVIQLY2}
            onChange={option => {
              this.onChangedDonVi(option);
            }}
            //  alert(`${option.label} (${option.key}) nom nom nom`);
          />
          <Text style={{ paddingLeft: 10 }}>Tháng/Năm:</Text>
          <ModalSelector
            data={listThangNam}
            style={{ width: 90, marginTop: -5 }}
            initValue={this.state.SelectedDate}
            onChange={option => {
              this.onChangedDate(option);
            }}
            //  alert(`${option.label} (${option.key}) nom nom nom`);
          />
        </View>
        <View style={styles.chart}>
          <Card title="TỔNG" style={{ marginTop: -50 }}>
            <View>
              <Text style={{ marginBottom: 10 }}>
                Phát triển mới: {this.numberWithCommas(PPhatTrienMoi)} khách
                hàng
              </Text>
              <Text style={{ marginBottom: 10 }}>
                Khách hàng ký mua cspk: {this.numberWithCommas(PSoLuong)} khách
                hàng
              </Text>
              <Text style={{ marginBottom: 10 }}>
                Số hoá đơn VC trong tháng: {this.numberWithCommas(PSoHoaDonVC)}
              </Text>
              <Text style={{ marginBottom: 10 }}>
                Tổng tiền: {this.numberWithCommas(PTongTien)} VNĐ
              </Text>
            </View>
          </Card>
          <ScrollView
            key={Math.random()}
            style={{
              backgroundColor: "white"
            }}
          >
            <ChartView
              style={{ height: 300 }}
              config={conf1}
              options={options}
              originWhitelist={[""]}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
            <View style={{ backgroundColor: "orange", height: 1 }} />
            <ChartView
              style={{ height: 300 }}
              config={conf2}
              options={options}
              originWhitelist={[""]}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
            <View style={{ backgroundColor: "orange", height: 1 }} />
            <ChartView
              style={{ height: 300 }}
              config={conf3}
              options={options}
              originWhitelist={[""]}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
            <View style={{ backgroundColor: "orange", height: 1 }} />
            <ChartView
              style={{ height: 500 }}
              config={conf4}
              options={options}
              originWhitelist={[""]}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
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
