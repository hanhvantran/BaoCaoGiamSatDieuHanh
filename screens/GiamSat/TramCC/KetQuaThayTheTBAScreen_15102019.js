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
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col, 
  Cell
} from "react-native-table-component";

export default class KetQuaThayTheTBDDScreen extends React.PureComponent {
  static navigationOptions = {
    title: "Kết quả khai thác hiệu suất TBACC"
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
      spinner: false,
      tableHead: [
        "Điện lực",
        " ≤ 1%",
        "1% < n ≤ 2%",
        "2% < n  ≤ 6%",
        "6% < n  ≤7%",
        "7% < n  ≤10%",
        "n > 10%",
        "Tổng",
        "Tháng",
        "Luỹ kế"
      ],
      tableTitle: ["Title", "Title2", "Title3", "Title4"],
      tableData: [
        ["1", "2", "3", "1", "2", "3", "1", "2", "3"],
        ["1", "2", "3", "1", "2", "3", "1", "2", "3"],
        ["1", "2", "3", "1", "2", "3", "1", "2", "3"],
        ["1", "2", "3", "1", "2", "3", "1", "2", "3"]
      ]
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
          //this.callMultiAPI(this.state.SelectedDate, userData.mA_DVIQLY);
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

    const urls = [urlBaoCao.sp_KETQUAKHAITHACHSTRAMCCPC + param1];
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
    let list = [];
    let list2 = [];
    let list3 = [];
    let list41 = [];
    let list42 = [];
    let varLabel3 = [];
    if (
      this.state.listDaTa &&
      !Array.isArray(this.state.listDaTa) &&
      this.state.listDaTa.Series != null
    ) {
      list.push(this.state.listDaTa.Series[0]);
      list.push(this.state.listDaTa.Series[1]);
      list2.push(this.state.listDaTa.Series[2]);
      list2.push(this.state.listDaTa.Series[3]);
      let DauNguon1 = this.state.listDaTa.Series[2].data[0];
      let TonThat1 = this.state.listDaTa.Series[2].data[1];
      let DauNguon2 = this.state.listDaTa.Series[3].data[0];
      let TonThat2 = this.state.listDaTa.Series[3].data[1];
      let DauNguon3 = this.state.listDaTa.Series[4].data[0];
      let TonThat3 = this.state.listDaTa.Series[4].data[1];
      let DauNguon4 = this.state.listDaTa.Series[5].data[0];
      let TonThat4 = this.state.listDaTa.Series[5].data[1];
      let TileTT1 = Number(
        DauNguon1 == 0 ? 0.0 : ((TonThat1 * 100) / DauNguon1).toFixed(2)
      );
      let TileTT2 = Number(
        DauNguon2 == 0 ? 0.0 : ((TonThat2 * 100) / DauNguon2).toFixed(2)
      );
      let TileTT3 = Number(
        DauNguon3 == 0 ? 0.0 : ((TonThat3 * 100) / DauNguon3).toFixed(2)
      );
      let TileTT4 = Number(
        DauNguon4 == 0 ? 0.0 : ((TonThat4 * 100) / DauNguon4).toFixed(2)
      );
      list3.push(TileTT1);
      list3.push(TileTT2);
      list3.push(TileTT3);
      list3.push(TileTT4);
      varLabel3.push(this.state.listDaTa.Series[2].name);
      varLabel3.push(this.state.listDaTa.Series[3].name);
      varLabel3.push(this.state.listDaTa.Series[4].name);
      varLabel3.push(this.state.listDaTa.Series[5].name);
      let arrayHienTai = this.state.listDaTa.Series[0].data;
      let arrayThangTruoc = this.state.listDaTa.Series[1].data;
      let TiTrong1 = arrayHienTai[0] + arrayHienTai[1];
      let TiTrong2 = arrayHienTai[2];
      let TiTrong3 = arrayHienTai[3];
      let TiTrongTong =
        arrayHienTai[0] +
        arrayHienTai[1] +
        arrayHienTai[2] +
        arrayHienTai[3] +
        arrayHienTai[4] +
        arrayHienTai[5];
      let A1 = Number(
        TiTrong1 == 0 ? 0 : ((TiTrong1 * 100) / TiTrongTong).toFixed(2)
      );
      let A2 = Number(
        TiTrong2 == 0 ? 0 : ((TiTrong2 * 100) / TiTrongTong).toFixed(2)
      );
      let A3 = Number(
        TiTrong3 == 0 ? 0 : ((TiTrong3 * 100) / TiTrongTong).toFixed(2)
      );
      let A4 = A1 + A2 + A3;

      let TiTrong_ThangTruoc1 = arrayThangTruoc[0] + arrayThangTruoc[1];
      let TiTrong_ThangTruoc2 = arrayThangTruoc[2];
      let TiTrong_ThangTruoc3 = arrayThangTruoc[3];
      let TiTrongTong_ThangTruoc =
        arrayThangTruoc[0] +
        arrayThangTruoc[1] +
        arrayThangTruoc[2] +
        arrayThangTruoc[3] +
        arrayThangTruoc[4] +
        arrayThangTruoc[5];

      let B1 = Number(
        TiTrongTong_ThangTruoc == 0
          ? 0
          : ((TiTrong_ThangTruoc1 * 100) / TiTrongTong_ThangTruoc).toFixed(2)
      );
      let B2 = Number(
        TiTrongTong_ThangTruoc == 0
          ? 0
          : ((TiTrong_ThangTruoc2 * 100) / TiTrongTong_ThangTruoc).toFixed(2)
      );
      let B3 = Number(
        TiTrongTong_ThangTruoc == 0
          ? 0
          : ((TiTrong_ThangTruoc3 * 100) / TiTrongTong_ThangTruoc).toFixed(2)
      );
      let B4 = B1 + B2 + B3;
      list41.push(A1);
      list41.push(A2);
      list41.push(A3);
      list41.push(A4);

      list42.push(B1);
      list42.push(B2);
      list42.push(B3);
      list42.push(B4);
    }
    var conf1 = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "Kết quả khai thác hiệu suất trạm CC"
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
        categories:
          this.state.listDaTa && !Array.isArray(this.state.listDaTa)
            ? this.state.listDaTa.Categories
            : []
      },
      series: list,
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
        categories: ["Đầu nguồn", "Tổn thất"]
      },
      series: list2,
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

    var conf4 = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "Tỉ trọng"
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
        categories: ["≤2%", "≤6%", "≤7%", "Tổng"]
      },
      series: [
        {
          name: "Tháng " + this.state.SelectedDate,
          data: list41
        },
        {
          name: "Tháng " + ThangNamTruoc,
          data: list42
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
                config={conf1}
                options={options}
                originWhitelist={[""]}
                javaScriptEnabled={true}
                domStorageEnabled={true}
              />
              <ChartView
                style={{ height: 500, width: vChieuRong }}
                config={conf2}
                options={options}
                originWhitelist={[""]}
                javaScriptEnabled={true}
                domStorageEnabled={true}
              />
            </View>
            <View style={{ backgroundColor: "orange", height: 1 }} />
            <View style={{ flexDirection: width >= 600 ? "row" : "column" }}>
              <ChartView
                style={{ height: 500, width: vChieuRong }}
                config={conf3}
                options={options2}
                originWhitelist={[""]}
                javaScriptEnabled={true}
                domStorageEnabled={true}
              />
              <ChartView
                style={{ height: 500, width: vChieuRong }}
                config={conf4}
                options={options2}
                originWhitelist={[""]}
                javaScriptEnabled={true}
                domStorageEnabled={true}
              />
            </View>
            <View style={styles.container2}>
              <Table borderStyle={{ borderWidth: 1 }}>
                <Row
                  data={[
                    "Số trạm tổn thất trong khoảng",
                    "TT hạ thế(%)"
                  ]}
                  flexArr={[8, 2]}
                  style={styles.head}
                  textStyle={styles.text}
                />
                <Row
                  data={this.state.tableHead}
                  flexArr={[1, 1, 1, 1, 1, 1, 1, 1, 1]}
                  style={styles.head}
                  textStyle={styles.text}
                />
                <TableWrapper style={styles.wrapper}>
                  <Col
                    data={this.state.tableTitle}
                    style={styles.title}
                    heightArr={[28, 28]}
                    textStyle={styles.text}
                  />
                  <Rows
                    data={this.state.tableData}
                    flexArr={[1, 1, 1, 1, 1, 1, 1, 1, 1]}
                    style={styles.row}
                    textStyle={styles.text}
                  />
                </TableWrapper>
              </Table>
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
  },
  container2: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  wrapper: { flexDirection: "row" },
  title: { flex: 1, backgroundColor: "#f6f8fa" },
  row: { height: 28 },
  text: { textAlign: "center" }
});
