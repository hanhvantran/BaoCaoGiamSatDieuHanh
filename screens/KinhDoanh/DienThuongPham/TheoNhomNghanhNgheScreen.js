import React from "react";
import {
  StyleSheet,
  Text,
  Alert,
  View,
  AsyncStorage,
  ScrollView,
  StatusBar,
  Dimensions,
  Image
} from "react-native";
import ModalSelector from "react-native-modal-selector";
import urlBaoCao from "../../../networking/services";
import ChartView from "react-native-highcharts";
import Spinner from "react-native-loading-spinner-overlay";
import SelectMultiple from "react-native-select-multiple";

const renderLabel = (label, style) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View style={{ marginLeft: 10 }}>
        <Text style={style}>{label}</Text>
      </View>
    </View>
  );
};
export default class TheoNhomNghanhNgheScreen extends React.PureComponent {
  static navigationOptions = {
    title: "Theo nhóm nghành nghề đặc thù"
  };
  state = { selectedFruits: [] };

  onSelectionsChange = selectedFruits => {
    // selectedFruits is array of { label, value }
    let vList = "";
    for (let i = 0; i < selectedFruits.length; i++) {
      if (i == 0) {
        vList = selectedFruits[i].value;
      } else {
        vList = vList + "," + selectedFruits[i].value;
      }
    }
    if (vList.length == 0) {
      Alert.alert("Chọn ít nhất 1 mã nghành nghề!", "Thông báo");
      this.setState({
        selectedFruits: selectedFruits,
        listNghanhNgheSelected: vList
      });
    } else {
      this.callMultiAPI(
        selectedFruits,
        vList,
        this.state.SelectedDate,
        this.state.SelectedDonVi
      );
      AsyncStorage.setItem("selectedFruits", JSON.stringify(selectedFruits));
    }
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
      listNghanhNghe: [],
      listDaTa: [],
      listDate: [],
      orientation: "",
      screenheight: Dimensions.get("window").height,
      screenwidth: Dimensions.get("window").width,
      spinner: false,
      selectedFruits: [],
      listNghanhNgheSelected: ""
    };
  }
  _bootstrapAsync = async () => {
    try {
      let abc = [];
      AsyncStorage.getItem("selectedFruits").then(user_data_json => {
        let userData = JSON.parse(user_data_json);
        if (userData != undefined) {
          let vList = "";
          for (let i = 0; i < userData.length; i++) {
            if (i == 0) {
              vList = userData[i].value;
            } else {
              vList = vList + "," + userData[i].value;
            }
          }

          this.setState({
            selectedFruits: userData,
            listNghanhNgheSelected: vList
          });
        }
      });
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

          this.get_NghanhNghe();
          this.get_Info_Dvi_ChaCon(userData.mA_DVIQLY, userData.caP_DVI);
          if (this.state.listNghanhNgheSelected.length > 0)
            this.callMultiAPI(
              this.state.selectedFruits,
              this.state.listNghanhNgheSelected,
              this.state.SelectedDate,
              this.state.SelectedDonVi
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
  get_NghanhNghe = () => {
    return fetch(urlBaoCao.get_NghanhNghe)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson && responseJson.length > 0) {
          this.setState(
            {
              listNghanhNghe: responseJson
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

  callMultiAPI = async (selectedFruits, vList, vThangNam, vMaDonVi) => {
    this.setState({
      spinner: true
    });
    let Thang = vThangNam.split("/")[0];
    let Nam = vThangNam.split("/")[1];
    let param1 =
      "?MaDonVi=" +
      vMaDonVi +
      "&THANG=" +
      Thang +
      "&NAM=" +
      Nam +
      "" +
      "&PListNghanhNghe=" +
      vList;

    const urls = [urlBaoCao.sp_ThuongPhamTheoNghanhNghe + param1];
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
        selectedFruits: selectedFruits,
        listNghanhNgheSelected: vList,
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
    if (this.state.listNghanhNgheSelected.length == 0) {
      Alert.alert("Chọn ít nhất 1 mã nghành nghề!", "Thông báo");
    } else {
      this.callMultiAPI(
        this.state.selectedFruits,
        this.state.listNghanhNgheSelected,
        this.state.SelectedDate,
        itemValue.key
      );
    }
  }
  onChangedDate(itemValue) {
    if (this.state.listNghanhNgheSelected.length == 0) {
      Alert.alert("Chọn ít nhất 1 mã nghành nghề!", "Thông báo");
    } else {
      this.callMultiAPI(
        this.state.selectedFruits,
        this.state.listNghanhNgheSelected,
        itemValue.key,
        this.state.SelectedDonVi
      );
    }
    //this.setState({ SelectedDate: itemValue });
  }
  render() {
    const width = this.state.screenwidth;
    const intFlex = parseInt(width / 180) - 1;
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
        categories:
          this.state.listDaTa && !Array.isArray(this.state.listDaTa)
            ? this.state.listDaTa.Categories
            : []
      },
      series:
        this.state.listDaTa && !Array.isArray(this.state.listDaTa)
          ? this.state.listDaTa.Series
          : [],
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: "{point.y:.1f}"
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
    let listNghanhNghe = [];
    {
      this.state.listNghanhNghe.map((item, key) =>
        listNghanhNghe.push({
          key: parseInt(item.mA_NN.toString()),
          label: item.teN_NN,
          value: parseInt(item.mA_NN.toString())
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
        <View style={styles.a}>
          <View style={styles.b}>
            <View style={styles.d}>
              {/* <Text style={{ paddingLeft: 10 }}>Đơn vị:</Text> */}
              <ModalSelector
                data={listDonViQuanLy}
                style={{ width: 170, marginTop: -5 /*, paddingLeft: 35*/ }}
                initValue={this.state.TEN_DVIQLY2}
                onChange={option => {
                  this.onChangedDonVi(option);
                }}
                //  alert(`${option.label} (${option.key}) nom nom nom`);
              />
            </View>
            <View style={styles.e}>
              {/* <Text style={{ paddingLeft: 10 }}>Tháng/Năm:</Text> */}
              <ModalSelector
                data={listThangNam}
                style={{ width: 170, marginTop: -5 }}
                initValue={this.state.SelectedDate}
                onChange={option => {
                  this.onChangedDate(option);
                }}
                //  alert(`${option.label} (${option.key}) nom nom nom`);
              />
            </View>
            <View style={styles.e} />
          </View>
          <View style={styles.c}>
            {/* <Text style={{ paddingLeft: 10 }}>Nghành nghề:</Text> */}
            <SelectMultiple
              items={listNghanhNghe}
              renderLabel={renderLabel}
              selectedItems={this.state.selectedFruits}
              onSelectionsChange={this.onSelectionsChange}
            />
          </View>
        </View>
        <View style={styles.chart}>
          <ScrollView
            key={Math.random()}
            style={{
              backgroundColor: "white"
            }}
          >
            <View>
              <ChartView
                style={{ height: 500, width: width }}
                config={conf2}
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
  a: {
    height: 180,
    paddingTop: 10,
    paddingLeft: 5,
    paddingBottom: 10,
    backgroundColor: "#fff",
    flexDirection: "row"
  },
  b: {
    width: 180,
    flexDirection: "column"
  },
  c: {
    marginTop: -15,
    //  width: this.width - 180,
    flexDirection: "row"
  },
  d: {
    flex: 1,
    flexDirection: "row"
  },
  e: {
    flex: 1,
    flexDirection: "row"
  },
  filter: {
    height: 120,
    paddingTop: 10,
    paddingLeft: 5,
    paddingBottom: 10,
    backgroundColor: "#fff",
    flexDirection: "row"
  },
  filter2: {
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
