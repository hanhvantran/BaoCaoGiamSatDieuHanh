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
import LoginScreen from "../LoginScreen";

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'LoginScreen';

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
      <KinhDoanhStack.Screen name="ThanhPhanPhuTai" component={ThanhPhanPhuTaiScreen} options={{title:"Theo 5 thành phần phụ tải"}} />
      <KinhDoanhStack.Screen name="TheoCapDienAp" component={TheoCapDienApScreen} options={{title:"Theo cấp điện áp"}} />
      <KinhDoanhStack.Screen name="TheoThoiGianBanDien" component={TheoThoiGianBanDienScreen} options={{title:"Theo thời gian bán điện"}} />
      <KinhDoanhStack.Screen name="ThuongPhamTheoKeHoachGiao" component={ThuongPhamTheoKeHoachGiaoScreen} options={{title:"Theo kế hoạch giao"}} />
      <KinhDoanhStack.Screen name="TheoNhomNghanhNghe" component={TheoNhomNghanhNgheScreen} options={{title:"Theo nhóm nghành nghề đặc thù"}} />
      <KinhDoanhStack.Screen name="GiaBanDienBinhQuan" component={GiaBanDienBinhQuanScreen} options={{title:"Giá bán bình quân"}} />
      <KinhDoanhStack.Screen name="KhachHangKhaiThacBaGia" component={KhachHangKhaiThacBaGiaScreen} options={{title:"Khách hàng khai thác 3 giá"}} />
      <KinhDoanhStack.Screen name="KhachHangThuocDoiTuongGS" component={KhachHangThuocDoiTuongGSScreen} options={{title:"Thuộc đối tượng giám sát"}} />
      <KinhDoanhStack.Screen name="KHKhaiThacBaGiaTheoNN" component={KHKhaiThacBaGiaTheoNNScreen} options={{title:"Khách hàng 3 giá theo nghành nghề"}} />
      <KinhDoanhStack.Screen name="KhachHangNghanhNghe" component={KhachHangNghanhNgheScreen} options={{title:"Khách hàng theo nghành nghề"}} />
      <KinhDoanhStack.Screen name="KhachHangCatDien" component={KhachHangCatDienScreen} options={{title:"Khách hàng cắt điện"}} />
      <KinhDoanhStack.Screen name="KhachHangNoTienDien" component={KhachHangNoTienDienScreen} options={{title:"Khách hàng nợ tiền điện"}} />
      <KinhDoanhStack.Screen name="KhachHangThanhLy" component={KhachHangThanhLyScreen} options={{title:"Khách hàng thành lý"}} />
      <KinhDoanhStack.Screen name="SoVoiKeHoach" component={SoVoiKeHoachScreen} options={{title:"Thu tiền điện so với kế hoạch giao"}} />
    </KinhDoanhStack.Navigator>
  );
}
const GiamSatStack = createStackNavigator();

