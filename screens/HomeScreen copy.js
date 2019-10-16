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
import registerForPushNotificationsAsync from "../networking/registerForPushNotificationsAsync";
import { Notifications } from "expo";
import * as firebase from "firebase";
import { YellowBox } from "react-native";
import _ from "lodash";

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
      error: ""
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
            USERID: userData.userid,
            USERNAME: userData.username,
            CAP_DVI: userData.caP_DVI,
            SelectedDonVi: userData.mA_DVIQLY,
            emailfb: userData.email,
            passwordfb: userData.passwordfb,
            spinner: false
          });
          //  console.log('userData.email', userData.email);
          //  console.log('userData.passwordfb', userData.passwordfb);
          this._notificationSubscription = this._registerForPushNotifications(
            userData.email,
            userData.passwordfb
          );
          //this.callMultiAPI();
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
  }
  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
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
  renderTabBar() {
    return <StatusBar hidden />;
  }
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
            .catch(error =>
              vThongBao.push({ "Loi:": url + ", " + error.message })
            )
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
  _registerForPushNotifications(emailfb, passwordfb) {
    // Send our push token over to our backend so we can receive notifications
    // You can comment the following line out if you want to stop receiving
    // a notification every time you open the app. Check out the source
    // for this function in api/registerForPushNotificationsAsync.js
    // firebase
    //   .auth()
    //   .createUserWithEmailAndPassword(
    //     "hathuyjp@gmail.com",
    //     "Tranvanhanh_79"
    //   )
    //   .then(() => {
    //     console.log("createUserWithEmailAndPassword: ", "ok");
    //   })
    //   .catch(error => {
    //     console.log("createUserWithEmailAndPassword: ", error.message);
    //   });
    firebase
      .auth()
      .signInWithEmailAndPassword(emailfb, passwordfb)
      .then(() => {
        //   console.log("loginfb: ", "success");
      })
      .catch(error => {
        //    console.log(this.state.emailfb, error.message);
      });
    var currentUser;
    var that = this;
    listener = firebase.auth().onAuthStateChanged(function(user) {
      // console.log("listener:", listener);
      // console.log("currentUser:", currentUser);
      // console.log("user:", user);
      if (user != null) {
        currentUser = user;
        registerForPushNotificationsAsync();
      }

      listener();
    });
    // Watch for incoming notifications
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }
  _handleNotification = notification => {
    this.userIDfirebase = firebase.auth().currentUser.uid;
    //  console.log("this.userIDfirebase: ", this.userIDfirebase);
    this.props.navigation.navigate("NhanDinhThongBaoScreen");
    this.setState({ notification: notification });

    firebase
      .database()
      .ref("users/" + this.userIDfirebase + "/notifications")
      .push(notification.data);
  };
  render() {
    const width = this.state.screenwidth;
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
    var conf1 = {
      chart: {
        type: "line",
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
        line: {
          dataLabels: {
            format: "{point.y:,.0f} ",
            enabled: true
          },
          colorByPoint: true
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
        text: "Giá bán"
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
        text: "Đo đếm"
      },
      yAxis: {
        title: {
          text: "TB"
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
    var conf10 = {
      chart: {
        type: "line",
        zoomType: "xy"
      },
      title: {
        text: "Solar Employment Growth by Sector, 2010-2016"
      },

      subtitle: {
        text: "Source: thesolarfoundation.com"
      },

      yAxis: {
        title: {
          text: "Number of Employees"
        }
      },
      legend: {
        layout: "vertical",
        align: "right",
        verticalAlign: "middle"
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: false
          },
          pointStart: 2010
        }
      },

      series: [
        {
          name: "Installation",
          data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
        },
        {
          name: "Manufacturing",
          data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
        },
        {
          name: "Sales & Distribution",
          data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
        },
        {
          name: "Project Development",
          data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
        },
        {
          name: "Other",
          data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
        }
      ],

      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: "horizontal",
                align: "center",
                verticalAlign: "bottom"
              }
            }
          }
        ]
      }
    };
    return (
      <View style={{ flex: 1 }}>
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
    color: "black"
  }
});
