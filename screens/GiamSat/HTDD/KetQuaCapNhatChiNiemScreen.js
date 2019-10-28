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
export default class KetQuaCapNhatChiNiemScreen extends React.PureComponent {
  static navigationOptions = {
    title: "HTĐĐ chưa niêm chì"
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
          this.callMultiAPI(this.state.SelectedDate, this.state.SelectedDonVi);
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
      //this._isMounted &&
      this.setState({ screenheight: height, screenwidth: width });
      this.getOrientation();
    });
    this.initListDate();
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
  initListDate() {
    var arrayData = [];
    var year = new Date().getFullYear();
    var intitYear = year;
    for (var i = intitYear; i > year - 3; i--) {
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
          this.setState(
            {
              listDonVi: responseJson,
              listDate: this.initListDate()
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
  callMultiAPI = (THANGNAM, DONVI) => {
    this.setState({
      spinner: true
    });
    let url =
      urlBaoCao.sp_ThongKeChiNiem +
      "?MaDonVi=" +
      DONVI +
      "&THANG=" +
      THANGNAM.split("/")[0] +
      "&NAM=" +
      THANGNAM.split("/")[1] +
      "";
    return fetch(url)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson && !Array.isArray(responseJson)) {
          this.setState({
            listDaTa: responseJson,
            SelectedDate: THANGNAM,
            SelectedDonVi: DONVI,
            spinner: false
          });
        } else {
          this.setState({ spinner: false });
          Alert.alert("Thông báo", "Không có dữ liệu!");
        }
      })
      .catch(error => {
        this.setState({
          spinner: false
        });
        Alert.alert("Lỗi kết nối!", error.toString());
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
    let PSLThang = 0;
    let PSLHTDD = 0;
    let PSLThangTruoc = 0;
    let PTiLe = 0;
    if (
      this.state.listDaTa &&
      !Array.isArray(this.state.listDaTa) &&
      this.state.listDaTa.Series != null
    ) {
      for (let i = 0; i < this.state.listDaTa.Series[0].data.length; i++) {
        PSLThang = PSLThang + this.state.listDaTa.Series[0].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[1].data.length; i++) {
        PSLHTDD = PSLHTDD + this.state.listDaTa.Series[1].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[3].data.length; i++) {
        PSLThangTruoc = PSLThangTruoc + this.state.listDaTa.Series[3].data[i];
      }
      PTiLe = Number(
        PSLHTDD == 0 ? 0 : ((PSLThang * 100) / PSLHTDD).toFixed(2)
      );
      list1.push(this.state.listDaTa.Series[0]);
      list1.push(this.state.listDaTa.Series[3]);
      list1.push(this.state.listDaTa.Series[4]);
      list2.push(this.state.listDaTa.Series[1]);
    }
    const width = this.state.screenwidth;
    const height = this.state.screenheight - 250;
    var conf1 = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "Số lượng HTĐĐ chưa niêm chì"
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
              maxWidth: 500
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
        text: "Số lượng HTĐĐ"
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
    const options = {
      global: {
        useUTC: false
      },
      lang: {
        thousandsSep: ".",
        numericSymbols: [
          " Nghìn",
          " Triệu",
          " Tỉ",
          " Nghìn tỉ",
          " Triệu tỉ",
          " Tỉ tỉ"
        ]
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
            style={{ width: 170, marginTop: -5 }}
            initValue={this.state.TEN_DVIQLY2}
            onChange={option => {
              this.onChangedDonVi(option);
            }}
            //  alert(`${option.label} (${option.key}) nom nom nom`);
          />
          <Text style={{ paddingLeft: 10 }}>Tháng/Năm:</Text>
          <ModalSelector
            data={listThangNam}
            style={{ width: 100, marginTop: -5 }}
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
                HTĐĐ chưa niêm chì tháng trước:{" "}
                {this.numberWithCommas(PSLThangTruoc)}
              </Text>
              <Text style={{ marginBottom: 10 }}>
                HTĐĐ chưa niêm chì tháng: {this.numberWithCommas(PSLThang)}
              </Text>
              <Text style={{ marginBottom: 10 }}>
                Tỉ lệ (Chưa niêm chì tháng/Tổng):{" "}
                {this.numberWithCommasDecimal(PTiLe)} %
              </Text>
              <Text style={{ marginBottom: 10 }}>
                Số lượng HTĐĐ: {this.numberWithCommas(PSLHTDD)}
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
              style={{ height: 500 }}
              config={conf1}
              options={options}
              originWhitelist={[""]}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
            <View style={{ backgroundColor: "orange", height: 1 }} />
            <ChartView
              style={{ height: 400 }}
              config={conf2}
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