function GiamSatStackScreen() {
  return (
    <GiamSatStack.Navigator>
      <GiamSatStack.Screen options={{headerShown:false}}  name="GiamSatScreen" component={GiamSatScreen} />
      <GiamSatStack.Screen name="KiemTraVien" component={KiemTraVienScreen} options={{title:"Kiểm tra viên"}} />
      <GiamSatStack.Screen name="CanhBaoCanRaSoat" component={CanhBaoCanRaSoatScreen} options={{title:"Chưa khai thác CSPK"}} />
      <GiamSatStack.Screen name="KetQuaBanCSPK" component={KetQuaBanCSPKScreen} options={{title:"Kết quả bán CSPK"}} />
      <GiamSatStack.Screen name="KetQuaCapNhatChiNiem" component={KetQuaCapNhatChiNiemScreen} options={{title:"HTĐĐ chưa niêm chì"}} />
      <GiamSatStack.Screen name="KetQuaThayTheCongToQuaTai" component={KetQuaThayTheCongToQuaTaiScreen} options={{title:"Công tơ quá tải"}} />
      <GiamSatStack.Screen name="KetQuaThayTheTBDD" component={KetQuaThayTheTBDDScreen} options={{title:"TBĐĐ được thay thế"}} />
      <GiamSatStack.Screen name="TBDDChayHong" component={TBDDChayHongScreen} options={{title:"TBĐĐ cháy hỏng"}} />
      <GiamSatStack.Screen name="SuDungDienTietKiem" component={SuDungDienTietKiemScreen} options={{title:"Sử dụng điện tiết kiệm"}} />
      <GiamSatStack.Screen name="TheoDienThuongPham" component={TheoDienThuongPhamScreen} options={{title:"Điện thương phẩm"}} />
      <GiamSatStack.Screen name="KetQuaThayTheTBA" component={KetQuaThayTheTBAScreen} options={{title:"Kết quả khai thác hiệu suất TBACC"}} />
      <GiamSatStack.Screen name="KetQuaTheoLoTrinhGiamTonThat" component={KetQuaTheoLoTrinhGiamTonThatScreen} options={{title:"Kết quả khai thác hiệu suất TBACC"}}  />
      <GiamSatStack.Screen name="TyLeTonThatDienNang" component={TyLeTonThatDienNangScreen} options={{title:"Báo cáo tỷ lệ tổn thất điện năng"}} />
      <GiamSatStack.Screen name="HDMBDChuaRaSoat" component={HDMBDChuaRaSoatScreen} options={{title:"HĐMBĐ quá hạn"}} />
      <GiamSatStack.Screen name="HDMBDDaRaSoat" component={HDMBDDaRaSoatScreen} options={{title:"HĐMBĐ đã ký lại"}} />
      <GiamSatStack.Screen name="TBDDChuaThayThe" component={TBDDChuaThayTheScreen} options={{title:"TBĐĐ quá hạn"}} />
      <GiamSatStack.Screen name="TBDDDaThayThe" component={TBDDDaThayTheScreen} options={{title:"TBĐĐ đã thay thế"}} />
      <GiamSatStack.Screen name="KiemTraXuLyVPSDD" component={KiemTraXuLyVPSDDScreen} options={{title:"Kiểm tra xử lý VPSDĐ"}} />
      <GiamSatStack.Screen name="KiemTraHTDD" component={KiemTraHTDDScreen} options={{title:"Kiểm tra HTĐĐ"}}/>
      <GiamSatStack.Screen name="KetQuaKiemTraApGia" component={KetQuaKiemTraApGiaScreen} options={{title:"Kiểm tra áp giá"}} />
    </GiamSatStack.Navigator>
  );
}
const ThongBaoStack = createStackNavigator();
function ThongBaoStackScreen() {
  return (
    <ThongBaoStack.Navigator>
      <ThongBaoStack.Screen options={{headerShown:false}}  name="ThongBaoScreen" component={ThongBaoScreen} />
      <ThongBaoStack.Screen name="NhanDinhGiamSatScreen"  component={NhanDinhGiamSatScreen} options={{title:"Giám sát"}} />
      <ThongBaoStack.Screen name="NhanDinhKinhDoanhScreen" component={NhanDinhKinhDoanhScreen} options={{title:"Kinh doanh"}} />
      <ThongBaoStack.Screen name="NhanDinhTietKiemDienScreen" component={NhanDinhTietKiemDienScreen} options={{title:"Tiết kiệm điện"}} />
      <ThongBaoStack.Screen name="NhanDinhTramCongCongScreen" component={NhanDinhTramCongCongScreen} options={{title:"Trạm công cộng"}} />
      <ThongBaoStack.Screen name="NhanDinhThongBaoScreen" component={NhanDinhThongBaoScreen} options={{title:"Cảnh báo"}} />
      <ThongBaoStack.Screen name="NhanDinhDoDoemScreen" component={NhanDinhDoDoemScreen} options={{title:"Đo đếm"}} />
      <ThongBaoStack.Screen name="NhanDinhThongBaoChiTietScreen" component={NhanDinhThongBaoChiTietScreen} options={{title:"Chi tiết cảnh báos"}} />
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
