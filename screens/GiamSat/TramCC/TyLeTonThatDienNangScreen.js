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
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cell
} from "react-native-table-component";
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
      spinner: false,
      tableHead: ["Điện lực", " Thực hiện", " Kế hoạch", " So sánh"]
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
    let tableTitle = ["", "", "", ""];
    let tableData = [];
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
        numericSymbols: [" N", " Tr", " Tỉ", " 1000Tỉ", " Triệu tỉ", " Tỉ tỉ"]
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
    let listDauNguon = [];
    let listThuongPham = [];
    let listTonThat = [];
    let list3 = [];
    let listTonThatTheoDonVi = [];
    let listTonThatTheoDonVikWh = [];
    let varLabel3 = [];
    if (
      this.state.listDaTa &&
      !Array.isArray(this.state.listDaTa) &&
      this.state.listDaTa.Series != null
    ) {
      let DauNguon1 = 0,
        DauNguon2 = 0,
        DauNguon3 = 0,
        DauNguon4 = 0;
      let TonThat1 = 0,
        TonThat2 = 0,
        TonThat3 = 0,
        TonThat4 = 0;
      let ThuongPham1 = 0,
        ThuongPham2 = 0,
        ThuongPham3 = 0,
        ThuongPham4 = 0;
      for (let i = 0; i < this.state.listDaTa.Series[0].data.length; i++) {
        DauNguon1 = DauNguon1 + this.state.listDaTa.Series[0].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[3].data.length; i++) {
        DauNguon2 = DauNguon2 + this.state.listDaTa.Series[3].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[6].data.length; i++) {
        DauNguon3 = DauNguon3 + this.state.listDaTa.Series[6].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[9].data.length; i++) {
        DauNguon4 = DauNguon4 + this.state.listDaTa.Series[9].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[2].data.length; i++) {
        TonThat1 = TonThat1 + this.state.listDaTa.Series[2].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[5].data.length; i++) {
        TonThat2 = TonThat2 + this.state.listDaTa.Series[5].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[8].data.length; i++) {
        TonThat3 = TonThat3 + this.state.listDaTa.Series[8].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[11].data.length; i++) {
        TonThat4 = TonThat4 + this.state.listDaTa.Series[11].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[1].data.length; i++) {
        ThuongPham1 = ThuongPham1 + this.state.listDaTa.Series[1].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[4].data.length; i++) {
        ThuongPham2 = ThuongPham2 + this.state.listDaTa.Series[4].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[7].data.length; i++) {
        ThuongPham3 = ThuongPham3 + this.state.listDaTa.Series[7].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[10].data.length; i++) {
        ThuongPham4 = ThuongPham4 + this.state.listDaTa.Series[10].data[i];
      }
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
      varLabel3.push("Hiện tại");
      varLabel3.push("Cùng kỳ");
      varLabel3.push("Luỹ kế");
      varLabel3.push("Luỹ kế cùng kỳ");

      listDauNguon.push(DauNguon1);
      listDauNguon.push(DauNguon2);
      listDauNguon.push(DauNguon3);
      listDauNguon.push(DauNguon4);

      listThuongPham.push(ThuongPham1);
      listThuongPham.push(ThuongPham2);
      listThuongPham.push(ThuongPham3);
      listThuongPham.push(ThuongPham4);

      listTonThat.push(TonThat1);
      listTonThat.push(TonThat2);
      listTonThat.push(TonThat3);
      listTonThat.push(TonThat4);

      listTonThatTheoDonVi.push(this.state.listDaTa.Series[12]);
      listTonThatTheoDonVi.push(this.state.listDaTa.Series[13]);
      listTonThatTheoDonVi.push(this.state.listDaTa.Series[14]);
      listTonThatTheoDonVi.push(this.state.listDaTa.Series[15]);

      listTonThatTheoDonVikWh.push(this.state.listDaTa.Series[0]);
      listTonThatTheoDonVikWh.push(this.state.listDaTa.Series[1]);
      listTonThatTheoDonVikWh.push(this.state.listDaTa.Series[2]);

      tableTitle =
        this.state.listDaTa && !Array.isArray(this.state.listDaTa)
          ? this.state.listDaTa.Categories
          : [];
      for (let i = 0; i < this.state.listDaTa.Series[12].data.length; i++) {
        const listDataRow = [];
        let intTTPT = 0,
          intKeHoach = 0;
        intTTPT = this.state.listDaTa.Series[12].data[i];
        intKeHoach = this.state.listDaTa.Series[16].data[i];
        listDataRow.push(intTTPT);
        listDataRow.push(intKeHoach);
        if (intKeHoach <= 0) {
          listDataRow.push("Chưa nhập kế hoạch");
        } else {
          listDataRow.push(Number(intTTPT - intKeHoach).toFixed(2));
        }
        tableData.push(listDataRow);
      }
    }

    var conf2 = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "Tổn thất hạ thế"
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
        categories: varLabel3
      },
      series: [
        {
          name: "Đầu nguồn",
          data: listDauNguon
          // yAxis: 1
        },
        {
          name: "Thương phẩm",
          data: listThuongPham
        },
        {
          name: "Tổn thất",
          data: listTonThat
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
    var conf3 = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "Tỉ lệ tổn thất hạ thế"
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
          },
          colorByPoint: true
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
        text: "Tổn thất theo đơn vị tháng " + this.state.SelectedDate
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
      series: listTonThatTheoDonVikWh,
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
    var conf5 = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "Tỉ lệ tổn thất theo đơn vị"
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
        categories:
          this.state.listDaTa && !Array.isArray(this.state.listDaTa)
            ? this.state.listDaTa.Categories
            : []
      },
      series: listTonThatTheoDonVi,
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
            <View style={{ backgroundColor: "orange", height: 1 }} />
            <ChartView
              style={{ height: 500 }}
              config={conf5}
              options={options2}
              originWhitelist={[""]}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
            <View style={styles.container2}>
              <View style={{ backgroundColor: "orange", height: 1 }} />
              <Table borderStyle={{ borderWidth: 1 }}>
                <Row
                  data={this.state.tableHead}
                  flexArr={[2, 1, 1, 1]}
                  style={styles.head}
                  textStyle={styles.text}
                />
                <TableWrapper style={styles.wrapper}>
                  <Col
                    data={tableTitle}
                    style={styles.title}
                    heightArr={[28, 28]}
                    textStyle={styles.text}
                  />
                  <Rows
                    data={tableData}
                    flexArr={[ 1, 1, 1]}
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
  container2: { flex: 1, padding: 16, backgroundColor: "#fff" },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  wrapper: { flexDirection: "row" },
  title: { flex: 2, backgroundColor: "#f6f8fa" },
  row: { height: 28 },
  text: { textAlign: "center" }
});
