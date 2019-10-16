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
//import { getTenDonVi } from "../../../data/dmdonvi";
import Spinner from "react-native-loading-spinner-overlay";
import Tabs from "../../Tabs/Tabs";
import { PricingCard } from "react-native-elements";
export default class KetQuaThayTheTBDDScreen extends React.PureComponent {
  static navigationOptions = {
    title: "TBĐĐ được thay thế"
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
        new Date().getDate() < 28
          ? new Date().getMonth() <= 9
            ? "0" + new Date().getMonth() + "/" + new Date().getFullYear()
            : new Date().getMonth() + "/" + new Date().getFullYear()
          : new Date().getMonth() + 1 <= 9
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
          this.sp_KTDinhKyHTDD(
            this.state.SelectedDonVi,
            this.state.SelectedDate
          );
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
      //this._isMounted &&
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
    var intitYear = year - 2;
    for (var i = intitYear; i <= year; i++) {
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
  sp_KTDinhKyHTDD = (DONVI, THANGNAM, GIATRI) => {
    this.setState({
      spinner: true
    });
    let url =
      urlBaoCao.sp_KTDinhKyHTDD +
      "?MaDonVi=" +
      DONVI +
      "&THANG=" +
      THANGNAM.split("/")[0] +
      "&NAM=" +
      THANGNAM.split("/")[1] +
      "";
    return fetch(url)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson && !Array.isArray(responseJson)) {
          this.setState({
            listDaTa: responseJson,
            SelectedDonVi: DONVI,
            SelectedDate: THANGNAM,
            spinner: false
          });
        } else {
          this.setState({ spinner: false });
          Alert.alert("Thông báo", "Không có dữ liệu!");
        }
      })
      .catch(error => {
        this.setState({
          spinner: false
        });
        Alert.alert("Lỗi kết nối!", error.toString());
      });
  };
  renderTabBar() {
    return <StatusBar hidden />;
  }
  onChangedDonVi(itemValue) {
    this.sp_KTDinhKyHTDD(itemValue.key, this.state.SelectedDate, 1);
  }
  onChangedDate(itemValue) {
    this.sp_KTDinhKyHTDD(this.state.SelectedDonVi, itemValue.key, 2);
    //this.setState({ SelectedDate: itemValue });
  }
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  numberWithCommasDecimal(x) {
    return x.toString().replace(".", ",");
  }
  render() {
    let PThucHienHTDD = 0;
    let PKeHoachHTDD = 0;
    let PTiLe = 0;

    let PThucHienCongTo = 0;
    let PKeHoachCongTo = 0;
    let PTiLeCongTo = 0;

    let PThucHienTU = 0;
    let PKeHoachTU = 0;
    let PTiLeTU = 0;

    let PThucHienTI = 0;
    let PKeHoachTI = 0;
    let PTiLeTI = 0;

    let list1 = [],
      list2 = [],
      list3 = [],
      list4 = [],
      list5 = [],
      list6 = [],
      list7 = [],
      list8 = [],
      list9 = [],
      list10 = [],
      list11 = [],
      list12 = [];
    let list13 = [],
      list14 = [],
      list15 = [],
      list16 = [],
      list17 = [],
      list18 = [];

    if (
      this.state.listDaTa &&
      !Array.isArray(this.state.listDaTa) &&
      this.state.listDaTa.Series != null
    ) {
      for (let i = 0; i < this.state.listDaTa.Series[0].data.length; i++) {
        PThucHienHTDD = PThucHienHTDD + this.state.listDaTa.Series[0].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[1].data.length; i++) {
        PKeHoachHTDD = PKeHoachHTDD + this.state.listDaTa.Series[1].data[i];
      }
      PTiLe =
        Number(
          PKeHoachHTDD == 0
            ? 0
            : ((PThucHienHTDD * 100) / PKeHoachHTDD).toFixed(2)
        ) + " %";
      for (let i = 0; i < this.state.listDaTa.Series[3].data.length; i++) {
        PThucHienCongTo =
          PThucHienCongTo + this.state.listDaTa.Series[3].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[4].data.length; i++) {
        PKeHoachCongTo = PKeHoachCongTo + this.state.listDaTa.Series[4].data[i];
      }
      PTiLeCongTo =
        Number(
          PKeHoachCongTo == 0
            ? 0
            : ((PThucHienCongTo * 100) / PKeHoachCongTo).toFixed(2)
        ) + " %";

      for (let i = 0; i < this.state.listDaTa.Series[6].data.length; i++) {
        PThucHienTU = PThucHienTU + this.state.listDaTa.Series[6].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[7].data.length; i++) {
        PKeHoachTU = PKeHoachTU + this.state.listDaTa.Series[7].data[i];
      }
      PTiLeTU =
        Number(
          PKeHoachTU == 0 ? 0 : ((PThucHienTU * 100) / PKeHoachTU).toFixed(2)
        ) + " %";
      for (let i = 0; i < this.state.listDaTa.Series[9].data.length; i++) {
        PThucHienTI = PThucHienTI + this.state.listDaTa.Series[9].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[10].data.length; i++) {
        PKeHoachTI = PKeHoachTI + this.state.listDaTa.Series[10].data[i];
      }
      PTiLeTI =
        Number(
          PKeHoachTI == 0 ? 0 : ((PThucHienTI * 100) / PKeHoachTI).toFixed(2)
        ) + " %";
      list1 = this.state.listDaTa.Series[0].data;
      list2 = this.state.listDaTa.Series[1].data;
      list3 = this.state.listDaTa.Series[2].data;
      list4 = this.state.listDaTa.Series[3].data;
      list5 = this.state.listDaTa.Series[4].data;
      list6 = this.state.listDaTa.Series[5].data;
      list7 = this.state.listDaTa.Series[6].data;
      list8 = this.state.listDaTa.Series[7].data;
      list9 = this.state.listDaTa.Series[8].data;
      list10 = this.state.listDaTa.Series[9].data;
      list11 = this.state.listDaTa.Series[10].data;
      list12 = this.state.listDaTa.Series[11].data;

      list13 = this.state.listDaTa.Series[12].data;
      list14 = this.state.listDaTa.Series[13].data;
      list15 = this.state.listDaTa.Series[14].data;
      list16 = this.state.listDaTa.Series[15].data;
      list17 = this.state.listDaTa.Series[16].data;
      list18 = this.state.listDaTa.Series[17].data;
      //console.log("list1:", list1);
      //console.log(" this.state.listDaTa.Series:", this.state.listDaTa.Series);

      // console.log("list2:", list2);
      // console.log("list3:", list3);
    }
    const width = this.state.screenwidth;
    const height = this.state.screenheight - 250;

    var conf1 = {
      chart: {
        type: "column"
      },

      title: {
        text: "Thay định kỳ HTĐĐ"
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
            text: "Số lượng"
          }
        },
        {
          opposite: true,
          title: {
            text: "Tỉ lệ thay định kỳ (%)"
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
          name: "Thực hiện",
          data: list1
          // yAxis: 1
        },
        {
          name: "Kế hoạch",
          data: list2
        },
        {
          name: "Tỉ lệ",
          data: list3,
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
        text: "Thay định kỳ công tơ"
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
            text: "Số lượng"
          }
        },
        {
          opposite: true,
          title: {
            text: "Tỉ lệ thay định kỳ (%)"
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
          name: "Thực hiện",
          data: list4
          // yAxis: 1
        },
        {
          name: "Kế hoạch",
          data: list5
        },
        {
          name: "Tỉ lệ",
          data: list6,
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
        text: "Thay định kỳ TU"
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
            text: "Số lượng"
          }
        },
        {
          opposite: true,
          title: {
            text: "Tỉ lệ thay định kỳ (%)"
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
          name: "Thực hiện",
          data: list7
          // yAxis: 1
        },
        {
          name: "Kế hoạch",
          data: list8
        },
        {
          name: "Tỉ lệ",
          data: list9,
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
        text: "Thay định kỳ TI"
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
            text: "Số lượng"
          }
        },
        {
          opposite: true,
          title: {
            text: "Tỉ lệ thay định kỳ (%)"
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
          name: "Thực hiện",
          data: list10
          // yAxis: 1
        },
        {
          name: "Kế hoạch",
          data: list11
        },
        {
          name: "Tỉ lệ",
          data: list12,
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
        text: "Thay định kỳ TI - Chi tiết"
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
            text: "Số lượng"
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
          name: "Hạ thế",
          data: list17
          // yAxis: 1
        },
        {
          name: "Trung thế",
          data: list18
          // yAxis: 1
        }
      ]
    };
    var conf6 = {
      chart: {
        type: "column"
      },

      title: {
        text: "Thay định kỳ Công tơ - Chi tiết"
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
            text: "Số lượng"
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
          name: "Công tơ cơ 1 pha",
          data: list13
          // yAxis: 1
        },
        {
          name: "Công tơ cơ 3 pha",
          data: list14
          // yAxis: 1
        },
        {
          name: "Công tơ điện tử 1 pha",
          data: list15
          // yAxis: 1
        },
        {
          name: "Công tơ điện tử 3 pha",
          data: list16
          // yAxis: 1
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
                title="Thực hiện"
                price={this.numberWithCommas(PThucHienHTDD)}
                titleStyle={{ fontSize: 12 }}
                pricingStyle={{ fontSize: 12 }}
                // info={["1 User", "Basic Support", "All Core Features"]}
                button={{ title: "", icon: "dashboard" }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <PricingCard
                color="red"
                title="Kế hoạch"
                price={this.numberWithCommas(PKeHoachHTDD)}
                titleStyle={{ fontSize: 10 }}
                pricingStyle={{ fontSize: 12 }}
                fontSize="22"
                // info={["1 User", "Basic Support", "All Core Features"]}
                button={{ title: "", icon: "dashboard" }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <PricingCard
                color="green"
                title="Tỉ lệ"
                price={this.numberWithCommasDecimal(PTiLe)}
                titleStyle={{ fontSize: 12 }}
                pricingStyle={{ fontSize: 12 }}
                // info={["1 User", "Basic Support", "All Core Features"]}
                button={{ title: "", icon: "dashboard" }}
              />
            </View>
          </View>
          <View style={{ flex: 1, paddingTop: 80 }}>
            <ChartView
              style={{ height: 500 }}
              config={conf1}
              options={options}
              originWhitelist={[""]}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
          </View>
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
          <View style={{ flex: 1, flexDirection: "row", height: 90 }}>
            <View style={{ flex: 1 }}>
              <PricingCard
                color="#4f9deb"
                title="Thực hiện"
                price={this.numberWithCommas(PThucHienCongTo)}
                titleStyle={{ fontSize: 12 }}
                pricingStyle={{ fontSize: 12 }}
                // info={["1 User", "Basic Support", "All Core Features"]}
                button={{ title: "", icon: "dashboard" }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <PricingCard
                color="red"
                title="Kế hoạch"
                price={this.numberWithCommas(PKeHoachCongTo)}
                titleStyle={{ fontSize: 12 }}
                pricingStyle={{ fontSize: 12 }}
                fontSize="22"
                // info={["1 User", "Basic Support", "All Core Features"]}
                button={{ title: "", icon: "dashboard" }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <PricingCard
                color="green"
                title="Tỉ lệ"
                price={this.numberWithCommasDecimal(PTiLeCongTo)}
                titleStyle={{ fontSize: 12 }}
                pricingStyle={{ fontSize: 12 }}
                fontSize="22"
                // info={["1 User", "Basic Support", "All Core Features"]}
                button={{ title: "", icon: "dashboard" }}
              />
            </View>
          </View>
          <View style={{ flex: 1, paddingTop: 80 }}>
            <ChartView
              style={{ height: 500 }}
              config={conf2}
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
          </View>
        </ScrollView>
      </View>
    );
    const Page3 = ({ label }) => (
      <View style={styles.chart}>
        <ScrollView
          key={Math.random()}
          style={{
            backgroundColor: "white"
          }}
        >
          <View style={{ flex: 1, flexDirection: "row", height: 90 }}>
            <View style={{ flex: 1 }}>
              <PricingCard
                color="#4f9deb"
                title="Thực hiện"
                price={this.numberWithCommas(PThucHienTU)}
                titleStyle={{ fontSize: 12 }}
                pricingStyle={{ fontSize: 12 }}
                // info={["1 User", "Basic Support", "All Core Features"]}
                button={{ title: "", icon: "dashboard" }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <PricingCard
                color="red"
                title="Kế hoạch"
                price={this.numberWithCommas(PKeHoachTU)}
                titleStyle={{ fontSize: 12 }}
                pricingStyle={{ fontSize: 12 }}
                fontSize="22"
                // info={["1 User", "Basic Support", "All Core Features"]}
                button={{ title: "", icon: "dashboard" }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <PricingCard
                color="green"
                title="Tỉ lệ"
                price={this.numberWithCommasDecimal(PTiLeTU)}
                titleStyle={{ fontSize: 12 }}
                pricingStyle={{ fontSize: 12 }}
                fontSize="22"
                // info={["1 User", "Basic Support", "All Core Features"]}
                button={{ title: "", icon: "dashboard" }}
              />
            </View>
          </View>
          <View style={{ flex: 1, paddingTop: 80 }}>
            <ChartView
              style={{ height: 500 }}
              config={conf3}
              options={options}
              originWhitelist={[""]}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
            <View style={{ backgroundColor: "orange", height: 1 }} />
            <View style={{ flex: 1, flexDirection: "row", height: 90 }}>
              <View style={{ flex: 1 }}>
                <PricingCard
                  color="#4f9deb"
                  title="Thực hiện"
                  price={this.numberWithCommas(PThucHienTI)}
                  titleStyle={{ fontSize: 12 }}
                  pricingStyle={{ fontSize: 12 }}
                  // info={["1 User", "Basic Support", "All Core Features"]}
                  button={{ title: "", icon: "dashboard" }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <PricingCard
                  color="red"
                  title="Kế hoạch"
                  price={this.numberWithCommas(PKeHoachTI)}
                  titleStyle={{ fontSize: 12 }}
                  pricingStyle={{ fontSize: 12 }}
                  fontSize="22"
                  // info={["1 User", "Basic Support", "All Core Features"]}
                  button={{ title: "", icon: "dashboard" }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <PricingCard
                  color="green"
                  title="Tỉ lệ"
                  price={this.numberWithCommasDecimal(PTiLeTI)}
                  titleStyle={{ fontSize: 12 }}
                  pricingStyle={{ fontSize: 12 }}
                  fontSize="22"
                  // info={["1 User", "Basic Support", "All Core Features"]}
                  button={{ title: "", icon: "dashboard" }}
                />
              </View>
            </View>
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
            <View title="HTĐĐ" style={styles.content}>
              <Page1 tabLabel={{ label: "Page #1" }} label="Page #1" />
            </View>
            {/* Second tab */}
            <View title="Công tơ" style={styles.content}>
              <Page2 tabLabel={{ label: "Page #1" }} label="Page #1" />
            </View>
            {/* Third tab */}
            <View title="Tu, Ti" style={styles.content}>
              <Page3 tabLabel={{ label: "Page #1" }} label="Page #1" />
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
