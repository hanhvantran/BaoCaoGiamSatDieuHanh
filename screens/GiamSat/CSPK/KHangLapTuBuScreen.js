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
//import { getTenDonVi } from "../../../data/dmdonvi";
import Spinner from "react-native-loading-spinner-overlay";

export default class KHangLapTuBuScreen extends React.PureComponent {
  static navigationOptions = {
    title: "Khách hàng lắp đặt tụ bù"
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
     // this._isMounted &&
        this.setState({ screenheight: height, screenwidth: width });
      this.getOrientation();
    });
    this.initListDate();
    this.get_ThuongPhamUoc(this.state.SelectedDonVi, this.state.SelectedDate);
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
  get_ThuongPhamUoc = (DONVI, THANGNAM, GIATRI) => {
    this.setState({
      spinner: true
    });
    let url =
      urlBaoCao.get_ThuongPhamUocTH +
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
          if (GIATRI == 1) {
            this.setState({
              listDaTa: responseJson,
              SelectedDonVi: DONVI,
              spinner: false
            });
          } else {
            this.setState({
              listDaTa: responseJson,
              SelectedDate: THANGNAM,
              spinner: false
            });
          }
        } else {
          if (GIATRI == 1) {
            this.setState({
              listDaTa: null,
              SelectedDonVi: DONVI,
              spinner: false
            });
          } else {
            this.setState({
              listDaTa: null,
              SelectedDate: THANGNAM,
              spinner: false
            });
          }
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
    this.get_ThuongPhamUoc(itemValue.key, this.state.SelectedDate, 1);
  }
  onChangedDate(itemValue) {
    this.get_ThuongPhamUoc(this.state.SelectedDonVi, itemValue.key, 2);
    //this.setState({ SelectedDate: itemValue });
  }
  multiChart() {
    let pieValue1;
    let pieValue2;
    let pieValue3;
    let pieValue4;
    let pieValue5;
    let pieLabel1 = "Nông lâm thuỷ sản";
    let pieLabel2 = "Công nghiệp xây dựng";
    let pieLabel3 = "Khách sạn nhà hàng";
    let pieLabel4 = "Quản lý tiêu dùng";
    let pieLabel5 = "Hoạt động khác";
    let columnHienTai;
    let columnCungKy;
    let columnLuyKe;
    let columnLuyKeCungKy;
    let columnTrungBinh = [];
    if (this.state.listDaTa && !Array.isArray(this.state.listDaTa) && this.state.listDaTa.Series!=null) {
      pieValue1 = this.state.listDaTa.Series[0].data[0];
      pieValue2 = this.state.listDaTa.Series[0].data[1];
      pieValue3 = this.state.listDaTa.Series[0].data[2];
      pieValue4 = this.state.listDaTa.Series[0].data[3];
      pieValue5 = this.state.listDaTa.Series[0].data[4];

      columnHienTai = this.state.listDaTa.Series[0].data;
      columnCungKy = this.state.listDaTa.Series[1].data;
      columnLuyKe = this.state.listDaTa.Series[2].data;
      columnLuyKeCungKy = this.state.listDaTa.Series[3].data;

      let varTB1;
      let varTB2;
      let varTB3;
      let varTB4;
      let varTB5;
      varTB1 =
        columnHienTai[0] +
        columnCungKy[0] +
        columnLuyKe[0] +
        columnLuyKeCungKy[0];
      varTB2 =
        columnHienTai[1] +
        columnCungKy[1] +
        columnLuyKe[1] +
        columnLuyKeCungKy[1];
      varTB3 =
        columnHienTai[2] +
        columnCungKy[2] +
        columnLuyKe[2] +
        columnLuyKeCungKy[2];
      varTB4 =
        columnHienTai[3] +
        columnCungKy[3] +
        columnLuyKe[3] +
        columnLuyKeCungKy[3];
      varTB5 =
        columnHienTai[4] +
        columnCungKy[4] +
        columnLuyKe[4] +
        columnLuyKeCungKy[4];
      columnTrungBinh.push(Math.round(varTB1 / 4));
      columnTrungBinh.push(Math.round(varTB2 / 4));
      columnTrungBinh.push(Math.round(varTB3 / 4));
      columnTrungBinh.push(Math.round(varTB4 / 4));
      columnTrungBinh.push(Math.round(varTB5 / 4));
    }
    const conf2 = {
      title: {
        text: "Thành phần phụ tải tháng " + this.state.SelectedDate
      },
      xAxis: {
        categories: [
          "Nông lâm thuỷ sản",
          "Công nghiệp xây dựng",
          "Khách sạn nhà hàng",
          "Quản lý tiêu dùng",
          "Hoạt động khác"
        ]
      },
      credits: {
        enabled: false
      },
      labels: {
        items: [
          {
            // html: "Total fruit consumption",
            style: {
              left: "50px",
              top: "18px"
            }
          }
        ]
      },
      series: [
        {
          type: "column",
          name: "Hiện tại",
          data: columnHienTai
        },
        {
          type: "column",
          name: "Cùng Kỳ",
          data: columnCungKy
        },
        {
          type: "column",
          name: "Luỹ kế",
          data: columnLuyKe
        },
        {
          type: "column",
          name: "Luỹ kế cùng kỳ",
          data: columnLuyKeCungKy
        },
        {
          type: "spline",
          name: "Trung bình",
          data: columnTrungBinh,
          marker: {
            lineWidth: 2,
            fillColor: "white"
          }
        }
        /*,
        {
          type: "pie",
          data: [
            {
              name: pieLabel1,
              y: pieValue1
            },
            {
              name: pieLabel2,
              y: pieValue2
            },
            {
              name: pieLabel3,
              y: pieValue3
            },
            {
              name: pieLabel4,
              y: pieValue4
            },
            {
              name: pieLabel5,
              y: pieValue5
            }
          ],
          center: [100, 80],
          size: 150,
          showInLegend: false,
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b><br>{point.percentage:.1f} %",
            distance: -50,
            filter: {
              property: "percentage",
              operator: ">",
              value: 4
            }
          }
        }*/
      ]
    };
  }
  render() {
    const width = this.state.screenwidth;
    const height = this.state.screenheight - 250;
    var conf = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "So sánh cùng kỳ"
      },
      yAxis: {
        title: {
          text: "VNĐ"
        }
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: "{point.y:.1f}"
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
      series:
        this.state.listDaTa && !Array.isArray(this.state.listDaTa)
          ? this.state.listDaTa.Series
          : [],

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
    let pieValue1;
    let pieValue2;
    let pieValue3;
    let pieValue4;
    let pieValue5;
    let pieLabel1 = "Nông lâm thuỷ sản";
    let pieLabel2 = "Công nghiệp xây dựng";
    let pieLabel3 = "Khách sạn nhà hàng";
    let pieLabel4 = "Quản lý tiêu dùng";
    let pieLabel5 = "Hoạt động khác";
    if (this.state.listDaTa && !Array.isArray(this.state.listDaTa)) {
      pieValue1 = this.state.listDaTa.Series[0].data[0];
      pieValue2 = this.state.listDaTa.Series[0].data[1];
      pieValue3 = this.state.listDaTa.Series[0].data[2];
      pieValue4 = this.state.listDaTa.Series[0].data[3];
      pieValue5 = this.state.listDaTa.Series[0].data[4];
    }
    var conf2 = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie"
      },
      title: {
        text: "Thành phần phụ tải tháng " + this.state.SelectedDate
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
      },
      credits: {
        enabled: false
      },
      size: 250,
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.1f} %",
          }
        }
      },
      series: [
        {
          name: "Tỉ lệ",
          colorByPoint: true,
          data: [
            {
              name: pieLabel1,
              y: pieValue1,
              sliced: true,
              selected: true
            },
            {
              name: pieLabel2,
              y: pieValue2
            },
            {
              name: pieLabel3,
              y: pieValue3
            },
            {
              name: pieLabel4,
              y: pieValue4
            },
            {
              name: pieLabel5,
              y: pieValue5
            }
          ]
        }
      ]
    };
    const options = {
      global: {
        useUTC: false
      },
      lang: {
        decimalPoint: ",",
        thousandsSep: "."
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
            <ChartView
              style={{ height: 200 }}
              config={conf2}
              options={options}
              originWhitelist={[""]}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
            <ChartView
              style={{ height: height }}
              config={conf}
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
