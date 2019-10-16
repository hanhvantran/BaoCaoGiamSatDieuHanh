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

export default class KetQuaTheoLoTrinhGiamTonThatScreen extends React.PureComponent {
  static navigationOptions = {
    title: "Kết quả theo lộ trình giảm TTĐN"
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
      SelectedDate: new Date().getFullYear(),
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
    var intitYear = year - 4;
    for (var i = intitYear; i <= year; i++) {
      arrayData.push({ VALUE: i.toString() });
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

  callMultiAPI = async (vNam, vMaDonVi) => {
    this.setState({
      spinner: true
    });
    let param1 = "?MaDonVi=" + vMaDonVi + "&NAM=" + vNam + "";
    const urls = [urlBaoCao.sp_KetQuaGiamTTDNPC2 + param1];
    Promise.all(
      urls.map(url =>
        fetch(url)
          .then(this.checkStatus)
          .then(this.parseJSON)
          .catch(function(err) {
            {
              this.setState({spinner: false});
              Alert.alert("Loi: "+ url.replace(urlBaoCao.IP, "") , error.message);
            }
          })
      )
    ).then(data => {
      this.setState({
        spinner: false,
        SelectedDonVi: vMaDonVi,
        SelectedDate: vNam,
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
    let list2 = [];
    let list3 = [];
    let list4 = [];
    let list5 = [];
    let list6 = [];
    let varCategories1 = [];
    let varCategories2 = [];

    if (this.state.listDaTa && this.state.listDaTa.length > 0) {
      let haI_SAU = 0,
        haI_SAU_HT = 0,
        kehoach = 0,
        moT_HAI = 0,
        moT_HAI_HT = 0,
        saU_BAY = 0,
        saU_BAY_HT = 0,
        tonG_MOT_HAI = 0,
        tonG_MOT_HAI_HT = 0,
        tongsotraM_HT = 0,
        tongsotram = 0;
      for (let i = 0; i < this.state.listDaTa.length; i++) {
        haI_SAU = haI_SAU + this.state.listDaTa[i].haI_SAU;
        haI_SAU_HT = haI_SAU_HT + this.state.listDaTa[i].haI_SAU_HT;
        moT_HAI = moT_HAI + this.state.listDaTa[i].moT_HAI;
        moT_HAI_HT = moT_HAI_HT + this.state.listDaTa[i].moT_HAI_HT;
        saU_BAY = saU_BAY + this.state.listDaTa[i].saU_BAY;
        saU_BAY_HT = saU_BAY_HT + this.state.listDaTa[i].saU_BAY_HT;
        tonG_MOT_HAI = tonG_MOT_HAI + this.state.listDaTa[i].tonG_MOT_HAI;
        tonG_MOT_HAI_HT =
          tonG_MOT_HAI_HT + this.state.listDaTa[i].tonG_MOT_HAI_HT;
        tongsotraM_HT = tongsotraM_HT + this.state.listDaTa[i].tongsotraM_HT;
        tongsotram = tongsotram + this.state.listDaTa[i].tongsotram;
        varCategories2.push(this.state.listDaTa[i].teN_DVIQLY);
        list5.push(this.state.listDaTa[i].tilE_HT);
        list6.push(this.state.listDaTa[i].kehoach);
      }
      list1.push(moT_HAI_HT);
      list1.push(haI_SAU_HT);
      list1.push(saU_BAY_HT);
      list1.push(tonG_MOT_HAI_HT);
      list2.push(moT_HAI);
      list2.push(haI_SAU);
      list2.push(saU_BAY);
      list2.push(tonG_MOT_HAI);
      varCategories1.push("1-2%");
      varCategories1.push("2-6%");
      varCategories1.push("6-7%");
      varCategories1.push("Tổng");

      let colum1_HT = Number(
        tongsotraM_HT == 0
          ? 0.0
          : ((moT_HAI_HT * 100) / tongsotraM_HT).toFixed(2)
      );
      let colum2_HT = Number(
        tongsotraM_HT == 0
          ? 0.0
          : ((haI_SAU_HT * 100) / tongsotraM_HT).toFixed(2)
      );
      let colum3_HT = Number(
        tongsotraM_HT == 0
          ? 0.0
          : ((saU_BAY_HT * 100) / tongsotraM_HT).toFixed(2)
      );
      let colum4_HT = Number(
        tongsotraM_HT == 0
          ? 0.0
          : ((tonG_MOT_HAI_HT * 100) / tongsotraM_HT).toFixed(2)
      );

      let colum1 = Number(
        tongsotram == 0 ? 0.0 : ((moT_HAI * 100) / tongsotram).toFixed(2)
      );
      let colum2 = Number(
        tongsotram == 0 ? 0.0 : ((haI_SAU * 100) / tongsotram).toFixed(2)
      );
      let colum3 = Number(
        tongsotram == 0 ? 0.0 : ((saU_BAY * 100) / tongsotram).toFixed(2)
      );
      let colum4 = Number(
        tongsotram == 0 ? 0.0 : ((tonG_MOT_HAI * 100) / tongsotram).toFixed(2)
      );
      list3.push(colum1_HT);
      list3.push(colum2_HT);
      list3.push(colum3_HT);
      list3.push(colum4_HT);

      list4.push(colum1);
      list4.push(colum2);
      list4.push(colum3);
      list4.push(colum4);

      //  "teN_DVIQLY": "PC Hậu Giang",
      // "tilE_HT": 85.13,
      // "tile": 85.33,
    }

    var conf2 = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "Theo số lượng trạm"
      },
      yAxis: {
        title: {
          text: "Trạm"
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
          name: this.state.SelectedDate,
          data: list1
        },
        {
          name: this.state.SelectedDate - 1,
          data: list2
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
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "Theo tỷ trọng"
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
        categories: varCategories1
      },
      series: [
        {
          name: "Tỷ trọng năm " + this.state.SelectedDate.toString(),
          data: list3
        },
        {
          name: "Tỷ trọng năm " + (this.state.SelectedDate - 1).toString(),
          data: list4
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
    var conf4 = {
      chart: {
        zoomType: "xy"
      },
      title: {
        text: "Kết quả thực hiện so với kế hoạch theo đơn vị"
      },
      xAxis: {
        categories: varCategories2
      },
      yAxis: {
        title: {
          text: "%"
        }
      },
      credits: {
        enabled: false
      },
      series: [
        {
          type: "column",
          name: "Thực hiện",
          data: list5
        },
        {
          type: "spline",
          name: "Kế hoạch",
          data: list6,
          marker: {
            lineWidth: 2,
            lineColor: "orange",
            fillColor: "white"
          }
         // colorByPoint: true
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
    const options2 = {
      global: {
        useUTC: false
      },
      lang: {
        thousandsSep: ".",
        decimalPoint: ','
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
            <View style={{ backgroundColor: "orange", height: 1 }} />
            <ChartView
              style={{ height: 500 }}
              config={conf4}
              options={options2}
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
