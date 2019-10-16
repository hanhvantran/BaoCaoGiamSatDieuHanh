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
import { getListTenDonVi } from "../../../data/dmdonvi";
export default class KetQuaRaSoatScreen extends React.PureComponent {
  static navigationOptions = {
    title: "Theo 5 thành phần phụ tải"
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
      screenwidth: Dimensions.get("window").width
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
            USERID: userData.userid,
            USERNAME: userData.username,
            CAP_DVI: userData.caP_DVI,
            SelectedDonVi: userData.mA_DVIQLY
          });
          this.get_Info_Dvi_ChaCon(userData.mA_DVIQLY, userData.caP_DVI);
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
    this.get_ThuongPhamUoc(this.state.SelectedDonVi, this.state.SelectedDate);
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
    var intitYear = year - 3;
    for (var i = intitYear; i <= year; i++) {
      for (var j = 1; j <= 12; j++) {
        var x = j <= 9 ? "0" + j + "/" + i : j + "/" + i;
        arrayData.push({ VALUE: x });
      }
    }
    this.setState({
      listDate: arrayData
    });
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
              listDonVi: responseJson
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
  get_ThuongPhamUoc = (DONVI, THANGNAM, GIATRI) => {
    return fetch(
      urlBaoCao.get_ThuongPhamUoc +
        "?MaDonVi=" +
        DONVI +
        "&THANG=" +
        THANGNAM.split("/")[0] +
        "&NAM=" +
        THANGNAM.split("/")[1] +
        ""
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson && responseJson.length > 0) {
          if (GIATRI == 1) {
            this.setState({
              listDaTa: responseJson,
              SelectedDonVi: DONVI
            });
          } else {
            this.setState({
              listDaTa: responseJson,
              SelectedDate: THANGNAM
            });
          }
        } else {
          if (GIATRI == 1) {
            this.setState({
              listDaTa: null,
              SelectedDonVi: DONVI
            });
          } else {
            this.setState({
              listDaTa: null,
              SelectedDate: THANGNAM
            });
          }
          Alert.alert("Thông báo", "Không có dữ liệu!");
        }
      })
      .catch(error => {
        Alert.alert("Lỗi kết nối!", error.toString());
      });
  };
  renderTabBar() {
    return <StatusBar hidden />;
  }
  onChangedDonVi(itemValue) {
    this.get_ThuongPhamUoc(itemValue.key, this.state.SelectedDate, 1);
  }
  onChangedDate(itemValue) {
    this.get_ThuongPhamUoc(this.state.SelectedDonVi, itemValue.key, 2);
    //this.setState({ SelectedDate: itemValue });
  }
  render() {
    const width = this.state.screenwidth;
    const height = this.state.screenheight - 50;
    let listDaTa1 = [];
    let listDaTa2 = [];
    let listDaTa3 = [];
    let listDaTa4 = [];
    let listDaTa5 = [];
    let listDaTa6 = [];
    let listDaTa7 = [];
    let listDaTa8 = [];
    let listDaTa9 = [];
    let listDaTa10 = [];
    let listDaTa11 = [];
    let listDaTa12 = [];
    let listDaTa13 = [];
    let listDaTa14 = [];
    let listDaTa15 = [];
    {
      this.state.listDaTa.map(
        (item, key) => (
          listDaTa1.push(item.nlthuysan),
          listDaTa2.push(item.cnxaydung),
          listDaTa3.push(item.ksannhang),
          listDaTa4.push(item.qlytieudung),
          listDaTa5.push(item.hdkhac),
          listDaTa6.push(item.nlthuysaN_CUNGKY),
          listDaTa7.push(item.cnxaydunG_CUNGKY),
          listDaTa8.push(item.ksannhanG_CUNGKY),
          listDaTa9.push(item.qlytieudunG_CUNGKY),
          listDaTa10.push(item.hdkhaC_CUNGKY),
          listDaTa11.push(item.nlthuysaN_LUYKE),
          listDaTa12.push(item.cnxaydunG_LUYKE),
          listDaTa13.push(item.ksannhanG_LUYKE),
          listDaTa14.push(item.qlytieudunG_LUYKE),
          listDaTa15.push(item.hdkhaC_LUYKE)
        )
      );
    }
    var conf = {
      chart: {
        type: "column",
        zoomType: "xy"
      },
      title: {
        text: "Theo 5 thành phần phụ tải"
      },
      xAxis: {
        categories: getListTenDonVi(
          this.state.SelectedDonVi,
          this.state.TEN_DVIQLY
        )
      },
      yAxis: {
        min: 0,
        title: {
          text: "kWh"
        }
      },
      legend: {
        reversed: true
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: true
      },
      plotOptions: {
        series: {
          stacking: "normal"
        }
      },
      series: [
        {
          name: "Nông lâm thuỷ sản",
          data: listDaTa1,
          stack: "THANG"
        },
        {
          name: "Công nghiệp xây dựng",
          data: listDaTa2,
          stack: "THANG"
        },
        {
          name: "Khách sạn nhà hàng",
          data: listDaTa3,
          stack: "THANG"
        },
        {
          name: "Quản lý tiêu dùng",
          data: listDaTa4,
          stack: "THANG"
        },
        {
          name: "Hoạt động khác",
          data: listDaTa5,
          stack: "THANG"
        },
        {
          name: "Nông lâm thuỷ sản - Cùng kỳ",
          data: listDaTa6,
          stack: "CUNGKY"
        },
        {
          name: "Công nghiệp xây dựng - Cùng kỳ",
          data: listDaTa7,
          stack: "CUNGKY"
        },
        {
          name: "Khách sạn nhà hàng - Cùng kỳ",
          data: listDaTa8,
          stack: "CUNGKY"
        },
        {
          name: "Quản lý tiêu dùng - Cùng kỳ",
          data: listDaTa9,
          stack: "CUNGKY"
        },
        {
          name: "Hoạt động khác - Cùng kỳ",
          data: listDaTa10,
          stack: "CUNGKY"
        },
        {
          name: "Nông lâm thuỷ sản - Luỹ kế",
          data: listDaTa11,
          stack: "LUYKE"
        },
        {
          name: "Công nghiệp xây dựng - Luỹ kế",
          data: listDaTa12,
          stack: "LUYKE"
        },
        {
          name: "Khách sạn nhà hàng - Luỹ kế",
          data: listDaTa13,
          stack: "LUYKE"
        },
        {
          name: "Quản lý tiêu dùng - Luỹ kế",
          data: listDaTa14,
          stack: "LUYKE"
        },
        {
          name: "Hoạt động khác - Luỹ kế",
          data: listDaTa15,
          stack: "LUYKE"
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
    let index = 0;
    const data = [
      { key: index++, label: "Red Apples" },
      { key: index++, label: "Cherries" },
      {
        key: index++,
        label: "Cranberries",
        accessibilityLabel: "Tap here for cranberries"
      },
      // etc...
      // Can also add additional custom keys which are passed to the onChange callback
      { key: index++, label: "Vegetable", customKey: "Not a fruit" }
    ];
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
        <View style={styles.filter}>
          <Text>Đơn vị:</Text>
          <ModalSelector
            data={listDonViQuanLy}
            style={{ width: 170, marginTop: -5 }}
            initKey={this.state.SelectedDonVi}
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
        <View style={styles.chart}>
          <ScrollView
            key={Math.random()}
            style={{
              backgroundColor: "white"
            }}
          >
            <ChartView
              style={{ height: height }}
              config={conf}
              options={options}
              // stock={true}
              //   originWhitelist={[""]}
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
