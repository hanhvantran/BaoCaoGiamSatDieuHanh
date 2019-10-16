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
export default class KetQuaThayTheCongToQuaTaiScreen extends React.PureComponent {
  static navigationOptions = {
    title: "Công tơ quá tải"
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
          this.get_ThongKeChiNiem(
            this.state.SelectedDonVi,
            this.state.SelectedDate
          );
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
          this.setState({
            spinner: false
          });
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
  get_ThongKeChiNiem = (DONVI, THANGNAM, GIATRI) => {
    this.setState({
      spinner: true
    });
    let url =
      urlBaoCao.sp_CongToQuaTai +
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
    this.get_ThongKeChiNiem(itemValue.key, this.state.SelectedDate, 1);
  }
  onChangedDate(itemValue) {
    this.get_ThongKeChiNiem(this.state.SelectedDonVi, itemValue.key, 2);
    //this.setState({ SelectedDate: itemValue });
  }
  render() {
    let list1 = [];
    let list2 = [];
    let list3 = [];
    let list4 = [];
    let list5 = [];
    let PQTAI = 0;
    let PVH = 0;
    let PQTAI_3_9 = 0;
    let PVH_3_9 = 0;
    let PQTAI_5_15 = 0;
    let PVH_5_15 = 0;
    let PQTAI_5_20 = 0;
    let PVH_5_20 = 0;
    let PQTAI_10_30 = 0;
    let PVH_10_30 = 0;
    let PQTAI_10_40 = 0;
    let PVH_10_40 = 0;
    let PQTAI_20_80 = 0;
    let PVH_20_80 = 0;
    let PQTAI_40_100 = 0;
    let PVH_40_100 = 0;
    let PQTAI_40_120 = 0;
    let PVH_40_120 = 0;
    if (
      this.state.listDaTa &&
      !Array.isArray(this.state.listDaTa) &&
      this.state.listDaTa.Series != null
    ) {
      for (let i = 0; i < this.state.listDaTa.Series[0].data.length; i++) {
        PQTAI_3_9 = PQTAI_3_9 + this.state.listDaTa.Series[0].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[1].data.length; i++) {
        PVH_3_9 = PVH_3_9 + this.state.listDaTa.Series[1].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[2].data.length; i++) {
        PQTAI_5_15 = PQTAI_5_15 + this.state.listDaTa.Series[2].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[3].data.length; i++) {
        PVH_5_15 = PVH_5_15 + this.state.listDaTa.Series[3].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[4].data.length; i++) {
        PQTAI_5_20 = PQTAI_5_20 + this.state.listDaTa.Series[4].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[5].data.length; i++) {
        PVH_5_20 = PVH_5_20 + this.state.listDaTa.Series[5].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[6].data.length; i++) {
        PQTAI_10_30 = PQTAI_10_30 + this.state.listDaTa.Series[6].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[7].data.length; i++) {
        PVH_10_30 = PVH_10_30 + this.state.listDaTa.Series[7].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[8].data.length; i++) {
        PQTAI_10_40 = PQTAI_10_40 + this.state.listDaTa.Series[8].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[9].data.length; i++) {
        PVH_10_40 = PVH_10_40 + this.state.listDaTa.Series[9].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[10].data.length; i++) {
        PQTAI_20_80 = PQTAI_20_80 + this.state.listDaTa.Series[10].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[11].data.length; i++) {
        PVH_20_80 = PVH_20_80 + this.state.listDaTa.Series[11].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[12].data.length; i++) {
        PQTAI_40_100 = PQTAI_40_100 + this.state.listDaTa.Series[12].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[13].data.length; i++) {
        PVH_40_100 = PVH_40_100 + this.state.listDaTa.Series[13].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[14].data.length; i++) {
        PQTAI_40_120 = PQTAI_40_120 + this.state.listDaTa.Series[14].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[15].data.length; i++) {
        PVH_40_120 = PVH_40_120 + this.state.listDaTa.Series[15].data[i];
      }
      PQTAI =
        PQTAI_3_9 +
        PQTAI_5_15 +
        PQTAI_5_20 +
        PQTAI_10_30 +
        PQTAI_10_40 +
        PQTAI_20_80 +
        PQTAI_40_100 +
        PQTAI_40_120;
      PVH =
        PVH_3_9 +
        PVH_5_15 +
        PVH_5_20 +
        PVH_10_30 +
        PVH_10_40 +
        PVH_20_80 +
        PVH_40_100 +
        PVH_40_120;

      list1.push(PQTAI_3_9);
      list1.push(PQTAI_5_15);
      list1.push(PQTAI_5_20);
      list1.push(PQTAI_10_30);
      list1.push(PQTAI_10_40);
      list1.push(PQTAI_20_80);
      list1.push(PQTAI_40_100);
      list1.push(PQTAI_40_120);
      list1.push(PQTAI);

      list2.push(PVH_3_9);
      list2.push(PVH_5_15);
      list2.push(PVH_5_20);
      list2.push(PVH_10_30);
      list2.push(PVH_10_40);
      list2.push(PVH_20_80);
      list2.push(PVH_40_100);
      list2.push(PVH_40_120);
      list2.push(PVH);

      list3.push(this.state.listDaTa.Series[0]);
      list3.push(this.state.listDaTa.Series[2]);
      list3.push(this.state.listDaTa.Series[4]);
      list3.push(this.state.listDaTa.Series[6]);
      list3.push(this.state.listDaTa.Series[8]);
      list3.push(this.state.listDaTa.Series[10]);
      list3.push(this.state.listDaTa.Series[12]);
      list3.push(this.state.listDaTa.Series[14]);

      list4.push(this.state.listDaTa.Series[1]);
      list4.push(this.state.listDaTa.Series[3]);
      list4.push(this.state.listDaTa.Series[5]);
      list4.push(this.state.listDaTa.Series[7]);
      list4.push(this.state.listDaTa.Series[9]);
      list4.push(this.state.listDaTa.Series[11]);
      list4.push(this.state.listDaTa.Series[13]);
      list4.push(this.state.listDaTa.Series[15]);

      list5.push(this.state.listDaTa.Series[16]);
      list5.push(this.state.listDaTa.Series[17]);
    }
    const width = this.state.screenwidth;
    const height = this.state.screenheight - 250;
    var conf1 = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "Tổng"
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
        categories: [
          "3(9)",
          "5(15)",
          "5(20)",
          "10(30)",
          "10(40)",
          "20(80)",
          "40(100)",
          "20(120)",
          "Tổng"
        ]
      },
      series: [
        {
          type: "column",
          name: "Quá tải",
          data: list1
        },
        {
          type: "column",
          name: "Vận hành",
          data: list2
        }
      ],
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
        text: "Số lượng công tơ quá tải"
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
    var conf3 = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "Số lượng công tơ vận hành"
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
      series: list4,
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
        text: "Công tơ vận hành quá tải theo đơn vị"
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
      series: list5,
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
          <ScrollView
            key={Math.random()}
            style={{
              backgroundColor: "white"
            }}
          >
            <ChartView
              style={{ height: 400 }}
              config={conf1}
              options={options}
              originWhitelist={[""]}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
            <View style={{ backgroundColor: "orange", height: 1 }} />
            <ChartView
              style={{ height: 400 }}
              config={conf4}
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
            <View style={{ backgroundColor: "orange", height: 1 }} />
            <ChartView
              style={{ height: 400 }}
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
