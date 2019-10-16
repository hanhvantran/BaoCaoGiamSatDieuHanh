import React from "react";
import { Platform, StyleSheet } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

import TabBarIcon from "../components/TabBarIcon";
import HomeScreen from "../screens/HomeScreen";
import GiamSatScreen from "../screens/GiamSatScreen";
import KinhDoanhScreen from "../screens/KinhDoanhScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ThongBaoScreen from "../screens/NhanDinhScreen";
import LoginScreen from "../LoginScreen";
//DienThuongPham
import ThanhPhanPhuTaiScreen from "../screens/KinhDoanh/DienThuongPham/ThanhPhanPhuTaiScreen";
import TheoCapDienApScreen from "../screens/KinhDoanh/DienThuongPham/TheoCapDienApScreen";
import TheoThoiGianBanDienScreen from "../screens/KinhDoanh/DienThuongPham/TheoThoiGianBanDienScreen";
import ThuongPhamTheoKeHoachGiaoScreen from "../screens/KinhDoanh/DienThuongPham/ThuongPhamTheoKeHoachGiaoScreen";
import TheoNhomNghanhNgheScreen from "../screens/KinhDoanh/DienThuongPham/TheoNhomNghanhNgheScreen";

//KiemTraApGiaDien
import GiaBanDienBinhQuanScreen from "../screens/KinhDoanh/KiemTraApGiaDien/GiaBanDienBinhQuanScreen";
import KhachHangKhaiThacBaGiaScreen from "../screens/KinhDoanh/KiemTraApGiaDien/KhachHangKhaiThacBaGiaScreen";
import KhachHangThuocDoiTuongGSScreen from "../screens/KinhDoanh/KiemTraApGiaDien/KhachHangThuocDoiTuongGSScreen";
import KHKhaiThacBaGiaTheoNNScreen from "../screens/KinhDoanh/KiemTraApGiaDien/KHKhaiThacBaGiaTheoNNScreen";

//ThuTienDien
import KhachHangCatDienScreen from "../screens/KinhDoanh/ThuTienDien/KhachHangCatDienScreen";
import KhachHangNoTienDienScreen from "../screens/KinhDoanh/ThuTienDien/KhachHangNoTienDienScreen";
import KhachHangThanhLyScreen from "../screens/KinhDoanh/ThuTienDien/KhachHangThanhLyScreen";
import SoVoiKeHoachScreen from "../screens/KinhDoanh/ThuTienDien/SoVoiKeHoachScreen";

//CongTacKiemTra

import KiemTraVienScreen from "../screens/GiamSat/CongTacKiemTra/KiemTraVienScreen";
import KetQuaKiemTraApGiaScreen from "../screens/GiamSat/CongTacKiemTra/KetQuaKiemTraApGiaScreen";
import KiemTraHTDDScreen from "../screens/GiamSat/CongTacKiemTra/KiemTraHTDDScreen";


//CSPK
import CanhBaoCanRaSoatScreen from "../screens/GiamSat/CSPK/CanhBaoCanRaSoatScreen";
import KHangLapTuBuScreen from "../screens/GiamSat/CSPK/KHangLapTuBuScreen";
import KetQuaBanCSPKScreen from "../screens/GiamSat/CSPK/KetQuaBanCSPKScreen";

//HTDD
import KetQuaCapNhatChiNiemScreen from "../screens/GiamSat/HTDD/KetQuaCapNhatChiNiemScreen";
import KetQuaGiamSatMDMSScreen from "../screens/GiamSat/HTDD/KetQuaGiamSatMDMSScreen";
import KetQuaThayTheCongToQuaTaiScreen from "../screens/GiamSat/HTDD/KetQuaThayTheCongToQuaTaiScreen";
import KetQuaThayTheTBDDScreen from "../screens/GiamSat/HTDD/KetQuaThayTheTBDDScreen";
import TBDDChayHongScreen from "../screens/GiamSat/HTDD/TBDDChayHongScreen";

//TietKiemDien
import SuDungDienTietKiemScreen from "../screens/GiamSat/TietKiemDien/SuDungDienTietKiemScreen";
import TheoDienThuongPhamScreen from "../screens/GiamSat/TietKiemDien/TheoDienThuongPhamScreen";

//TramCC
import KetQuaThayTheTBAScreen from "../screens/GiamSat/TramCC/KetQuaThayTheTBAScreen";
import KetQuaTheoLoTrinhGiamTonThatScreen from "../screens/GiamSat/TramCC/KetQuaTheoLoTrinhGiamTonThatScreen";
import TyLeTonThatDienNangScreen from "../screens/GiamSat/TramCC/TyLeTonThatDienNangScreen";

//VPPL
import HDMBDChuaRaSoatScreen from "../screens/GiamSat/VPPL/HDMBDChuaRaSoatScreen";
import HDMBDDaRaSoatScreen from "../screens/GiamSat/VPPL/HDMBDDaRaSoatScreen";
import TBDDChuaThayTheScreen from "../screens/GiamSat/VPPL/TBDDChuaThayTheScreen";
import TBDDDaThayTheScreen from "../screens/GiamSat/VPPL/TBDDDaThayTheScreen";
import KiemTraXuLyVPSDDScreen from "../screens/GiamSat/VPPL/KiemTraXuLyVPSDDScreen";

