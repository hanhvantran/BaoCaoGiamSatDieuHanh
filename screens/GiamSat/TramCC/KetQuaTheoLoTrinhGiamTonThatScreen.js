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
      spinner: false,
      tableHead: [
        "Đơn vị",
        "1% < n ≤2%",
        "2% < n ≤6%",
        "6% < n ≤7%",
        "Tổng",
        "1% < n ≤2%",
        "2% < n ≤6%",
        "6% < n ≤7%",
        "Tổng",
        "+/-"
      ],
      tableHead2: ["Điện lực", " Thực hiện", " Kế hoạch", " So sánh"]
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
              this.setState({ spinner: false });
              Alert.alert(
                "Loi: " + url.replace(urlBaoCao.IP, ""),
                error.message
              );
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
    let tableTitle = [];
    let tableData = [];
    let listtableTitle = [];
    let tableTitle2 = ["", "", "", ""];
    let tableData2 = [];
    const width = this.state.screenwidth;
    let vChieuRong = width >= 600 ? width / 2 : width;
    let vChieuRong31 = width >= 600 ? (width / 3) * 1 : width;
    let vChieuRong32 = width >= 600 ? (width / 3) * 2 : width;
    const height = this.state.screenheight - 50;
    let Nam = this.state.SelectedDate;
    let lblNoiDung =
      "ĐÁNH GIÁ KẾT QUẢ THỰC HIỆN LỘ TRÌNH GIẢM TTĐN TRẠM CÔNG CỘNG " + Nam;
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
    let list1 = [];
    let list2 = [];
    let list22 = [];
    let list3 = [];
    let list4 = [];
    let list44 = [];
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
        const listDataRow = [];
        listtableTitle.push(this.state.listDaTa[i].teN_DVIQLY);
        moT_HAI_HT = moT_HAI_HT + this.state.listDaTa[i].moT_HAI_HT;
        haI_SAU_HT = haI_SAU_HT + this.state.listDaTa[i].haI_SAU_HT;
        saU_BAY_HT = saU_BAY_HT + this.state.listDaTa[i].saU_BAY_HT;
        tonG_MOT_HAI_HT =
          tonG_MOT_HAI_HT + this.state.listDaTa[i].tonG_MOT_HAI_HT;
        moT_HAI = moT_HAI + this.state.listDaTa[i].moT_HAI;
        haI_SAU = haI_SAU + this.state.listDaTa[i].haI_SAU;
        saU_BAY = saU_BAY + this.state.listDaTa[i].saU_BAY;
        tonG_MOT_HAI = tonG_MOT_HAI + this.state.listDaTa[i].tonG_MOT_HAI;
        tongsotraM_HT = tongsotraM_HT + this.state.listDaTa[i].tongsotraM_HT;
        tongsotram = tongsotram + this.state.listDaTa[i].tongsotram;

        let colum1_HT = Number(
          this.state.listDaTa[i].tongsotraM_HT == 0
            ? 0.0
            : (
                (this.state.listDaTa[i].moT_HAI_HT * 100) /
                this.state.listDaTa[i].tongsotraM_HT
              ).toFixed(2)
        );
        let colum2_HT = Number(
          this.state.listDaTa[i].tongsotraM_HT == 0
            ? 0.0
            : (
                (this.state.listDaTa[i].haI_SAU_HT * 100) /
                this.state.listDaTa[i].tongsotraM_HT
              ).toFixed(2)
        );
        let colum3_HT = Number(
          this.state.listDaTa[i].tongsotraM_HT == 0
            ? 0.0
            : (
                (this.state.listDaTa[i].saU_BAY_HT * 100) /
                this.state.listDaTa[i].tongsotraM_HT
              ).toFixed(2)
        );
        let colum4_HT = Number(
          this.state.listDaTa[i].tongsotraM_HT == 0
            ? 0.0
            : (
                (this.state.listDaTa[i].tonG_MOT_HAI_HT * 100) /
                this.state.listDaTa[i].tongsotraM_HT
              ).toFixed(2)
        );

        let colum1 = Number(
          this.state.listDaTa[i].tongsotram == 0
            ? 0.0
            : (
                (this.state.listDaTa[i].moT_HAI * 100) /
                this.state.listDaTa[i].tongsotram
              ).toFixed(2)
        );
        let colum2 = Number(
          this.state.listDaTa[i].tongsotram == 0
            ? 0.0
            : (
                (this.state.listDaTa[i].haI_SAU * 100) /
                this.state.listDaTa[i].tongsotram
              ).toFixed(2)
        );
        let colum3 = Number(
          this.state.listDaTa[i].tongsotram == 0
            ? 0.0
            : (
                (this.state.listDaTa[i].saU_BAY * 100) /
                this.state.listDaTa[i].tongsotram
              ).toFixed(2)
        );
        let colum4 = Number(
          this.state.listDaTa[i].tongsotram == 0
            ? 0.0
            : (
                (this.state.listDaTa[i].tonG_MOT_HAI * 100) /
                this.state.listDaTa[i].tongsotram
              ).toFixed(2)
        );
        listDataRow.push(colum1_HT);
        listDataRow.push(colum2_HT);
        listDataRow.push(colum3_HT);
        listDataRow.push(colum4_HT);
        listDataRow.push(colum1);
        listDataRow.push(colum2);
        listDataRow.push(colum3);
        listDataRow.push(colum4);
        listDataRow.push(Number(colum4_HT - colum4).toFixed(2));
        tableData.push(listDataRow);

        varCategories2.push(this.state.listDaTa[i].teN_DVIQLY);
        list5.push(this.state.listDaTa[i].tilE_HT);
        list6.push(this.state.listDaTa[i].kehoach);

        const listDataRow2 = [];
        let intTiLe2 = this.state.listDaTa[i].tilE_HT;
        let intKeHoach2 = this.state.listDaTa[i].kehoach;
        listDataRow2.push(intTiLe2);
        listDataRow2.push(intKeHoach2);
        listDataRow2.push(Number(intTiLe2 - intKeHoach2).toFixed(2));
        tableData2.push(listDataRow2);
      }
      tableTitle = listtableTitle;
      list1.push(moT_HAI_HT);
      list1.push(haI_SAU_HT);
      list1.push(saU_BAY_HT);
      list1.push(tonG_MOT_HAI_HT);
      list2.push(moT_HAI);
      list2.push(haI_SAU);
      list2.push(saU_BAY);
      list2.push(tonG_MOT_HAI);
      list22.push(moT_HAI_HT - moT_HAI);
      list22.push(haI_SAU_HT - haI_SAU);
      list22.push(saU_BAY_HT - saU_BAY);
      list22.push(tonG_MOT_HAI_HT - tonG_MOT_HAI);
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

      list44.push(colum1_HT - colum1);
      list44.push(colum2_HT - colum2);
      list44.push(colum3_HT - colum3);
      list44.push(colum4_HT - colum4);

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
        },
        {
          name: "+/-",
          data: list22
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
        },
        {
          name: "+/-",
          data: list44
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
        decimalPoint: ","
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
            <View style={styles.container2}>
              <View style={{ backgroundColor: "orange", height: 1 }} />
              <Text
                style={{
                  backgroundColor: "orange",
                  color: "white",
                  fontSize: 18,
                  textAlign: "center",
                  alignItems: "center"
                }}
              >
                {lblNoiDung}
              </Text>
              <Table borderStyle={{ borderWidth: 1 }}>
                <Row
                  data={[
                    "Đơn vị",
                    "Tỉ trọng năm " + Nam.toString(),
                    "Tỉ trọng năm " + (Nam - 1).toString(),
                    "So sánh cùng kỳ"
                  ]}
                  flexArr={[2, 4, 4, 1]}
                  style={styles.head}
                  textStyle={styles.text}
                />
                <Row
                  data={this.state.tableHead}
                  flexArr={[2, 1, 1, 1, 1, 1, 1, 1, 1]}
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
                    flexArr={[1, 1, 1, 1, 1, 1, 1, 1, 1]}
                    style={styles.row}
                    textStyle={styles.text}
                  />
                </TableWrapper>
              </Table>
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
            <View style={styles.container2}>
              <View style={{ backgroundColor: "orange", height: 1 }} />
              <Table borderStyle={{ borderWidth: 1 }}>
                <Row
                  data={this.state.tableHead2}
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
                    data={tableData2}
                    flexArr={[1, 1, 1]}
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
  container2: { flex: 1, padding: 10, backgroundColor: "#fff" },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  wrapper: { flexDirection: "row" },
  title: { flex: 2, backgroundColor: "#f6f8fa" },
  row: { height: 28 },
  text: { textAlign: "center" }
});
