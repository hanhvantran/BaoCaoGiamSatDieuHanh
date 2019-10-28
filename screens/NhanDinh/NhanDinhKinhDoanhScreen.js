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
//import Tabs from "../Tabs/Tabs";
//import { PricingCard } from "react-native-elements";
import { ListItem } from "../ListItem";
export default class NhanDinhKinhDoanhScreen extends React.PureComponent {
  static navigationOptions = {
    title: "Kinh Doanh"
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
      listDaTa: [],
      listDaTaKeHoach: [],
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
    var intitYear = year - 10;
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
    let param1 = "?MaDonVi=" + vMaDonVi + "&NAM=" + vThangNam + "";
    const urls = [
      urlBaoCao.SP_KeHoach + param1,
      urlBaoCao.SP_NhanDinhKinhDoanh + param1
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
        listDaTaKeHoach: data[0],
        listDaTa: data[1]
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
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  numberWithCommasDecimal(x) {
    return x.toString().replace(".", ",");
  }
  render() {
    let PSanLuong = 0;
    let PSoTien = 0;
    let PGiaBan = 0;
    let PSanLuongKH = 0;
    let PSoTienKH = 0;
    let PGiaBanKH = 0;
    let PSanLuong_HoanThanh = 0;
    let PGiaBan_HoanThanh = 0;
    let PSoTien_HoanThanh = 0;

    let list100 = [];
    let list101 = [];
    let list1 = [],
      list2 = [],
      list3 = [],
      list4 = [],
      list5 = [],
      list6 = [],
      list7 = [],
      list8 = [],
      list9 = [];
    let list10 = [],
      list11 = [];
    let list12 = [];
    let varCategories1 = [];
    let PDonViDoanhThuCaoNhat = "";
    let PDonViDoanhThuThapNhat = "";
    let PDonViTiLeThuCaoNhat = "";
    let PDonViTiLeThuThapNhat = "";

    let PDonViThuongPhamCaoNhat = "";
    let PDonViThuongPhamThapNhat = "";
    let PDonViTiLeThuongPhamCaoNhat = "";
    let PDonViTiLeThuongPhamThapNhat = "";

    let PDonViGiaBanCaoNhat = "";
    let PDonViGiaBanThapNhat = "";
    let PDonViTiLeGiaBanCaoNhat = "";
    let PDonViTiLeGiaBanThapNhat = "";
    if (
      this.state.listDaTaKeHoach &&
      !Array.isArray(this.state.listDaTaKeHoach) &&
      this.state.listDaTaKeHoach.Series != null
    ) {
      list10 = this.state.listDaTaKeHoach.Series[0].data;
      list11 = this.state.listDaTaKeHoach.Series[1].data;
      let indexTPHAM = list10.indexOf("TPHAM");
      let indexGIABQ = list10.indexOf("GIABQ");
      let indexTHUTD = list10.indexOf("THUTD");
      PSanLuongKH = list11[indexTPHAM];
      PSoTienKH = list11[indexTHUTD];
      PGiaBanKH = list11[indexGIABQ];
    }
    if (
      this.state.listDaTa &&
      !Array.isArray(this.state.listDaTa) &&
      this.state.listDaTa.Series != null
    ) {
      list1 = this.state.listDaTa.Series[0].data;
      list2 = this.state.listDaTa.Series[1].data;
      list3 = this.state.listDaTa.Series[2].data;
      list4 = this.state.listDaTa.Series[3].data;
      list5 = this.state.listDaTa.Series[4].data;
      list6 = this.state.listDaTa.Series[5].data;
      list7 = this.state.listDaTa.Series[6].data;
      list8 = this.state.listDaTa.Series[7].data;
      list9 = this.state.listDaTa.Series[8].data;
      for (let i = 0; i < this.state.listDaTa.Series[0].data.length; i++) {
        PSanLuong = PSanLuong + this.state.listDaTa.Series[0].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[1].data.length; i++) {
        PSoTien = PSoTien + this.state.listDaTa.Series[1].data[i];
      }
      PGiaBan = Number(PSanLuong == 0 ? 0 : (PSoTien / PSanLuong).toFixed(2));

      varCategories1.push("Kế hoạch");
      varCategories1.push("Thực hiện");
      list12.push(PSanLuongKH);
      list12.push(PSanLuong);
      if (this.state.SelectedDonVi.length < 6) {
        let indexDoanhThu = list2.indexOf(Math.max(...list2));
        PDonViDoanhThuCaoNhat =
          "Doanh thu cao nhất: " +
          this.state.listDaTa.Categories[indexDoanhThu] +
          ", " +
          this.numberWithCommas(Math.max(...list2)) +
          " VNĐ";
        let indexDoanhThuMin = list2.indexOf(Math.min(...list2));
        PDonViDoanhThuThapNhat =
          "Doanh thu thấp nhất: " +
          this.state.listDaTa.Categories[indexDoanhThuMin] +
          ", " +
          this.numberWithCommas(Math.min(...list2)) +
          " VNĐ";

        let indexTiLeThu = list9.indexOf(Math.max(...list9));

        PDonViTiLeThuCaoNhat =
          "Tỉ lệ thu cao nhất: " +
          this.state.listDaTa.Categories[indexTiLeThu] +
          ", " +
          this.numberWithCommasDecimal(Math.max(...list9)) +
          " %";

        let indexMinTiLeThu = list9.indexOf(Math.min(...list9));
        PDonViTiLeThuThapNhat =
          "Tỉ lệ thu thấp nhất: " +
          this.state.listDaTa.Categories[indexMinTiLeThu] +
          ", " +
          this.numberWithCommasDecimal(Math.min(...list9)) +
          " %";

        let indexThuongPham = list1.indexOf(Math.max(...list1));
        PDonViThuongPhamCaoNhat =
          "Thương phẩm cao nhất: " +
          this.state.listDaTa.Categories[indexThuongPham] +
          ", " +
          this.numberWithCommas(Math.max(...list1)) +
          " kWh";
        let indexThuongPhamMin = list1.indexOf(Math.min(...list1));
        PDonViThuongPhamThapNhat =
          "Thương phẩm thấp nhất: " +
          this.state.listDaTa.Categories[indexThuongPhamMin] +
          ", " +
          this.numberWithCommas(Math.min(...list1)) +
          " kWh";

        let indexThuongPhamTiLe = list7.indexOf(Math.max(...list7));
        PDonViTiLeThuongPhamCaoNhat =
          "Tỉ lệ thương phẩm cao nhất: " +
          this.state.listDaTa.Categories[indexThuongPhamTiLe] +
          ", " +
          this.numberWithCommasDecimal(Math.max(...list7)) +
          " %";
        let indexThuongPhamTiLeMin = list7.indexOf(Math.min(...list7));
        PDonViTiLeThuongPhamThapNhat =
          "Tỉ lệ thương phẩm thấp nhất: " +
          this.state.listDaTa.Categories[indexThuongPhamTiLeMin] +
          ", " +
          this.numberWithCommasDecimal(Math.min(...list7)) +
          " %";

        let indexGiaBan = list3.indexOf(Math.max(...list3));

        PDonViGiaBanCaoNhat =
          "Giá bán bình quân cao nhất: " +
          this.state.listDaTa.Categories[indexGiaBan] +
          ", " +
          this.numberWithCommasDecimal(Math.max(...list3)) +
          " VNĐ";

        let indexGiaBanMin = list3.indexOf(Math.min(...list3));
        PDonViGiaBanThapNhat =
          "Giá bán bình quân thấp nhất: " +
          this.state.listDaTa.Categories[indexGiaBanMin] +
          ", " +
          this.numberWithCommasDecimal(Math.min(...list3)) +
          " VNĐ";
        list100 = [
          {
            title: PDonViDoanhThuCaoNhat,
            icon: "flash-on",
            //   subtitle: "Có 25 hợp đồng đến hạn ký lại ",
            color: "green"
          },
          {
            title: PDonViTiLeThuCaoNhat,
            icon: "flash-on",
            // subtitle: "Có 25 hợp đồng đến hạn ký lại ",
            color: "green"
          },
          {
            title: PDonViThuongPhamCaoNhat,
            icon: "flash-on",
            //   subtitle: "Có 25 hợp đồng đến hạn ký lại ",
            color: "green"
          },
          {
            title: PDonViTiLeThuongPhamCaoNhat,
            icon: "flash-on",
            //   subtitle: "Có 25 hợp đồng đến hạn ký lại ",
            color: "green"
          },
          {
            title: PDonViGiaBanCaoNhat,
            icon: "flash-on",
            // subtitle: "Có 25 hợp đồng đến hạn ký lại ",
            color: "green"
          }
        ];
        list101 = [
          {
            title: PDonViDoanhThuThapNhat,
            icon: "layers",
            // subtitle: "Có 20 công tơ vận hành quá tải",
            color: "red"
          },
          {
            title: PDonViTiLeThuThapNhat,
            icon: "layers",
            // subtitle: "Có 10 khách hàng cảnh báo ký mua CSPK",
            color: "red"
          },
          {
            title: PDonViThuongPhamThapNhat,
            icon: "layers",
            // subtitle: "Có 20 công tơ vận hành quá tải",
            color: "red"
          },
          {
            title: PDonViTiLeThuongPhamThapNhat,
            icon: "layers",
            // subtitle: "Có 20 công tơ vận hành quá tải",
            color: "red"
          },
          {
            title: PDonViGiaBanThapNhat,
            icon: "layers",
            // subtitle: "Có 10 khách hàng cảnh báo ký mua CSPK",
            color: "red"
          }
        ];
      }
    }
    PSanLuong_HoanThanh = Number(
      PSanLuongKH == 0 ? 0 : ((PSanLuong * 100) / PSanLuongKH).toFixed(2)
    );
    PGiaBan_HoanThanh = Number(
      PGiaBanKH == 0 ? 0 : ((PGiaBan * 100) / PGiaBanKH).toFixed(2)
    );
    PSoTien_HoanThanh = Number(
      PSoTienKH == 0 ? 0 : ((PSoTien * 100) / PSoTienKH).toFixed(2)
    );
    console.log("PSanLuong_HoanThanh", PSanLuong_HoanThanh);
    const width = this.state.screenwidth;
    const height = this.state.screenheight - 250;
    let vChieuRong = width >= 600 ? (width - 10) / 2 : width;
    let vChieuRongChart = width >= 600 ? (width - 20) / 3 : width;
    var conf1 = {
      chart: {
        type: "column"
      },

      title: {
        text: "Tình hình thực hiện thương phẩm"
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
        },
        {
          opposite: true,
          title: {
            text: "Thực hiện(%)"
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
          },
          borderRadius: 5
        },
        line: {
          dataLabels: {
            format: "{point.y:,.0f} ",
            enabled: true
          },
          colorByPoint: true
        }
      },

      series: [
        {
          name: "Thương phẩm",
          data: list1
          // yAxis: 1
        },
        {
          name: "Kế hoạch thương phẩm",
          data: list5
        },
        {
          name: "Thực hiện(%)",
          data: list7,
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
        text: "Tình hình thực hiện doanh thu"
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
            text: "VNĐ"
          }
        },
        {
          opposite: true,
          title: {
            text: "Thực hiện(%)"
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
          },
          borderRadius: 5
        },
        line: {
          dataLabels: {
            format: "{point.y:,.0f} ",
            enabled: true
          },
          colorByPoint: true
        }
      },

      series: [
        {
          name: "Doanh thu",
          data: list2
          // yAxis: 1
        },
        {
          name: "Kế hoạch doanh thu",
          data: list6
        },
        {
          name: "Thực hiện(%)",
          data: list9,
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
        text: "Tình hình thực hiện giá bán bình quân"
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
            text: "VNĐ"
          }
        },
        {
          opposite: true,
          title: {
            text: "Thực hiện(%)"
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
          },
          borderRadius: 5
        },
        line: {
          dataLabels: {
            format: "{point.y:,.0f} ",
            enabled: true
          },
          colorByPoint: true
        }
      },
      series: [
        {
          name: "Giá bán bình quân",
          data: list3
          // yAxis: 1
        },
        {
          name: "Kế hoạch giá bán bình quân",
          data: list4
        },
        {
          name: "Thực hiện(%)",
          data: list8,
          type: "line",
          yAxis: 1
        }
      ]
    };
    var conf4 = {
      chart: {
        type: "column"
      },

      title: {
        text: "Thực hiện thương phẩm"
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
            text: "Thực hiện(%)"
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
          },
          borderRadius: 5
        }
      },

      series: [
        {
          name: "Kế hoạch",
          data: [PSanLuongKH]
          // yAxis: 1
        },
        {
          name: "Thực hiện",
          data: [PSanLuong]
        },
        {
          name: "Hoàn thành(%)",
          data: [PSanLuong_HoanThanh],
          //type: "line",
          yAxis: 1
        }
      ]
    };
    var conf5 = {
      chart: {
        type: "column"
      },

      title: {
        text: "Thực hiện doanh thu"
      },

      yAxis: [
        {
          title: {
            text: "VNĐ"
          }
        },
        {
          opposite: true,
          title: {
            text: "Thực hiện(%)"
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
          },
          borderRadius: 5
        }
      },

      series: [
        {
          name: "Kế hoạch",
          data: [PSoTienKH]
          // yAxis: 1
        },
        {
          name: "Thực hiện",
          data: [PSoTien]
        },
        {
          name: "Hoàn thành(%)",
          data: [PSoTien_HoanThanh],
          //type: "line",
          yAxis: 1
        }
      ]
    };
    var conf6 = {
      chart: {
        type: "column"
      },

      title: {
        text: "Giá bán bình quân"
      },

      yAxis: [
        {
          title: {
            text: "VNĐ"
          }
        },
        {
          opposite: true,
          title: {
            text: "Thực hiện(%)"
          }
        }
      ],
      credits: {
        enabled: false
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: "{point.y:.0f}"
          }
        },
        column: {
          borderRadius: 5
        }
      },

      series: [
        {
          name: "Kế hoạch",
          data: [PGiaBanKH]
          // yAxis: 1
        },
        {
          name: "Thực hiện",
          data: [PGiaBan]
        },
        {
          name: "Hoàn thành(%)",
          data: [PGiaBan_HoanThanh],
          //type: "line",
          yAxis: 1
        }
      ]
    };
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
        <View style={styles.chart}>
          <ScrollView
            key={Math.random()}
            style={{
              backgroundColor: "white"
            }}
          >
            <View style={{ flexDirection: width >= 600 ? "row" : "column" }}>
              <ChartView
                style={{ height: 500, width: vChieuRongChart }}
                config={conf4}
                options={options}
                originWhitelist={[""]}
                javaScriptEnabled={true}
                domStorageEnabled={true}
              />
              <ChartView
                style={{ height: 500, width: vChieuRongChart }}
                config={conf5}
                options={options}
                originWhitelist={[""]}
                javaScriptEnabled={true}
                domStorageEnabled={true}
              />
              <ChartView
                style={{ height: 500, width: vChieuRongChart }}
                config={conf6}
                options={options}
                originWhitelist={[""]}
                javaScriptEnabled={true}
                domStorageEnabled={true}
              />
            </View>
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
