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
import { getTenDonVi } from "../../data/dmdonvi";
import ChartView from "react-native-highcharts";
import Spinner from "react-native-loading-spinner-overlay";
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
      SelectedDate: new Date().getFullYear().toString(),
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
            TEN_DVIQLY2: getTenDonVi(userData.caP_DVI, userData.teN_DVIQLY),
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

    const urls = [urlBaoCao.SP_NhanDinhTramCC + param1];
    Promise.all(
      urls.map(url =>
        fetch(url)
          .then(this.checkStatus)
          .then(this.parseJSON)
          .catch(error =>
            Alert.alert("There was a problem!", error + "\n" + url)
          )
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
  render() {
    const width = this.state.screenwidth;
    const height = this.state.screenheight - 50;
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
    let list25 = [],
      list26 = [],
      list27 = [],
      list28 = [],
      list29 = [];
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
      list10 = this.state.listDaTa.Series[9].data;
      list11 = this.state.listDaTa.Series[10].data;
      list12 = this.state.listDaTa.Series[11].data;

      list25 = this.state.listDaTa.Series[24].data;
      list26 = this.state.listDaTa.Series[25].data;
      list27 = this.state.listDaTa.Series[26].data;
      list28 = this.state.listDaTa.Series[27].data;
      list29 = this.state.listDaTa.Series[28].data;
    }

    const options = {
      global: {
        useUTC: false
      },
      lang: {
        decimalPoint: ",",
        thousandsSep: "."
      }
    };
    var conf1 = {
      chart: {
        type: "column"
      },

      title: {
        text: "Lĩnh vực trạm công cộng "
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
          data: list25
          // yAxis: 1
        },
        {
          name: "Tổng số trạm",
          data: list27
        },
        {
          name: "Tỉ lệ trạm ngoài chuẩn",
          data: list28,
          yAxis: 1
        }
      ]
    };
    var conf2 = {
      chart: {
        type: "column",
        options3d: {
          enabled: true,
          alpha: 15,
          beta: 15,
          viewDistance: 25,
          depth: 40
        }
      },

      title: {
        text: "Báo cáo trạm công cộng"
      },
      xAxis: {
        categories:
          this.state.listDaTa && !Array.isArray(this.state.listDaTa)
            ? this.state.listDaTa.Categories
            : [],
        labels: {
          skew3d: true,
          style: {
            fontSize: "16px"
          }
        }
      },
      credits: {
        enabled: false
      },
      yAxis: {
        allowDecimals: false,
        min: 0,
        title: {
          text: "Số trạm",
          skew3d: true
        }
      },

      tooltip: {
        headerFormat: "<b>{point.key}</b><br>",
        pointFormat:
          '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y} / {point.stackTotal}'
      },

      plotOptions: {
        column: {
          stacking: "normal",
          depth: 40
        }
      },

      series: [
        {
          name: "Tháng 1",
          data: list1,
          stack: "male"
        },
        {
          name: "Tháng 2",
          data: list2,
          stack: "male"
        },
        {
          name: "Tháng 3",
          data: list3,
          stack: "male"
        },
        {
          name: "Tháng 4",
          data: list4,
          stack: "male"
        },
        {
          name: "Tháng 5",
          data: list5,
          stack: "male"
        },
        {
          name: "Tháng 6",
          data: list6,
          stack: "male"
        },
        {
          name: "Tháng 7",
          data: list7,
          stack: "male"
        },
        {
          name: "Tháng 8",
          data: list8,
          stack: "male"
        },
        {
          name: "Tháng 9",
          data: list9,
          stack: "male"
        },
        {
          name: "Tháng 10",
          data: list10,
          stack: "male"
        },
        {
          name: "Tháng 11",
          data: list11,
          stack: "male"
        },
        {
          name: "Tháng 12",
          data: list12,
          stack: "male"
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
            <ChartView
              style={{ height: 500, width: width }}
              config={conf1}
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
