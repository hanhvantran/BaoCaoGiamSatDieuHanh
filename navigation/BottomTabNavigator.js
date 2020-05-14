/*import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import LoginScreen from "../LoginScreen";
const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-code-working" />,
        }}
      />
      <BottomTab.Screen
        name="Links"
        component={LinksScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-book" />,
        }}
      />
      <BottomTab.Screen
        name="LoginScreen"
        component={LinksScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-book" />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
      return 'How to get started';
    case 'Links':
      return 'Links to learn more';
  }
}*/
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Platform, StyleSheet } from "react-native";
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';

import GiamSatScreen from "../screens/GiamSatScreen";
import KinhDoanhScreen from "../screens/KinhDoanhScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ThongBaoScreen from "../screens/NhanDinhScreen";
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
import KhachHangNghanhNgheScreen from "../screens/KinhDoanh/KiemTraApGiaDien/KhachHangNghanhNgheScreen";

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

import KetQuaBanCSPKScreen from "../screens/GiamSat/CSPK/KetQuaBanCSPKScreen";

//HTDD
import KetQuaCapNhatChiNiemScreen from "../screens/GiamSat/HTDD/KetQuaCapNhatChiNiemScreen";
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


const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

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
const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen options={{headerShown:false}}  name="Home" component={HomeScreen} />
    </HomeStack.Navigator>
  );
}
const KinhDoanhStack = createStackNavigator();

function KinhDoanhStackScreen() {
  return (
    <KinhDoanhStack.Navigator>
      <KinhDoanhStack.Screen options={{headerShown:false}}  name="KinhDoanh" component={KinhDoanhScreen} />
      <KinhDoanhStack.Screen name="ThanhPhanPhuTai" component={ThanhPhanPhuTaiScreen} />
      <KinhDoanhStack.Screen name="TheoCapDienAp" component={TheoCapDienApScreen} />
      <KinhDoanhStack.Screen name="TheoThoiGianBanDien" component={TheoThoiGianBanDienScreen} />
      <KinhDoanhStack.Screen name="ThuongPhamTheoKeHoachGiao" component={ThuongPhamTheoKeHoachGiaoScreen} />
      <KinhDoanhStack.Screen name="TheoNhomNghanhNghe" component={TheoNhomNghanhNgheScreen} />
      <KinhDoanhStack.Screen name="GiaBanDienBinhQuan" component={GiaBanDienBinhQuanScreen} />
      <KinhDoanhStack.Screen name="KhachHangKhaiThacBaGia" component={KhachHangKhaiThacBaGiaScreen} />
      <KinhDoanhStack.Screen name="KhachHangThuocDoiTuongGS" component={KhachHangThuocDoiTuongGSScreen} />
      <KinhDoanhStack.Screen name="KHKhaiThacBaGiaTheoNN" component={KHKhaiThacBaGiaTheoNNScreen} />
      <KinhDoanhStack.Screen name="KhachHangNghanhNghe" component={KhachHangNghanhNgheScreen} />
      <KinhDoanhStack.Screen name="KhachHangCatDien" component={KhachHangCatDienScreen} />
      <KinhDoanhStack.Screen name="KhachHangNoTienDien" component={KhachHangNoTienDienScreen} />
      <KinhDoanhStack.Screen name="KhachHangThanhLy" component={KhachHangThanhLyScreen} />
      <KinhDoanhStack.Screen name="SoVoiKeHoach" component={SoVoiKeHoachScreen} />
    </KinhDoanhStack.Navigator>
  );
}
const GiamSatStack = createStackNavigator();

