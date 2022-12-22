//Message thông tin cảnh báo
export const messagesSuccess = {
  I0001: "Đăng ký thành công",
  I0002: "Đăng nhập thành công",
  I0003: "Cập nhật thành công",
  I0004: "Xóa thành công",
  I0005: "Tải file thành công",
  I0006: "Thêm thành công",
  I0007: (a) => {
    return "Tạo " + a + " thành công ";
  },
  I0008: (a) => {
    return "Chào mừng đến với sự kiện " + a;
  },
  I0009: "Di chuyển đến hàng chờ",
  I0010: "Bắt đầu sự kiện",
};

//Message lỗi
export const messagesError = {
  E0001: (a) => {
    return a + " bắt buộc nhập";
  },
  E0002: (a, b) => {
    return "Vui lòng nhập " + a + " có độ dài lớn hơn hoặc bằng " + b;
  },
  E0003: (a) => {
    return a + " nhập sai định dạng";
  },
  E0004: "Vui lòng nhập đầy đủ tất cả các ô",
  E0005: (a) =>
    "Không cho phép khoảng trắng và buộc phải lớn hơn hoặc bằng 6 ký tự ở " + a,
  E0006: "Vui lòng đọc và đồng ý với điều khoản",
  E0007: (a, b) => {
    return "Tồn tại " + a + " hoặc " + b;
  },
  E0008: (a) => a + " đã tồn tại trong hệ thống",
  E0009: "Không tồn tại người dùng",
  E0010:
    "Bạn chưa có tài khoản với email này \nThử với tài khoản khác hoặc đăng ký tài khoản mới",
  E0011: (a) => a + " không trùng khớp",
  E0021: (a, b) => {
    return "Vui lòng nhập " + a + " giống với " + b;
  },
  E0022: "Tải file thất bại",

  E1002: "Cập nhật thất bại",
  E1003: "Xóa thất bại",
  E2001: "Mã pin sai, vui lòng nhập lại mã pin",
  E2002: "Không được để mã PIN trống",
  E2003: "Không thể quét được mã, vui lòng quét lại mã QR",
  E2004: "Không có sự kiện nào tồn tại với mã PIN này",
  E4444: "Đã xảy ra lỗi hệ thống",
};
