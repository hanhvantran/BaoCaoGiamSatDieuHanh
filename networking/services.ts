const IP = "https://khachhang.evnspc.vn/APIGiamSat/api/";
const urlBaoCao = {
    IP: "https://khachhang.evnspc.vn/APIGiamSat/api/",
    getDanhSachDonViQuanLy: IP + "getDanhSachDonViQuanLy",
    SP_KTDangNhap: IP + "SP_KTDangNhap",
    get_Info_Dvi_ChaCon: IP + "get_Info_Dvi_ChaCon",
    SP_BaoCaoTongHop: IP + "SP_BaoCaoTongHop",
    get_ThuongPhamUoc: IP + "get_ThuongPhamUoc",
    get_ThuongPhamUocTH: IP + "get_ThuongPhamUocTH",
    GET_KhachHangNoTienDien: IP + "GET_KhachHangNoTienDien",
    GET_KHCatDienDoNoTienDien: IP + "GET_KHCatDienDoNoTienDien",
    GET_ThuongPhamTheoTGBDien: IP + "GET_ThuongPhamTheoTGBDien",
    GET_ThuongPhamTheoCapDA: IP + "GET_ThuongPhamTheoCapDA",
    GET_ThuongPhamSoVoiKeHoach: IP + "GET_ThuongPhamSoVoiKeHoach",
    GET_TiLeThuTienDien: IP + "GET_TiLeThuTienDien",

    //GiaBanBinhQuan
    GetSoNongGBBQTrongThang: IP + "GetSoNongGBBQTrongThang/",
    GetSoLieuGBBQ: IP + "GetSoLieuGBBQ/",
    LaySoLieuSoSanhGBBQ: IP + "LaySoLieuSoSanhGBBQ/",
    GetGBBQThucHienTheoThang: IP + "GetGBBQThucHienTheoThang/",
    GetGBBQThucHienTheoNam: IP + "GetGBBQThucHienTheoNam/",
    GetGBBQKeHoach: IP + "GetGBBQKeHoach/",
    //GetGBBQKeHoachCapDuoi:IP + "GetGBBQKeHoachCapDuoi/",
    // GetGBBQLuyKeTheoThang:IP + "GetGBBQLuyKeTheoThang/",
    GetGBBQNhomNNTheoThang: IP + "GetGBBQNhomNNTheoThang/",
    GetGBBQCapDATheoThang: IP + "GetGBBQCapDATheoThang/",
    GetGBBQLuyKeCapDuoi: IP + "GetGBBQLuyKeCapDuoi/",
    //Home
    GetSoDoDemTheoThang: IP + "GetSoDoDemTheoThang/",
    GetHDMBDThucHienTheoThang: IP + "GetHDMBDThucHienTheoThang/",
    GetGBBQThucHienTheoThang2: IP + "GetGBBQThucHienTheoThang/",
    GetDoanhThuThucHienTheoThang: IP + "GetDoanhThuThucHienTheoThang/",
    GetTonThatThangTheoPPMoi: IP + "GetTonThatThangTheoPPMoi/",
    GetThuongPhamThucHienTheoThang: IP + "GetThuongPhamThucHienTheoThang/",
    //Tram CC 
    sp_KETQUAKHAITHACHSTRAMCCPC: IP + "sp_KETQUAKHAITHACHSTRAMCCPC",
    sp_KETQUAKHAITHACHSTRAMCCPC2: IP + "sp_KETQUAKHAITHACHSTRAMCCPC2",
    GET_TYLETONTHATHATHEPC: IP + "GET_TYLETONTHATHATHEPC",
    sp_KetQuaGiamTTDNPC: IP + "sp_KetQuaGiamTTDNPC",
    sp_KetQuaGiamTTDNPC2: IP + "sp_KetQuaGiamTTDNPC2",
    //Cong tac kiem tra 
    GET_SoLuongKiemTraVien: IP + "GET_SoLuongKiemTraVien",
    GET_KhachHangKhaiThac3Gia: IP + "GET_KhachHangKhaiThac3Gia",
    GET_KHangKhaiThac3GiaTheoNN: IP + "GET_KHangKhaiThac3GiaTheoNN",
    GET_SoLuotKiemTraApGia: IP + "GET_SoLuotKiemTraApGia",
    GET_KetQuaKiemTraApGia: IP + "GET_KetQuaKiemTraApGia",
    sp_ThongKeApGia: IP + "sp_ThongKeApGia",
    sp_HDDenHanKyLai: IP + "sp_HDDenHanKyLai",
    sp_HanKdinh_Cto: IP + "sp_HanKdinh_Cto",
    sp_HanKdinh_TUTI: IP + "sp_HanKdinh_TUTI",
    sp_HanKdinh_TUTI_B_PC_THop: IP + "sp_HanKdinh_TUTI_B_PC_THop",
    get_NghanhNghe: IP + "get_NghanhNghe",
    get_NghanhNghe2: IP + "get_NghanhNghe2",
    get_NghanhNghe3: IP + "get_NghanhNghe3",
    GET_KHangThanhLyNoKhoDoi: IP + "GET_KHangThanhLyNoKhoDoi",
    sp_ThuongPhamTheoNghanhNghe: IP + "sp_ThuongPhamTheoNghanhNghe",
    sp_KetQuaBanCSPK: IP + "sp_KetQuaBanCSPK",
    sp_CongToQuaTai: IP + "sp_CongToQuaTai",
    sp_ThongKeChiNiem: IP + "sp_ThongKeChiNiem",
    sp_TTDDMatChayHong: IP + "sp_TTDDMatChayHong",
    sp_UpdateToKen: IP + "UpdateToKen",
    BC_KTraXLyVPhamSDDien: IP + "BC_KTraXLyVPhamSDDien",
    SP_KTraHTDD: IP + "SP_KTraHTDD",
    sp_KTDinhKyHTDD: IP + "sp_KTDinhKyHTDD",
    get_Kh_PhaiMuaCSPK_TH_PMax: IP + "get_Kh_PhaiMuaCSPK_TH_PMax",
    SP_KeHoach: IP + "SP_KeHoach",
    SP_NhanDinhTramCC: IP + "SP_NhanDinhTramCC",
    SP_NhanDinhKinhDoanh: IP + "SP_NhanDinhKinhDoanh",
    SP_DienTietKiem: IP + "SP_DienTietKiem",
    sp_CongToChayHong: IP + "sp_CongToChayHong",
    SP_KHThieuThongTinChiNiem: IP + "SP_KHThieuThongTinChiNiem",
    sp_ThongBao: IP + "sp_ThongBao",
    sp_UpdateDaXem: IP + "sp_UpdateDaXem"


};
export default urlBaoCao; 
