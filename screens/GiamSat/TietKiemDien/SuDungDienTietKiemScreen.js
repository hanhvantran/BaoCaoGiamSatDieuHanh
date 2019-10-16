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

export default class SuDungDienTietKiemScreen extends React.PureComponent {
  static navigationOptions = {
    title: "Sử dụng điện tiết kiệm"
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

    const urls = [urlBaoCao.SP_DienTietKiem + param1];

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
    let Nam = this.state.SelectedDate;
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
    let list1 = [];
    let list21 = [];
    let list22 = [];
    let list23 = [];
    let list24 = [];
    let list25 = [];
    let list3 = [];
    let list4 = [];
    let list5 = [];
    let list6 = [];
    let list7 = [];
    let varCategories1 = [];
    let varCategories2 = [];
    let listCSCC = [],
      listSH_KDDV = [],
      listDNSX = [],
      listHCSN = [],
      listThangTiLe = [];

    if (
      this.state.listDaTa &&
      !Array.isArray(this.state.listDaTa) &&
      this.state.listDaTa.Series != null
    ) {
      let intCSCC = 0,
        intSH_KDDV = 0,
        intDNSX = 0,
        intHCSN = 0,
        intTongDienTietKiem = 0;
      let intCSCC_TP = 0,
        intSH_KDDV_TP = 0,
        intDNSX_TP = 0,
        intHCSN_TP = 0,
        intTongDienThuongPham_TP = 0;
      for (let i = 0; i < this.state.listDaTa.Series[0].data.length; i++) {
        intCSCC = intCSCC + this.state.listDaTa.Series[0].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[1].data.length; i++) {
        intSH_KDDV = intSH_KDDV + this.state.listDaTa.Series[1].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[2].data.length; i++) {
        intDNSX = intDNSX + this.state.listDaTa.Series[2].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[3].data.length; i++) {
        intHCSN = intHCSN + this.state.listDaTa.Series[3].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[4].data.length; i++) {
        intTongDienTietKiem =
          intTongDienTietKiem + this.state.listDaTa.Series[4].data[i];
      }

      for (let i = 0; i < this.state.listDaTa.Series[10].data.length; i++) {
        intCSCC_TP = intCSCC_TP + this.state.listDaTa.Series[10].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[11].data.length; i++) {
        intSH_KDDV_TP = intSH_KDDV_TP + this.state.listDaTa.Series[11].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[12].data.length; i++) {
        intDNSX_TP = intDNSX_TP + this.state.listDaTa.Series[12].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[13].data.length; i++) {
        intHCSN_TP = intHCSN_TP + this.state.listDaTa.Series[13].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[14].data.length; i++) {
        intTongDienThuongPham_TP =
          intTongDienThuongPham_TP + this.state.listDaTa.Series[14].data[i];
      }
      list21.push(intCSCC);
      list21.push(intSH_KDDV);
      list21.push(intDNSX);
      list21.push(intHCSN);
      list21.push(intTongDienTietKiem);
      varCategories1.push("CSCC");
      varCategories1.push("SH & KDDV");
      varCategories1.push("DNSX");
      varCategories1.push("HCSN");
      varCategories1.push("Tổng");

      list3.push(intCSCC_TP);
      list3.push(intSH_KDDV_TP);
      list3.push(intDNSX_TP);
      list3.push(intHCSN_TP);
      list3.push(intTongDienThuongPham_TP);
      listCSCC = this.state.listDaTa.Series[0].data;
      listSH_KDDV = this.state.listDaTa.Series[1].data;
      listDNSX = this.state.listDaTa.Series[2].data;
      listHCSN = this.state.listDaTa.Series[3].data;

      listThangTiLe = this.state.listDaTa.Series[24].data;
    }
    var conf1 = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "Điện tiết kiệm"
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
        categories: varCategories1
      },
      series: [
        {
          name: "Điện tiết kiệm theo nghành nghề",
          data: list21
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
      exporting: {
        showTable: true
      },
      allowDecimals: false,
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
        text: "Điện thương phẩm"
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
        categories: varCategories1
      },
      series: [
        {
          name: "Điện thương phẩm theo nghành nghề",
          data: list3
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
      exporting: {
        showTable: true
      },
      allowDecimals: false,
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
        type: "column"
      },
      title: {
        text: "Điện tiết kiệm theo thành nghành nghề"
      },
      xAxis: {
        categories:
          this.state.listDaTa && !Array.isArray(this.state.listDaTa)
            ? this.state.listDaTa.Categories
            : []
      },
      yAxis: [
        {
          min: 0,
          title: {
            text: "kWh"
          },
          stackLabels: {
            enabled: true,
            style: {
              fontWeight: "bold",
              color:
                // theme
                "gray"
            }
          }
        },
        {
          opposite: true,
          title: {
            text: "Thực hiện(%)"
          }
        }
      ],
      // legend: {
      //   align: "right",
      //   x: -30,
      //   verticalAlign: "top",
      //   y: 25,
      //   floating: true,
      //   backgroundColor: "white",
      //   borderColor: "#CCC",
      //   borderWidth: 1,
      //   shadow: false
      // },
      tooltip: {
        headerFormat: "<b>{point.x}</b><br/>",
        pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}"
      },
      plotOptions: {
        column: {
          stacking: "normal",
          dataLabels: {
            enabled: true
          }
        },
        line: {
          dataLabels: {
            format: "{point.y:,.2f} ",
            enabled: true
          },
          colorByPoint: true
        }
      },
      credits: {
        enabled: false
      },
      series: [
        {
          name: "CSCC",
          data: listCSCC
        },
        {
          name: "SH&KDDV",
          data: listSH_KDDV
        },
        {
          name: "DNSX",
          data: listDNSX
        },
        {
          name: "HCSN",
          data: listHCSN
        },
        {
          name: "Thực hiện(%)",
          data: listThangTiLe,
          type: "line",
          yAxis: 1
        }
      ]
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
            initValue={this.state.SelectedDate.toString()}
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
                style={{ height: 400, width: vChieuRong }}
                config={conf1}
                options={options}
                originWhitelist={[""]}
                javaScriptEnabled={true}
                domStorageEnabled={true}
              />
              <ChartView
                style={{ height: 400, width: vChieuRong }}
                config={conf2}
                options={options}
                originWhitelist={[""]}
                javaScriptEnabled={true}
                domStorageEnabled={true}
              />
            </View>
            <View style={{ backgroundColor: "orange", height: 1 }} />
            <ChartView
              style={{ height: 500 }}
              config={conf3}
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
