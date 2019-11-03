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
  Button,
  Image
} from "react-native";
import ModalSelector from "react-native-modal-selector";
import urlBaoCao from "../../../networking/services";
import ChartView from "react-native-highcharts";
import Spinner from "react-native-loading-spinner-overlay";
import TreeSelect from "../../../components/react-native-tree-select";
const treeData1 = [
  {
    key: "1",
    label: "Nghành nghề",
    children: [
      {
        key: "1000",
        label: "I. NÔNG NGHIỆP, LÂM NGHIỆP, THUỶ SẢN",
        children: [
          {
            key: "1100",
            label: "I.1. Điện cấp cho bơm nông nghiệp",
            children: [
              {
                key: "1110",
                label: "  1. Bơm tưới, tiêu nước phục vụ nông nghiệp"
              },
              {
                key: "1120",
                label:
                  "  2. Đóng, mở các cống điều tiết nước, phân lũ và sản xuất nông nghiệp khác"
              }
            ]
          },
          {
            key: "1200",
            label:
              "I.2. Các hoạt động nông nghiệp khác (Bơm tưới vườn cây, dịch vụ cây trồng, ...)"
          },
          {
            key: "1300",
            label:
              "I.3. Lâm nghiệp: Sản xuất lâm nghiệp, chế biến, khai thác trong ngành lâm nghiệp"
          },
          {
            key: "1400",
            label:
              "I.4. Thủy sản: Đánh bắt, nuôi trồng thủy sản và các hoạt động có liên quan"
          }
        ]
      },
      {
        key: "2000",
        label: "II. CÔNG NGHIỆP XÂY DỰNG",
        children: [
          {
            key: "2100",
            label: "II.1. Công nghiệp Khai khoáng",
            children: [
              { key: "2101", label: "  1. Khai thác than" },
              { key: "2102", label: "  2. Khai thác dầu thô, khí tự nhiên" },
              { key: "2103", label: "  3. Khai thác quặng Uranium, Thorium" },
              {
                key: "2104",
                label: "  4. Khai thác quặng kim loại đen và kim loại màu"
              },
              {
                key: "2105",
                label:
                  "  5. Khai thác đá, cát, sỏi, đất sét, cao lanh, khoáng hóa chất, ..."
              }
            ]
          },
          {
            key: "2200",
            label: "II.2. Công nghiệp Chế biến",
            children: [
              { key: "2201", label: "  1. Chế biến thực phẩm" },
              { key: "2202", label: "  2. Sản xuất đồ uống" },
              { key: "2203", label: "  3. Sản xuất thuốc lá, thuốc lào" },
              {
                key: "2204",
                label: "  4. Sản xuất sợi, dệt vải và hoàn thiện sản phẩm dệt"
              },
              {
                key: "2205",
                label: "  5. Sản xuất trang phục, nhuộm da lông thú (may mặc)"
              },
              {
                key: "2206",
                label:
                  "  6. Thuộc, sơ chế da, sản xuất vali, túi xách, yên đệm và giày dép"
              },
              {
                key: "2207",
                label:
                  "    7. Chế biến gỗ và sản xuất các sản phẩm từ gỗ, tre, nứa, ..."
              },
              { key: "2208", label: "  8. Sản xuất giấy và sản phẩm từ giấy" },
              {
                key: "2209",
                label:
                  "  9. Xuất bản, in và sao bản ghi các loại văn hóa phẩm như băng, đĩa nhạc"
              },
              {
                key: "2210",
                label:
                  "  10. Sản xuất than cốc, sản phẩm dầu mỏ tinh chế và nhiên liệu hạt nhân"
              },
              {
                key: "2211",
                label:
                  "  11. Sản phẩm hóa chất, phân bón, thuốc trừ sâu, hóa chất khác..."
              },
              {
                key: "2212",
                label: "  12. Sản xuất các sản phẩm từ cao su và nhựa các loại"
              },
              {
                key: "2213",
                label: "  13. Sản xuất các sản phẩm từ chất khoáng phi kim loại"
              },
              {
                key: "2214",
                label:
                  "  14. Sản xuất các kim loại như: Sắt, thép, kim loại màu…"
              },
              { key: "2215", label: "  15. Sản xuất các sản phẩm từ kim loại" },
              {
                key: "2216",
                label:
                  "  16. Chế tạo máy móc thiết bị cho sản xuất và hoạt động văn phòng"
              },
              {
                key: "2217",
                label:
                  "  17. Sản xuất các thiết bị, dụng cụ điện, thiết bị chiếu sáng"
              },
              {
                key: "2218",
                label:
                  "  18. Sản xuất rađio, tivi, thiết bị truyền thông và các linh kiện điện tử"
              },
              {
                key: "2219",
                label: "  19. Sản xuất và lắp ráp các sản phẩm điện gia dụng"
              },
              {
                key: "2220",
                label:
                  "  20. Sản xuất dụng cụ y tế, quang học, đồng hồ các loại"
              },
              {
                key: "2221",
                label:
                  "  21. Sản xuất xe có động cơ, rơ móc; Sản xuất các phương tiện đi lại…"
              },
              {
                key: "2222",
                label: "  22. Sản xuất giường, tủ, bàn ghế và các sản phẩm khác"
              },
              {
                key: "2223",
                label:
                  "  23. Tái chế phế liệu, phế thải kim loại và phi kim loại"
              }
            ]
          },
          {
            key: "2300",
            label: "II.3. Cung cấp và phân phối gas, nước",
            children: [
              {
                key: "2301",
                label: "  1. Sản xuất tập trung và phân phối khí đốt"
              },
              {
                key: "2302",
                label:
                  "  2. Sản xuất gas, phân phối nhiên liệu khí bằng đường ống"
              },
              { key: "2303", label: "  3. Khai thác, lọc và phân phối nước" }
            ]
          },
          {
            key: "2400",
            label: "II.4. Xây dựng",
            children: [
              { key: "2410", label: "  1. San lấp mặt bằng" },
              { key: "2420", label: "  2. Xây dựng" },
              { key: "2430", label: "  3. Lắp đặt thiết bị" }
            ]
          },
          { key: "2500", label: "II.5. Các ngành công nghiệp khác" }
        ]
      },
      {
        key: "3000",
        label: "III. THƯƠNG NGHIỆP, KHÁCH SẠN, NHÀ HÀNG",
        children: [
          {
            key: "3100",
            label: "III.1. Bán buôn, bán lẻ và cửa hàng sửa chữa",
            children: [
              {
                key: "3101",
                label: "  1. Bán buôn, bán lẻ của các công ty, cửa hàng"
              },
              {
                key: "3102",
                label: "  2. Sửa chữa, bảo dưỡng vật phẩm tiêu dùng"
              }
            ]
          },
          {
            key: "3200",
            label: "III.2. Khách sạn, quán trọ",
            children: [
              { key: "3210", label: "  1. Khách sạn" },
              { key: "3220", label: "  3. Quán trọ" },
              { key: "3230", label: "  3. Nhà hàng" }
            ]
          }
        ]
      },
      {
        key: "4000",
        label: "IV. SINH HOẠT DÂN DỤNG",
        children: [
          {
            key: "4100",
            label:
              "  1. Điện cấp cho các cơ quan Đảng, Nhà nước và tổ chức đoàn thể trong nước"
          },
          {
            key: "4200",
            label: "  2. Các đại sứ quán, các tổ chức của Liên hợp quốc"
          },
          {
            key: "4300",
            label:
              "  3. Điện cấp cho văn phòng làm việc của các doanh nghiệp và đơn vị sự nghiệP"
          },
          { key: "4400", label: "  4. Điện cấp cho Sinh hoạt dân dụng" },
          {
            key: "4401",
            label: "  4.1Điện sinh hoạt của hộ gia đình dân cư thuộc thành thị"
          },
          {
            key: "4402",
            label:
              "  4.2.Điện sinh hoạt của hộ gia đình dân cư thuộc nông thôn, miền núi,…"
          }
        ]
      },
      {
        key: "5000",
        label: "V. HOẠT ĐỘNG KHÁC",
        children: [
          {
            key: "5100",
            label: "V.1. Cơ sở văn hóa thể thao",
            children: [
              {
                key: "5101",
                label:
                  "  1. Nhà hát, rạp chiếu bóng, rạp xiếc, nhà thông tin văn hóa…"
              },
              {
                key: "5102",
                label:
                  "  2. Các câu lạc bộ văn hóa thể thao, khu vui chơi giải trí, công viên…"
              },
              { key: "5103", label: "  3. Trường học" },
              {
                key: "5104",
                label: "  4. Các bệnh viện, bệnh xá, trạm xá, khu điều dưỡng,…"
              }
            ]
          },
          {
            key: "5200",
            label:
              "V.2. Điện cấp cho ánh sáng công cộng và các hoạt động công cộng khác"
          },
          {
            key: "5300",
            label: "V.3. Điện cho Chiếu sáng",
            children: [
              {
                key: "5301",
                label: "  1. Điện dùng trong các hoạt động chỉ huy giao thông"
              },
              { key: "5302", label: "  2. Điện cấp cho các kho, bãi hàng hóa" }
            ]
          },
          {
            key: "5400",
            label: "V.4. Điện cấp cho Cơ sở truyền thông",
            children: [
              { key: "5401", label: "  1.Ngân hàng, bảo hiểm, tín dụng" },
              { key: "5402", label: "  2. Viện nghiên cứu khoa học" },
              {
                key: "5403",
                label: "  3. Trung tâm phát triển tin học và phần mềm"
              },
              {
                key: "5404",
                label:
                  "  4. Phát thanh, phát tín, truyền hình, thông tin, liên lạc"
              }
            ]
          },
          {
            key: "5500",
            label: "V.5. Các hoạt động xã hội khác chưa được phân vào đâu"
          }
        ]
      }
    ]
  }
];
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
      isVisible: false,
      value: [{ key: "1000", label: "I. NÔNG NGHIỆP" }],
      treeData: []
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

          // this.get_NghanhNghe();
          this.get_Info_Dvi_ChaCon(userData.mA_DVIQLY, userData.caP_DVI);
          if (this.state.value.length > 0)
            this.callMultiAPI(
              this.state.value,
              this.state.SelectedDate,
              userData.mA_DVIQLY
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
    return fetch(urlBaoCao.get_NghanhNghe3)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson && responseJson.length > 0) {
          console.log("responseJson", responseJson);
          let y = [];
          y = responseJson[0].data;
          this.setState({
            treeData: y
          });
          console.log("setState", this.state.treeData);
        } else {
          Alert.alert("Thông báo", "Không có dữ liệu!");
        }
      })
      .catch(error => {
        Alert.alert("Lỗi kết nối!", error.toString());
      });
  };
  get_NghanhNghe = async () => {
    const urls = [urlBaoCao.get_NghanhNghe2];
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
        treeData: data[0]
      });
    });
  };

  callMultiAPI = async (vValue, vThangNam, vMaDonVi) => {
    this.setState({
      spinner: true
    });
    let vList = "";
    for (let i = 0; i < vValue.length; i++) {
      if (vValue[i].key != 1) {
        if (vList.length <= 0) {
          vList = vValue[i].key;
        } else {
          vList = vList + "," + vValue[i].key;
        }
      }
    }
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
        value: vValue,
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
    if (this.state.value.length == 0) {
      Alert.alert("Chọn ít nhất 1 mã nghành nghề!", "Thông báo");
    } else {
      this.callMultiAPI(
        this.state.value,
        this.state.SelectedDate,
        itemValue.key
      );
    }
  }
  onChangedDate(itemValue) {
    if (this.state.value.length == 0) {
      Alert.alert("Chọn ít nhất 1 mã nghành nghề!", "Thông báo");
    } else {
      this.callMultiAPI(
        this.state.value,
        itemValue.key,
        this.state.SelectedDonVi
      );
    }
  }
  onChangedNghanhNghe(itemValue) {
    if (itemValue.length == 0) {
      Alert.alert("Chọn ít nhất 1 mã nghành nghề!", "Thông báo");
    } else {
      this.callMultiAPI(
        itemValue,
        this.state.SelectedDate,
        this.state.SelectedDonVi
      );
    }
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
    let varCategories1 = [];
    let list1 = [];
    if (
      this.state.listDaTa &&
      !Array.isArray(this.state.listDaTa) &&
      this.state.listDaTa.Series != null
    ) {
      let intThuongPhamTong = 0;
      let x = [];
      for (let i = 0; i < this.state.value.length; i++) {
        if (this.state.value[i].key != 1) {
          x.push(this.state.value[i]);
        }
      }
      for (let i = 0; i < x.length; i++) {
        varCategories1.push(x[i].key.toString());
        let intThuongPham = 0;
        for (let j = 0; j < this.state.listDaTa.Series[i].data.length; j++) {
          intThuongPham = intThuongPham + this.state.listDaTa.Series[i].data[j];
        }
        intThuongPhamTong = intThuongPhamTong + intThuongPham;
        list1.push(intThuongPham);
      }
      varCategories1.push("Tổng");
      list1.push(intThuongPhamTong);
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
        text: "Tổng thương phẩm theo nghành nghề đặc thù"
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
          name: "Tháng " + this.state.SelectedDate,
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
        text: "Thương phẩm theo nghành nghề đặc thù"
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
        <View style={styles.filter}>
          {/* <Text style={{ paddingLeft: 10 }}>Đơn vị:</Text> */}
          <ModalSelector
            data={listDonViQuanLy}
            style={{ width: 150, marginTop: -5 /*, paddingLeft: 35*/ }}
            initValue={this.state.TEN_DVIQLY2}
            onChange={option => {
              this.onChangedDonVi(option);
            }}
            //  alert(`${option.label} (${option.key}) nom nom nom`);
          />
          {/* <Text style={{ paddingLeft: 10 }}>Tháng/Năm:</Text> */}
          <ModalSelector
            data={listThangNam}
            style={{ width: 90, marginTop: -5, paddingLeft: 5 }}
            initValue={this.state.SelectedDate}
            onChange={option => {
              this.onChangedDate(option);
            }}
          ></ModalSelector>
          <View style={styles.container2}>
            <Button
              onPress={() => {
                this.treeSelectRef.open();
              }}
              title="Chọn nghành nghề"
            />
            <TreeSelect
              ref={node => (this.treeSelectRef = node)}
              onComfirm={value => {
                this.onChangedNghanhNghe(value);
              }}
              value={this.state.value}
              // onlyCheckLeaf={true}
              onlyCheckLeaf={false}
              multiple={true}
              treeData={treeData1}
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
                style={{ height: 500 }}
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
  container2: {
    backgroundColor: "#fff",
    marginTop: -3,
    paddingLeft: 5
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
    height: 60,
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
