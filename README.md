# Công cụ tính tiền điện

Công cụ hỗ trợ ước tính tiền điện theo nhóm sử dụng, sản lượng tiêu thụ và biểu giá hiện hành.

**Phiên bản đầy đủ:** [Tính tiền điện tại Lichmatdien.net](https://lichmatdien.net/tinh-tien-dien.html)

## Chức năng chính

- Tính điện sinh hoạt theo 6 bậc và số hộ dùng chung công tơ.
- Tính điện kinh doanh, sản xuất theo cấp điện áp và khung giờ.
- Hỗ trợ nhóm hành chính sự nghiệp, cơ quan, bệnh viện và bán buôn.
- Hiển thị tiền trước VAT, VAT, tổng thanh toán và giá điện bình quân.
- Giao diện phù hợp với máy tính và điện thoại.

## Đưa lên GitHub Pages

1. Tạo một repository mới trên GitHub.
2. Tải toàn bộ tệp trong thư mục này lên nhánh `main`.
3. Vào **Settings → Pages**.
4. Chọn **Deploy from a branch**.
5. Chọn nhánh `main` và thư mục `/ (root)`, sau đó nhấn **Save**.

Hướng dẫn chi tiết nằm trong [docs/DEPLOY.md](docs/DEPLOY.md).

## Biểu giá

Biểu giá đang sử dụng được khai báo trong `assets/js/tariffs.js`. Khi có biểu giá mới, cần cập nhật lại các mức giá trước khi sử dụng.

## Thông tin

Công cụ được phát triển bởi [Lichmatdien.net](https://lichmatdien.net/tinh-tien-dien.html). Kết quả hiển thị mang tính ước tính; hóa đơn chính thức do đơn vị bán điện phát hành.