//NhanDinh
import NhanDinhGiamSatScreen from "../screens/NhanDinh/NhanDinhGiamSatScreen";
import NhanDinhKinhDoanhScreen from "../screens/NhanDinh/NhanDinhKinhDoanhScreen";
import NhanDinhTietKiemDienScreen from "../screens/NhanDinh/NhanDinhTietKiemDienScreen";
import NhanDinhTramCongCongScreen from "../screens/NhanDinh/NhanDinhTramCongCongScreen";
import NhanDinhThongBaoScreen from "../screens/NhanDinh/NhanDinhThongBaoScreen";
import NhanDinhThongBaoChiTietScreen from "../screens/NhanDinh/NhanDinhThongBaoChiTietScreen";
import NhanDinhDoDoemScreen from "../screens/NhanDinh/NhanDinhDoDoemScreen";
import SendPushNotification from "../screens/PushNotifications/SendPushNotification";

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  padLeft: {
    paddingLeft: 16
  },
  padRight: {
    paddingRight: 16
  }
});
const HomeStack = createStackNavigator({
  Home: HomeScreen
});

HomeStack.navigationOptions = {
  tabBarLabel: "Trang chủ",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-home" : "md-home"}
    />
  )
};

const KinhDoanhStack = createStackNavigator({
  KinhDoanh: KinhDoanhScreen,
  //DienThuongPham
  ThanhPhanPhuTai: ThanhPhanPhuTaiScreen,
  TheoCapDienAp: TheoCapDienApScreen,
  TheoThoiGianBanDien: TheoThoiGianBanDienScreen,
  ThuongPhamTheoKeHoachGiao: ThuongPhamTheoKeHoachGiaoScreen,
  TheoNhomNghanhNghe: TheoNhomNghanhNgheScreen,
  //KiemTraApGiaDien
  GiaBanDienBinhQuan: GiaBanDienBinhQuanScreen,

  KhachHangKhaiThacBaGia: KhachHangKhaiThacBaGiaScreen,
  KhachHangThuocDoiTuongGS: KhachHangThuocDoiTuongGSScreen,
  KHKhaiThacBaGiaTheoNN: KHKhaiThacBaGiaTheoNNScreen,
  //ThuTienDien
  KhachHangCatDien: KhachHangCatDienScreen,
  KhachHangNoTienDien: KhachHangNoTienDienScreen,
  KhachHangThanhLy: KhachHangThanhLyScreen,
  SoVoiKeHoach: SoVoiKeHoachScreen
});

KinhDoanhStack.navigationOptions = {
  tabBarLabel: "Kinh doanh",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-business" : "md-business"}
    />
  )
};

const GiamSatStack = createStackNavigator({
  GiamSatScreen: GiamSatScreen,
  KiemTraVien: KiemTraVienScreen,
  CanhBaoCanRaSoat: CanhBaoCanRaSoatScreen,
  KHangLapTuBu: KHangLapTuBuScreen,
  KetQuaBanCSPK: KetQuaBanCSPKScreen,
  KetQuaCapNhatChiNiem: KetQuaCapNhatChiNiemScreen,
  KetQuaGiamSatMDMS: KetQuaGiamSatMDMSScreen,
  KetQuaThayTheCongToQuaTai: KetQuaThayTheCongToQuaTaiScreen,
  KetQuaThayTheTBDD: KetQuaThayTheTBDDScreen,
  TBDDChayHong: TBDDChayHongScreen,
  SuDungDienTietKiem: SuDungDienTietKiemScreen,
  TheoDienThuongPham: TheoDienThuongPhamScreen,
  KetQuaThayTheTBA: KetQuaThayTheTBAScreen,
  KetQuaTheoLoTrinhGiamTonThat: KetQuaTheoLoTrinhGiamTonThatScreen,
  TyLeTonThatDienNang: TyLeTonThatDienNangScreen,
  HDMBDChuaRaSoat: HDMBDChuaRaSoatScreen,
  HDMBDDaRaSoat: HDMBDDaRaSoatScreen,
  TBDDChuaThayThe: TBDDChuaThayTheScreen,
  TBDDDaThayThe: TBDDDaThayTheScreen,
  KiemTraXuLyVPSDD:KiemTraXuLyVPSDDScreen,
  KiemTraHTDD: KiemTraHTDDScreen,
  KetQuaKiemTraApGia: KetQuaKiemTraApGiaScreen
});

GiamSatStack.navigationOptions = {
  tabBarLabel: "Giám sát",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-stats" : "md-stats"}
    />
  )
};

const ThongBaoStack = createStackNavigator({
  ThongBaoScreen: ThongBaoScreen,
  NhanDinhGiamSatScreen: NhanDinhGiamSatScreen,
  NhanDinhKinhDoanhScreen: NhanDinhKinhDoanhScreen,
  NhanDinhTietKiemDienScreen: NhanDinhTietKiemDienScreen,
  NhanDinhTramCongCongScreen: NhanDinhTramCongCongScreen,
  NhanDinhThongBaoScreen: NhanDinhThongBaoScreen,
  NhanDinhDoDoemScreen: NhanDinhDoDoemScreen,
  NhanDinhThongBaoChiTietScreen: NhanDinhThongBaoChiTietScreen,
  SendPushNotification: SendPushNotification
});

ThongBaoStack.navigationOptions = {
  tabBarLabel: "Nhận định",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-notifications" : "md-notifications"}
    />
  )
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen
});

SettingsStack.navigationOptions = {
  tabBarLabel: "Hệ thống",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-cog" : "md-cog"}
    />
  )
};

export default createBottomTabNavigator({
  HomeStack,
  KinhDoanhStack,
  GiamSatStack,
  ThongBaoStack,
  SettingsStack
});
