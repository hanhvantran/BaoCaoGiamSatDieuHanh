import React from "react";
import {
  StyleSheet,
  Text,
  Alert,
  View,
  AsyncStorage,
  ScrollView,
  StatusBar,
  Dimensions,
} from "react-native";
import urlBaoCao from "../networking/services";
import ChartView from "react-native-highcharts";
import ChartMapView from "react-native-highcharts/react-native-highmaps";
import { Badge, PricingCard } from "react-native-elements";
import ButtonCustom from "../components/ButtonCustom";
import Spinner from "react-native-loading-spinner-overlay";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import { YellowBox } from "react-native";
import ModalSelector from "react-native-modal-selector";
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cell,
} from "react-native-table-component";
import _ from "lodash";
////"main": "node_modules/expo/AppEntry.js",
export default class HomeScreen extends React.PureComponent {
  static navigationOptions = {
    title: null,
    header: null,
  };
  constructor(props) {
    super(props);
    YellowBox.ignoreWarnings(["Setting a timer"]);
    const _console = _.clone(console);
    console.warn = (message) => {
      if (message.indexOf("Setting a timer") <= -1) {
        _console.warn(message);
      }
    };
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
      SelectedDate: new Date().getFullYear().toString(),
      orientation: "",
      screenheight: Dimensions.get("window").height,
      screenwidth: Dimensions.get("window").width,
      listGetSoDoDemTheoThang: [],
      listGetHDMBDThucHienTheoThang: [],
      listGetGBBQThucHienTheoThang2: [],
      listGetDoanhThuThucHienTheoThang: [],
      listGetTonThatThangTheoPPMoi: [],
      listGetThuongPhamThucHienTheoThang: [],
      listGetMTAM: [],
      listSoThu: [],
      listGiaBanTheoNam: [],
      listGetMTAMTongHop: [],
      listDonVi: [],
      listDate: [],
      spinner: false,
      emailfb: "",
      passwordfb: "",
      notification: {},
      userIDfirebase: "",
      notificationsAvailable: [],
      error: "",
      lblNoiDung: "",
      lblNoiDung2: "",
      lblNoiDung3: "",
      tableHead: ["Tính chất", "Tổng công suất (KWP)"],
      PThuongPham1: 0,
      PThuongPham2: 0,
      PThuongPham3: 0,
      PThuongPham4: 0,
      PThuongPham5: 0,
      PThuongPham6: 0,
      PThuongPham7: 0,
      PThuongPham8: 0,
    };
  }
  async registerForPushNotificationsAsync(TaiKhoan, DonVi) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== "granted") {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== "granted") {
      return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    AsyncStorage.setItem("UserToken", token);
    return fetch(
      urlBaoCao.sp_UpdateToKen +
        "?pToKen=" +
        token +
        "&PMaDonVi=" +
        DonVi +
        "&PTaiKhoan=" +
        TaiKhoan +
        ""
    )
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log("UpdateToKen:", "OK");
      })
      .catch((error) => {
        // console.log("UpdateToKen:", error);
      });
    // POST the token to your backend server from where you can retrieve it to send push notifications.
  }
  _bootstrapAsync = async () => {
    try {
      AsyncStorage.getItem("UserInfomation").then((user_data_json) => {
        let userData = JSON.parse(user_data_json);
        // console.log('userData', userData);
        if (
          userData == undefined ||
          userData.ngaY_LOGIN == undefined ||
          userData.ngaY_LOGIN == null
        ) {
          var { navigate } = this.props.navigation;
          navigate("LoginScreen");
        } else {
          // console.log('userData.ngaY_LOGIN', userData.ngaY_LOGIN);
          let ngayLogin = userData.ngaY_LOGIN;
          let dateLogin = new Date(ngayLogin);
          dateLogin.setDate(dateLogin.getDate() + 2);
          let dateNow = new Date();
          var dd = dateNow.getDate();
          var mm = dateNow.getMonth() + 1;

          var yyyy = dateNow.getFullYear();
          if (dd < 10) {
            dd = "0" + dd;
          }
          if (mm < 10) {
            mm = "0" + mm;
          }
          var today = dd + "/" + mm + "/" + yyyy;

          // console.log('dateLogin', dateLogin);
          if (dateNow > dateLogin) {
            // console.log('dateNow', dateNow);
            var { navigate } = this.props.navigation;
            navigate("LoginScreen");
          } else {
            // console.log('ngon','ngon');
            this.setState({
              FULLNAME: userData.fullname,
              MA_DVICTREN: userData.mA_DVICTREN,
              MA_DVIQLY: userData.mA_DVIQLY,
              TEN_DVIQLY: userData.mA_DVIQLY + " - " + userData.teN_DVIQLY,
              TEN_DVIQLY2: userData.teN_DVIQLY2,
              lblNoiDung: (
                userData.teN_DVIQLY2 +
                " - BÁO CÁO TỔNG HỢP NĂM " +
                this.state.SelectedDate.toString()
              ).toUpperCase(),
              lblNoiDung2: userData.teN_DVIQLY2,
              lblNoiDung3:
                "Ngày " +
                today +
                ", số liệu được đồng bộ lúc 0h, 12h hàng ngày.",
              USERID: userData.userid,
              USERNAME: userData.username,
              CAP_DVI: userData.caP_DVI,
              SelectedDonVi: userData.mA_DVIQLY,
              emailfb: userData.email,
              passwordfb: userData.passwordfb,
              spinner: false,
            });
            this.registerForPushNotificationsAsync(
              userData.username,
              userData.mA_DVIQLY
            );
            this.get_Info_Dvi_ChaCon(userData.mA_DVIQLY, userData.caP_DVI);
            this.callMultiAPI(
              this.state.SelectedDate,
              userData.mA_DVIQLY,
              userData.teN_DVIQLY2
            );
          }
        }
      });
    } catch (error) {
      Alert.alert("AsyncStorage error", error.message);
    }
  };
  initListDate() {
    var arrayData = [];
    var year = new Date().getFullYear();
    var intitYear = year;
    for (var i = intitYear; i > year - 5; i--) {
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
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson && responseJson.length > 0) {
          this.setState(
            {
              listDonVi: responseJson,
              listDate: this.initListDate(),
            },
            function () {
              // In this block you can do something with new state.
            }
          );
        } else {
          Alert.alert("Thông báo", "Không có dữ liệu!");
        }
      })
      .catch((error) => {
        Alert.alert("Lỗi kết nối!", error.toString());
      });
  };
  componentDidMount() {
    this._bootstrapAsync();

    //this._bootstrapAsync();
    this.getOrientation();
    Dimensions.addEventListener("change", () => {
      const { height, width } = Dimensions.get("window");

      this.setState({ screenheight: height, screenwidth: width });

      this.getOrientation();
    });
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }

  _handleNotification = (notification) => {
    // console.log("notification: ", notification);
    this.setState({ notification: notification });
    this.props.navigation.navigate("NhanDinhThongBaoScreen");
  };
  getOrientation = () => {
    if (this.refs.rootView) {
      if (Dimensions.get("window").width < Dimensions.get("window").height) {
        this.setState({ orientation: "portrait" });
      } else {
        this.setState({ orientation: "landscape" });
      }
    }
  };
  renderTabBar() {
    return <StatusBar hidden />;
  }
  handleLogoutPress = async () => {
    try {
      // await AsyncStorage.removeItem("UserInfomation");
      await AsyncStorage.clear();
      //console.log("this.props.navigation", this.props);
      // console.log("this.props.navigation", this.props.navigation);
      // var { navigate } = this.props.navigation;
      // navigate("NhanDinhScreen");
      this.props.navigation.navigate("LoginScreen");
      //   BackHandler.exitApp();
    } catch (error) {
      Alert.alert("AsyncStorage error", error.message);
    }
  };
  callMultiAPI = async (vThangNam, vMaDonVi, lblTenDonVi) => {
    let vThongBao = [];
    let intNumber = 0;
    this.setState({
      spinner: true,
    });
    let dateNow = new Date();
    var mm = dateNow.getMonth() + 1;
    let Thang = 12;
    let Nam = vThangNam;
    let NamTruoc = vThangNam - 1;
    let param1 = vMaDonVi + "/1/" + Thang + "/" + Nam;
    let param2 = vMaDonVi + "/12/" + NamTruoc + "/" + Thang + "/" + Nam;
    let param3 = "?MaDonVi=" + vMaDonVi + "&Nam=" + Nam + "";
    let param4 = "?MaDonVi=" + vMaDonVi + "&Thang=" + mm + "&Nam=" + Nam;
    let param5 = vMaDonVi + "/" + NamTruoc + "/" + Nam;
    const urls = [
      urlBaoCao.GetSoDoDemTheoThang + param1, //MaDonVi, Thang, Nam
      urlBaoCao.GetHDMBDThucHienTheoThang + param1, //MaDonVi, Thang, Nam
      urlBaoCao.GetGBBQThucHienTheoThang2 + param1, //MaDonVi, Thang, Nam
      urlBaoCao.GetDoanhThuThucHienTheoThang + param1, //MaDonVi, TuThang, DenThang, Nam
      urlBaoCao.GetTonThatThangTheoPPMoi + param2, //MaDonVi, TuNam, DenNam
      urlBaoCao.GetThuongPhamThucHienTheoThang + param1,
      urlBaoCao.sp_BaoCaoDMTMN + param3,
      urlBaoCao.SP_SoThu + param4,
      urlBaoCao.GetGBBQThucHienTheoNam + param5,
      urlBaoCao.sp_MTMN + param3,
    ];
    // use map() to perform a fetch and handle the response for each url
    Promise.all(
      urls.map(
        (url) =>
          fetch(url)
            .then(this.checkStatus)
            .then(this.parseJSON)
            .catch((error) => {
              this.setState({
                spinner: false,
              });
              Alert.alert(
                "Loi: " + url.replace(urlBaoCao.IP, ""),
                error.message
              );
            })
        // .finally(function() {
        //   intNumber++;
        //   if (intNumber == 6) {
        //     if (Object.keys(vThongBao).length == 6) {
        //       Alert.alert("Lỗi lấy dữ liệu!", "");
        //       this.setState({
        //         spinner: false,
        //         listGetSoDoDemTheoThang: [],
        //         listGetHDMBDThucHienTheoThang: [],
        //         listGetGBBQThucHienTheoThang2: [],
        //         listGetDoanhThuThucHienTheoThang: [],
        //         listGetTonThatThangTheoPPMoi: [],
        //         listGetThuongPhamThucHienTheoThang: []
        //       });
        //       Alert.alert("Lỗi lấy dữ liệu!", JSON.stringify(vThongBao));
        //     } else if (
        //       Object.keys(vThongBao).length > 0 &&
        //       Object.keys(vThongBao).length < 6
        //     ) {
        //       this.setState({
        //         spinner: false
        //       });
        //       //  console.log("Object.keys(vThongBao).length", vThongBao);
        //       Alert.alert("Lỗi lấy dữ liệu", JSON.stringify(vThongBao));
        //     }
        //   }
        // })
      )
    ).then((data) => {
      //  console.log("data:", data);
      this.setState({
        spinner: false,
        listGetSoDoDemTheoThang: data[0],
        listGetHDMBDThucHienTheoThang: data[1],
        listGetGBBQThucHienTheoThang2: data[2],
        listGetDoanhThuThucHienTheoThang: data[3],
        listGetTonThatThangTheoPPMoi: data[4],
        listGetThuongPhamThucHienTheoThang: data[5],
        listGetMTAM: data[6],
        listSoThu: data[7],
        listGiaBanTheoNam: data[8],
        listGetMTAMTongHop: data[9],
        SelectedDonVi: vMaDonVi,
        SelectedDate: vThangNam,
        lblNoiDung: (
          lblTenDonVi +
          " - BÁO CÁO TỔNG HỢP NĂM " +
          vThangNam
        ).toUpperCase(),
        lblNoiDung2: lblTenDonVi,
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
  onChangedDonVi(itemValue) {
    let lblTen = itemValue.label;
    this.callMultiAPI(this.state.SelectedDate, itemValue.key, lblTen);
  }
  onChangedDate(itemValue) {
    this.callMultiAPI(
      itemValue.key,
      this.state.SelectedDonVi,
      this.state.lblNoiDung2
    );
    //this.setState({ SelectedDate: itemValue });
  }
  parseJSON(response) {
    return response.json();
  }
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  numberWithCommasDecimal(x) {
    return x.toString().replace(".", ",");
  }
  render() {
    let tableTitle = [
      "Khách hàng",
      "Trụ sở ĐL(Thuộc TCT)",
      "Trụ sở ĐL(Không thuộc TCT)",
      "Tổng",
    ];
    let tableData = [];
    //var Highcharts = "Highcharts";
    const width = this.state.screenwidth;
    const options = {
      global: {
        useUTC: false,
      },
      lang: {
        thousandsSep: ".",
        numericSymbols: [" N", " Tr", " Tỉ", " 1000Tỉ", " Triệu tỉ", " Tỉ tỉ"],
      },
      // lang: {
      //   decimalPoint: ",",
      //   thousandsSep: "."
      // },
    };
    const options2 = {
      global: {
        useUTC: false,
      },
      lang: {
        thousandsSep: ".",
        decimalPoint: ",",
      },
    };
    let listThuongPhamKhongKeHoach=[];
    if( this.state.listGetThuongPhamThucHienTheoThang &&
      !Array.isArray(this.state.listGetThuongPhamThucHienTheoThang)
        )
        {    
          listThuongPhamKhongKeHoach.push(this.state.listGetThuongPhamThucHienTheoThang.Series[0]);
          listThuongPhamKhongKeHoach.push(this.state.listGetThuongPhamThucHienTheoThang.Series[1]);
          listThuongPhamKhongKeHoach.push(this.state.listGetThuongPhamThucHienTheoThang.Series[2]);
        //  listGiaBanTheoNam.push(this.state.listGetGBBQThucHienTheoNam.Series[1]);
        }
    var conf1 = {
      chart: {
        type: "column",
        zoomType: "xy",
      },
      title: {
        text: "Thương phẩm",
      },
      yAxis: {
        title: {
          text: "kWh",
        },
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
            formatter: function () {
              /*  if (this.y > 1000000000) {
                return Highcharts.numberFormat(this.y / 1000000000, 0) + "Tỉ";
              } else 
*/
              if (Math.abs(this.y) > 1000000) {
                return Number(Math.floor(this.y / 1000000)) + "Tr";
              } else if (Math.abs(this.y) > 1000) {
                return Number(Math.floor(this.y / 1000)) + "N";
              } else {
                return this.y;
              }
            },
          },
        },
        series: {
          allowPointSelect: true,
          marker: {
            enabled: true,
          },
        },
      },

      credits: {
        enabled: false,
      },

      xAxis: {
        categories:
          this.state.listGetThuongPhamThucHienTheoThang &&
          !Array.isArray(this.state.listGetThuongPhamThucHienTheoThang)
            ? this.state.listGetThuongPhamThucHienTheoThang.Categories
            : [],
      },
      series:listThuongPhamKhongKeHoach,

      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
          },
        ],
      },
    };

    var conf2 = {
      chart: {
        type: "column",
        zoomType: "xy",
      },
      title: {
        text: "Doanh thu",
      },
      yAxis: {
        title: {
          text: "VNĐ",
        },
      },
      plotOptions: {
        column: {
          dataLabels: {
            formatter: function () {
              if (Math.abs(this.y) > 1000000000) {
                return Number(Math.floor(this.y / 1000000000)) + "Tỉ";
              } else if (Math.abs(this.y) > 1000000) {
                return Number(Math.floor(this.y / 1000000)) + "Tr";
              } else if (Math.abs(this.y) > 1000) {
                return Number(Math.floor(this.y / 1000)) + "N";
              } else {
                return this.y;
              }
            },
            enabled: true,
          },
        },
        series: {
          allowPointSelect: true,
          marker: {
            enabled: true,
          },
        },
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories:
          this.state.listGetDoanhThuThucHienTheoThang &&
          !Array.isArray(this.state.listGetDoanhThuThucHienTheoThang)
            ? this.state.listGetDoanhThuThucHienTheoThang.Categories
            : [],
      },
      series:
        this.state.listGetDoanhThuThucHienTheoThang &&
        !Array.isArray(this.state.listGetDoanhThuThucHienTheoThang)
          ? this.state.listGetDoanhThuThucHienTheoThang.Series
          : [],

      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
          },
        ],
      },
    };
    var conf3 = {
      chart: {
        type: "line",
        zoomType: "xy",
      },
      title: {
        text: "Tổn thất",
      },
      yAxis: {
        title: {
          text: "%",
        },
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: "{point.y:.1f}",
          },
        },
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories:
          this.state.listGetTonThatThangTheoPPMoi &&
          !Array.isArray(this.state.listGetTonThatThangTheoPPMoi)
            ? this.state.listGetTonThatThangTheoPPMoi.Categories
            : [],
      },
      series:
        this.state.listGetTonThatThangTheoPPMoi &&
        !Array.isArray(this.state.listGetTonThatThangTheoPPMoi)
          ? this.state.listGetTonThatThangTheoPPMoi.Series
          : [],

      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
          },
        ],
      },
    };
    var conf4 = {
      chart: {
        type: "column",
        zoomType: "xy",
      },
      title: {
        text: "Giá bán bình quân theo tháng",
      },
      yAxis: {
        title: {
          text: "VNĐ",
        },
      },
      plotOptions: {
        column: {
          dataLabels: {
            format: "{point.y:,.0f} ",
            enabled: true,
          },
        },
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories:
          this.state.listGetGBBQThucHienTheoThang2 &&
          !Array.isArray(this.state.listGetGBBQThucHienTheoThang2)
            ? this.state.listGetGBBQThucHienTheoThang2.Categories
            : [],
      },
      series:
        this.state.listGetGBBQThucHienTheoThang2 &&
        !Array.isArray(this.state.listGetGBBQThucHienTheoThang2)
          ? this.state.listGetGBBQThucHienTheoThang2.Series
          : [],

      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
          },
        ],
      },
    };
    var conf5 = {
      chart: {
        type: "column",
        zoomType: "xy",
      },
      title: {
        text: "Số HĐMBĐ",
      },
      yAxis: {
        title: {
          text: "HĐ",
        },
      },
      plotOptions: {
        column: {
          dataLabels: {
            format: "{point.y:,.0f} ",
            enabled: true,
          },
        },
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories:
          this.state.listGetHDMBDThucHienTheoThang &&
          !Array.isArray(this.state.listGetHDMBDThucHienTheoThang)
            ? this.state.listGetHDMBDThucHienTheoThang.Categories
            : [],
      },
      series:
        this.state.listGetHDMBDThucHienTheoThang &&
        !Array.isArray(this.state.listGetHDMBDThucHienTheoThang)
          ? this.state.listGetHDMBDThucHienTheoThang.Series
          : [],

      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
          },
        ],
      },
    };
    var conf6 = {
      chart: {
        type: "line",
        zoomType: "xy",
      },
      title: {
        text: "Số công tơ",
      },
      yAxis: {
        title: {
          text: "Công tơ",
        },
      },
      plotOptions: {
        line: {
          dataLabels: {
            format: "{point.y:,.0f} ",
            enabled: true,
          },
        },
      },

      credits: {
        enabled: false,
      },
      xAxis: {
        categories:
          this.state.listGetSoDoDemTheoThang &&
          !Array.isArray(this.state.listGetSoDoDemTheoThang)
            ? this.state.listGetSoDoDemTheoThang.Categories
            : [],
      },
      series:
        this.state.listGetSoDoDemTheoThang &&
        !Array.isArray(this.state.listGetSoDoDemTheoThang)
          ? this.state.listGetSoDoDemTheoThang.Series
          : [],

      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
          },
        ],
      },
    };
    let dataMap1 = [];
    let dataMap2 = [];
    let varMapData = [];
    let tongkWh = 0;
    let tongkWh0 = 0;
    let tongkWh1 = 0;
    let tongkWh2 = 0;

    let tongkWP = 0;
    let tongkWP0 = 0;
    let tongkWP1 = 0;
    let tongkWP2 = 0;

    // See API docs for 'joinBy' for more info on linking data and map.
    if (
      this.state.listGetMTAM != undefined &&
      this.state.listGetMTAM.length > 0
    ) {
      let listDataRow = [];
      dataMap1 = JSON.parse(this.state.listGetMTAM[0].data);
      dataMap2 = JSON.parse(this.state.listGetMTAM[0].congsuat);
      varMapData = JSON.parse(this.state.listGetMTAM[0].map);

      listDataRow.push(
        this.state.listGetMTAM[0].congsuattongkhong
          .toLocaleString()
          .replace(",", "#")
          .replace(".", ",")
          .replace("#", ".")
      );
     // listDataRow.push(this.numberWithCommas(this.state.listGetMTAM[0].tonG0));
      tableData.push(listDataRow);
      listDataRow = [];
      listDataRow.push(
        this.state.listGetMTAM[0].congsuattongmot
          .toLocaleString()
          .replace(",", "#")
          .replace(".", ",")
          .replace("#", ".")
      );
     // listDataRow.push(this.numberWithCommas(this.state.listGetMTAM[0].tonG1));
      tableData.push(listDataRow);
      listDataRow = [];
      listDataRow.push(
        this.state.listGetMTAM[0].congsuattonghai
          .toLocaleString()
          .replace(",", "#")
          .replace(".", ",")
          .replace("#", ".")
      );
     // listDataRow.push(this.numberWithCommas(this.state.listGetMTAM[0].tonG2));
      tableData.push(listDataRow);
      listDataRow = [];
      listDataRow.push(
        this.state.listGetMTAM[0].congsuattong
          .toLocaleString()
          .replace(",", "#")
          .replace(".", ",")
          .replace("#", ".")
      );
   //   listDataRow.push(this.numberWithCommas(this.state.listGetMTAM[0].tong));
      tableData.push(listDataRow);
    }
    let PNam = this.state.SelectedDate.toString();
    const confMap1 = {
      chart: {
        map: varMapData,
      },
      title: {
        text: "Sản lượng phát lũy kế năm " + this.state.SelectedDate,
      },
      mapNavigation: {
        enabled: true,
        buttonOptions: {
          verticalAlign: "bottom",
        },
      },

      tooltip: {
        enabled: true,
      },

      colorAxis: {
        min: 0,
        minColor: "#E6E7E8",
        maxColor: "#DF0101",
      },
      credits: {
        enabled: false,
      },

      series: [
        {
          data: dataMap1,
          name: "Điện phát",
          joinBy: "hc_key",
          states: {
            hover: {
              color: "#BADA55",
            },
          },
          dataLabels: {
            enabled: true,
            format: "{point.name}",
          },
        },
      ],
    };
    const confMap2 = {
      chart: {
        map: varMapData,
      },
      title: {
        text: "Công suất lắp đặt(KWP)",
      },
      mapNavigation: {
        enabled: true,
        buttonOptions: {
          verticalAlign: "bottom",
        },
      },

      tooltip: {
        enabled: true,
      },

      colorAxis: {
        min: 0,
        minColor: "#E6E7E8",
        maxColor: "#DF0101",
      },
      credits: {
        enabled: false,
      },

      series: [
        {
          data: dataMap2,
          name: "CS lắp đặt",
          joinBy: "hc_key",
          states: {
            hover: {
              color: "#BADA55",
            },
          },
          dataLabels: {
            enabled: true,
            format: "{point.name}",
          },
        },
      ],
    };
    let listDonViQuanLy = [];
    {
      this.state.listDonVi.map((item, key) =>
        listDonViQuanLy.push({
          key: item.mA_DVIQLY,
          label: item.teN_DVIQLY,
          value: item.mA_DVIQLY,
        })
      );
    }
    let listThangNam = [];
    {
      this.state.listDate.map((item, key) =>
        listThangNam.push({
          key: item.VALUE,
          label: item.VALUE,
          value: item.VALUE,
        })
      );
    }
    let intThuongPhamNam = 0;
    let intThuongPhamThang = 0;
    let intThuongPhamNamTruoc = 0;
    let intThuongPhamDenThang = 0;
    let intThuongPhamDenThangCungKy = 0;
    let intThuongPhamDenThangCungKySoSanh = 0;
    let intKeHoachThuongPhamNam = 0;
    let intKeHoachThuongPhamThang = 0;
    let intHoanThanhKeHoachNam = 0.0;
    let intHoanThanhKeHoachThang = 0.0;
    let stringKeHoachThuongPhamNam = [];
    let dateNow = new Date();
    var yyyy = dateNow.getFullYear();
    var mm = dateNow.getMonth() + 1;
    let PThang=mm;
    if (mm < 10) {
      PThang = "0" + mm;
    }

    let stringSoDaThu = [];
    if (
      this.state.listGetThuongPhamThucHienTheoThang &&
      !Array.isArray(this.state.listGetThuongPhamThucHienTheoThang)
    ) {
      for (
        let i = 0;
        i < this.state.listGetThuongPhamThucHienTheoThang.Series[0].data.length;
        i++
      ) {
        intThuongPhamNam =
          intThuongPhamNam +
          this.state.listGetThuongPhamThucHienTheoThang.Series[0].data[i];
      }
      for (let i = 0; i < mm - 1; i++) {
        intThuongPhamDenThang =
          intThuongPhamDenThang +
          this.state.listGetThuongPhamThucHienTheoThang.Series[0].data[i];
      }
      for (let i = 0; i < mm - 1; i++) {
        intThuongPhamDenThangCungKy =
          intThuongPhamDenThangCungKy +
          this.state.listGetThuongPhamThucHienTheoThang.Series[1].data[i];
      }
      for (
        let i = 0;
        i < this.state.listGetThuongPhamThucHienTheoThang.Series[1].data.length;
        i++
      ) {
        intThuongPhamNamTruoc =
          intThuongPhamNamTruoc +
          this.state.listGetThuongPhamThucHienTheoThang.Series[1].data[i];
      }
      for (
        let i = 0;
        i < this.state.listGetThuongPhamThucHienTheoThang.Series[3].data.length;
        i++
      ) {
        intKeHoachThuongPhamNam =
          intKeHoachThuongPhamNam +
          this.state.listGetThuongPhamThucHienTheoThang.Series[3].data[i];
      }
      if (intKeHoachThuongPhamNam != 0) {
        intHoanThanhKeHoachNam = (
          (intThuongPhamNam * 100) /
          intKeHoachThuongPhamNam
        ).toFixed(2);
      }
      intThuongPhamThang = this.state.listGetThuongPhamThucHienTheoThang
        .Series[0].data[mm - 1];
      intKeHoachThuongPhamThang = this.state.listGetThuongPhamThucHienTheoThang
        .Series[3].data[mm - 1];
      if (intKeHoachThuongPhamThang != 0) {
        intHoanThanhKeHoachThang = (
          (intThuongPhamThang * 100) /
          intKeHoachThuongPhamThang
        ).toFixed(2);
      }
      if (intThuongPhamDenThangCungKy != 0) {
        intThuongPhamDenThangCungKySoSanh = (
          ((intThuongPhamDenThang - intThuongPhamDenThangCungKy) * 100) /
          intThuongPhamDenThangCungKy
        ).toFixed(2);
      }
      stringKeHoachThuongPhamNam.push(
        "Hoàn thành " +
          this.numberWithCommasDecimal(intHoanThanhKeHoachNam) +
          "% kế hoạch năm"
      );
      if (intThuongPhamDenThangCungKySoSanh > 0) {
        stringKeHoachThuongPhamNam.push(
          "Tăng " +
            this.numberWithCommasDecimal(intThuongPhamDenThangCungKySoSanh) +
            "% cùng kỳ năm " +
            (this.state.SelectedDate - 1)
        );
      } else {
        stringKeHoachThuongPhamNam.push(
          "Giảm " +
            this.numberWithCommasDecimal(
              Math.abs(intThuongPhamDenThangCungKySoSanh)
            ) +
            "% cùng kỳ năm " +
            (this.state.SelectedDate - 1)
        );
      }
      stringKeHoachThuongPhamNam.push(
        "Tháng " +
          mm +
          ": " +
          this.numberWithCommas(intThuongPhamThang) +
          " kWh"
      );
      stringKeHoachThuongPhamNam.push(
        "Hoàn thành " +
          this.numberWithCommasDecimal(intHoanThanhKeHoachThang) +
          "% kế hoạch tháng"
      );
      stringKeHoachThuongPhamNam.push(
        "Thương phẩm năm " +
          (this.state.SelectedDate - 1) +
          ": " +
          this.numberWithCommas(intThuongPhamNamTruoc) +
          " kWh"
      );
    }
    let intSoPhaiThu = 0;
    let intSoThu = 0;
    let intTiLeThu = 0;
    let stringTiLeThu =
      "Số phải thu " + PThang.toString() + "/" + this.state.SelectedDate;
    if (this.state.listSoThu && !Array.isArray(this.state.listSoThu)) {
      intSoThu = this.state.listSoThu.Series[1].data[0];
      intSoPhaiThu = this.state.listSoThu.Series[2].data[0];
      intTiLeThu = this.state.listSoThu.Series[3].data[0];
      stringSoDaThu.push("Đã thu " + this.numberWithCommas(intSoThu) + " đồng");
    }
    let intGiaBanNamTruoc = 0;
    let intGiaBanNam = 0;
    let intKeHoachGiaBanNamTruoc = 0;
    let intKeHoachGiaBanNam = 0;
    let strGiaBan = [];
    if (
      this.state.listGiaBanTheoNam &&
      !Array.isArray(this.state.listGiaBanTheoNam)
    ) {
      intGiaBanNamTruoc = this.state.listGiaBanTheoNam.Series[0].data[0];
      intGiaBanNam = this.state.listGiaBanTheoNam.Series[0].data[1];
      intKeHoachGiaBanNamTruoc = this.state.listGiaBanTheoNam.Series[1].data[0];
      intKeHoachGiaBanNam = this.state.listGiaBanTheoNam.Series[1].data[1];
      if (intGiaBanNam > intGiaBanNamTruoc) {
        strGiaBan.push(
          "Tăng " +
            (intGiaBanNam - intGiaBanNamTruoc)
              .toFixed(2)
              .toLocaleString()
              .replace(",", "#")
              .replace(".", ",")
              .replace("#", ".") +
            " đồng so với năm " +
            (this.state.SelectedDate - 1)
        );
      } else {
        strGiaBan.push(
          "Giảm " +
            (intGiaBanNamTruoc - intGiaBanNam)
              .toFixed(2)
              .toLocaleString()
              .replace(",", "#")
              .replace(".", ",")
              .replace("#", ".") +
            " đồng so với năm " +
            (this.state.SelectedDate - 1)
        );
      }
      if (intGiaBanNam > intKeHoachGiaBanNam) {
        strGiaBan.push(
          "Tăng " +
            (intGiaBanNam - intKeHoachGiaBanNam)
              .toFixed(2)
              .toLocaleString()
              .replace(",", "#")
              .replace(".", ",")
              .replace("#", ".") +
            " đồng so với kế hoạch"
        );
      } else {
        strGiaBan.push(
          "Giảm " +
            (intKeHoachGiaBanNam - intGiaBanNam)
              .toFixed(2)
              .toLocaleString()
              .replace(",", "#")
              .replace(".", ",")
              .replace("#", ".") +
            " đồng so với kế hoạch"
        );
      }
    }
    let intTongCongSuat = 0;
    let intCongSuat = 0;
    let intKeHoachMTMN = 0.0;
    let intHoanThanhKeHoach = 0.0;
    let strMTMN = "";
    let strMTMNHienTai = [];
    if (
      this.state.listGetMTAMTongHop &&
      !Array.isArray(this.state.listGetMTAMTongHop)
    ) {
      intCongSuat = this.state.listGetMTAMTongHop.Series[0].data[0];
      intTongCongSuat = this.state.listGetMTAMTongHop.Series[1].data[0];
      intKeHoachMTMN = this.state.listGetMTAMTongHop.Series[2].data[0];
      strMTMN = this.state.listGetMTAMTongHop.Series[3].data[0];
      strMTMNHienTai.push("Lắp đặt " +this.state.SelectedDate+": " + intCongSuat.toLocaleString()
      .replace(",", "#")
      .replace(".", ",")
      .replace("#", ".") + " MWp");
    }
    return (
      <View style={{ flex: 1 }}>
        <Text
          style={{
            backgroundColor: "#4f9deb",
            color: "white",
            fontSize: 18,
            textAlign: "center",
            alignItems: "center",
            marginTop: 25,
          }}
        >
          {this.state.lblNoiDung}
        </Text>
        <Spinner
          visible={this.state.spinner}
          textContent={"Đang lấy số liệu..."}
          textStyle={styles.spinnerTextStyle}
        />
        <ScrollView
          key={Math.random()}
          style={{
            backgroundColor: "white",
          }}
        >
          <View style={styles.chart}>
            <View style={{ marginTop: -20 }}>
              <PricingCard
                color="#4f9deb"
                title="Thương phẩm"
                price={this.numberWithCommas(intThuongPhamNam) + " kWh"}
                //  info1={["Hoàn thành 80% kế hoạch năm", "Tăng 10% so với năm 2019","Tháng 3: 5000 ty KWh",  "Hoàn thành: 99% kế hoạch tháng",  "Thương phẩm năm 2019: 19000 ti"]}
                info={stringKeHoachThuongPhamNam}
                // info={[
                //   "Hoàn thành "+{this.numberWithCommas(intHoanThanhKeHoachNam)}+"% kế hoạch năm",
                //   "Tăng 10% so với năm 2019",
                //   "Tháng 3: 5000 ty KWh",
                //   "Hoàn thành: 99% kế hoạch tháng",
                //   "Thương phẩm năm 2019: 19000 ti",
                // ]}
                // info={[""]}
                button={{
                  title:
                    "Kế hoạch năm " +
                    this.numberWithCommas(intKeHoachThuongPhamNam) +
                    " kWh",
                  icon: "monetization-on",
                }}
                infoStyle={{ color: "black", fontSize: 13 }}
              />
            </View>
            <View style={{ marginTop: -20 }}>
              <PricingCard
                color="#4CAF50"
                title="GBBQ"
                price={
                  intGiaBanNam
                    .toLocaleString()
                    .replace(",", "#")
                    .replace(".", ",")
                    .replace("#", ".") + " đồng"
                }
                // info1={["Hanh van THuong"]}
                info={strGiaBan}
                // info={[""]}
                button={{
                  title:
                    "Kế hoạch " +
                    this.numberWithCommas(intKeHoachGiaBanNam) +
                    " đồng",
                  icon: "monetization-on",
                }}
                infoStyle={{ color: "black", fontSize: 13 }}
              />
            </View>
            <View style={{ marginTop: -20 }}>
              <PricingCard
                color="#ef0202"
                title={stringTiLeThu}
                price={this.numberWithCommas(intSoPhaiThu) + " đồng"}
                // info1={["Hanh van THuong"]}
                info={stringSoDaThu}
                // info={[""]}
                button={{
                  title: "Hoàn thành " + intTiLeThu + "%",
                  icon: "monetization-on",
                }}
                infoStyle={{ color: "black", fontSize: 17 }}
              />
            </View>
            <View style={{ marginTop: -20 }}>
              <PricingCard
                color="#FF9800"
                title="Công suất NLMTMN khách hàng đang vận hành"
                price={intTongCongSuat.toLocaleString()
                    .replace(",", "#")
                    .replace(".", ",")
                    .replace("#", ".") + "  MWp"}
                // info1={["Hanh van THuong"]}
                info={strMTMNHienTai}
                // info={[""]}
                button={{
                  title: strMTMN,
                  icon: "monetization-on",
                }}
                infoStyle={{ color: "black", fontSize: 17 }}
              />
            </View>
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
              options={options2}
              originWhitelist={[""]}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
            <View style={{ backgroundColor: "orange", height: 1 }} />
            <ChartView
              style={{ height: 400 }}
              config={conf4}
              options={options2}
              originWhitelist={[""]}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
            <View style={{ backgroundColor: "orange", height: 1 }} />
            <ChartView
              style={{ height: 400 }}
              config={conf5}
              options={options}
              originWhitelist={[""]}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
            <View style={{ backgroundColor: "orange", height: 1 }} />
            <ChartView
              style={{ height: 400 }}
              config={conf6}
              options={options}
              originWhitelist={[""]}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
            <View style={{ backgroundColor: "orange", height: 1 }} />
            <View style={styles.container2}>
              <Table borderStyle={{ borderWidth: 1 }}>
                <Row
                  data={["TÌNH HÌNH PHÁT TRIỂN ĐMTMN EVNSPC"]}
                  flexArr={[2]}
                  style={styles.head}
                  textStyle={styles.text}
                />
                <Row
                  data={this.state.tableHead}
                  flexArr={[2, 1]}
                  style={styles.head}
                  textStyle={styles.text}
                />
                <TableWrapper style={styles.wrapper}>
                  <Col
                    data={tableTitle}
                    style={styles.title}
                    heightArr={[28]}
                    textStyle={styles.text}
                  />
                  <Rows
                    data={tableData}
                    flexArr={[1]}
                    style={styles.row}
                    textStyle={styles.text}
                  />
                </TableWrapper>
              </Table>
            </View>
            {/* <ChartMapView
              style={{ height: 400 }}
              config={confMap1}
              mapChart={true}
              //  title={"Tình hình phát triển ĐMTMN EVNPSC "}
              options={options}
              //data={dataMap}
              originWhitelist={[""]}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            ></ChartMapView>
            <View style={{ backgroundColor: "orange", height: 1 }} /> */}
            <ChartMapView
              style={{ height: 400 }}
              config={confMap2}
              mapChart={true}
              //  title={"Tình hình phát triển ĐMTMN EVNPSC "}
              options={options2}
              //data={dataMap}
              originWhitelist={[""]}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            ></ChartMapView>
          </View>
          <View style={{ height: 1, backgroundColor: "orange" }} />
          <View style={styles.chart}>
            {/* <Card title="CARD WITH DIVIDER"> */}
            {/* </Card> */}
            <ModalSelector
              data={listDonViQuanLy}
              initValue={this.state.TEN_DVIQLY2}
              onChange={(option) => {
                this.onChangedDonVi(option);
              }}
              //  alert(`${option.label} (${option.key}) nom nom nom`);
            />
            <ModalSelector
              style={{ marginTop: 10 }}
              data={listThangNam}
              initValue={this.state.SelectedDate}
              onChange={(option) => {
                this.onChangedDate(option);
              }}
              //  alert(`${option.label} (${option.key}) nom nom nom`);
            />
            <Text
              style={{
                backgroundColor: "#F44336",
                color: "white",
                fontSize: 14,
                textAlign: "center",
                alignItems: "center",
                marginTop: 25,
              }}
            >
              {this.state.lblNoiDung3}
            </Text>
            {/* <ButtonCustom label="Lấy dữ liệu" onPress={this.callMultiAPI} /> */}
          </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  chart: {
    flex: 1,
    paddingTop: 20,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 10,
    backgroundColor: "white",
  },
  spinnerTextStyle: {
    color: "brown",
  },

  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  container2: { flex: 1, padding: 10, backgroundColor: "#fff" },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  wrapper: { flexDirection: "row" },
  title: { flex: 2, backgroundColor: "#f6f8fa" },
  row: { height: 28 },
  text: { textAlign: "center" },
});