function GiamSatStackScreen() {
  return (
    <GiamSatStack.Navigator>
      <GiamSatStack.Screen options={{headerShown:false}}  name="GiamSatScreen" component={GiamSatScreen} />
      <GiamSatStack.Screen name="KiemTraVien" component={KiemTraVienScreen} />
      <GiamSatStack.Screen name="CanhBaoCanRaSoat" component={CanhBaoCanRaSoatScreen} />
      <GiamSatStack.Screen name="KetQuaBanCSPK" component={KetQuaBanCSPKScreen} />
      <GiamSatStack.Screen name="KetQuaCapNhatChiNiem" component={KetQuaCapNhatChiNiemScreen} />
      <GiamSatStack.Screen name="KetQuaThayTheCongToQuaTai" component={KetQuaThayTheCongToQuaTaiScreen} />
      <GiamSatStack.Screen name="KetQuaThayTheTBDD" component={KetQuaThayTheTBDDScreen} />
      <GiamSatStack.Screen name="TBDDChayHong" component={TBDDChayHongScreen} />
      <GiamSatStack.Screen name="SuDungDienTietKiem" component={SuDungDienTietKiemScreen} />
      <GiamSatStack.Screen name="TheoDienThuongPham" component={TheoDienThuongPhamScreen} />
      <GiamSatStack.Screen name="KetQuaThayTheTBA" component={KetQuaThayTheTBAScreen} />
      <GiamSatStack.Screen name="KetQuaTheoLoTrinhGiamTonThat" component={KetQuaTheoLoTrinhGiamTonThatScreen} />
      <GiamSatStack.Screen name="TyLeTonThatDienNang" component={TyLeTonThatDienNangScreen} />
      <GiamSatStack.Screen name="HDMBDChuaRaSoat" component={HDMBDChuaRaSoatScreen} />
      <GiamSatStack.Screen name="HDMBDDaRaSoat" component={HDMBDDaRaSoatScreen} />
      <GiamSatStack.Screen name="TBDDChuaThayThe" component={TBDDChuaThayTheScreen} />
      <GiamSatStack.Screen name="TBDDDaThayThe" component={TBDDDaThayTheScreen} />
      <GiamSatStack.Screen name="KiemTraXuLyVPSDD" component={KiemTraXuLyVPSDDScreen} />
      <GiamSatStack.Screen name="KiemTraHTDD" component={KiemTraHTDDScreen} />
      <GiamSatStack.Screen name="KetQuaKiemTraApGia" component={KetQuaKiemTraApGiaScreen} />
    </GiamSatStack.Navigator>
  );
}
const ThongBaoStack = createStackNavigator();
function ThongBaoStackScreen() {
  return (
    <ThongBaoStack.Navigator>
      <ThongBaoStack.Screen options={{headerShown:false}}  name="ThongBaoScreen" component={ThongBaoScreen} />
      <ThongBaoStack.Screen name="NhanDinhGiamSatScreen"  component={NhanDinhGiamSatScreen} />
      <ThongBaoStack.Screen name="NhanDinhKinhDoanhScreen" component={NhanDinhKinhDoanhScreen} />
      <ThongBaoStack.Screen name="NhanDinhTietKiemDienScreen" component={NhanDinhTietKiemDienScreen} />
      <ThongBaoStack.Screen name="NhanDinhTramCongCongScreen" component={NhanDinhTramCongCongScreen} />
      <ThongBaoStack.Screen name="NhanDinhThongBaoScreen" component={NhanDinhThongBaoScreen} />
      <ThongBaoStack.Screen name="NhanDinhDoDoemScreen" component={NhanDinhDoDoemScreen} />
      <ThongBaoStack.Screen name="NhanDinhThongBaoChiTietScreen" component={NhanDinhThongBaoChiTietScreen} />
   </ThongBaoStack.Navigator>
  );
}
const SettingsStack = createStackNavigator();
function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen options={{headerShown:false}}  name="SettingsScreen" component={SettingsScreen} />
    </SettingsStack.Navigator>
  );
}
export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });
  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME} tabBarOptions={null} >
      <BottomTab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarLabel: "Trang Chủ",
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={Platform.OS === "ios" ? "ios-home" : "md-home"}/>,
        }}
      />
      <BottomTab.Screen
        name="KinhDoanh"
        component={KinhDoanhStackScreen}
        
        options={{
          tabBarLabel: "Kinh Doanh",
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={Platform.OS === "ios" ? "ios-business" : "md-business"} />,
        }}
      />
      <BottomTab.Screen
        name="GiamSat"
        component={GiamSatStackScreen}
        options={{
          tabBarLabel: "Giám Sát",
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={Platform.OS === "ios" ? "ios-stats" : "md-stats"} />,
        }}
      />
       <BottomTab.Screen
        name="NhanDinh"
        component={ThongBaoStackScreen}
        options={{
          tabBarLabel: "Nhận Định",
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={Platform.OS === "ios" ? "ios-notifications" : "md-notifications"}/>,
        }}
      />
        <BottomTab.Screen
        name="HeThong"
        component={SettingsStackScreen}
        options={{
          tabBarLabel: "Hệ Thống",
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={Platform.OS === "ios" ? "ios-cog" : "md-cog"}/>,
        }}
      />
    </BottomTab.Navigator>
  );
}

 function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;
  switch (routeName) {     case 'Home':
      return null;
    case 'ThanhPhanPhuTai':
      return 'Theo 5 thành phần phụ tải';
  }
}
