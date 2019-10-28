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
import Tabs from "../../Tabs/Tabs";
// import Swiper from "react-native-swiper";
//    "react-native-swiper": "^1.6.0-nightly.5",

export default class TBDDChuaThayTheScreen extends React.PureComponent {
  static navigationOptions = {
    title: "TBĐĐ quá hạn"
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
      listDaTaTUTI: [],
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

    const urls = [
      urlBaoCao.sp_HanKdinh_Cto + param1,
      urlBaoCao.sp_HanKdinh_TUTI + param1
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
        listDaTa: data[0],
        listDaTaTUTI: data[1]
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
    let list1 = [];
    let list2 = [];
    let list3 = [];
    let list4 = [];
    let varCategories1 = [];
    let varCategories2 = [];
    let Thang = this.state.SelectedDate.split("/")[0];
    let Nam = this.state.SelectedDate.split("/")[1];
    var ld = new Date(Nam, Thang, 0).getDate();
    var lastday = ld + "/" + Thang + "/" + Nam;
    varCategories2.push("Loại trừ đến ngày " + lastday);
    varCategories2.push("Loại trừ đến ngày 31/12/" + Nam);
    varCategories2.push("Quá hạn - 1 pha " + lastday);
    varCategories2.push("Quá hạn - 3 pha " + lastday);
    varCategories2.push("Quá hạn - 1 pha 31/12/" + Nam);
    varCategories2.push("Quá hạn - 3 pha 31/12/" + Nam);
    if (
      this.state.listDaTa &&
      !Array.isArray(this.state.listDaTa) &&
      this.state.listDaTa.Series != null
    ) {
      let intTongCto1Pha = 0;
      for (let i = 0; i < this.state.listDaTa.Series[0].data.length; i++) {
        intTongCto1Pha = intTongCto1Pha + this.state.listDaTa.Series[0].data[i];
      }
      let intTongCto3Pha = 0;
      for (let i = 0; i < this.state.listDaTa.Series[1].data.length; i++) {
        intTongCto3Pha = intTongCto3Pha + this.state.listDaTa.Series[1].data[i];
      }
      let intQuaHan1PhaDenNgay = 0;
      for (let i = 0; i < this.state.listDaTa.Series[2].data.length; i++) {
        intQuaHan1PhaDenNgay =
          intQuaHan1PhaDenNgay + this.state.listDaTa.Series[2].data[i];
      }
      let intQuaHan3PhaDenNgay = 0;
      for (let i = 0; i < this.state.listDaTa.Series[3].data.length; i++) {
        intQuaHan3PhaDenNgay =
          intQuaHan3PhaDenNgay + this.state.listDaTa.Series[3].data[i];
      }
      let intQuaHan1PhaCuoiNam = 0;
      for (let i = 0; i < this.state.listDaTa.Series[4].data.length; i++) {
        intQuaHan1PhaCuoiNam =
          intQuaHan1PhaCuoiNam + this.state.listDaTa.Series[4].data[i];
      }
      let intQuaHan3PhaCuoiNam = 0;
      for (let i = 0; i < this.state.listDaTa.Series[5].data.length; i++) {
        intQuaHan3PhaCuoiNam =
          intQuaHan3PhaCuoiNam + this.state.listDaTa.Series[5].data[i];
      }
      let intLoaiTruDenNgay = 0;
      for (let i = 0; i < this.state.listDaTa.Series[6].data.length; i++) {
        intLoaiTruDenNgay =
          intLoaiTruDenNgay + this.state.listDaTa.Series[6].data[i];
      }
      let intLoaiTruCuoiNam = 0;
      for (let i = 0; i < this.state.listDaTa.Series[7].data.length; i++) {
        intLoaiTruCuoiNam =
          intLoaiTruCuoiNam + this.state.listDaTa.Series[7].data[i];
      }

      list1.push(this.state.listDaTa.Series[8]);
      list1.push(this.state.listDaTa.Series[9]);
      list1.push(this.state.listDaTa.Series[10]);
      list1.push(this.state.listDaTa.Series[11]);

      list2.push(intTongCto1Pha);
      list2.push(intTongCto3Pha);
      list2.push(intTongCto1Pha + intTongCto3Pha);
      list3.push(this.state.listDaTa.Series[2]);
      list3.push(this.state.listDaTa.Series[3]);
      list3.push(this.state.listDaTa.Series[4]);
      list3.push(this.state.listDaTa.Series[5]);

      list4.push(intLoaiTruDenNgay);
      list4.push(intLoaiTruCuoiNam);
      list4.push(intQuaHan1PhaDenNgay);
      list4.push(intQuaHan3PhaDenNgay);
      list4.push(intQuaHan1PhaCuoiNam);
      list4.push(intQuaHan3PhaCuoiNam);
      varCategories1.push("1 pha");
      varCategories1.push("3 pha");
      varCategories1.push("Tổng");
    }

    //TU, TI
    let list5 = [];
    let list6 = [];
    let list7 = [];
    let list8 = [];
    let list9 = [];
    let list10 = [];
    let list11 = [];
    let varCategories3 = [];
    let varCategories4 = [];
    let varCategories5 = [];
    varCategories4.push("Loại trừ đến ngày " + lastday);
    varCategories4.push("Loại trừ đến ngày 31/12/" + Nam);
    varCategories4.push("Quá hạn đến ngày " + lastday);
    varCategories4.push("Quá hạn đến ngày 31/12/" + Nam);

    varCategories5.push("Hạ thế loại trừ đến ngày " + lastday);
    varCategories5.push("Trung thế loại trừ đến ngày " + lastday);
    varCategories5.push("Hạ thế loại trừ đến ngày 31/12/" + Nam);
    varCategories5.push("Trung thế loại trừ đến ngày 31/12/" + Nam);
    varCategories5.push("TI loại trừ đến ngày " + lastday);
    varCategories5.push("TI loại trừ đến ngày 31/12/" + Nam);

    varCategories5.push("Hạ thế quá hạn đến ngày " + lastday);
    varCategories5.push("Trung thế quá hạn đến ngày " + lastday);
    varCategories5.push("Hạ thế quá hạn đến ngày 31/12/" + Nam);
    varCategories5.push("Trung thế quá hạn đến ngày 31/12/" + Nam);
    varCategories5.push("TI quá hạn đến ngày " + lastday);
    varCategories5.push("TI quá hạn đến ngày 31/12/" + Nam);

    if (
      this.state.listDaTaTUTI &&
      !Array.isArray(this.state.listDaTaTUTI) &&
      this.state.listDaTaTUTI.Series != null
    ) {
      let intVH_TI = 0;
      for (let i = 0; i < this.state.listDaTaTUTI.Series[0].data.length; i++) {
        intVH_TI = intVH_TI + this.state.listDaTaTUTI.Series[0].data[i];
      }
      let intVH_TI_HATHE = 0;
      for (let i = 0; i < this.state.listDaTaTUTI.Series[10].data.length; i++) {
        intVH_TI_HATHE =
          intVH_TI_HATHE + this.state.listDaTaTUTI.Series[10].data[i];
      }
      let intVH_TI_TRUNGTHE = 0;
      for (let i = 0; i < this.state.listDaTaTUTI.Series[11].data.length; i++) {
        intVH_TI_TRUNGTHE =
          intVH_TI_TRUNGTHE + this.state.listDaTaTUTI.Series[11].data[i];
      }
      let intVH_TU = 0;
      for (let i = 0; i < this.state.listDaTaTUTI.Series[5].data.length; i++) {
        intVH_TU = intVH_TU + this.state.listDaTaTUTI.Series[5].data[i];
      }
      let intTULoaiTruDenNgay = 0;
      for (let i = 0; i < this.state.listDaTaTUTI.Series[8].data.length; i++) {
        intTULoaiTruDenNgay =
          intTULoaiTruDenNgay + this.state.listDaTaTUTI.Series[8].data[i];
      }
      let intTULoaiTruCuoiNam = 0;
      for (let i = 0; i < this.state.listDaTaTUTI.Series[9].data.length; i++) {
        intTULoaiTruCuoiNam =
          intTULoaiTruCuoiNam + this.state.listDaTaTUTI.Series[9].data[i];
      }
      let intTUQuaHanDenNgay = 0;
      for (let i = 0; i < this.state.listDaTaTUTI.Series[6].data.length; i++) {
        intTUQuaHanDenNgay =
          intTUQuaHanDenNgay + this.state.listDaTaTUTI.Series[6].data[i];
      }
      let intTUQuaHanCuoiNam = 0;
      for (let i = 0; i < this.state.listDaTaTUTI.Series[7].data.length; i++) {
        intTUQuaHanCuoiNam =
          intTUQuaHanCuoiNam + this.state.listDaTaTUTI.Series[7].data[i];
      }
      //TI
      let intTIHaTheLoaiTruDenNgay = 0;
      for (let i = 0; i < this.state.listDaTaTUTI.Series[16].data.length; i++) {
        intTIHaTheLoaiTruDenNgay =
          intTIHaTheLoaiTruDenNgay + this.state.listDaTaTUTI.Series[16].data[i];
      }
      let intTITrungTheLoaiTruDenNgay = 0;
      for (let i = 0; i < this.state.listDaTaTUTI.Series[17].data.length; i++) {
        intTITrungTheLoaiTruDenNgay =
          intTITrungTheLoaiTruDenNgay +
          this.state.listDaTaTUTI.Series[17].data[i];
      }
      let intTIHaTheLoaiTruCuoiNam = 0;
      for (let i = 0; i < this.state.listDaTaTUTI.Series[18].data.length; i++) {
        intTIHaTheLoaiTruCuoiNam =
          intTIHaTheLoaiTruCuoiNam + this.state.listDaTaTUTI.Series[18].data[i];
      }
      let intTITrungTheLoaiTruCuoiNam = 0;
      for (let i = 0; i < this.state.listDaTaTUTI.Series[19].data.length; i++) {
        intTITrungTheLoaiTruCuoiNam =
          intTITrungTheLoaiTruCuoiNam +
          this.state.listDaTaTUTI.Series[19].data[i];
      }
      let intTILoaiTruDenNgay = 0;
      for (let i = 0; i < this.state.listDaTaTUTI.Series[3].data.length; i++) {
        intTILoaiTruDenNgay =
          intTILoaiTruDenNgay + this.state.listDaTaTUTI.Series[3].data[i];
      }
      let intTILoaiTruCuoiNam = 0;
      for (let i = 0; i < this.state.listDaTaTUTI.Series[4].data.length; i++) {
        intTILoaiTruCuoiNam =
          intTILoaiTruCuoiNam + this.state.listDaTaTUTI.Series[4].data[i];
      }

      //TI QUA HAN
      let intTIHaTheQuaHanDenNgay = 0;
      for (let i = 0; i < this.state.listDaTaTUTI.Series[12].data.length; i++) {
        intTIHaTheQuaHanDenNgay =
          intTIHaTheQuaHanDenNgay + this.state.listDaTaTUTI.Series[12].data[i];
      }
      let intTITrungTheQuaHanDenNgay = 0;
      for (let i = 0; i < this.state.listDaTaTUTI.Series[13].data.length; i++) {
        intTITrungTheQuaHanDenNgay =
          intTITrungTheQuaHanDenNgay +
          this.state.listDaTaTUTI.Series[13].data[i];
      }
      let intTIHaTheQuaHanCuoiNam = 0;
      for (let i = 0; i < this.state.listDaTaTUTI.Series[14].data.length; i++) {
        intTIHaTheQuaHanCuoiNam =
          intTIHaTheQuaHanCuoiNam + this.state.listDaTaTUTI.Series[14].data[i];
      }
      let intTITrungTheQuaHanCuoiNam = 0;
      for (let i = 0; i < this.state.listDaTaTUTI.Series[15].data.length; i++) {
        intTITrungTheQuaHanCuoiNam =
          intTITrungTheQuaHanCuoiNam +
          this.state.listDaTaTUTI.Series[15].data[i];
      }
      let intTIQuaHanDenNgay = 0;
      for (let i = 0; i < this.state.listDaTaTUTI.Series[1].data.length; i++) {
        intTIQuaHanDenNgay =
          intTIQuaHanDenNgay + this.state.listDaTaTUTI.Series[1].data[i];
      }
      let intTIQuaHanCuoiNam = 0;
      for (let i = 0; i < this.state.listDaTaTUTI.Series[2].data.length; i++) {
        intTIQuaHanCuoiNam =
          intTIQuaHanCuoiNam + this.state.listDaTaTUTI.Series[2].data[i];
      }

      list5.push(intVH_TU);
      list5.push(intVH_TI_HATHE);
      list5.push(intVH_TI_TRUNGTHE);
      list5.push(intVH_TI);
      varCategories3.push("TU");
      varCategories3.push("TI hạ thế");
      varCategories3.push("TI trung thế");
      varCategories3.push("TI");
      list6.push(intTULoaiTruDenNgay);
      list6.push(intTULoaiTruCuoiNam);
      list6.push(intTUQuaHanDenNgay);
      list6.push(intTUQuaHanCuoiNam);

      list7.push(intTIHaTheLoaiTruDenNgay);
      list7.push(intTITrungTheLoaiTruDenNgay);
      list7.push(intTIHaTheLoaiTruCuoiNam);
      list7.push(intTITrungTheLoaiTruCuoiNam);
      list7.push(intTILoaiTruDenNgay);
      list7.push(intTILoaiTruCuoiNam);

      list7.push(intTIHaTheQuaHanDenNgay);
      list7.push(intTITrungTheQuaHanDenNgay);
      list7.push(intTIHaTheQuaHanCuoiNam);
      list7.push(intTITrungTheQuaHanCuoiNam);
      list7.push(intTIQuaHanDenNgay);
      list7.push(intTIQuaHanCuoiNam);

      list8.push(this.state.listDaTaTUTI.Series[6]);
      list8.push(this.state.listDaTaTUTI.Series[7]);

      list9.push(this.state.listDaTaTUTI.Series[1]);
      list9.push(this.state.listDaTaTUTI.Series[2]);

      list9.push(this.state.listDaTaTUTI.Series[1]);
      list9.push(this.state.listDaTaTUTI.Series[2]);

      list10.push(this.state.listDaTaTUTI.Series[5]);

      list11.push(this.state.listDaTaTUTI.Series[10]);
      list11.push(this.state.listDaTaTUTI.Series[11]);
      list11.push(this.state.listDaTaTUTI.Series[0]);
    }

    // else{
    //   Alert.alert("Không có dữ liệu!", "Thông báo");
    // }
    var conf1 = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "Tổng số công tơ đang vận hành"
      },
      yAxis: {
        title: {
          text: "Công tơ"
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
          name: "Tổng số công tơ",
          data: list2
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
        text: "Tổng số công tơ đang vận hành"
      },
      yAxis: {
        title: {
          text: "Công tơ"
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
      series: list1,
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
        text: "Công tơ quá hạn"
      },
      yAxis: {
        title: {
          text: "Công tơ"
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
      series: list3,
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
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "Công tơ quá hạn"
      },
      yAxis: {
        title: {
          text: "Công tơ"
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
          name: "Công tơ quá hạn",
          data: list4
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
    var conf5 = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "Tổng số TU, TI đang vận hành"
      },
      yAxis: {
        title: {
          text: "Số lượng"
        }
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories: varCategories3
      },
      series: [
        {
          name: "TU, TI vận hành",
          data: list5
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
    var conf6 = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "TU quá hạn"
      },
      yAxis: {
        title: {
          text: "TU"
        }
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories: varCategories4
      },
      series: [
        {
          name: "TU quá hạn",
          data: list6
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
    var conf7 = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "TI quá hạn"
      },
      yAxis: {
        title: {
          text: "TI"
        }
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories: varCategories5
      },
      series: [
        {
          name: "TI quá hạn",
          data: list7
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
    var conf8 = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "TU quá hạn"
      },
      yAxis: {
        title: {
          text: "TU"
        }
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories:
          this.state.listDaTaTUTI && !Array.isArray(this.state.listDaTaTUTI)
            ? this.state.listDaTaTUTI.Categories
            : []
      },
      series: list8,
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
    var conf9 = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "TI quá hạn"
      },
      yAxis: {
        title: {
          text: "TI"
        }
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories:
          this.state.listDaTaTUTI && !Array.isArray(this.state.listDaTaTUTI)
            ? this.state.listDaTaTUTI.Categories
            : []
      },
      series: list9,
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

    var conf10 = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "TU vận hành"
      },
      yAxis: {
        title: {
          text: "TU"
        }
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories:
          this.state.listDaTaTUTI && !Array.isArray(this.state.listDaTaTUTI)
            ? this.state.listDaTaTUTI.Categories
            : []
      },
      series: list10,
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
    var conf11 = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "TI vận hành"
      },
      yAxis: {
        title: {
          text: "TI"
        }
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories:
          this.state.listDaTaTUTI && !Array.isArray(this.state.listDaTaTUTI)
            ? this.state.listDaTaTUTI.Categories
            : []
      },
      series: list11,
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
      // <Swiper style={styles.wrapper} showsButtons={false}>
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
            initValue={this.state.SelectedDate.toString()}
            onChange={option => {
              this.onChangedDate(option);
            }}
            //  alert(`${option.label} (${option.key}) nom nom nom`);
          />
        </View>
        <Tabs>
          <View title="Công tơ" style={styles.content}>
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
                  config={conf4}
                  options={options}
                  originWhitelist={[""]}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                />
              </View>
              <View style={{ backgroundColor: "orange", height: 1 }} />
              <ChartView
                style={{ height: 500 }}
                config={conf3}
                options={options}
                originWhitelist={[""]}
                javaScriptEnabled={true}
                domStorageEnabled={true}
              />
              <View style={{ backgroundColor: "orange", height: 1 }} />
              <ChartView
                style={{ height: 500 }}
                config={conf2}
                options={options}
                originWhitelist={[""]}
                javaScriptEnabled={true}
                domStorageEnabled={true}
              />
            </ScrollView>
          </View>
          <View title="TU, TI" style={styles.content}>
            <View style={styles.chart}>
              <ScrollView
                key={Math.random()}
                style={{
                  backgroundColor: "white"
                }}
              >
                <View
                  style={{ flexDirection: width >= 600 ? "row" : "column" }}
                >
                  <ChartView
                    style={{ height: 500, width: vChieuRong }}
                    config={conf5}
                    options={options}
                    originWhitelist={[""]}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                  />
                  <ChartView
                    style={{ height: 500, width: vChieuRong }}
                    config={conf6}
                    options={options}
                    originWhitelist={[""]}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                  />
                </View>
                <View style={{ backgroundColor: "orange", height: 1 }} />
                <ChartView
                  style={{ height: 500 }}
                  config={conf7}
                  options={options}
                  originWhitelist={[""]}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                />
                <View style={{ backgroundColor: "orange", height: 1 }} />
                <ChartView
                  style={{ height: 500 }}
                  config={conf8}
                  options={options}
                  originWhitelist={[""]}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                />
                <View style={{ backgroundColor: "orange", height: 1 }} />
                <ChartView
                  style={{ height: 500 }}
                  config={conf9}
                  options={options}
                  originWhitelist={[""]}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                />
                <View style={{ backgroundColor: "orange", height: 1 }} />
                <ChartView
                  style={{ height: 500 }}
                  config={conf10}
                  options={options}
                  originWhitelist={[""]}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                />
                <View style={{ backgroundColor: "orange", height: 1 }} />
                <ChartView
                  style={{ height: 500 }}
                  config={conf11}
                  options={options}
                  originWhitelist={[""]}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                />
              </ScrollView>
            </View>
          </View>
        </Tabs>
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
    fontSize: 26 // Bigger font size,
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
    flex: 1
  }
});
