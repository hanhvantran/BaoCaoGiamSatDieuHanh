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
export default class KetQuaKiemTraApGiaScreen extends React.PureComponent {
  static navigationOptions = {
    title: "Kiểm tra áp giá"
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
      listDaTa1: [],
      listDaTa2: [],
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
          this.setState({ spinner: false });
          Alert.alert("Thông báo", "Không có dữ liệu!");
        }
      })
      .catch(error => {
        this.setState({ spinner: false });
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

    const urls = [
      urlBaoCao.GET_SoLuotKiemTraApGia + param1,
      urlBaoCao.GET_KetQuaKiemTraApGia + param1
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
        spinner: false,
        SelectedDonVi: vMaDonVi,
        SelectedDate: vThangNam,
        listDaTa1: data[0],
        listDaTa2: data[1]
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
    const height = this.state.screenheight - 50;
    let Thang = this.state.SelectedDate.split("/")[0];
    let Nam = this.state.SelectedDate.split("/")[1];
    let ThangTruoc = Thang - 1;
    let NamTruoc = Nam;
    if (Thang == 1) {
      ThangTruoc = 12;
      NamTruoc = Nam - 1;
    }
    let list1 = [];
    if (
      this.state.listDaTa1 &&
      !Array.isArray(this.state.listDaTa1) &&
      this.state.listDaTa1.Series != null
    ) {
      list1.push(this.state.listDaTa1.Series[0]);
      list1.push(this.state.listDaTa1.Series[1]);
    }
    let list2 = [];
    let list3 = [];
    let list4 = [];
    let list5 = [];
    let varCategories2 = [];

    if (
      this.state.listDaTa2 &&
      !Array.isArray(this.state.listDaTa2) &&
      this.state.listDaTa2.Series != null
    ) {
      let intSoHoKhongDoi = 0;
      for (let i = 0; i < this.state.listDaTa2.Series[0].data.length; i++) {
        intSoHoKhongDoi =
          intSoHoKhongDoi + this.state.listDaTa2.Series[0].data[i];
      }
      let intSoHoKhongDoiLuyKe = 0;
      for (let i = 0; i < this.state.listDaTa2.Series[7].data.length; i++) {
        intSoHoKhongDoiLuyKe =
          intSoHoKhongDoiLuyKe + this.state.listDaTa2.Series[7].data[i];
      }
      let intSoTang = 0;
      for (let i = 0; i < this.state.listDaTa2.Series[1].data.length; i++) {
        intSoTang = intSoTang + this.state.listDaTa2.Series[1].data[i];
      }
      let intSoTangLuyKe = 0;
      for (let i = 0; i < this.state.listDaTa2.Series[8].data.length; i++) {
        intSoTangLuyKe =
          intSoTangLuyKe + this.state.listDaTa2.Series[8].data[i];
      }
      let intSoGiam = 0;
      for (let i = 0; i < this.state.listDaTa2.Series[2].data.length; i++) {
        intSoGiam = intSoGiam + this.state.listDaTa2.Series[2].data[i];
      }
      let intSoGiamLuyKe = 0;
      for (let i = 0; i < this.state.listDaTa2.Series[9].data.length; i++) {
        intSoGiamLuyKe =
          intSoGiamLuyKe + this.state.listDaTa2.Series[9].data[i];
      }
      let intThayDoiTiLeGia = 0;
      for (let i = 0; i < this.state.listDaTa2.Series[3].data.length; i++) {
        intThayDoiTiLeGia =
          intThayDoiTiLeGia + this.state.listDaTa2.Series[3].data[i];
      }
      let intThayDoiTiLeGiaLuyKe = 0;
      for (let i = 0; i < this.state.listDaTa2.Series[10].data.length; i++) {
        intThayDoiTiLeGiaLuyKe =
          intThayDoiTiLeGiaLuyKe + this.state.listDaTa2.Series[10].data[i];
      }
      let intThayDoiNhomGia = 0;
      for (let i = 0; i < this.state.listDaTa2.Series[4].data.length; i++) {
        intThayDoiNhomGia =
          intThayDoiNhomGia + this.state.listDaTa2.Series[4].data[i];
      }
      let intThayDoiNhomGiaLuyKe = 0;
      for (let i = 0; i < this.state.listDaTa2.Series[11].data.length; i++) {
        intThayDoiNhomGiaLuyKe =
          intThayDoiNhomGiaLuyKe + this.state.listDaTa2.Series[11].data[i];
      }
      let intKhongThayDoi = 0;
      for (let i = 0; i < this.state.listDaTa2.Series[5].data.length; i++) {
        intKhongThayDoi =
          intKhongThayDoi + this.state.listDaTa2.Series[5].data[i];
      }
      let intKhongThayDoiLuyKe = 0;
      for (let i = 0; i < this.state.listDaTa2.Series[12].data.length; i++) {
        intKhongThayDoiLuyKe =
          intKhongThayDoiLuyKe + this.state.listDaTa2.Series[12].data[i];
      }
      let intTong = 0;
      for (let i = 0; i < this.state.listDaTa2.Series[6].data.length; i++) {
        intTong = intTong + this.state.listDaTa2.Series[6].data[i];
      }
      let intTongLuyKe = 0;
      for (let i = 0; i < this.state.listDaTa2.Series[13].data.length; i++) {
        intTongLuyKe = intTongLuyKe + this.state.listDaTa2.Series[13].data[i];
      }
      varCategories2.push("Số hộ không đổi");
      //varCategories2.push("Số hộ không đổi luỹ kế");
      varCategories2.push("Số hộ tăng");
      //varCategories2.push("Số hộ tăng luỹ kế");
      varCategories2.push("Số hộ giảm");
      // varCategories2.push("Số hộ giảm luỹ kế");
      varCategories2.push("Thay đổi tỉ lệ giá");
      // varCategories2.push("Thay đổi tỉ lệ giá luỹ kế");
      varCategories2.push("Thay đổi nhóm giá");
      // varCategories2.push("Thay đổi nhóm giá luỹ kế");
      varCategories2.push("Không thay đổi");
      // varCategories2.push("Không thay đổi luỹ kế");
      varCategories2.push("Tổng");
      // varCategories2.push("Tổng luỹ kế");

      list2.push(intSoHoKhongDoi);
      list3.push(intSoHoKhongDoiLuyKe);
      list2.push(intSoTang);
      list3.push(intSoTangLuyKe);
      list2.push(intSoGiam);
      list3.push(intSoGiamLuyKe);
      list2.push(intThayDoiTiLeGia);
      list3.push(intThayDoiTiLeGiaLuyKe);
      list2.push(intThayDoiNhomGia);
      list3.push(intThayDoiNhomGiaLuyKe);
      list2.push(intKhongThayDoi);
      list3.push(intKhongThayDoiLuyKe);
      list2.push(intTong);
      list3.push(intTongLuyKe);

      list4.push(this.state.listDaTa2.Series[0]);
      list4.push(this.state.listDaTa2.Series[1]);
      list4.push(this.state.listDaTa2.Series[2]);
      list4.push(this.state.listDaTa2.Series[3]);
      list4.push(this.state.listDaTa2.Series[4]);
      list4.push(this.state.listDaTa2.Series[5]);
      list4.push(this.state.listDaTa2.Series[6]);

      list5.push(this.state.listDaTa2.Series[7]);
      list5.push(this.state.listDaTa2.Series[8]);
      list5.push(this.state.listDaTa2.Series[9]);
      list5.push(this.state.listDaTa2.Series[10]);
      list5.push(this.state.listDaTa2.Series[11]);
      list5.push(this.state.listDaTa2.Series[12]);
      list5.push(this.state.listDaTa2.Series[13]);
    }
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
        text: "Số lượt kiểm tra áp giá"
      },
      yAxis: {
        title: {
          text: "Số lượt"
        }
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories:
          this.state.listDaTa1 && !Array.isArray(this.state.listDaTa1)
            ? this.state.listDaTa1.Categories
            : []
      },
      series: list1,
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
        text: "Kết quả kiểm tra áp giá"
      },
      yAxis: {
        title: {
          text: "Số lượt"
        }
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories: varCategories2
      },
      series: [
        {
          name: "Tháng",
          data: list2
        },
        {
          name: "Luỹ kế",
          data: list3
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
        text: "Kết quả kiểm tra áp giá theo tháng"
      },
      yAxis: {
        title: {
          text: "Số lượt"
        }
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories:
          this.state.listDaTa1 && !Array.isArray(this.state.listDaTa1)
            ? this.state.listDaTa1.Categories
            : []
      },
      series: list4,
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
    var conf4 = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "Kết quả kiểm tra áp giá luỹ kế"
      },
      yAxis: {
        title: {
          text: "Số lượt"
        }
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories:
          this.state.listDaTa1 && !Array.isArray(this.state.listDaTa1)
            ? this.state.listDaTa1.Categories
            : []
      },
      series: list5,
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
            <ChartView
              style={{ height: 500, width: width }}
              config={conf1}
              options={options}
              originWhitelist={[""]}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
            <View style={{ backgroundColor: "orange", height: 1 }} />
            <ChartView
              style={{ height: 500, width: width }}
              config={conf2}
              options={options}
              originWhitelist={[""]}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
            <View style={{ backgroundColor: "orange", height: 1 }} />
            <ChartView
              style={{ height: 500, width: width }}
              config={conf3}
              options={options}
              originWhitelist={[""]}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
            <View style={{ backgroundColor: "orange", height: 1 }} />
            <ChartView
              style={{ height: 500, width: width }}
              config={conf4}
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
