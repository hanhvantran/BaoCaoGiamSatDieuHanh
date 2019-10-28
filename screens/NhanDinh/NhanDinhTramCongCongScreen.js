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
    title: "Trạm công cộng"
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

    const urls = [urlBaoCao.SP_NhanDinhTramCC + param1];
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
    let list100 = [];
    let list101 = [];
    let PDonViVuotNguongCaoNhat = "";
    let PDonViVuotNguongThapNhat = "";
    let PDonViVuotNguongCaoNhatTiLe = "";
    let PDonViVuotNguongThapNhatTiLe = "";

    let PDonViKiemTraCaoNhat = "";
    let PDonViKiemTraThapNhat = "";
    let PDonViKiemTraCaoNhatTiLe = "";
    let PDonViKiemTraThapNhatTiLe = "";

    let PTongSoTram = 0;
    let PTramNgoaiChuan = 0;
    let PTiLe = 0;
    let PTramKiemTra = 0;
    let PTiLeKiemTra = 0;
    /*
 listDaTa1[i] = dt.Rows[i]["SOTRAM_NAMNGOAI"];
                    listDaTa2[i] = dt.Rows[i]["KIEMTRA_THANG"];
                    listDaTa3[i] = dt.Rows[i]["KIEMTRA_LUYKE"];
                    listDaTa4[i] = dt.Rows[i]["TONGSOTRAM"];
                    listDaTa5[i] = dt.Rows[i]["TILE_NAMNGOAI"];
                    listDaTa6[i] = dt.Rows[i]["TILE_KIEMTRA"];*/
    let listTramNgoaiChuan = [],
      listKiemTraThang = [],
      listKiemTraLuyKe = [],
      listTongSoTram = [],
      listTiLeNamNgoai = [];
    listTiLeKiemTraThang = [];
    if (
      this.state.listDaTa &&
      !Array.isArray(this.state.listDaTa) &&
      this.state.listDaTa.Series != null
    ) {
      listTramNgoaiChuan = this.state.listDaTa.Series[0].data;
      listKiemTraThang = this.state.listDaTa.Series[1].data;
      listKiemTraLuyKe = this.state.listDaTa.Series[2].data;
      listTongSoTram = this.state.listDaTa.Series[3].data;
      listTiLeNamNgoai = this.state.listDaTa.Series[4].data;
      listTiLeKiemTraThang = this.state.listDaTa.Series[5].data;

      for (let i = 0; i < this.state.listDaTa.Series[0].data.length; i++) {
        PTramNgoaiChuan =
          PTramNgoaiChuan + this.state.listDaTa.Series[0].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[1].data.length; i++) {
        PTramKiemTra = PTramKiemTra + this.state.listDaTa.Series[1].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[3].data.length; i++) {
        PTongSoTram = PTongSoTram + this.state.listDaTa.Series[3].data[i];
      }
      PTiLe =
        this.numberWithCommasDecimal(
          Number(
            PTongSoTram == 0
              ? 0
              : ((PTramNgoaiChuan * 100) / PTongSoTram).toFixed(2)
          )
        ) + " %";

      PTiLeKiemTra =
        this.numberWithCommasDecimal(
          Number(
            PTramNgoaiChuan == 0
              ? 0
              : ((PTramKiemTra * 100) / PTramNgoaiChuan).toFixed(2)
          )
        ) + " %";
      if (this.state.SelectedDonVi.length < 6) {
        let index = listTramNgoaiChuan.indexOf(Math.max(...listTramNgoaiChuan));
        PDonViVuotNguongCaoNhat =
          "Đơn vị có số trạm vượt ngưỡng cao nhất: " +
          this.state.listDaTa.Categories[index] +
          ", " +
          this.numberWithCommas(Math.max(...listTramNgoaiChuan)) +
          " trạm";
        let indexMin = listTramNgoaiChuan.indexOf(
          Math.min(...listTramNgoaiChuan)
        );
        PDonViVuotNguongThapNhat =
          "Đơn vị có số trạm vượt ngưỡng thấp nhất: " +
          this.state.listDaTa.Categories[indexMin] +
          ", " +
          this.numberWithCommas(Math.min(...listTramNgoaiChuan)) +
          " trạm";

        let indexTiLe = listTiLeNamNgoai.indexOf(Math.max(...listTiLeNamNgoai));

        PDonViVuotNguongCaoNhatTiLe =
          "Đơn vị có tỉ lệ vượt ngưỡng cao nhất: " +
          this.state.listDaTa.Categories[indexTiLe] +
          ", " +
          this.numberWithCommasDecimal(Math.max(...listTiLeNamNgoai)) +
          " %";

        let indexMinTiLe = listTiLeNamNgoai.indexOf(
          Math.min(...listTiLeNamNgoai)
        );
        PDonViVuotNguongThapNhatTiLe =
          "Đơn vị có tỉ lệ vượt ngưỡng thấp nhất: " +
          this.state.listDaTa.Categories[indexMinTiLe] +
          ", " +
          this.numberWithCommasDecimal(Math.min(...listTiLeNamNgoai)) +
          " %";

        list100 = [
          {
            title: PDonViVuotNguongCaoNhat,
            icon: "flash-on",
            //   subtitle: "Có 25 hợp đồng đến hạn ký lại ",
            color: "red"
          },
          {
            title: PDonViVuotNguongCaoNhatTiLe,
            icon: "flash-on",
            // subtitle: "Có 25 hợp đồng đến hạn ký lại ",
            color: "red"
          },
          {
            title: PDonViVuotNguongThapNhat,
            icon: "layers",
            // subtitle: "Có 20 công tơ vận hành quá tải",
            color: "green"
          },
          {
            title: PDonViVuotNguongThapNhatTiLe,
            icon: "layers",
            // subtitle: "Có 10 khách hàng cảnh báo ký mua CSPK",
            color: "green"
          }
        ];

        let indexKiemTra = listKiemTraThang.indexOf(
          Math.max(...listKiemTraThang)
        );
        PDonViKiemTraCaoNhat =
          "Đơn vị có số trạm kiểm tra cao nhất: " +
          this.state.listDaTa.Categories[indexKiemTra] +
          ", " +
          this.numberWithCommas(Math.max(...listKiemTraThang)) +
          " trạm";
        let indexMinKiemTra = listKiemTraThang.indexOf(
          Math.min(...listKiemTraThang)
        );
        PDonViKiemTraThapNhat =
          "Đơn vị có số trạm kiểm tra thấp nhất: " +
          this.state.listDaTa.Categories[indexMinKiemTra] +
          ", " +
          this.numberWithCommas(Math.min(...listKiemTraThang)) +
          " trạm";

        let indexTiLeKiemTra = listTiLeKiemTraThang.indexOf(
          Math.max(...listTiLeKiemTraThang)
        );

        PDonViKiemTraCaoNhatTiLe =
          "Đơn vị có tỉ lệ kiểm tra cao nhất: " +
          this.state.listDaTa.Categories[indexTiLeKiemTra] +
          ", " +
          this.numberWithCommasDecimal(Math.max(...listTiLeKiemTraThang)) +
          " %";

        let indexMinTiLeKiemTra = listTiLeKiemTraThang.indexOf(
          Math.min(...listTiLeKiemTraThang)
        );
        PDonViKiemTraThapNhatTiLe =
          "Đơn vị có tỉ lệ kiểm tra thấp nhất: " +
          this.state.listDaTa.Categories[indexMinTiLeKiemTra] +
          ", " +
          this.numberWithCommasDecimal(Math.min(...listTiLeKiemTraThang)) +
          " %";

        list101 = [
          {
            title: PDonViKiemTraCaoNhat,
            icon: "flash-on",
            //   subtitle: "Có 25 hợp đồng đến hạn ký lại ",
            color: "red"
          },
          {
            title: PDonViKiemTraCaoNhatTiLe,
            icon: "flash-on",
            // subtitle: "Có 25 hợp đồng đến hạn ký lại ",
            color: "red"
          },
          {
            title: PDonViKiemTraThapNhat,
            icon: "layers",
            // subtitle: "Có 20 công tơ vận hành quá tải",
            color: "green"
          },
          {
            title: PDonViKiemTraThapNhatTiLe,
            icon: "layers",
            // subtitle: "Có 10 khách hàng cảnh báo ký mua CSPK",
            color: "green"
          }
        ];
      }
    }
    const width = this.state.screenwidth;
    const height = this.state.screenheight - 250;
    var conf1 = {
      chart: {
        type: "column"
      },

      title: {
        text: "Trạm vượt ngưỡng <=1 và >7"
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
            text: "Số trạm"
          }
        },
        {
          opposite: true,
          title: {
            text: "Tỉ lệ trạm ngoài chuẩn(%)"
          }
        }
      ],
      credits: {
        enabled: false
      },
      plotOptions: {
        column: {
          borderRadius: 5
        }
      },

      series: [
        {
          name: "Số trạm ngoài chuẩn",
          data: listTramNgoaiChuan
          // yAxis: 1
        },
        {
          name: "Tổng số trạm",
          data: listTongSoTram
        },
        {
          name: "Tỉ lệ trạm ngoài chuẩn",
          data: listTiLeNamNgoai,
          type: "line",
          yAxis: 1
        }
      ]
    };
    var conf2 = {
      chart: {
        type: "column"
      },

      title: {
        text: "Tình hình kiểm tra trạm vượt ngưỡng"
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
            text: "Số trạm"
          }
        },
        {
          opposite: true,
          title: {
            text: "Tỉ lệ kiểm tra trạm ngoài chuẩn(%)"
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
        },
        colorByPoint: true
      },

      series: [
        {
          name: "Số trạm ngoài chuẩn",
          data: listTramNgoaiChuan
          // yAxis: 1
        },
        {
          name: "Số trạm kiểm tra",
          data: listKiemTraThang
        },
        {
          name: "Tỉ lệ kiểm tra trạm ngoài chuẩn",
          data: listTiLeKiemTraThang,
          type: "line",
          yAxis: 1
        }
      ]
    };
    var conf3 = {
      chart: {
        type: "column"
      },

      title: {
        text: "Tình hình kiểm tra trạm vượt ngưỡng"
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
            text: "Số trạm"
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
      series: [
        {
          name: "Số trạm kiểm tra tháng",
          data: listKiemTraThang
        },
        {
          name: "Số trạm kiểm tra luỹ kế",
          data: listKiemTraLuyKe
        }
      ]
    };
    // var conf3 = {
    //   chart: {
    //     type: "column",
    //     options3d: {
    //       enabled: true,
    //       alpha: 15,
    //       beta: 15,
    //       viewDistance: 25,
    //       depth: 40
    //     }
    //   },

    //   title: {
    //     text: "Trạm vượt ngưỡng <=1 và >7"
    //   },
    //   xAxis: {
    //     categories:
    //       this.state.listDaTa && !Array.isArray(this.state.listDaTa)
    //         ? this.state.listDaTa.Categories
    //         : [],
    //     labels: {
    //       skew3d: true,
    //       style: {
    //         fontSize: "16px"
    //       }
    //     }
    //   },
    //   credits: {
    //     enabled: false
    //   },
    //   yAxis: {
    //     allowDecimals: false,
    //     min: 0,
    //     title: {
    //       text: "Số trạm",
    //       skew3d: true
    //     }
    //   },

    //   tooltip: {
    //     headerFormat: "<b>{point.key}</b><br>",
    //     pointFormat:
    //       '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y} / {point.stackTotal}'
    //   },

    //   plotOptions: {
    //     column: {
    //       stacking: "normal",
    //       depth: 40
    //     }
    //   },

    //   series: [
    //     {
    //       name: "Tháng 1",
    //       data: list1,
    //       stack: "male"
    //     },
    //     {
    //       name: "Tháng 2",
    //       data: list2,
    //       stack: "male"
    //     },
    //     {
    //       name: "Tháng 3",
    //       data: list3,
    //       stack: "male"
    //     },
    //     {
    //       name: "Tháng 4",
    //       data: list4,
    //       stack: "male"
    //     },
    //     {
    //       name: "Tháng 5",
    //       data: list5,
    //       stack: "male"
    //     },
    //     {
    //       name: "Tháng 6",
    //       data: list6,
    //       stack: "male"
    //     },
    //     {
    //       name: "Tháng 7",
    //       data: list7,
    //       stack: "male"
    //     },
    //     {
    //       name: "Tháng 8",
    //       data: list8,
    //       stack: "male"
    //     },
    //     {
    //       name: "Tháng 9",
    //       data: list9,
    //       stack: "male"
    //     },
    //     {
    //       name: "Tháng 10",
    //       data: list10,
    //       stack: "male"
    //     },
    //     {
    //       name: "Tháng 11",
    //       data: list11,
    //       stack: "male"
    //     },
    //     {
    //       name: "Tháng 12",
    //       data: list12,
    //       stack: "male"
    //     }
    //   ]
    // };
    // var conf4 = {
    //   chart: {
    //     type: "column",
    //     options3d: {
    //       enabled: true,
    //       alpha: 15,
    //       beta: 15,
    //       viewDistance: 25,
    //       depth: 40
    //     }
    //   },

    //   title: {
    //     text: "Tổng số trạm đã kiểm tra trong năm"
    //   },
    //   xAxis: {
    //     categories:
    //       this.state.listDaTa && !Array.isArray(this.state.listDaTa)
    //         ? this.state.listDaTa.Categories
    //         : [],
    //     labels: {
    //       skew3d: true,
    //       style: {
    //         fontSize: "16px"
    //       }
    //     }
    //   },
    //   credits: {
    //     enabled: false
    //   },
    //   yAxis: {
    //     allowDecimals: false,
    //     min: 0,
    //     title: {
    //       text: "Số trạm",
    //       skew3d: true
    //     }
    //   },

    //   tooltip: {
    //     headerFormat: "<b>{point.key}</b><br>",
    //     pointFormat:
    //       '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y} / {point.stackTotal}'
    //   },

    //   plotOptions: {
    //     column: {
    //       stacking: "normal",
    //       depth: 40
    //     }
    //   },

    //   series: [
    //     {
    //       name: "Tháng 1",
    //       data: list13,
    //       stack: "male"
    //     },
    //     {
    //       name: "Tháng 2",
    //       data: list14,
    //       stack: "male"
    //     },
    //     {
    //       name: "Tháng 3",
    //       data: list15,
    //       stack: "male"
    //     },
    //     {
    //       name: "Tháng 4",
    //       data: list16,
    //       stack: "male"
    //     },
    //     {
    //       name: "Tháng 5",
    //       data: list17,
    //       stack: "male"
    //     },
    //     {
    //       name: "Tháng 6",
    //       data: list18,
    //       stack: "male"
    //     },
    //     {
    //       name: "Tháng 7",
    //       data: list19,
    //       stack: "male"
    //     },
    //     {
    //       name: "Tháng 8",
    //       data: list20,
    //       stack: "male"
    //     },
    //     {
    //       name: "Tháng 9",
    //       data: list21,
    //       stack: "male"
    //     },
    //     {
    //       name: "Tháng 10",
    //       data: list22,
    //       stack: "male"
    //     },
    //     {
    //       name: "Tháng 11",
    //       data: list23,
    //       stack: "male"
    //     },
    //     {
    //       name: "Tháng 12",
    //       data: list24,
    //       stack: "male"
    //     }
    //   ]
    // };
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
                title="Số trạm"
                price={this.numberWithCommas(PTongSoTram)}
                titleStyle={{ fontSize: 11 }}
                pricingStyle={{ fontSize: 11 }}
                // info={["1 User", "Basic Support", "All Core Features"]}
                button={{ title: "", icon: "dashboard" }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <PricingCard
                color="red"
                title="<=1% và >7%"
                price={this.numberWithCommas(PTramNgoaiChuan)}
                titleStyle={{ fontSize: 11 }}
                pricingStyle={{ fontSize: 11 }}
                fontSize="22"
                // info={["1 User", "Basic Support", "All Core Features"]}
                button={{ title: "", icon: "dashboard" }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <PricingCard
                color="green"
                title="Tỉ lệ"
                price={PTiLe}
                titleStyle={{ fontSize: 11 }}
                pricingStyle={{ fontSize: 11 }}
                // info={["1 User", "Basic Support", "All Core Features"]}
                button={{ title: "", icon: "dashboard" }}
              />
            </View>
          </View>
          <View style={{ flex: 1, paddingTop: 80 }}>
            <ChartView
              style={{ height: 500, width: width }}
              config={conf1}
              options={options}
              originWhitelist={[""]}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
          </View>
          <View style={{ backgroundColor: "orange", height: 1 }} />
          <ScrollView
            key={Math.random()}
            style={{
              backgroundColor: "white"
            }}
          >
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
                titleStyle={{ color: "black", marginBottom: 10 }}
                subtitleStyle={{ color: "black" }}
              />
            ))}
          </ScrollView>
        </ScrollView>
      </View>
    );
    const Page2 = ({ label }) => (
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
                title="Ngoài chuẩn"
                price={PTramNgoaiChuan}
                titleStyle={{ fontSize: 11 }}
                pricingStyle={{ fontSize: 11 }}
                // info={["1 User", "Basic Support", "All Core Features"]}
                button={{ title: "", icon: "dashboard" }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <PricingCard
                color="red"
                title="Kiểm tra"
                price={PTramKiemTra}
                titleStyle={{ fontSize: 11 }}
                pricingStyle={{ fontSize: 11 }}
                fontSize="22"
                // info={["1 User", "Basic Support", "All Core Features"]}
                button={{ title: "", icon: "dashboard" }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <PricingCard
                color="green"
                title="Tỉ lệ"
                price={PTiLeKiemTra}
                titleStyle={{ fontSize: 11 }}
                pricingStyle={{ fontSize: 11 }}
                // info={["1 User", "Basic Support", "All Core Features"]}
                button={{ title: "", icon: "dashboard" }}
              />
            </View>
          </View>
          <View style={{ flex: 1, paddingTop: 80 }}>
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
          </View>
          <View style={{ backgroundColor: "orange", height: 1 }} />
          <ScrollView
            key={Math.random()}
            style={{
              backgroundColor: "white"
            }}
          >
            {Object.keys(list101).map((keys, i) => (
              <ListItem
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
                titleStyle={{ color: "black", marginBottom: 10 }}
                subtitleStyle={{ color: "black" }}
              />
            ))}
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
        <View style={styles.container}>
          <Tabs>
            {/* First tab */}
            <View title="Trạm bất thường" style={styles.content}>
              <Page1 tabLabel={{ label: "Page #1" }} label="Page #1" />
            </View>
            {/* Second tab */}
            <View title="Tình hình kiểm tra" style={styles.content}>
              <Page2 tabLabel={{ label: "Page #1" }} label="Page #1" />
            </View>
          </Tabs>
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
