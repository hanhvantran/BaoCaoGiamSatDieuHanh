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
import Spinner from "react-native-loading-spinner-overlay";
export default class TyLeTonThatDienNangScreen extends React.PureComponent {
  static navigationOptions = {
    title: "Báo cáo tỷ lệ tổn thất điện năng"
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
          this.callMultiAPI(this.state.SelectedDate, userData.mA_DVIQLY);
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
          Alert.alert("Thông báo", "Không có dữ liệu!");
        }
      })
      .catch(error => {
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

    const urls = [urlBaoCao.GET_TYLETONTHATHATHEPC + param1];
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
    this.callMultiAPI(this.state.SelectedDate, itemValue.key);
  }
  onChangedDate(itemValue) {
    this.callMultiAPI(itemValue.key, this.state.SelectedDonVi);
    //this.setState({ SelectedDate: itemValue });
  }
  render() {
    const width = this.state.screenwidth;
    let vChieuRong = width >= 600 ? width / 2 : width;
    let vChieuRong31 = width >= 600 ? (width / 3) * 1 : width;
    let vChieuRong32 = width >= 600 ? (width / 3) * 2 : width;
    const height = this.state.screenheight - 50;
    let Thang = this.state.SelectedDate.split("/")[0];
    let Nam = this.state.SelectedDate.split("/")[1];
    let ThangTruoc = Thang - 1;
    let NamTruoc = Nam;
    if (Thang == 1) {
      ThangTruoc = 12;
      NamTruoc = Nam - 1;
    }
    let ThangNamTruoc = ThangTruoc + "/" + NamTruoc;
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
    const options2 = {
      global: {
        useUTC: false
      },
      lang: {
        thousandsSep: ".",
        decimalPoint: ","
      }
    };
    let list3 = [];
    let varLabel3 = [];
    if (
      this.state.listDaTa &&
      !Array.isArray(this.state.listDaTa) &&
      this.state.listDaTa.Series != null
    ) {
      let arrayHienTai = this.state.listDaTa.Series[0].data;
      let arrayCungKy = this.state.listDaTa.Series[1].data;
      let arrayLuyKe = this.state.listDaTa.Series[2].data;
      let arrayLuyKeCungKy = this.state.listDaTa.Series[3].data;

      let DienNangNhan1 = arrayHienTai[0];
      let ThuongPham1 = arrayHienTai[1];
      let TonThat1 = arrayHienTai[2];

      let DienNangNhan2 = arrayCungKy[0];
      let ThuongPham2 = arrayCungKy[1];
      let TonThat2 = arrayCungKy[2];

      let DienNangNhan3 = arrayLuyKe[0];
      let ThuongPham3 = arrayLuyKe[1];
      let TonThat3 = arrayLuyKe[2];

      let DienNangNhan4 = arrayLuyKeCungKy[0];
      let ThuongPham4 = arrayLuyKeCungKy[1];
      let TonThat4 = arrayLuyKeCungKy[2];

      let TileTT1 = Number(
        ThuongPham1 == 0 ? 0.0 : ((TonThat1 * 100) / ThuongPham1).toFixed(2)
      );
      let TileTT2 = Number(
        ThuongPham2 == 0 ? 0.0 : ((TonThat2 * 100) / ThuongPham2).toFixed(2)
      );
      let TileTT3 = Number(
        ThuongPham3 == 0 ? 0.0 : ((TonThat3 * 100) / ThuongPham3).toFixed(2)
      );
      let TileTT4 = Number(
        ThuongPham4 == 0 ? 0.0 : ((TonThat4 * 100) / ThuongPham4).toFixed(2)
      );
      list3.push(TileTT1);
      list3.push(TileTT2);
      list3.push(TileTT3);
      list3.push(TileTT4);
      varLabel3.push("Hiện tại");
      varLabel3.push("Cùng kỳ");
      varLabel3.push("Luỹ kế");
      varLabel3.push("Luỹ kế cùng kỳ");
    }

    var conf2 = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "Sản lượng"
      },
      yAxis: {
        title: {
          text: "kWh"
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
      series:
        this.state.listDaTa && !Array.isArray(this.state.listDaTa)
          ? this.state.listDaTa.Series
          : [],
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
    var conf3 = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "Tổn thất hạ thế"
      },
      yAxis: {
        title: {
          text: "%"
        }
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories: varLabel3
      },
      series: [
        {
          name: "Tỉ lệ tổn thất (%)",
          data: list3
        }
      ],
      plotOptions: {
        column: {
          dataLabels: {
            format: "{point.y:,.2f} ",
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
          <ScrollView
            key={Math.random()}
            style={{
              backgroundColor: "white"
            }}
          >
            <View style={{ flexDirection: width >= 600 ? "row" : "column" }}>
              <ChartView
                style={{ height: 500, width: vChieuRong }}
                config={conf2}
                options={options}
                originWhitelist={[""]}
                javaScriptEnabled={true}
                domStorageEnabled={true}
              />
              <ChartView
                style={{ height: 500, width: vChieuRong }}
                config={conf3}
                options={options2}
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
