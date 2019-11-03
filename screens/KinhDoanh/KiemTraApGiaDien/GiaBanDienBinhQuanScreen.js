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

export default class ThanhPhanPhuTaiScreen extends React.PureComponent {
  static navigationOptions = {
    title: "Giá bán điện bình quân"
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
      listGetSoNongGBBQTrongThang: [],
      listGetSoLieuGBBQ: [],
      listLaySoLieuSoSanhGBBQ: [],
      listGetGBBQThucHienTheoThang: [],
      listGetGBBQThucHienTheoNam: [],
      listGetGBBQKeHoach: [],
      listGetGBBQNhomNNTheoThang: [],
      listGetGBBQCapDATheoThang: [],
      listGetGBBQLuyKeCapDuoi: [],
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
    let TuThang = 1;
    let Nam = vThangNam.split("/")[1];
    let NamTruoc = vThangNam.split("/")[1] - 1;
    let param1 = vMaDonVi + "/" + Thang + "/" + Nam;
    let param2 = vMaDonVi + "/" + TuThang + "/" + Thang + "/" + Nam;
    let param3 = vMaDonVi + "/" + NamTruoc + "/" + Nam;
    const urls = [
      //  urlBaoCao.GetSoNongGBBQTrongThang + param1, //MaDonVi, Thang, Nam
      //   urlBaoCao.GetSoLieuGBBQ + param1, //MaDonVi, Thang, Nam
      urlBaoCao.LaySoLieuSoSanhGBBQ + param1, //MaDonVi, Thang, Nam
      urlBaoCao.GetGBBQThucHienTheoThang + param2, //MaDonVi, TuThang, DenThang, Nam
      urlBaoCao.GetGBBQThucHienTheoNam + param3, //MaDonVi, TuNam, DenNam
      //   urlBaoCao.GetGBBQKeHoach + param3, //MaDonVi, TuNam, DenNam
      urlBaoCao.GetGBBQNhomNNTheoThang + param1, //MaDonVi, Thang, Nam
      //   urlBaoCao.GetGBBQCapDATheoThang + param1, //MaDonVi, Thang, Nam,
      urlBaoCao.GetGBBQLuyKeCapDuoi + param1 //MaDonVi, Thang, Nam
    ];

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
        SelectedDonVi: vMaDonVi,
        SelectedDate: vThangNam,
        // listGetSoNongGBBQTrongThang: data[0],
        //listGetSoLieuGBBQ: data[1],
        listLaySoLieuSoSanhGBBQ: data[0],
        listGetGBBQThucHienTheoThang: data[1],
        listGetGBBQThucHienTheoNam: data[2],
        //  listGetGBBQKeHoach: data[3],
        listGetGBBQNhomNNTheoThang: data[3],
        //listGetGBBQCapDATheoThang: data[7],
        listGetGBBQLuyKeCapDuoi: data[4],
        spinner: false
      });
    });

    // this.performTimeConsumingTask();
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
    var conf1 = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "So sánh giá bình quân"
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
          this.state.listLaySoLieuSoSanhGBBQ &&
          !Array.isArray(this.state.listLaySoLieuSoSanhGBBQ)
            ? this.state.listLaySoLieuSoSanhGBBQ.Categories
            : []
      },
      series:
        this.state.listLaySoLieuSoSanhGBBQ &&
        !Array.isArray(this.state.listLaySoLieuSoSanhGBBQ)
          ? this.state.listLaySoLieuSoSanhGBBQ.Series
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
        text: "Giá bán bình quân theo nghành nghề"
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
          this.state.listGetGBBQNhomNNTheoThang &&
          !Array.isArray(this.state.listGetGBBQNhomNNTheoThang)
            ? this.state.listGetGBBQNhomNNTheoThang.Categories
            : []
      },
      series:
        this.state.listGetGBBQNhomNNTheoThang &&
        !Array.isArray(this.state.listGetGBBQNhomNNTheoThang)
          ? this.state.listGetGBBQNhomNNTheoThang.Series
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
        text: "Biểu đồ giá bình quân từng tháng"
      },
      yAxis: {
        title: {
          text: "VNĐ"
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
        // series: {
        //   borderWidth: 0,
        //   dataLabels: {
        //     enabled: true,
        //     format: "{point.y:.0f}"
        //   },
        //   colorByPoint: true
        // }
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories:
          this.state.listGetGBBQThucHienTheoThang &&
          !Array.isArray(this.state.listGetGBBQThucHienTheoThang)
            ? this.state.listGetGBBQThucHienTheoThang.Categories
            : []
      },
      series:
        this.state.listGetGBBQThucHienTheoThang &&
        !Array.isArray(this.state.listGetGBBQThucHienTheoThang)
          ? this.state.listGetGBBQThucHienTheoThang.Series
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
        type: "line",
        zoomType: "xy"
      },
      title: {
        text: "Giá bình quân từng năm"
      },
      yAxis: {
        title: {
          text: "VNĐ"
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
        // series: {
        //   borderWidth: 0,
        //   dataLabels: {
        //     enabled: true,
        //     format: "{point.y:.0f}"
        //   },
        //   colorByPoint: true
        // }
      },
      credits: {
        enabled: false
      },

      xAxis: {
        categories:
          this.state.listGetGBBQThucHienTheoNam &&
          !Array.isArray(this.state.listGetGBBQThucHienTheoNam)
            ? this.state.listGetGBBQThucHienTheoNam.Categories
            : []
      },
      series:
        this.state.listGetGBBQThucHienTheoNam &&
        !Array.isArray(this.state.listGetGBBQThucHienTheoNam)
          ? this.state.listGetGBBQThucHienTheoNam.Series
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
        text: "Giá bình quân các đơn vị cấp dưới tháng " + this.state.SelectedDate
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
          this.state.listGetGBBQLuyKeCapDuoi &&
          !Array.isArray(this.state.listGetGBBQLuyKeCapDuoi)
            ? this.state.listGetGBBQLuyKeCapDuoi.Categories
            : []
      },
      series:
        this.state.listGetGBBQLuyKeCapDuoi &&
        !Array.isArray(this.state.listGetGBBQLuyKeCapDuoi)
          ? this.state.listGetGBBQLuyKeCapDuoi.Series
          : []
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
            <View style={{ height: 1, backgroundColor: "orange" }} />
            <View style={{ flexDirection: width >= 600 ? "row" : "column" }}>
              <ChartView
                style={{ height: 500, width: vChieuRong32 }}
                config={conf3}
                options={options}
                originWhitelist={[""]}
                javaScriptEnabled={true}
                domStorageEnabled={true}
              />
              <ChartView
                style={{ height: 500, width: vChieuRong31 }}
                config={conf4}
                options={options}
                originWhitelist={[""]}
                javaScriptEnabled={true}
                domStorageEnabled={true}
              />
            </View>
            <View style={{ height: 1, backgroundColor: "orange" }} />
            <View style={styles.chart}>
              <ChartView
                style={{ height: 500 }}
                config={conf5}
                options={options}
                originWhitelist={[""]}
                javaScriptEnabled={true}
                domStorageEnabled={true}
              />
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
  }
});
