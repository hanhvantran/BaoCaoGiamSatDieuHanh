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
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cell
} from "react-native-table-component";

export default class KetQuaThayTheTBDDScreen extends React.PureComponent {
  static navigationOptions = {
    title: "Kết quả khai thác hiệu suất TBACC"
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
      listDaTaTemp: [],
      listDate: [],
      orientation: "",
      screenheight: Dimensions.get("window").height,
      screenwidth: Dimensions.get("window").width,
      spinner: false,
      tableHead: [
        "Điện lực",
        " ≤ 1%",
        "1% < n ≤ 2%",
        "2% < n  ≤ 6%",
        "6% < n  ≤7%",
        "7% < n  ≤10%",
        "n > 10%",
        "Tổng",
        "Tháng",
        "Luỹ kế"
      ]
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

  callMultiAPI2 = async (vThangNam, vMaDonVi) => {
    this.setState({
      spinner: true
    });
    let Thang = vThangNam.split("/")[0];
    let Nam = vThangNam.split("/")[1];
    let param1 =
      "?MaDonVi=" + vMaDonVi + "&THANG=" + Thang + "&NAM=" + Nam + "";

    const urls = [urlBaoCao.sp_KETQUAKHAITHACHSTRAMCCPC + param1];
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
  callMultiAPI = async (vThangNam, vMaDonVi) => {
    this.setState({
      spinner: true
    });
    let Thang = vThangNam.split("/")[0];
    let Nam = vThangNam.split("/")[1];
    let param1 =
      "?MaDonVi=" + vMaDonVi + "&THANG=" + Thang + "&NAM=" + Nam + "";

    const urls = [urlBaoCao.sp_KETQUAKHAITHACHSTRAMCCPC2 + param1];
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
        listDaTaTemp: data[0]
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
    let tableTitle = ["", "", "", ""];
    let tableData = [];
    const width = this.state.screenwidth;
    let vChieuRong = width >= 600 ? width / 2 : width;
    let vChieuRong31 = width >= 600 ? (width / 3) * 1 : width;
    let vChieuRong32 = width >= 600 ? (width / 3) * 2 : width;
    const height = this.state.screenheight - 50;
    let Thang = this.state.SelectedDate.split("/")[0];
    let Nam = this.state.SelectedDate.split("/")[1];
    let ThangTruoc = Thang - 1;
    let NamTruoc = Nam;
    if (Thang == 1) {
      ThangTruoc = 12;
      NamTruoc = Nam - 1;
    }
    let ThangNamTruoc = ThangTruoc + "/" + NamTruoc;
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
    let list = [],
      list1 = [];
    let list2 = [],
      list22 = [];
    let list3 = [];
    let list41 = [];
    let list42 = [];
    let varLabel3 = [
      "Tổn thất " + this.state.SelectedDate,
      "Tổn thất " + ThangNamTruoc,
      "Luỹ kế " + this.state.SelectedDate,
      "Luỹ kế " + ThangNamTruoc
    ];
    let varCategories1 = [
      "≤1%",
      "≤2%",
      "≤6%",
      "≤7%",
      "≤10%",
      ">10%",
      "Tổng cộng"
    ];
    let listtableTitle = [];
    const listDataRowTong = [];
    let intmotpt = 0,
      inthaipt = 0,
      intsaupt = 0,
      intbaypt = 0,
      intmuoipt = 0,
      inttrenmuoipt = 0,
      inttong = 0;
    let intdaU_NGUON = 0,
      inttT_KWH = 0,
      intdaU_NGUONLK = 0,
      inttT_KWHLK = 0;
    let intmotpt_TRUOC = 0,
      inthaipt_TRUOC = 0,
      intsaupt_TRUOC = 0,
      intbaypt_TRUOC = 0,
      intmuoipt_TRUOC = 0,
      inttrenmuoipt_TRUOC = 0,
      inttong_TRUOC = 0;
    let intdaU_NGUON_TRUOC = 0,
      inttT_KWH_TRUOC = 0,
      intdaU_NGUONLK_TRUOC = 0,
      inttT_KWHLK_TRUOC = 0;
    //=iif(CDbl(Fields!DAU_NGUON.Value)=0,0, round((CDbl(Fields!TT_KWH.Value)*100)/CDbl(Fields!DAU_NGUON.Value),2))
    if (this.state.listDaTaTemp && Array.isArray(this.state.listDaTaTemp)) {
      for (let i = 0; i < this.state.listDaTaTemp.length; i++) {
        const listDataRow = [];
        let doubleTonThat = 0,
          doubleTonThatLuyKe = 0;
        let intDauNguon = 0,
          intDauNguonLuyKe = 0;
        let intTonThat = 0,
          intTonThatLuyKe = 0;
        listtableTitle.push(this.state.listDaTaTemp[i].teN_DVIQLY);
        listDataRow.push(this.state.listDaTaTemp[i].motpt);
        listDataRow.push(this.state.listDaTaTemp[i].haipt);
        listDataRow.push(this.state.listDaTaTemp[i].saupt);
        listDataRow.push(this.state.listDaTaTemp[i].baypt);
        listDataRow.push(this.state.listDaTaTemp[i].muoipt);
        listDataRow.push(this.state.listDaTaTemp[i].trenmuoipt);
        listDataRow.push(this.state.listDaTaTemp[i].tong);

        intDauNguon = this.state.listDaTaTemp[i].daU_NGUON;
        intTonThat = this.state.listDaTaTemp[i].tT_KWH;

        intDauNguonLuyKe = this.state.listDaTaTemp[i].daU_NGUONLK;
        intTonThatLuyKe = this.state.listDaTaTemp[i].tT_KWHLK;

        doubleTonThat = Number(
          intDauNguon == 0 ? 0 : ((intTonThat * 100) / intDauNguon).toFixed(2)
        );
        doubleTonThatLuyKe = Number(
          intDauNguonLuyKe == 0
            ? 0
            : ((intTonThatLuyKe * 100) / intDauNguonLuyKe).toFixed(2)
        );
        listDataRow.push(doubleTonThat);
        listDataRow.push(doubleTonThatLuyKe);

        tableData.push(listDataRow);
        intmotpt = intmotpt + this.state.listDaTaTemp[i].motpt;
        inthaipt = inthaipt + this.state.listDaTaTemp[i].haipt;
        intsaupt = intsaupt + this.state.listDaTaTemp[i].saupt;
        intbaypt = intbaypt + this.state.listDaTaTemp[i].baypt;
        intmuoipt = intmuoipt + this.state.listDaTaTemp[i].muoipt;
        inttrenmuoipt = inttrenmuoipt + this.state.listDaTaTemp[i].trenmuoipt;
        inttong = inttong + this.state.listDaTaTemp[i].tong;
        intdaU_NGUON = intdaU_NGUON + this.state.listDaTaTemp[i].daU_NGUON;
        inttT_KWH = inttT_KWH + this.state.listDaTaTemp[i].tT_KWH;
        intdaU_NGUONLK =
          intdaU_NGUONLK + this.state.listDaTaTemp[i].daU_NGUONLK;
        inttT_KWHLK = inttT_KWHLK + this.state.listDaTaTemp[i].tT_KWHLK;

        intmotpt_TRUOC =
          intmotpt_TRUOC + this.state.listDaTaTemp[i].motpT_TRUOC;
        inthaipt_TRUOC =
          inthaipt_TRUOC + this.state.listDaTaTemp[i].haipT_TRUOC;
        intsaupt_TRUOC =
          intsaupt_TRUOC + this.state.listDaTaTemp[i].saupT_TRUOC;
        intbaypt_TRUOC =
          intbaypt_TRUOC + this.state.listDaTaTemp[i].baypT_TRUOC;
        intmuoipt_TRUOC =
          intmuoipt_TRUOC + this.state.listDaTaTemp[i].muoipT_TRUOC;
        inttrenmuoipt_TRUOC =
          inttrenmuoipt_TRUOC + this.state.listDaTaTemp[i].trenmuoipT_TRUOC;
        inttong_TRUOC = inttong_TRUOC + this.state.listDaTaTemp[i].tonG_TRUOC;
        intdaU_NGUON_TRUOC =
          intdaU_NGUON_TRUOC + this.state.listDaTaTemp[i].daU_NGUON_TRUOC;
        inttT_KWH_TRUOC =
          inttT_KWH_TRUOC + this.state.listDaTaTemp[i].tT_KWH_TRUOC;
        intdaU_NGUONLK_TRUOC =
          intdaU_NGUONLK_TRUOC + this.state.listDaTaTemp[i].daU_NGUONLK_TRUOC;
        inttT_KWHLK_TRUOC =
          inttT_KWHLK_TRUOC + this.state.listDaTaTemp[i].tT_KWHLK_TRUOC;
      }
      let dTonThat = 0,
        dTonThatLuyKe = 0;
      dTonThat = Number(
        intdaU_NGUON == 0 ? 0 : ((inttT_KWH * 100) / intdaU_NGUON).toFixed(2)
      );
      dTonThatLuyKe = Number(
        intdaU_NGUONLK == 0
          ? 0
          : ((inttT_KWHLK * 100) / intdaU_NGUONLK).toFixed(2)
      );
      listDataRowTong.push(intmotpt);
      listDataRowTong.push(inthaipt);
      listDataRowTong.push(intsaupt);
      listDataRowTong.push(intbaypt);
      listDataRowTong.push(intmuoipt);
      listDataRowTong.push(inttrenmuoipt);
      listDataRowTong.push(inttong);
      listDataRowTong.push(dTonThat);
      listDataRowTong.push(dTonThatLuyKe);
      tableData.push(listDataRowTong);

      listtableTitle.push("Tổng");
      tableTitle = listtableTitle;

      list.push(intmotpt);
      list.push(inthaipt);
      list.push(intsaupt);
      list.push(intbaypt);
      list.push(intmuoipt);
      list.push(inttrenmuoipt);
      list.push(inttong);

      list1.push(intmotpt_TRUOC);
      list1.push(inthaipt_TRUOC);
      list1.push(intsaupt_TRUOC);
      list1.push(intbaypt_TRUOC);
      list1.push(intmuoipt_TRUOC);
      list1.push(inttrenmuoipt_TRUOC);
      list1.push(inttong_TRUOC);

      list2.push(intdaU_NGUON);
      list2.push(inttT_KWH);
      list22.push(intdaU_NGUON_TRUOC);
      list22.push(inttT_KWH_TRUOC);

      let TileTT1 = Number(
        intdaU_NGUON == 0 ? 0.0 : ((inttT_KWH * 100) / intdaU_NGUON).toFixed(2)
      );
      let TileTT2 = Number(
        intdaU_NGUON_TRUOC == 0
          ? 0.0
          : ((inttT_KWH_TRUOC * 100) / intdaU_NGUON_TRUOC).toFixed(2)
      );
      let TileTT3 = Number(
        intdaU_NGUONLK == 0
          ? 0.0
          : ((inttT_KWHLK * 100) / intdaU_NGUONLK).toFixed(2)
      );
      let TileTT4 = Number(
        intdaU_NGUONLK_TRUOC == 0
          ? 0.0
          : ((inttT_KWHLK_TRUOC * 100) / intdaU_NGUONLK_TRUOC).toFixed(2)
      );
      list3.push(TileTT1);
      list3.push(TileTT2);
      list3.push(TileTT3);
      list3.push(TileTT4);

      let A1 = Number(
        inttong == 0 ? 0 : (((intmotpt + inthaipt) * 100) / inttong).toFixed(2)
      );
      let A2 = Number(
        inttong == 0 ? 0 : ((intsaupt * 100) / inttong).toFixed(2)
      );
      let A3 = Number(
        inttong == 0 ? 0 : ((intbaypt * 100) / inttong).toFixed(2)
      );
      let A4 = A1 + A2 + A3;
      let B1 = Number(
        inttong_TRUOC == 0
          ? 0
          : (((intmotpt_TRUOC + inthaipt_TRUOC) * 100) / inttong_TRUOC).toFixed(
              2
            )
      );
      let B2 = Number(
        inttong_TRUOC == 0
          ? 0
          : ((intsaupt_TRUOC * 100) / inttong_TRUOC).toFixed(2)
      );
      let B3 = Number(
        inttong_TRUOC == 0
          ? 0
          : ((intbaypt_TRUOC * 100) / inttong_TRUOC).toFixed(2)
      );
      let B4 = B1 + B2 + B3;
      list41.push(A1);
      list41.push(A2);
      list41.push(A3);
      list41.push(A4);

      list42.push(B1);
      list42.push(B2);
      list42.push(B3);
      list42.push(B4);
    }
    var conf1 = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "Kết quả khai thác hiệu suất trạm CC"
      },
      yAxis: {
        title: {
          text: "Trạm"
        }
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories: ["≤1%", "≤2%", "≤6%", "≤7%", "≤10%", ">10%", "Tổng cộng"]
      },
      series: [
        {
          name: "Tháng " + this.state.SelectedDate,
          data: list
        },
        {
          name: "Tháng " + ThangNamTruoc,
          data: list1
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
        text: "Sản lượng"
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
        categories: ["Đầu nguồn", "Tổn thất"]
      },
      series: [
        {
          name: "Tháng " + this.state.SelectedDate,
          data: list2
        },
        {
          name: "Tháng " + ThangNamTruoc,
          data: list22
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
        text: "Tổn thất hạ thế"
      },
      yAxis: {
        title: {
          text: "%"
        }
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories: varLabel3
      },
      series: [
        {
          name: "Tỉ lệ tổn thất (%)",
          data: list3
        }
      ],
      plotOptions: {
        column: {
          dataLabels: {
            format: "{point.y:,.2f} ",
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
        text: "Tỉ trọng"
      },
      yAxis: {
        title: {
          text: "%"
        }
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories: ["≤2%", "≤6%", "≤7%", "Tổng"]
      },
      series: [
        {
          name: "Tháng " + this.state.SelectedDate,
          data: list41
        },
        {
          name: "Tháng " + ThangNamTruoc,
          data: list42
        }
      ],
      plotOptions: {
        column: {
          dataLabels: {
            format: "{point.y:,.2f} ",
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
            <View style={{ backgroundColor: "orange", height: 1 }} />
            <View style={{ flexDirection: width >= 600 ? "row" : "column" }}>
              <ChartView
                style={{ height: 500, width: vChieuRong }}
                config={conf3}
                options={options2}
                originWhitelist={[""]}
                javaScriptEnabled={true}
                domStorageEnabled={true}
              />
              <ChartView
                style={{ height: 500, width: vChieuRong }}
                config={conf4}
                options={options2}
                originWhitelist={[""]}
                javaScriptEnabled={true}
                domStorageEnabled={true}
              />
            </View>
            <View style={styles.container2}>
              <View style={{ backgroundColor: "orange", height: 1 }} />
              <Table borderStyle={{ borderWidth: 1 }}>
                <Row
                  data={["Số trạm tổn thất trong khoảng", "TT hạ thế(%)"]}
                  flexArr={[9, 2]}
                  style={styles.head}
                  textStyle={styles.text}
                />
                <Row
                  data={this.state.tableHead}
                  flexArr={[2, 1, 1, 1, 1, 1, 1, 1, 1]}
                  style={styles.head}
                  textStyle={styles.text}
                />
                <TableWrapper style={styles.wrapper}>
                  <Col
                    data={tableTitle}
                    style={styles.title}
                    heightArr={[28, 28]}
                    textStyle={styles.text}
                  />
                  <Rows
                    data={tableData}
                    flexArr={[1, 1, 1, 1, 1, 1, 1, 1, 1]}
                    style={styles.row}
                    textStyle={styles.text}
                  />
                </TableWrapper>
              </Table>
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
  container2: { flex: 1, padding: 10, backgroundColor: "#fff" },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  wrapper: { flexDirection: "row" },
  title: { flex: 2, backgroundColor: "#f6f8fa" },
  row: { height: 28 },
  text: { textAlign: "center" }
});
