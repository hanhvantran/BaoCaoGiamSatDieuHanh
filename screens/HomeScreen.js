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
import urlBaoCao from "../networking/services";
import ChartView from "react-native-highcharts";
import ButtonCustom from "../components/ButtonCustom";
import Spinner from "react-native-loading-spinner-overlay";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import { YellowBox } from "react-native";
import _ from "lodash";
////"main": "node_modules/expo/AppEntry.js",
export default class HomeScreen extends React.PureComponent {
  static navigationOptions = {
    title: null,
    header: null
  };
  constructor(props) {
    super(props);
    YellowBox.ignoreWarnings(["Setting a timer"]);
    const _console = _.clone(console);
    console.warn = message => {
      if (message.indexOf("Setting a timer") <= -1) {
        _console.warn(message);
      }
    };
    this.state = {
      FULLNAME: "",
      MA_DVICTREN: "",
      MA_DVIQLY: "",
      TEN_DVIQLY: "",
      USERID: 0,
      USERNAME: "",
      CAP_DVI: "",
      SelectedDonVi: "",
      orientation: "",
      screenheight: Dimensions.get("window").height,
      screenwidth: Dimensions.get("window").width,
      listGetSoDoDemTheoThang: [],
      listGetHDMBDThucHienTheoThang: [],
      listGetGBBQThucHienTheoThang2: [],
      listGetDoanhThuThucHienTheoThang: [],
      listGetTonThatThangTheoPPMoi: [],
      listGetThuongPhamThucHienTheoThang: [],
      spinner: false,
      emailfb: "",
      passwordfb: "",
      notification: {},
      userIDfirebase: "",
      notificationsAvailable: [],
      error: "",
      lblNoiDung: ""
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
      .then(response => response.json())
      .then(responseJson => {
        //console.log("UpdateToKen:", "OK");
      })
      .catch(error => {
        // console.log("UpdateToKen:", error);
      });
    // POST the token to your backend server from where you can retrieve it to send push notifications.
  }
  _bootstrapAsync = async () => {
    try {
      AsyncStorage.getItem("UserInfomation").then(user_data_json => {
        let userData = JSON.parse(user_data_json);
        if (userData == undefined) {
          var { navigate } = this.props.navigation;
          navigate("LoginScreen");
        } else {
          let Nam = new Date().getFullYear();

          this.setState({
            FULLNAME: userData.fullname,
            MA_DVICTREN: userData.mA_DVICTREN,
            MA_DVIQLY: userData.mA_DVIQLY,
            TEN_DVIQLY: userData.mA_DVIQLY + " - " + userData.teN_DVIQLY,
            USERID: userData.userid,
            USERNAME: userData.username,
            CAP_DVI: userData.caP_DVI,
            SelectedDonVi: userData.mA_DVIQLY,
            emailfb: userData.email,
            passwordfb: userData.passwordfb,
            spinner: false,
            lblNoiDung: userData.teN_DVIQLY2 + " - BÁO CÁO TỔNG HỢP NĂM " + Nam
          });
          this.registerForPushNotificationsAsync(
            userData.username,
            userData.mA_DVIQLY
          );
          this.callMultiAPI();
        }
      });
    } catch (error) {
      Alert.alert("AsyncStorage error", error.message);
    }
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

  _handleNotification = notification => {
    console.log("notification: ", notification);
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
  callMultiAPI = async () => {
    let vThongBao = [];
    let intNumber = 0;
    this.setState({
      spinner: true
    });
    let Thang = new Date().getMonth() + 1;
    let Nam = new Date().getFullYear();
    let NamTruoc = new Date().getFullYear() - 1;
    let param1 = this.state.MA_DVIQLY + "/1/" + Thang + "/" + Nam;
    let param2 =
      this.state.MA_DVIQLY + "/12/" + NamTruoc + "/" + Thang + "/" + Nam;
    const urls = [
      urlBaoCao.GetSoDoDemTheoThang + param1, //MaDonVi, Thang, Nam
      urlBaoCao.GetHDMBDThucHienTheoThang + param1, //MaDonVi, Thang, Nam
      urlBaoCao.GetGBBQThucHienTheoThang2 + param1, //MaDonVi, Thang, Nam
      urlBaoCao.GetDoanhThuThucHienTheoThang + param1, //MaDonVi, TuThang, DenThang, Nam
      urlBaoCao.GetTonThatThangTheoPPMoi + param2, //MaDonVi, TuNam, DenNam
      urlBaoCao.GetThuongPhamThucHienTheoThang + param1
    ];
    // use map() to perform a fetch and handle the response for each url
    Promise.all(
      urls.map(
        url =>
          fetch(url)
            .then(this.checkStatus)
            .then(this.parseJSON)
            .catch(error => {
              this.setState({
                spinner: false
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
    ).then(data => {
      //  console.log("data:", data);
      this.setState({
        spinner: false,
        listGetSoDoDemTheoThang: data[0],
        listGetHDMBDThucHienTheoThang: data[1],
        listGetGBBQThucHienTheoThang2: data[2],
        listGetDoanhThuThucHienTheoThang: data[3],
        listGetTonThatThangTheoPPMoi: data[4],
        listGetThuongPhamThucHienTheoThang: data[5]
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
  numberWithCommas(x) {
    return Math.numericSymbols(
      x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    );
  }
  render() {
    //var Highcharts = "Highcharts";
    const width = this.state.screenwidth;
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
    var conf1 = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "Thương phẩm"
      },
      yAxis: {
        title: {
          text: "kWh"
        }
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
            formatter: function() {
              /*  if (this.y > 1000000000) {
                return Highcharts.numberFormat(this.y / 1000000000, 0) + "Tỉ";
              } else 
*/
              if (this.y > 1000000) {
                return Number(Math.floor(this.y / 1000000)) + "Tr";
              } else if (this.y > 1000) {
                return Number(Math.floor(this.y / 1000)) + "N";
              } else {
                return this.y;
              }
            }
          }
        },
        series: {
          allowPointSelect: true,
          marker: {
            enabled: true
          }
        }
      },

      credits: {
        enabled: false
      },

      xAxis: {
        categories:
          this.state.listGetThuongPhamThucHienTheoThang &&
          !Array.isArray(this.state.listGetThuongPhamThucHienTheoThang)
            ? this.state.listGetThuongPhamThucHienTheoThang.Categories
            : []
      },
      series:
        this.state.listGetThuongPhamThucHienTheoThang &&
        !Array.isArray(this.state.listGetThuongPhamThucHienTheoThang)
          ? this.state.listGetThuongPhamThucHienTheoThang.Series
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

    var conf2 = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "Doanh thu"
      },
      yAxis: {
        title: {
          text: "VNĐ"
        }
      },
      plotOptions: {
        column: {
          dataLabels: {
            formatter: function() {
              if (this.y > 1000000000) {
                return Number(Math.floor(this.y / 1000000000)) + "Tỉ";
              } else if (this.y > 1000000) {
                return Number(Math.floor(this.y / 1000000)) + "Tr";
              } else if (this.y > 1000) {
                return Number(Math.floor(this.y / 1000)) + "N";
              } else {
                return this.y;
              }
            },
            enabled: true
          }
        },
        series: {
          allowPointSelect: true,
          marker: {
            enabled: true
          }
        }
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories:
          this.state.listGetDoanhThuThucHienTheoThang &&
          !Array.isArray(this.state.listGetDoanhThuThucHienTheoThang)
            ? this.state.listGetDoanhThuThucHienTheoThang.Categories
            : []
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
              maxWidth: 500
            }
          }
        ]
      }
    };
    var conf3 = {
      chart: {
        type: "line",
        zoomType: "xy"
      },
      title: {
        text: "Tổn thất"
      },
      yAxis: {
        title: {
          text: "%"
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
          this.state.listGetTonThatThangTheoPPMoi &&
          !Array.isArray(this.state.listGetTonThatThangTheoPPMoi)
            ? this.state.listGetTonThatThangTheoPPMoi.Categories
            : []
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
        text: "Giá bán bình quân theo tháng"
      },
      yAxis: {
        title: {
          text: "VNĐ"
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
          this.state.listGetGBBQThucHienTheoThang2 &&
          !Array.isArray(this.state.listGetGBBQThucHienTheoThang2)
            ? this.state.listGetGBBQThucHienTheoThang2.Categories
            : []
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
        text: "Số HĐMBĐ"
      },
      yAxis: {
        title: {
          text: "HĐ"
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
          this.state.listGetHDMBDThucHienTheoThang &&
          !Array.isArray(this.state.listGetHDMBDThucHienTheoThang)
            ? this.state.listGetHDMBDThucHienTheoThang.Categories
            : []
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
              maxWidth: 500
            }
          }
        ]
      }
    };
    var conf6 = {
      chart: {
        type: "line",
        zoomType: "xy"
      },
      title: {
        text: "Số công tơ"
      },
      yAxis: {
        title: {
          text: "Công tơ"
        }
      },
      plotOptions: {
        line: {
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
          this.state.listGetSoDoDemTheoThang &&
          !Array.isArray(this.state.listGetSoDoDemTheoThang)
            ? this.state.listGetSoDoDemTheoThang.Categories
            : []
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
              maxWidth: 500
            }
          }
        ]
      }
    };

    return (
      <View style={{ flex: 1 }}>
        <Text
          style={{
            backgroundColor: "orange",
            color: "white",
            fontSize: 18,
            textAlign: "center",
            alignItems: "center",
            marginTop: 25
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
            backgroundColor: "white"
          }}
        >
          <View style={styles.chart}>
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
          </View>
          <View style={{ height: 1, backgroundColor: "orange" }} />
          <View style={styles.chart}>
            {/* <Card title="CARD WITH DIVIDER"> */}
            {/* </Card> */}
            <ButtonCustom label="Lấy dữ liệu" onPress={this.callMultiAPI} />
          </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  chart: {
    flex: 1,
    paddingTop: 20,
    paddingLeft: 5,
    paddingBottom: 10,
    backgroundColor: "white"
  },
  spinnerTextStyle: {
    color: "brown"
  }
});
