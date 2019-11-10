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
import Spinner from "react-native-loading-spinner-overlay";
import Tabs from "../Tabs/Tabs";
import { PricingCard } from "react-native-elements";
import { ListItem } from "../ListItem";
export default class NhanDinhTramCongCongScreen extends React.PureComponent {
  static navigationOptions = {
    title: "Tiết kiệm điện"
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
    const urls = [urlBaoCao.SP_DienTietKiem + param1];
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
  _card(el) {
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
    const width = this.state.screenwidth;
    let vChieuRong = width >= 600 ? width / 3 : width;
    let vChieuRongTopList = width >= 600 ? width / 2 : width;
    let vChieuRong31 = width >= 600 ? (width / 3) * 1 : width;
    let vChieuRong32 = width >= 600 ? (width / 3) * 2 : width;
    const height = this.state.screenheight - 50;
    let Nam = this.state.SelectedDate;
    let list100 = [],
      list101 = [];
    let intCSCC = 0,
      intSH_KDDV = 0,
      intDNSX = 0,
      intHCSN = 0,
      intTONG = 0;
    let intDIENTTCSCC = 0,
      intDIENTTSH_KDDV = 0,
      intDIENTTDNSX = 0,
      intDIENTTHCSN = 0,
      intDIENTTTONG = 0;
    let intTiLeCSCC = 0,
      intTiLeSH_KDDV = 0,
      intTiLeDNSX = 0,
      intTiLeHCSN = 0;
    let listCSCC = [],
      listSH_KDDV = [],
      listDNSX = [],
      listHCSN = [],
      listTONG = [];
    let listDIENTTCSCC = [],
      listDIENTTSH_KDDV = [],
      listDIENTTDNSX = [],
      listDIENTTHCSN = [],
      listDIENTTTONG = [];
    let listTiLeCSCC = [],
      listTiLeSH_KDDV = [],
      listTiLeDNSX = [],
      listTiLeHCSN = [],
      listTiLeTONG = [];
    let varCategories1 = [];
    let list21 = [],
      list3 = [];
    let list4 = [],
      list42 = [],
      list43 = [];
    let varCategories2 = [];
    let list5 = [],
      list6 = [],
      list7 = [];
    if (
      this.state.listDaTa &&
      !Array.isArray(this.state.listDaTa) &&
      this.state.listDaTa.Series != null
    ) {
      //Dien tiet kiem
      for (let i = 0; i < this.state.listDaTa.Series[5].data.length; i++) {
        intCSCC = intCSCC + this.state.listDaTa.Series[5].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[6].data.length; i++) {
        intSH_KDDV = intSH_KDDV + this.state.listDaTa.Series[6].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[7].data.length; i++) {
        intDNSX = intDNSX + this.state.listDaTa.Series[7].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[8].data.length; i++) {
        intHCSN = intHCSN + this.state.listDaTa.Series[8].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[9].data.length; i++) {
        intTONG = intTONG + this.state.listDaTa.Series[9].data[i];
      }

      //Dien tieu thu
      for (let i = 0; i < this.state.listDaTa.Series[15].data.length; i++) {
        intDIENTTCSCC = intDIENTTCSCC + this.state.listDaTa.Series[15].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[16].data.length; i++) {
        intDIENTTSH_KDDV =
          intDIENTTSH_KDDV + this.state.listDaTa.Series[16].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[17].data.length; i++) {
        intDIENTTDNSX = intDIENTTDNSX + this.state.listDaTa.Series[17].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[18].data.length; i++) {
        intDIENTTHCSN = intDIENTTHCSN + this.state.listDaTa.Series[18].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[19].data.length; i++) {
        intDIENTTTONG = intDIENTTTONG + this.state.listDaTa.Series[19].data[i];
      }

      //Ti Le
      for (let i = 0; i < this.state.listDaTa.Series[25].data.length; i++) {
        intTiLeCSCC = intTiLeCSCC + this.state.listDaTa.Series[25].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[26].data.length; i++) {
        intTiLeSH_KDDV =
          intTiLeSH_KDDV + this.state.listDaTa.Series[26].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[27].data.length; i++) {
        intTiLeDNSX = intTiLeDNSX + this.state.listDaTa.Series[27].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[28].data.length; i++) {
        intTiLeHCSN = intTiLeHCSN + this.state.listDaTa.Series[28].data[i];
      }
      // for (let i = 0; i < this.state.listDaTa.Series[29].data.length; i++) {
      //   intTiLeTONG = intTiLeTONG + this.state.listDaTa.Series[29].data[i];
      // }
      let intTiLeTONG = Number(
        intDIENTTTONG == 0 ? 0 : ((intTONG * 100) / intDIENTTTONG).toFixed(2)
      );
      listCSCC = this.state.listDaTa.Series[5].data;
      listSH_KDDV = this.state.listDaTa.Series[6].data;
      listDNSX = this.state.listDaTa.Series[7].data;
      listHCSN = this.state.listDaTa.Series[8].data;
      listTONG = this.state.listDaTa.Series[9].data;

      listDIENTTCSCC = this.state.listDaTa.Series[15].data;
      listDIENTTSH_KDDV = this.state.listDaTa.Series[16].data;
      listDIENTTDNSX = this.state.listDaTa.Series[17].data;
      listDIENTTHCSN = this.state.listDaTa.Series[18].data;
      listDIENTTTONG = this.state.listDaTa.Series[19].data;

      listTiLeCSCC = this.state.listDaTa.Series[25].data;
      listTiLeSH_KDDV = this.state.listDaTa.Series[26].data;
      listTiLeDNSX = this.state.listDaTa.Series[27].data;
      listTiLeHCSN = this.state.listDaTa.Series[28].data;
      listTiLeTONG = this.state.listDaTa.Series[29].data;

      list5.push(this.state.listDaTa.Series[9]);
      list6.push(this.state.listDaTa.Series[19]);
      list7.push(this.state.listDaTa.Series[29]);

      list21.push(intCSCC);
      list21.push(intSH_KDDV);
      list21.push(intDNSX);
      list21.push(intHCSN);
      list21.push(intTONG);
      varCategories1.push("CSCC");
      varCategories1.push("SH & KDDV");
      varCategories1.push("DNSX");
      varCategories1.push("HCSN");
      varCategories1.push("Tổng");

      list3.push(intDIENTTCSCC);
      list3.push(intDIENTTSH_KDDV);
      list3.push(intDIENTTDNSX);
      list3.push(intDIENTTHCSN);
      list3.push(intDIENTTTONG);

      list4.push(intTONG);
      list42.push(intDIENTTTONG);
      list43.push(intTiLeTONG);
      if (this.state.SelectedDonVi.length < 6) {
        let PDienTietKiemCaoNhat = "";
        let PDienTietKiemThapNhat = "";
        let PTiLeThuCaoNhat = "";
        let PTiLeThuThapNhat = "";
        let PThuongPhamCaoNhat = "";
        let PThuongPhamThapNhat = "";
        let indexTietKiemDien = listTONG.indexOf(Math.max(...listTONG));
        PDienTietKiemCaoNhat =
          "ĐTK cao nhất: " +
          this.state.listDaTa.Categories[indexTietKiemDien] +
          ", " +
          this.numberWithCommas(Math.max(...listTONG)) +
          " kWh";
        let indexTietKiemDienMin = listTONG.indexOf(Math.min(...listTONG));
        PDienTietKiemThapNhat =
          "ĐTK thấp nhất: " +
          this.state.listDaTa.Categories[indexTietKiemDienMin] +
          ", " +
          this.numberWithCommas(Math.min(...listTONG)) +
          " kWh";

        let indexTiLe = listTiLeTONG.indexOf(Math.max(...listTiLeTONG));

        PTiLeThuCaoNhat =
          "Tỉ lệ TKĐ cao nhất: " +
          this.state.listDaTa.Categories[indexTiLe] +
          ", " +
          this.numberWithCommasDecimal(Math.max(...listTiLeTONG)) +
          " %";

        let indexMinTiLe = listTiLeTONG.indexOf(Math.min(...listTiLeTONG));
        PTiLeThuThapNhat =
          "Tỉ lệ TKĐ thấp nhất: " +
          this.state.listDaTa.Categories[indexMinTiLe] +
          ", " +
          this.numberWithCommasDecimal(Math.min(...listTiLeTONG)) +
          " %";

        let indexThuongPham = listDIENTTTONG.indexOf(
          Math.max(...listDIENTTTONG)
        );
        PThuongPhamCaoNhat =
          "DNTT cao nhất: " +
          this.state.listDaTa.Categories[indexThuongPham] +
          ", " +
          this.numberWithCommas(Math.max(...listDIENTTTONG)) +
          " kWh";
        let indexThuongPhamMin = listDIENTTTONG.indexOf(
          Math.min(...listDIENTTTONG)
        );
        PThuongPhamThapNhat =
          "DNTT thấp nhất: " +
          this.state.listDaTa.Categories[indexThuongPhamMin] +
          ", " +
          this.numberWithCommas(Math.min(...listDIENTTTONG)) +
          " kWh";

        list100 = [
          {
            title: PDienTietKiemCaoNhat,
            icon: "flash-on",
            //   subtitle: "Có 25 hợp đồng đến hạn ký lại ",
            color: "green"
          },
          {
            title: PTiLeThuCaoNhat,
            icon: "flash-on",
            // subtitle: "Có 25 hợp đồng đến hạn ký lại ",
            color: "green"
          },
          {
            title: PThuongPhamCaoNhat,
            icon: "flash-on",
            //   subtitle: "Có 25 hợp đồng đến hạn ký lại ",
            color: "green"
          }
        ];
        list101 = [
          {
            title: PDienTietKiemThapNhat,
            icon: "layers",
            // subtitle: "Có 20 công tơ vận hành quá tải",
            color: "red"
          },
          {
            title: PTiLeThuThapNhat,
            icon: "layers",
            // subtitle: "Có 10 khách hàng cảnh báo ký mua CSPK",
            color: "red"
          },
          {
            title: PThuongPhamThapNhat,
            icon: "layers",
            // subtitle: "Có 20 công tơ vận hành quá tải",
            color: "red"
          }
        ];
      }
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
        text: "Điện tiết kiệm năm " + Nam
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
        categories: varCategories1
      },
      series: [
        {
          name: "Điện tiết kiệm theo nghành nghề",
          data: list21
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
    var conf2 = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "Điện thương phẩm năm " + Nam
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
        categories: varCategories1
      },
      series: [
        {
          name: "Điện thương phẩm theo nghành nghề",
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
        text: "Tổng năm " + Nam
      },
      yAxis: [
        {
          title: {
            text: "kWh"
          }
        },
        {
          opposite: true,
          title: {
            text: "Tỉ lệ (%)"
          }
        }
      ],
      credits: {
        enabled: false
      },
      xAxis: {
        categories: varCategories2
      },
      series: [
        {
          name: "Điện tiết kiệm",
          data: list4
          // yAxis: 1
        },
        {
          name: "Điện thương phẩm",
          data: list42
        },
        {
          name: "Tỉ lệ(%)",
          data: list43,
          type: "column",
          yAxis: 1
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
    var conf4 = {
      chart: {
        type: "column"
      },
      title: {
        text: "Điện tiết kiệm theo thành nghành nghề năm " + Nam
      },
      xAxis: {
        categories:
          this.state.listDaTa && !Array.isArray(this.state.listDaTa)
            ? this.state.listDaTa.Categories
            : []
      },
      yAxis: [
        {
          min: 0,
          title: {
            text: "kWh"
          },
          stackLabels: {
            enabled: true,
            style: {
              fontWeight: "bold",
              color:
                // theme
                "gray"
            }
          }
        },
        {
          opposite: true,
          title: {
            text: "Thực hiện(%)"
          }
        }
      ],
      // legend: {
      //   align: "right",
      //   x: -30,
      //   verticalAlign: "top",
      //   y: 25,
      //   floating: true,
      //   backgroundColor: "white",
      //   borderColor: "#CCC",
      //   borderWidth: 1,
      //   shadow: false
      // },
      tooltip: {
        headerFormat: "<b>{point.x}</b><br/>",
        pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}"
      },
      plotOptions: {
        column: {
          stacking: "normal",
          dataLabels: {
            enabled: true
          }
        },
        line: {
          dataLabels: {
            format: "{point.y:,.2f} ",
            enabled: true
          },
          colorByPoint: true
        }
      },
      credits: {
        enabled: false
      },
      series: [
        {
          name: "CSCC",
          data: listCSCC
        },
        {
          name: "SH&KDDV",
          data: listSH_KDDV
        },
        {
          name: "DNSX",
          data: listDNSX
        },
        {
          name: "HCSN",
          data: listHCSN
        },
        {
          name: "Thực hiện(%)",
          data: listTiLeTONG,
          type: "line",
          yAxis: 1
        }
      ]
    };
    var conf5 = {
      chart: {
        type: "column"
      },

      title: {
        text: "Điện tiết kiệm năm " + Nam
      },
      xAxis: {
        categories:
          this.state.listDaTa && !Array.isArray(this.state.listDaTa)
            ? this.state.listDaTa.Categories
            : []
      },

      yAxis: [
        {
          title: {
            text: "kWh"
          }
        }
      ],
      credits: {
        enabled: false
      },
      plotOptions: {
        column: {
          dataLabels: {
            format: "{point.y:,.0f} ",
            enabled: true
          }
        }
      },
      series: list5
    };
    var conf6 = {
      chart: {
        type: "column"
      },

      title: {
        text: "Điện thương phẩm năm " + Nam
      },
      xAxis: {
        categories:
          this.state.listDaTa && !Array.isArray(this.state.listDaTa)
            ? this.state.listDaTa.Categories
            : []
      },

      yAxis: [
        {
          title: {
            text: "kWh"
          }
        }
      ],
      credits: {
        enabled: false
      },
      plotOptions: {
        column: {
          dataLabels: {
            format: "{point.y:,.0f} ",
            enabled: true
          }
        }
      },
      series: list6
    };
    var conf7 = {
      chart: {
        type: "line"
      },

      title: {
        text: "Tỉ lệ tiết kiệm điện năm " + Nam
      },
      xAxis: {
        categories:
          this.state.listDaTa && !Array.isArray(this.state.listDaTa)
            ? this.state.listDaTa.Categories
            : []
      },

      yAxis: [
        {
          title: {
            text: "%"
          }
        }
      ],
      credits: {
        enabled: false
      },
      plotOptions: {
        line: {
          dataLabels: {
            format: "{point.y:,.2f} ",
            enabled: true
          },
          colorByPoint: true
        }
      },
      series: list7
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
    const Page1 = ({ label }) => (
      <View style={styles.chart}>
        <ScrollView
          key={Math.random()}
          style={{
            backgroundColor: "white"
          }}
        >
          <View style={styles.chart}>
            <ScrollView
              key={Math.random()}
              style={{
                backgroundColor: "white"
              }}
            >
              <View style={{ flexDirection: width >= 600 ? "row" : "column" }}>
                <ChartView
                  style={{ height: 400, width: vChieuRong }}
                  config={conf1}
                  options={options}
                  originWhitelist={[""]}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                />
                <ChartView
                  style={{ height: 400, width: vChieuRong }}
                  config={conf2}
                  options={options}
                  originWhitelist={[""]}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                />
                <ChartView
                  style={{ height: 400, width: vChieuRong }}
                  config={conf3}
                  options={options}
                  originWhitelist={[""]}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                />
              </View>
              <View style={{ backgroundColor: "orange", height: 1 }} />
              <ChartView
                style={{ height: 500 }}
                config={conf4}
                options={options}
                originWhitelist={[""]}
                javaScriptEnabled={true}
                domStorageEnabled={true}
              />
              <View style={{ backgroundColor: "orange", height: 1 }} />
              <ChartView
                style={{ height: 500 }}
                config={conf5}
                options={options}
                originWhitelist={[""]}
                javaScriptEnabled={true}
                domStorageEnabled={true}
              />
              <View style={{ backgroundColor: "orange", height: 1 }} />
              <ChartView
                style={{ height: 500 }}
                config={conf6}
                options={options}
                originWhitelist={[""]}
                javaScriptEnabled={true}
                domStorageEnabled={true}
              />
              <View style={{ backgroundColor: "orange", height: 1 }} />
              <ChartView
                style={{ height: 500 }}
                config={conf7}
                options={options2}
                originWhitelist={[""]}
                javaScriptEnabled={true}
                domStorageEnabled={true}
              />
              <View style={{ backgroundColor: "orange", height: 1 }} />
              <View
                style={{
                  flex: 1,
                  flexDirection: width >= 600 ? "row" : "column"
                }}
              >
                <View style={{ width: vChieuRongTopList }}>
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
                      //chevron
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
                <View style={{ width: vChieuRongTopList }}>
                  {Object.keys(list101).map((keys, i) => (
                    <ListItem
                      style={{ width: vChieuRongTopList }}
                      key={i}
                      title={list101[keys].title}
                      // onPress={this._card.bind(this, list100[keys])}
                      // subtitle={list100[keys].body}
                      leftIcon={{
                        name: list101[keys].icon,
                        color: list101[keys].color,
                        size: 20
                      }}
                      //chevron
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
          </View>
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
