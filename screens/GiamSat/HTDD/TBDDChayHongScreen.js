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
export default class TBDDChayHongScreen extends React.PureComponent {
  static navigationOptions = {
    title: "TBĐĐ cháy hỏng"
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
  callMultiAPI = (THANGNAM, DONVI) => {
    this.setState({
      spinner: true
    });
    let url =
      urlBaoCao.sp_TTDDMatChayHong +
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
    let PTongSoCongTo = 0;
    let PMatChayHong = 0;
    let PTiLe = 0;
    let PTongTUChay = 0;
    let PTongTIChay = 0;
    let PTongDienTT = 0;
    let PTongSoTien = 0;

    let PCongToMat = [];
    let PCongToChay = [];
    let PCongToHong = [];

    let PTU = [];
    let PTI = [];
    let PDienTT = [];
    let PSoTien = [];

    if (
      this.state.listDaTa &&
      !Array.isArray(this.state.listDaTa) &&
      this.state.listDaTa.Series != null
    ) {
      for (let i = 0; i < this.state.listDaTa.Series[4].data.length; i++) {
        PMatChayHong = PMatChayHong + this.state.listDaTa.Series[4].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[5].data.length; i++) {
        PTongSoCongTo = PTongSoCongTo + this.state.listDaTa.Series[5].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[0].data.length; i++) {
        PTongTUChay = PTongTUChay + this.state.listDaTa.Series[0].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[1].data.length; i++) {
        PTongTIChay = PTongTIChay + this.state.listDaTa.Series[1].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[22].data.length; i++) {
        PTongDienTT = PTongDienTT + this.state.listDaTa.Series[22].data[i];
      }
      for (let i = 0; i < this.state.listDaTa.Series[23].data.length; i++) {
        PTongSoTien = PTongSoTien + this.state.listDaTa.Series[23].data[i];
      }
      PTiLe =
        Number(
          PTongSoCongTo == 0
            ? 0
            : ((PMatChayHong * 100) / PTongSoCongTo).toFixed(2)
        ) + " %";

      PCongToMat.push(this.state.listDaTa.Series[8]);
      PCongToMat.push(this.state.listDaTa.Series[9]);
      PCongToMat.push(this.state.listDaTa.Series[10]);
      PCongToMat.push(this.state.listDaTa.Series[11]);
      PCongToMat.push(this.state.listDaTa.Series[7]);

      PCongToChay.push(this.state.listDaTa.Series[13]);
      PCongToChay.push(this.state.listDaTa.Series[14]);
      PCongToChay.push(this.state.listDaTa.Series[15]);
      PCongToChay.push(this.state.listDaTa.Series[16]);
      PCongToChay.push(this.state.listDaTa.Series[12]);

      PCongToHong.push(this.state.listDaTa.Series[18]);
      PCongToHong.push(this.state.listDaTa.Series[19]);
      PCongToHong.push(this.state.listDaTa.Series[20]);
      PCongToHong.push(this.state.listDaTa.Series[21]);
      PCongToHong.push(this.state.listDaTa.Series[17]);

      PTU.push(this.state.listDaTa.Series[0]);

      PTI.push(this.state.listDaTa.Series[2]);
      PTI.push(this.state.listDaTa.Series[3]);
      PTI.push(this.state.listDaTa.Series[1]);
      PDienTT.push(this.state.listDaTa.Series[22]);
      PSoTien.push(this.state.listDaTa.Series[23]);
    }
    const width = this.state.screenwidth;
    const height = this.state.screenheight - 250;
    var conf1 = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "Công tơ mất"
      },
      yAxis: {
        title: {
          text: "Số lượng"
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
          this.state.listDaTa && !Array.isArray(this.state.listDaTa)
            ? this.state.listDaTa.Categories
            : []
      },
      series: PCongToMat,
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
        text: "Công tơ cháy"
      },
      yAxis: {
        title: {
          text: "Số lượng"
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
          this.state.listDaTa && !Array.isArray(this.state.listDaTa)
            ? this.state.listDaTa.Categories
            : []
      },
      series: PCongToChay,
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
        text: "Công tơ hỏng"
      },
      yAxis: {
        title: {
          text: "Số lượng"
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
          this.state.listDaTa && !Array.isArray(this.state.listDaTa)
            ? this.state.listDaTa.Categories
            : []
      },
      series: PCongToHong,
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
        text: "TU cháy"
      },
      yAxis: {
        title: {
          text: "Số lượng"
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
          this.state.listDaTa && !Array.isArray(this.state.listDaTa)
            ? this.state.listDaTa.Categories
            : []
      },
      series: PTU,
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
        text: "TI cháy"
      },
      yAxis: {
        title: {
          text: "Số lượng"
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
          this.state.listDaTa && !Array.isArray(this.state.listDaTa)
            ? this.state.listDaTa.Categories
            : []
      },
      series: PTI,
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
        text: "Số kWh truy thu"
      },
      yAxis: {
        title: {
          text: "kWh"
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
          this.state.listDaTa && !Array.isArray(this.state.listDaTa)
            ? this.state.listDaTa.Categories
            : []
      },
      series: PDienTT,
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
        text: "Số tiền truy thu"
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
          this.state.listDaTa && !Array.isArray(this.state.listDaTa)
            ? this.state.listDaTa.Categories
            : []
      },
      series: PSoTien,
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
                title="Công tơ"
                price={this.numberWithCommas(PTongSoCongTo)}
                titleStyle={{ fontSize: 12 }}
                pricingStyle={{ fontSize: 12 }}
                // info={["1 User", "Basic Support", "All Core Features"]}
                button={{ title: "", icon: "dashboard" }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <PricingCard
                color="red"
                title="Mất cháy hỏng"
                price={this.numberWithCommas(PMatChayHong)}
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
                title="Tổng TU cháy"
                price={this.numberWithCommas(PTongTUChay)}
                titleStyle={{ fontSize: 12 }}
                pricingStyle={{ fontSize: 12 }}
                // info={["1 User", "Basic Support", "All Core Features"]}
                button={{ title: "", icon: "dashboard" }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <PricingCard
                color="red"
                title="Tổng TI cháy"
                price={this.numberWithCommas(PTongTIChay)}
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
                title="Điện tiêu thụ truy thu"
                price={this.numberWithCommas(PTongDienTT)}
                titleStyle={{ fontSize: 12 }}
                pricingStyle={{ fontSize: 12 }}
                // info={["1 User", "Basic Support", "All Core Features"]}
                button={{ title: "", icon: "dashboard" }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <PricingCard
                color="red"
                title="Số tiền truy thu"
                price={this.numberWithCommas(PTongSoTien)}
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
              config={conf6}
              options={options}
              originWhitelist={[""]}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
            <View style={{ backgroundColor: "orange", height: 1 }} />
            <ChartView
              style={{ height: 400 }}
              config={conf7}
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
            <View title="Công tơ" style={styles.content}>
              <Page1 tabLabel={{ label: "Page #1" }} label="Page #1" />
            </View>
            {/* Second tab */}
            <View title="Tu, Ti" style={styles.content}>
              <Page2 tabLabel={{ label: "Page #1" }} label="Page #1" />
            </View>
            {/* Third tab */}
            <View title="Truy thu" style={styles.content}>
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
