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
import urlBaoCao from "../../networking/services";
import ChartView from "react-native-highcharts";
//import { getTenDonVi } from "../../data/dmdonvi";
import Spinner from "react-native-loading-spinner-overlay";
//import Tabs from "../Tabs/Tabs";
import { PricingCard } from "react-native-elements";
import { ListItem } from "../ListItem";
export default class NhanDinhTramCongCongScreen extends React.PureComponent {
  static navigationOptions = {
    title: "Đo đếm"
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
      SelectedDate: new Date().getFullYear().toString(),
      listDonVi: [],
      listDaTaChiNiem: [],
      listDaTaChayHong: [],
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
    var intitYear = year - 5;
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
  callMultiAPI = async (vThangNam, vMaDonVi) => {
    this.setState({
      spinner: true
    });
    let param1 =
      "?MaDonVi=" + vMaDonVi + "&THANG=12" + "&NAM=" + vThangNam + "";

    const urls = [
      urlBaoCao.SP_KHThieuThongTinChiNiem + param1,
      urlBaoCao.sp_CongToChayHong + param1
    ];
    Promise.all(
      urls.map(url =>
        fetch(url)
          .then(this.checkStatus)
          .then(this.parseJSON)
          .catch(error => {
            this.setState({ spinner: false });
            Alert.alert(
              "Lỗi: " + url.toString().replace(urlBaoCao.IP, ""),
              error.message
            );
          })
      )
    ).then(data => {
      this.setState({
        spinner: false,
        SelectedDonVi: vMaDonVi,
        SelectedDate: vThangNam,
        listDaTaChiNiem: data[0],
        listDaTaChayHong: data[1]
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
  _card(el) {
    console.log("el", el);
    var { navigate } = this.props.navigation;
    navigate("NhanDinhThongBaoChiTietScreen", {
      data: el
    });
    // if (el.page != undefined) {
    //   var { navigate } = this.props.navigation;
    //   navigate(el.page);
    // } else {
    //   Alert.alert("Thông báo!", "Chức năng chưa được khởi tạo");
    // }
  }
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  numberWithCommasDecimal(x) {
    return x.toString().replace(".", ",");
  }
  render() {
    let list100 = [],
      list101 = [];
    let intTongSoKhachHang = 0;
    let intKhachHangChuaNiemChi = 0;
    let intTiLeChuaNiemChi = 0;

    let listTongSoKhachHang = [];
    let listKhachHangChuaNiemChi = [];
    let listTiLeChuaNiemChi = [];
    //CHINIEM
    if (
      this.state.listDaTaChiNiem &&
      !Array.isArray(this.state.listDaTaChiNiem) &&
      this.state.listDaTaChiNiem.Series != null
    ) {
      //intVHCongTO1Pha = this.state.listDaTaCto.Series[0].data;
      //Cong To
      for (
        let i = 0;
        i < this.state.listDaTaChiNiem.Series[0].data.length;
        i++
      ) {
        intTongSoKhachHang =
          intTongSoKhachHang + this.state.listDaTaChiNiem.Series[0].data[i];
      }
      for (
        let i = 0;
        i < this.state.listDaTaChiNiem.Series[1].data.length;
        i++
      ) {
        intKhachHangChuaNiemChi =
          intKhachHangChuaNiemChi +
          this.state.listDaTaChiNiem.Series[1].data[i];
      }

      for (
        let i = 0;
        i < this.state.listDaTaChiNiem.Series[2].data.length;
        i++
      ) {
        intTiLeChuaNiemChi =
          intTiLeChuaNiemChi + this.state.listDaTaChiNiem.Series[2].data[i];
      }
      listTongSoKhachHang = this.state.listDaTaChiNiem.Series[0].data;
      listKhachHangChuaNiemChi = this.state.listDaTaChiNiem.Series[1].data;
      listTiLeChuaNiemChi = this.state.listDaTaChiNiem.Series[2].data;
    }
    //Cong to chay
    let intCongToMatChayHong = 0;
    let intTongSoCongTo = 0;
    let intTiLeChayHong = 0;

    let listCongToMatChayHong = [];
    let listTongSoCongTo = [];
    let listTiLeChayHong = [];

    if (
      this.state.listDaTaChayHong &&
      !Array.isArray(this.state.listDaTaChayHong) &&
      this.state.listDaTaChayHong.Series != null
    ) {
      //intVHCongTO1Pha = this.state.listDaTaCto.Series[0].data;
      //Cong To
      for (
        let i = 0;
        i < this.state.listDaTaChayHong.Series[0].data.length;
        i++
      ) {
        intTongSoCongTo =
          intTongSoCongTo + this.state.listDaTaChayHong.Series[0].data[i];
      }
      for (
        let i = 0;
        i < this.state.listDaTaChayHong.Series[1].data.length;
        i++
      ) {
        intCongToMatChayHong =
          intCongToMatChayHong + this.state.listDaTaChayHong.Series[1].data[i];
      }

      for (
        let i = 0;
        i < this.state.listDaTaChayHong.Series[2].data.length;
        i++
      ) {
        intTiLeChayHong =
          intTiLeChayHong + this.state.listDaTaChayHong.Series[2].data[i];
      }
      listTongSoCongTo = this.state.listDaTaChayHong.Series[0].data;
      listCongToMatChayHong = this.state.listDaTaChayHong.Series[1].data;
      listTiLeChayHong = this.state.listDaTaChayHong.Series[2].data;
      if (this.state.SelectedDonVi < 6) {
        let PSoLuongKHCaoNhat = "";
        let PSoLuongKHThap = "";
        let PSoLuongKHChuaNiemChiCaoNhat = "";
        let PSoLuongKHChuaNiemChiThapNhat = "";
        let PTiLeChuaNiemChiCaoNhat = "";
        let PTiLeChuaNiemChiThapNhat = "";

        let PSoLuongCongToCaoNhat = "";
        let PSoLuongCongToThapNhat = "";
        let PSoLuongCongToMCHCaoNhat = "";
        let PSoLuongCongToMCHThapNhat = "";
        let PTiLeCongToMCHCaoNhat = "";
        let PTiLeCongToMCHThapNhat = "";

        let indexSoLuongKH = listTongSoKhachHang.indexOf(
          Math.max(...listTongSoKhachHang)
        );
        PSoLuongKHCaoNhat =
          "Số khách hàng cao nhất: " +
          this.state.listDaTaChiNiem.Categories[indexSoLuongKH] +
          ", " +
          this.numberWithCommas(Math.max(...listTongSoKhachHang)) +
          "";
        let indexSoLuongKHMin = listTongSoKhachHang.indexOf(
          Math.min(...listTongSoKhachHang)
        );
        PDienTietKiemThapNhat =
          "Số khách hàng thấp nhất: " +
          this.state.listDaTaChiNiem.Categories[indexSoLuongKHMin] +
          ", " +
          this.numberWithCommas(Math.min(...listTongSoKhachHang)) +
          "";

        let indexSoLuongKHChuaNiemChi = listKhachHangChuaNiemChi.indexOf(
          Math.max(...listKhachHangChuaNiemChi)
        );
        PSoLuongKHChuaNiemChiCaoNhat =
          "Chưa niêm chì cao nhất: " +
          this.state.listDaTaChiNiem.Categories[indexSoLuongKHChuaNiemChi] +
          ", " +
          this.numberWithCommas(Math.max(...listKhachHangChuaNiemChi)) +
          "";
        let indexSoLuongKHChuaNiemChiMin = listKhachHangChuaNiemChi.indexOf(
          Math.min(...listKhachHangChuaNiemChi)
        );
        PSoLuongKHChuaNiemChiThapNhat =
          "Chưa niêm chì thấp nhất: " +
          this.state.listDaTaChiNiem.Categories[indexSoLuongKHChuaNiemChiMin] +
          ", " +
          this.numberWithCommas(Math.min(...listKhachHangChuaNiemChi)) +
          "";

        let indexTiLeKHChuaNiemChi = listTiLeChuaNiemChi.indexOf(
          Math.max(...listTiLeChuaNiemChi)
        );
        PTiLeChuaNiemChiCaoNhat =
          "Chưa niêm chì cao nhất(%): " +
          this.state.listDaTaChiNiem.Categories[indexTiLeKHChuaNiemChi] +
          ", " +
          this.numberWithCommasDecimal(Math.max(...listTiLeChuaNiemChi)) +
          " %";
        let indexTiLeKHChuaNiemChiMin = listTiLeChuaNiemChi.indexOf(
          Math.min(...listTiLeChuaNiemChi)
        );
        PTiLeChuaNiemChiThapNhat =
          "Chưa niêm chì thấp nhất(%): " +
          this.state.listDaTaChiNiem.Categories[indexTiLeKHChuaNiemChiMin] +
          ", " +
          this.numberWithCommasDecimal(Math.min(...listTiLeChuaNiemChi)) +
          " %";

        let indexSoLuongCongTo = listTongSoCongTo.indexOf(
          Math.max(...listTongSoCongTo)
        );
        PSoLuongCongToCaoNhat =
          "Số công tơ cao nhất: " +
          this.state.listDaTaChayHong.Categories[indexSoLuongCongTo] +
          ", " +
          this.numberWithCommas(Math.max(...listTongSoCongTo)) +
          "";
        let indexSoLuongCongToMin = listTongSoCongTo.indexOf(
          Math.min(...listTongSoCongTo)
        );
        PSoLuongCongToThapNhat =
          "Số công tơ thấp nhất: " +
          this.state.listDaTaChayHong.Categories[indexSoLuongCongToMin] +
          ", " +
          this.numberWithCommas(Math.min(...listTongSoCongTo)) +
          "";

        let indexCongToMat = listCongToMatChayHong.indexOf(
          Math.max(...listCongToMatChayHong)
        );
        PSoLuongCongToMCHCaoNhat =
          "MCH cao nhất: " +
          this.state.listDaTaChayHong.Categories[indexCongToMat] +
          ", " +
          this.numberWithCommas(Math.max(...listCongToMatChayHong)) +
          "";
        let indexCongToMatMin = listCongToMatChayHong.indexOf(
          Math.min(...listCongToMatChayHong)
        );
        PSoLuongCongToMCHThapNhat =
          "MCH thấp nhất: " +
          this.state.listDaTaChayHong.Categories[indexCongToMatMin] +
          ", " +
          this.numberWithCommas(Math.min(...listCongToMatChayHong)) +
          "";

        let indexTiLeMCH = listTiLeChayHong.indexOf(
          Math.max(...listTiLeChayHong)
        );
        PTiLeCongToMCHCaoNhat =
          "Tỉ lệ MCH cao nhất(%): " +
          this.state.listDaTaChayHong.Categories[indexTiLeMCH] +
          ", " +
          this.numberWithCommasDecimal(Math.max(...listTiLeChayHong)) +
          " %";
        let indexTiLeMCHMin = listTiLeChayHong.indexOf(
          Math.min(...listTiLeChayHong)
        );
        PTiLeCongToMCHThapNhat =
          "Tỉ lệ MCH thấp nhất(%): " +
          this.state.listDaTaChayHong.Categories[indexTiLeMCHMin] +
          ", " +
          this.numberWithCommasDecimal(Math.min(...listTiLeChayHong)) +
          " %";
        list100 = [
          {
            title: PSoLuongKHCaoNhat,
            icon: "flash-on",
            //   subtitle: "Có 25 hợp đồng đến hạn ký lại ",
            color: "green"
          },
          {
            title: PSoLuongKHChuaNiemChiCaoNhat,
            icon: "flash-on",
            // subtitle: "Có 25 hợp đồng đến hạn ký lại ",
            color: "green"
          },
          {
            title: PTiLeChuaNiemChiCaoNhat,
            icon: "flash-on",
            //   subtitle: "Có 25 hợp đồng đến hạn ký lại ",
            color: "green"
          },
          {
            title: PSoLuongCongToCaoNhat,
            icon: "flash-on",
            //   subtitle: "Có 25 hợp đồng đến hạn ký lại ",
            color: "green"
          },
          {
            title: PSoLuongCongToMCHCaoNhat,
            icon: "flash-on",
            // subtitle: "Có 25 hợp đồng đến hạn ký lại ",
            color: "green"
          },
          {
            title: PTiLeCongToMCHCaoNhat,
            icon: "flash-on",
            //   subtitle: "Có 25 hợp đồng đến hạn ký lại ",
            color: "green"
          }
        ];
        list101 = [
          {
            title: PSoLuongKHThap,
            icon: "layers",
            // subtitle: "Có 20 công tơ vận hành quá tải",
            color: "red"
          },
          {
            title: PSoLuongKHChuaNiemChiThapNhat,
            icon: "layers",
            // subtitle: "Có 10 khách hàng cảnh báo ký mua CSPK",
            color: "red"
          },
          {
            title: PTiLeChuaNiemChiThapNhat,
            icon: "layers",
            // subtitle: "Có 20 công tơ vận hành quá tải",
            color: "red"
          },
          {
            title: PSoLuongCongToThapNhat,
            icon: "layers",
            // subtitle: "Có 20 công tơ vận hành quá tải",
            color: "red"
          },
          {
            title: PSoLuongCongToMCHThapNhat,
            icon: "layers",
            // subtitle: "Có 10 khách hàng cảnh báo ký mua CSPK",
            color: "red"
          },
          {
            title: PTiLeCongToMCHThapNhat,
            icon: "layers",
            // subtitle: "Có 20 công tơ vận hành quá tải",
            color: "red"
          }
        ];
      }
    }

    const width = this.state.screenwidth;
    const height = this.state.screenheight - 250;
    let vChieuRong = width >= 600 ? width / 2 : width;
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
    var conf1 = {
      chart: {
        type: "column"
      },

      title: {
        text: "Khách hàng chưa niêm chì"
      },
      xAxis: {
        categories:
          this.state.listDaTaChiNiem &&
          !Array.isArray(this.state.listDaTaChiNiem)
            ? this.state.listDaTaChiNiem.Categories
            : []
      },

      yAxis: [
        {
          title: {
            text: "Khách hàng"
          }
        },
        {
          opposite: true,
          title: {
            text: "Tỉ lệ khách hàng chưa niêm chì(%)"
          }
        }
      ],
      credits: {
        enabled: false
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true
          }
        }
      },

      series: [
        {
          name: "Chưa niêm chì",
          data: listKhachHangChuaNiemChi,
          column: {
            dataLabels: {
              format: "{point.y:,.0f} ",
              enabled: true
            }
          }
          // yAxis: 1
        },
        {
          name: "Tổng số khách hàng",
          data: listTongSoKhachHang,
          column: {
            dataLabels: {
              format: "{point.y:,.0f} ",
              enabled: true
            }
          }
        },
        {
          name: "Tỉ lệ khách hàng chưa niêm chì (%)",
          data: listTiLeChuaNiemChi,
          type: "line",
          yAxis: 1,
          line: {
            dataLabels: {
              format: "{point.y:,.2f} ",
              enabled: true
            }
          },
          colorByPoint: true
        }
      ]
    };
    var conf2 = {
      chart: {
        type: "column"
      },

      title: {
        text: "Công tơ mất cháy hỏng"
      },
      xAxis: {
        categories:
          this.state.listDaTaChayHong &&
          !Array.isArray(this.state.listDaTaChayHong)
            ? this.state.listDaTaChayHong.Categories
            : []
      },

      yAxis: [
        {
          title: {
            text: "Công tơ"
          }
        },
        {
          opposite: true,
          title: {
            text: "Tỉ lệ công tơ mất cháy hỏng(%)"
          }
        }
      ],
      credits: {
        enabled: false
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true
          }
        }
      },

      series: [
        {
          name: "Công tơ mất cháy hỏng",
          data: listCongToMatChayHong,
          column: {
            dataLabels: {
              format: "{point.y:,.0f} ",
              enabled: true
            }
          }
          // yAxis: 1
        },
        {
          name: "Tổng số công tơ",
          data: listTongSoCongTo,
          column: {
            dataLabels: {
              format: "{point.y:,.0f} ",
              enabled: true
            }
          }
        },
        {
          name: "Tỉ lệ công tơ mất cháy hỏng (%)",
          data: listTiLeChayHong,
          type: "line",
          yAxis: 1,
          line: {
            dataLabels: {
              format: "{point.y:,.2f} ",
              enabled: true
            }
          },
          colorByPoint: true
        }
      ]
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
    const Page1 = ({ label }) => (
      <View style={styles.chart}>
        <ScrollView
          key={Math.random()}
          style={{
            backgroundColor: "white"
          }}
        >
          <View
            style={{
              flex: 1,
              paddingTop: -50,
              flexDirection: "row",
              height: 90
            }}
          >
            <View style={{ flex: 1 }}>
              <PricingCard
                color="#4f9deb"
                title="Chưa niêm chì"
                price={this.numberWithCommas(intKhachHangChuaNiemChi)}
                titleStyle={{ fontSize: 12 }}
                pricingStyle={{ fontSize: 12 }}
                info={[this.numberWithCommas(intTongSoKhachHang)]}
                // info={["1 User", "Basic Support", "All Core Features"]}
                button={{ title: "", icon: "dashboard" }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <PricingCard
                color="red"
                title="Mất, cháy, hỏng "
                price={this.numberWithCommas(intCongToMatChayHong)}
                titleStyle={{ fontSize: 10 }}
                pricingStyle={{ fontSize: 12 }}
                fontSize="22"
                // info={["1 User", "Basic Support", "All Core Features"]}
                info={[this.numberWithCommas(intTongSoCongTo)]}
                button={{ title: "", icon: "dashboard" }}
              />
            </View>
          </View>
          <View style={{ flex: 1, paddingTop: 80 }}></View>
          <View style={{ backgroundColor: "orange", height: 1 }} />
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
          <ScrollView
            key={Math.random()}
            style={{
              backgroundColor: "white"
            }}
          >
            <View style={{ backgroundColor: "orange", height: 1 }} />
            <View
              style={{
                flex: 1,
                flexDirection: width >= 600 ? "row" : "column"
              }}
            >
              <View style={{ width: vChieuRong }}>
                {Object.keys(list100).map((keys, i) => (
                  <ListItem
                    key={i}
                    title={list100[keys].title}
                    // onPress={this._card.bind(this, list100[keys])}
                    // subtitle={list100[keys].body}
                    leftIcon={{
                      name: list100[keys].icon,
                      color: list100[keys].color,
                      size: 20
                    }}
                    chevron
                    bottomDivider
                    titleStyle={{
                      color: "black",
                      marginBottom: 10,
                      fontSize: 12
                    }}
                    subtitleStyle={{ color: "black" }}
                  />
                ))}
              </View>
              <View style={{ width: vChieuRong }}>
                {Object.keys(list101).map((keys, i) => (
                  <ListItem
                    style={{ width: vChieuRong }}
                    key={i}
                    title={list101[keys].title}
                    // onPress={this._card.bind(this, list100[keys])}
                    // subtitle={list100[keys].body}
                    leftIcon={{
                      name: list101[keys].icon,
                      color: list101[keys].color,
                      size: 20
                    }}
                    chevron
                    bottomDivider
                    titleStyle={{
                      color: "black",
                      marginBottom: 10,
                      fontSize: 12
                    }}
                    subtitleStyle={{ color: "black" }}
                  />
                ))}
              </View>
            </View>
          </ScrollView>
        </ScrollView>
      </View>
    );

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
          <Text style={{ paddingLeft: 10 }}>Năm:</Text>
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
        <View style={styles.container}>
          <Page1 tabLabel={{ label: "Page #1" }} label="Page #1" />
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
  container: {
    flex: 1,
    marginTop: -12,
    backgroundColor: "#f5f7fa"
  },
  // Content header
  header: {
    margin: 5, // Add margin
    color: "#122d4d", // White color
    // fontFamily: 'Avenir',               // Change font family
    fontSize: 26 // Bigger font size
  },
  // Content text
  text: {
    marginHorizontal: 20, // Add horizontal margin
    color: "#122d4d", // Semi-transparent text
    textAlign: "center", // Center
    //fontFamily: 'Avenir',
    fontSize: 18
  },
  // Tab content container
  content: {
    flex: 1,
    backgroundColor: "white"
  }
});
