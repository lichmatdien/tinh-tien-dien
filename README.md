# Công cụ tính tiền điện bằng HTML, CSS và JavaScript

Dự án tĩnh, không cần PHP, cơ sở dữ liệu, API hoặc bước build. Chỉ cần mở `index.html` là chạy được.

## Phạm vi đã giữ lại

- Điện sinh hoạt theo 6 bậc và số hộ dùng chung công tơ.
- Điện kinh doanh, sản xuất theo cấp điện áp và 1/3 khung giờ.
- Hành chính sự nghiệp; bệnh viện, trường học.
- Bán buôn điện sinh hoạt và tổ hợp thương mại - dịch vụ - sinh hoạt ở mức rút gọn.
- VAT 8% hiện hành đến hết 31/12/2026, bảng chi tiết, tổng tiền và giá bình quân.

## Những phần đã lược bỏ so với bộ mã PHP ban đầu

- Phụ thuộc CMS, `FSRoute`, tệp `views/*.php` và các lệnh `include`.
- Công suất phản kháng, chỉ số công tơ, công tơ thẻ trả trước.
- Đối chiếu tiền điện phòng trọ, biểu đồ bậc điện, gợi ý tiết kiệm.
- Nội dung SEO dài lặp lại trong từng màn hình.

GitHub Pages chỉ phục vụ tệp tĩnh nên việc chuyển toàn bộ sang HTML/CSS/JS giúp dự án triển khai trực tiếp từ repository.

## Cấu trúc

```text
.
├── index.html
├── 404.html
├── assets/
│   ├── css/style.css
│   ├── img/favicon.svg
│   └── js/
│       ├── tariffs.js
│       ├── engine.js
│       └── app.js
├── manifest.webmanifest
├── robots.txt
└── .nojekyll
```

## Chạy trên máy tính

Cách nhanh nhất: mở trực tiếp `index.html`.

Hoặc chạy máy chủ tĩnh:

```bash
python -m http.server 8080
```

Sau đó mở `http://localhost:8080`.

## Đăng lên GitHub Pages

1. Tạo repository mới, ví dụ `tinh-tien-dien`.
2. Tải toàn bộ file trong thư mục này lên nhánh `main`.
3. Vào **Settings → Pages**.
4. Ở **Build and deployment**, chọn **Deploy from a branch**.
5. Chọn nhánh `main`, thư mục `/ (root)`, rồi bấm **Save**.
6. Chờ GitHub cấp địa chỉ dạng `https://ten-tai-khoan.github.io/tinh-tien-dien/`.

Chi tiết thêm nằm trong [docs/DEPLOY.md](docs/DEPLOY.md).

## Cập nhật biểu giá

Mở `assets/js/tariffs.js` và sửa các con số trong đối tượng `ELECTRICITY_TARIFFS`. Không cần sửa giao diện hoặc thuật toán.

Biểu giá mẫu hiện tại lấy theo Quyết định 1279/QĐ-BCT ngày 09/05/2025, áp dụng từ 10/05/2025. Giá trong cấu hình chưa gồm VAT. Thuế suất mẫu đang đặt là 8% theo chính sách giảm thuế có hiệu lực đến hết 31/12/2026.

## Liên kết hữu ích

Công cụ tập trung vào ước tính hóa đơn. Khi cần theo dõi kế hoạch ngừng cấp điện theo khu vực, có thể tra cứu tại [Lichmatdien.net](https://lichmatdien.net/).

## Lưu ý

Dự án độc lập và không phải website của EVN. Kết quả chỉ mang tính tham khảo; hóa đơn chính thức do đơn vị bán điện phát hành.
