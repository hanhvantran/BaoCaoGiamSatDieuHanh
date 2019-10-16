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
//import { getTenDonVi } from "../../data/dmdonvi";
import Spinner from "react-native-loading-spinner-overlay";
//import Tabs from "../Tabs/Tabs";
import { PricingCard } from "react-native-elements";
import { ListItem } from "../ListItem";
export default class NhanDinhTramCongCongScreen extends React.PureComponent {
  static navigationOptions = {
    title: "Giám sát"
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
      listDaTaCto: [],
      listDaTaTUTI: [],
      listDaTaHopDong: [],
      listDaTaViPhamSuDungDien: [],
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
    var intitYear = year - 5;
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
    let param1 =
      "?MaDonVi=" + vMaDonVi + "&THANG=12" + "&NAM=" + vThangNam + "";

    const urls = [
      urlBaoCao.sp_HanKdinh_Cto + param1 + "&PLoaibaocao=NAM",
      urlBaoCao.sp_HanKdinh_TUTI + param1 + "&PLoaibaocao=NAM",
      urlBaoCao.sp_HDDenHanKyLai + param1,
      urlBaoCao.BC_KTraXLyVPhamSDDien + param1
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
        listDaTaCto: data[0],
        listDaTaTUTI: data[1],
        listDaTaHopDong: data[2],
        listDaTaViPhamSuDungDien: data[3]
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
    let list100 = [],
      list101 = [];
    let intVHCongTO = 0;
    let intVHCongTO1Pha = 0;
    let intVHCongTO3Pha = 0;
    let intQHCongTO = 0;
    let intQHCongTO1Pha = 0;
    let intQHCongTO3Pha = 0;
    let listCongToQuaHan = [];
    let listCongToVanHanh = [];
    let listTiLeQuaHan = [];
    //CTO
    if (
      this.state.listDaTaCto &&
      !Array.isArray(this.state.listDaTaCto) &&
      this.state.listDaTaCto.Series != null
    ) {
      //intVHCongTO1Pha = this.state.listDaTaCto.Series[0].data;
      //Cong To
      for (let i = 0; i < this.state.listDaTaCto.Series[0].data.length; i++) {
        intVHCongTO1Pha =
          intVHCongTO1Pha + this.state.listDaTaCto.Series[0].data[i];
      }
      for (let i = 0; i < this.state.listDaTaCto.Series[1].data.length; i++) {
        intVHCongTO3Pha =
          intVHCongTO3Pha + this.state.listDaTaCto.Series[1].data[i];
      }
      intVHCongTO = intVHCongTO1Pha + intVHCongTO3Pha;

      for (let i = 0; i < this.state.listDaTaCto.Series[4].data.length; i++) {
        intQHCongTO1Pha =
          intQHCongTO1Pha + this.state.listDaTaCto.Series[4].data[i];
      }
      for (let i = 0; i < this.state.listDaTaCto.Series[5].data.length; i++) {
        intQHCongTO3Pha =
          intQHCongTO3Pha + this.state.listDaTaCto.Series[5].data[i];
      }
      intQHCongTO = intQHCongTO1Pha + intQHCongTO3Pha;
      listCongToQuaHan = this.state.listDaTaCto.Series[12].data;
      listCongToVanHanh = this.state.listDaTaCto.Series[13].data;
      listTiLeQuaHan = this.state.listDaTaCto.Series[14].data;
    }
    //TU,TI
    let intVHTU = 0;
    let intVHTI = 0;
    let intQHTU = 0;
    let intQHTI = 0;
    let listTUQuaHan = [];
    let listTUVanHanh = [];
    let listTiLeTUQuaHan = [];

    let listTIQuaHan = [];
    let listTIVanHanh = [];
    let listTiLeTIQuaHan = [];
    if (
      this.state.listDaTaTUTI &&
      !Array.isArray(this.state.listDaTaTUTI) &&
      this.state.listDaTaTUTI.Series != null
    ) {
      //intVHCongTO1Pha = this.state.listDaTaCto.Series[0].data;
      //Cong To
      for (let i = 0; i < this.state.listDaTaTUTI.Series[5].data.length; i++) {
        intVHTU = intVHTU + this.state.listDaTaTUTI.Series[5].data[i];
      }
      for (let i = 0; i < this.state.listDaTaTUTI.Series[0].data.length; i++) {
        intVHTI = intVHTI + this.state.listDaTaTUTI.Series[0].data[i];
      }
      for (let i = 0; i < this.state.listDaTaTUTI.Series[7].data.length; i++) {
        intQHTU = intQHTU + this.state.listDaTaTUTI.Series[7].data[i];
      }
      for (let i = 0; i < this.state.listDaTaTUTI.Series[2].data.length; i++) {
        intQHTI = intQHTI + this.state.listDaTaTUTI.Series[2].data[i];
      }
      listTUQuaHan = this.state.listDaTaTUTI.Series[7].data;
      listTUVanHanh = this.state.listDaTaTUTI.Series[5].data;
      listTiLeTUQuaHan = this.state.listDaTaTUTI.Series[21].data;

      listTIQuaHan = this.state.listDaTaTUTI.Series[2].data;
      listTIVanHanh = this.state.listDaTaTUTI.Series[0].data;
      listTiLeTIQuaHan = this.state.listDaTaTUTI.Series[20].data;
    }
    //Hop Dong
    let intHopDong = 0;
    let intHopDongQuaHan = 0;
    let intHopDongSH = 0;
    let intHopDongNSH = 0;
    let intHopDongQuaHanSH = 0;
    let intHopDongQuaHanNSH = 0;
    let listHopDongDenHan = [];
    let listHopDong = [];
    let listTiLeHopDongQuaHan = [];
    if (
      this.state.listDaTaHopDong &&
      !Array.isArray(this.state.listDaTaHopDong) &&
      this.state.listDaTaHopDong.Series != null
    ) {
      //intVHCongTO1Pha = this.state.listDaTaCto.Series[0].data;
      //Cong To
      for (
        let i = 0;
        i < this.state.listDaTaHopDong.Series[0].data.length;
        i++
      ) {
        intHopDongSH =
          intHopDongSH + this.state.listDaTaHopDong.Series[0].data[i];
      }
      for (
        let i = 0;
        i < this.state.listDaTaHopDong.Series[1].data.length;
        i++
      ) {
        intHopDongNSH =
          intHopDongNSH + this.state.listDaTaHopDong.Series[1].data[i];
      }
      for (
        let i = 0;
        i < this.state.listDaTaHopDong.Series[2].data.length;
        i++
      ) {
        intHopDongQuaHanSH =
          intHopDongQuaHanSH + this.state.listDaTaHopDong.Series[2].data[i];
      }
      for (
        let i = 0;
        i < this.state.listDaTaHopDong.Series[3].data.length;
        i++
      ) {
        intHopDongQuaHanNSH =
          intHopDongQuaHanNSH + this.state.listDaTaHopDong.Series[3].data[i];
      }
      intHopDong = intHopDongSH + intHopDongNSH;
      intHopDongQuaHan = intHopDongQuaHanSH + intHopDongQuaHanNSH;

      listHopDongDenHan = this.state.listDaTaHopDong.Series[7].data;
      listHopDong = this.state.listDaTaHopDong.Series[6].data;
      listTiLeHopDongQuaHan = this.state.listDaTaHopDong.Series[8].data;
      if (this.state.SelectedDonVi < 6) {
        let PCongToQuaHanCaoNhat = "";
        let PCongToQuaHanThapNhat = "";
        let PTiLeCongToQuaHanCaoNhat = "";
        let PTiLeCongToQuaHanThapNhat = "";

        let PTUQuaHanCaoNhat = "";
        let PTUQuaHanThapNhat = "";
        let PTiLeTUQuaHanCaoNhat = "";
        let PTiLeTUQuaHanThapNhat = "";

        let PTIQuaHanCaoNhat = "";
        let PTIQuaHanThapNhat = "";
        let PTiLeTIQuaHanCaoNhat = "";
        let PTiLeTIQuaHanThapNhat = "";

        let PHopDongQuaHanCaoNhat = "";
        let PHopDongQuaHanThapNhat = "";
        let PTiLeHopDongQuaHanCaoNhat = "";
        let PTiLeHopDongQuaHanThapNhat = "";

        let indexCongTo = listCongToQuaHan.indexOf(
          Math.max(...listCongToQuaHan)
        );
        PCongToQuaHanCaoNhat =
          "Công tơ quá hạn cao nhất: " +
          this.state.listDaTaCto.Categories[indexCongTo] +
          ", " +
          this.numberWithCommas(Math.max(...listCongToQuaHan)) +
          "";
        let indexCongToMin = listCongToQuaHan.indexOf(
          Math.min(...listCongToQuaHan)
        );
        PCongToQuaHanThapNhat =
          "Công tơ quá hạn thấp nhất: " +
          this.state.listDaTaCto.Categories[indexCongToMin] +
          ", " +
          this.numberWithCommas(Math.min(...listCongToQuaHan)) +
          "";

        let indexTiLeCongTo = listTiLeQuaHan.indexOf(
          Math.max(...listTiLeQuaHan)
        );

        PTiLeCongToQuaHanCaoNhat =
          "Công tơ quá hạn cao nhất(%): " +
          this.state.listDaTaCto.Categories[indexTiLeCongTo] +
          ", " +
          this.numberWithCommasDecimal(Math.max(...listTiLeQuaHan)) +
          " %";

        let indexTiLeCongToMin = listTiLeQuaHan.indexOf(
          Math.min(...listTiLeQuaHan)
        );
        PTiLeCongToQuaHanThap =
          "Công tơ quá hạn thấp nhất(%): " +
          this.state.listDaTaCto.Categories[indexTiLeCongToMin] +
          ", " +
          this.numberWithCommasDecimal(Math.min(...listTiLeQuaHan)) +
          " %";

        let indexTU = listTUQuaHan.indexOf(Math.max(...listTUQuaHan));
        PTUQuaHanCaoNhat =
          "TU quá hạn cao nhất: " +
          this.state.listDaTaTUTI.Categories[indexTU] +
          ", " +
          this.numberWithCommas(Math.max(...listTUQuaHan)) +
          "";
        let indexTUMin = listTUQuaHan.indexOf(Math.min(...listTUQuaHan));
        PTUQuaHanThapNhat =
          "TU quá hạn thấp nhất: " +
          this.state.listDaTaTUTI.Categories[indexTUMin] +
          ", " +
          this.numberWithCommas(Math.min(...listTUQuaHan)) +
          "";

        let indexTiLeTU = listTiLeTUQuaHan.indexOf(
          Math.max(...listTiLeTUQuaHan)
        );

        PTiLeTUQuaHanCaoNhat =
          "TU quá hạn cao nhất(%): " +
          this.state.listDaTaTUTI.Categories[indexTiLeTU] +
          ", " +
          this.numberWithCommasDecimal(Math.max(...listTiLeTUQuaHan)) +
          " %";

        let indexTiLeTUMin = listTiLeTUQuaHan.indexOf(
          Math.min(...listTiLeTUQuaHan)
        );
        PTiLeTUQuaHanThap =
          "TU quá hạn thấp nhất(%): " +
          this.state.listDaTaTUTI.Categories[indexTiLeTUMin] +
          ", " +
          this.numberWithCommasDecimal(Math.min(...listTiLeTUQuaHan)) +
          " %";

        let indexTI = listTIQuaHan.indexOf(Math.max(...listTIQuaHan));
        PTIQuaHanCaoNhat =
          "TI quá hạn cao nhất: " +
          this.state.listDaTaTUTI.Categories[indexTI] +
          ", " +
          this.numberWithCommas(Math.max(...listTIQuaHan)) +
          "";
        let indexTIMin = listTIQuaHan.indexOf(Math.min(...listTIQuaHan));
        PTIQuaHanThapNhat =
          "TI quá hạn thấp nhất: " +
          this.state.listDaTaTUTI.Categories[indexTIMin] +
          ", " +
          this.numberWithCommas(Math.min(...listTIQuaHan)) +
          "";

        let indexTiLeTI = listTiLeTIQuaHan.indexOf(
          Math.max(...listTiLeTIQuaHan)
        );

        PTiLeTIQuaHanCaoNhat =
          "TI quá hạn cao nhất(%): " +
          this.state.listDaTaTUTI.Categories[indexTiLeTI] +
          ", " +
          this.numberWithCommasDecimal(Math.max(...listTiLeTIQuaHan)) +
          " %";

        let indexTiLeTIMin = listTiLeTIQuaHan.indexOf(
          Math.min(...listTiLeTIQuaHan)
        );
        PTiLeTIQuaHanThap =
          "TI quá hạn thấp nhất(%): " +
          this.state.listDaTaTUTI.Categories[indexTiLeTIMin] +
          ", " +
          this.numberWithCommasDecimal(Math.min(...listTiLeTIQuaHan)) +
          " %";

        let indexHopDong = listHopDongDenHan.indexOf(
          Math.max(...listHopDongDenHan)
        );
        PHopDongQuaHanCaoNhat =
          "HĐ đến hạn cao nhất: " +
          this.state.listDaTaHopDong.Categories[indexHopDong] +
          ", " +
          this.numberWithCommas(Math.max(...listHopDongDenHan)) +
          "";
        let indexHopDongMin = listHopDongDenHan.indexOf(
          Math.min(...listHopDongDenHan)
        );
        PHopDongQuaHanThapNhat =
          "HĐ đến hạn thấp nhất: " +
          this.state.listDaTaHopDong.Categories[indexHopDongMin] +
          ", " +
          this.numberWithCommas(Math.min(...listHopDongDenHan)) +
          "";

        let indexTiLeHopDong = listTiLeHopDongQuaHan.indexOf(
          Math.max(...listTiLeHopDongQuaHan)
        );

        PTiLeHopDongQuaHanCaoNhat =
          "HĐ đến hạn cao nhất(%): " +
          this.state.listDaTaHopDong.Categories[indexTiLeHopDong] +
          ", " +
          this.numberWithCommasDecimal(Math.max(...listTiLeHopDongQuaHan)) +
          " %";

        let indexTiLeHopDongMin = listTiLeHopDongQuaHan.indexOf(
          Math.min(...listTiLeHopDongQuaHan)
        );
        PTiLeHopDongQuaHanThapNhat =
          "HĐ đến hạn thấp nhất(%): " +
          this.state.listDaTaHopDong.Categories[indexTiLeHopDongMin] +
          ", " +
          this.numberWithCommasDecimal(Math.min(...listTiLeHopDongQuaHan)) +
          " %";

        list100 = [
          {
            title: PCongToQuaHanThapNhat,
            icon: "flash-on",
            //   subtitle: "Có 25 hợp đồng đến hạn ký lại ",
            color: "green"
          },
          {
            title: PTiLeCongToQuaHanThapNhat,
            icon: "flash-on",
            // subtitle: "Có 25 hợp đồng đến hạn ký lại ",
            color: "green"
          },
          {
            title: PTUQuaHanThapNhat,
            icon: "flash-on",
            //   subtitle: "Có 25 hợp đồng đến hạn ký lại ",
            color: "green"
          },
          {
            title: PTiLeTUQuaHanThapNhat,
            icon: "flash-on",
            //   subtitle: "Có 25 hợp đồng đến hạn ký lại ",
            color: "green"
          },
          {
            title: PTIQuaHanThapNhat,
            icon: "flash-on",
            //   subtitle: "Có 25 hợp đồng đến hạn ký lại ",
            color: "green"
          },
          {
            title: PTiLeTIQuaHanThapNhat,
            icon: "flash-on",
            //   subtitle: "Có 25 hợp đồng đến hạn ký lại ",
            color: "green"
          },
          {
            title: PHopDongQuaHanThapNhat,
            icon: "flash-on",
            //   subtitle: "Có 25 hợp đồng đến hạn ký lại ",
            color: "green"
          },
          {
            title: PTiLeHopDongQuaHanThapNhat,
            icon: "flash-on",
            //   subtitle: "Có 25 hợp đồng đến hạn ký lại ",
            color: "green"
          }
        ];
        list101 = [
          {
            title: PCongToQuaHanCaoNhat,
            icon: "layers",
            // subtitle: "Có 20 công tơ vận hành quá tải",
            color: "red"
          },
          {
            title: PTiLeCongToQuaHanCaoNhat,
            icon: "layers",
            // subtitle: "Có 10 khách hàng cảnh báo ký mua CSPK",
            color: "red"
          },
          {
            title: PTUQuaHanCaoNhat,
            icon: "layers",
            // subtitle: "Có 20 công tơ vận hành quá tải",
            color: "red"
          },
          {
            title: PTiLeTUQuaHanCaoNhat,
            icon: "layers",
            // subtitle: "Có 20 công tơ vận hành quá tải",
            color: "red"
          },
          {
            title: PTIQuaHanCaoNhat,
            icon: "layers",
            // subtitle: "Có 20 công tơ vận hành quá tải",
            color: "red"
          },
          {
            title: PTiLeTIQuaHanCaoNhat,
            icon: "layers",
            // subtitle: "Có 20 công tơ vận hành quá tải",
            color: "red"
          },
          {
            title: PHopDongQuaHanCaoNhat,
            icon: "layers",
            // subtitle: "Có 20 công tơ vận hành quá tải",
            color: "red"
          },
          {
            title: PTiLeHopDongQuaHanCaoNhat,
            icon: "layers",
            // subtitle: "Có 20 công tơ vận hành quá tải",
            color: "red"
          }
        ];
      }
    }
    //VPSDĐ
    let intkWh = 0;
    let intTongTien = 0;
    let listkWh = [];
    let listTongTien = [];
    if (
      this.state.listDaTaViPhamSuDungDien &&
      !Array.isArray(this.state.listDaTaViPhamSuDungDien) &&
      this.state.listDaTaViPhamSuDungDien.Series != null
    ) {
      //intVHCongTO1Pha = this.state.listDaTaCto.Series[0].data;
      //Cong To
      for (
        let i = 0;
        i < this.state.listDaTaViPhamSuDungDien.Series[11].data.length;
        i++
      ) {
        intkWh =
          intkWh + this.state.listDaTaViPhamSuDungDien.Series[11].data[i];
      }
      for (
        let i = 0;
        i < this.state.listDaTaViPhamSuDungDien.Series[13].data.length;
        i++
      ) {
        intTongTien =
          intTongTien + this.state.listDaTaViPhamSuDungDien.Series[13].data[i];
      }
      listkWh.push(this.state.listDaTaViPhamSuDungDien.Series[11]);
      listTongTien.push(this.state.listDaTaViPhamSuDungDien.Series[13]);
    }
    const width = this.state.screenwidth;
    const height = this.state.screenheight - 250;
    let vChieuRong = width >= 600 ? width / 2 : width;

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
    var conf1 = {
      chart: {
        type: "column"
      },

      title: {
        text: "Công tơ quá hạn kiểm định"
      },
      xAxis: {
        categories:
          this.state.listDaTaCto && !Array.isArray(this.state.listDaTaCto)
            ? this.state.listDaTaCto.Categories
            : []
      },

      yAxis: [
        {
          title: {
            text: "Công tơ"
          }
        },
        {
          opposite: true,
          title: {
            text: "Tỉ lệ công tơ quá hạn(%)"
          }
        }
      ],
      credits: {
        enabled: false
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true
          }
        }
      },

      series: [
        {
          name: "Công tơ quá hạn",
          data: listCongToQuaHan,
          column: {
            dataLabels: {
              format: "{point.y:,.0f} ",
              enabled: true
            }
          }
          // yAxis: 1
        },
        {
          name: "Tổng số công tơ",
          data: listCongToVanHanh,
          column: {
            dataLabels: {
              format: "{point.y:,.0f} ",
              enabled: true
            }
          }
        },
        {
          name: "Tỉ lệ công tơ quá hạn (%)",
          data: listTiLeQuaHan,
          type: "line",
          yAxis: 1,
          line: {
            dataLabels: {
              format: "{point.y:,.2f} ",
              enabled: true
            }
          },
          colorByPoint: true
        }
      ]
    };
    var conf2 = {
      chart: {
        type: "column"
      },

      title: {
        text: "TU quá hạn kiểm định"
      },
      xAxis: {
        categories:
          this.state.listDaTaTUTI && !Array.isArray(this.state.listDaTaTUTI)
            ? this.state.listDaTaTUTI.Categories
            : []
      },

      yAxis: [
        {
          title: {
            text: "TU"
          }
        },
        {
          opposite: true,
          title: {
            text: "Tỉ lệ TU quá hạn(%)"
          }
        }
      ],
      credits: {
        enabled: false
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true
          }
        }
      },

      series: [
        {
          name: "TU quá hạn",
          data: listTUQuaHan,
          column: {
            dataLabels: {
              format: "{point.y:,.0f} ",
              enabled: true
            }
          }
          // yAxis: 1
        },
        {
          name: "Tổng số TU",
          data: listTUVanHanh,
          column: {
            dataLabels: {
              format: "{point.y:,.0f} ",
              enabled: true
            }
          }
        },
        {
          name: "Tỉ lệ TU quá hạn (%)",
          data: listTiLeTUQuaHan,
          type: "line",
          yAxis: 1,
          line: {
            dataLabels: {
              format: "{point.y:,.2f} ",
              enabled: true
            }
          },
          colorByPoint: true
        }
      ]
    };
    var conf3 = {
      chart: {
        type: "column"
      },

      title: {
        text: "TI quá hạn kiểm định"
      },
      xAxis: {
        categories:
          this.state.listDaTaTUTI && !Array.isArray(this.state.listDaTaTUTI)
            ? this.state.listDaTaTUTI.Categories
            : []
      },

      yAxis: [
        {
          title: {
            text: "TI"
          }
        },
        {
          opposite: true,
          title: {
            text: "Tỉ lệ TI quá hạn(%)"
          }
        }
      ],
      credits: {
        enabled: false
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true
          }
        }
      },

      series: [
        {
          name: "TI quá hạn",
          data: listTIQuaHan,
          column: {
            dataLabels: {
              format: "{point.y:,.0f} ",
              enabled: true
            }
          }
          // yAxis: 1
        },
        {
          name: "Tổng số TI",
          data: listTIVanHanh,
          column: {
            dataLabels: {
              format: "{point.y:,.0f} ",
              enabled: true
            }
          }
        },
        {
          name: "Tỉ lệ TI quá hạn (%)",
          data: listTiLeTIQuaHan,
          type: "line",
          yAxis: 1,
          line: {
            dataLabels: {
              format: "{point.y:,.2f} ",
              enabled: true
            }
          },
          colorByPoint: true
        }
      ]
    };
    var conf4 = {
      chart: {
        type: "column"
      },

      title: {
        text: "Hợp đồng đến hạn ký lại"
      },
      xAxis: {
        categories:
          this.state.listDaTaHopDong &&
          !Array.isArray(this.state.listDaTaHopDong)
            ? this.state.listDaTaHopDong.Categories
            : []
      },

      yAxis: [
        {
          title: {
            text: "Hợp đồng"
          }
        },
        {
          opposite: true,
          title: {
            text: "Tỉ lệ hợp đồng đến hạn ký lại(%)"
          }
        }
      ],
      credits: {
        enabled: false
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true
          }
        }
      },

      series: [
        {
          name: "Hợp đồng đến hạn",
          data: listHopDongDenHan,
          column: {
            dataLabels: {
              format: "{point.y:,.0f} ",
              enabled: true
            }
          }
          // yAxis: 1
        },
        {
          name: "Tổng số hợp đồng",
          data: listHopDong,
          column: {
            dataLabels: {
              format: "{point.y:,.0f} ",
              enabled: true
            }
          }
        },
        {
          name: "Tỉ lệ hợp đồng đến hạn (%)",
          data: listTiLeHopDongQuaHan,
          type: "line",
          yAxis: 1,
          line: {
            dataLabels: {
              format: "{point.y:,.2f} ",
              enabled: true
            }
          },
          colorByPoint: true
        }
      ]
    };
    var conf5 = {
      chart: {
        type: "column"
      },

      title: {
        text: "Truy thu VPSDĐ (kWh)"
      },
      xAxis: {
        categories:
          this.state.listDaTaViPhamSuDungDien &&
          !Array.isArray(this.state.listDaTaViPhamSuDungDien)
            ? this.state.listDaTaViPhamSuDungDien.Categories
            : []
      },

      yAxis: [
        {
          title: {
            text: "kWh"
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
      series: listkWh
    };
    var conf6 = {
      chart: {
        type: "column"
      },

      title: {
        text: "Truy thu VPSDĐ (VNĐ)"
      },
      xAxis: {
        categories:
          this.state.listDaTaViPhamSuDungDien &&
          !Array.isArray(this.state.listDaTaViPhamSuDungDien)
            ? this.state.listDaTaViPhamSuDungDien.Categories
            : []
      },

      yAxis: [
        {
          title: {
            text: "VNĐ"
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
      series: listTongTien
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
            {/* <View
            style={{
              flex: 1,
              height: width >= 800 ? 10 : 120,
              flexDirection: width >= 800 ? "row" : "column"
            }}
          > */}
            <View
              style={{
                flex: 1,
                flexDirection: "row"
              }}
            >
              <View style={{ flex: 1 }}>
                <PricingCard
                  color="#4f9deb"
                  title="Công tơ quá hạn "
                  price={this.numberWithCommas(intQHCongTO)}
                  titleStyle={{ fontSize: 12 }}
                  pricingStyle={{ fontSize: 12 }}
                  info={[this.numberWithCommas(intVHCongTO)]}
                  // info={["1 User", "Basic Support", "All Core Features"]}
                  button={{ title: "", icon: "dashboard" }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <PricingCard
                  color="red"
                  title="TU, TI quá hạn "
                  price={
                    this.numberWithCommas(intQHTU) +
                    "/" +
                    this.numberWithCommas(intQHTI)
                  }
                  titleStyle={{ fontSize: 10 }}
                  pricingStyle={{ fontSize: 12 }}
                  fontSize="22"
                  // info={["1 User", "Basic Support", "All Core Features"]}
                  info={[
                    this.numberWithCommas(intVHTU) +
                      "/" +
                      this.numberWithCommas(intVHTI)
                  ]}
                  button={{ title: "", icon: "dashboard" }}
                />
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row"
                //   paddingTop: width >= 800 ? 0 : 200
              }}
            >
              <View style={{ flex: 1 }}>
                <PricingCard
                  color="green"
                  title="Hợp đồng đến hạn"
                  price={this.numberWithCommas(intHopDongQuaHan)}
                  titleStyle={{ fontSize: 12 }}
                  pricingStyle={{ fontSize: 12 }}
                  info={[this.numberWithCommas(intHopDong)]}
                  button={{ title: "", icon: "dashboard" }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <PricingCard
                  color="orange"
                  title="Truy thu VPSDĐ"
                  price={this.numberWithCommas(intkWh) + " kWh"}
                  titleStyle={{ fontSize: 12 }}
                  pricingStyle={{ fontSize: 12 }}
                  info={[this.numberWithCommas(intTongTien) + " VNĐ"]}
                  // info={["1 User", "Basic Support", "All Core Features"]}
                  button={{ title: "", icon: "dashboard" }}
                />
              </View>
            </View>
          </View>
          <View style={{ flex: 1, paddingTop: 80 }}></View>
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
          <ChartView
            style={{ height: 500, width: width }}
            config={conf4}
            options={options}
            originWhitelist={[""]}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
          <View style={{ backgroundColor: "orange", height: 1 }} />
          <ChartView
            style={{ height: 500, width: width }}
            config={conf5}
            options={options}
            originWhitelist={[""]}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
          <View style={{ backgroundColor: "orange", height: 1 }} />
          <ChartView
            style={{ height: 500, width: width }}
            config={conf6}
            options={options}
            originWhitelist={[""]}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
          <ScrollView
            key={Math.random()}
            style={{
              backgroundColor: "white"
            }}
          >
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
        <View style={styles.container}>
          <Page1 tabLabel={{ label: "Page #1" }} label="Page #1" />
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
