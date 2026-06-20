# Hướng dẫn đưa dự án lên mạng

## 1. GitHub Pages - nên dùng làm bản chính

Dự án không có bước build.

- Repository: public.
- Branch: `main`.
- Source: **Deploy from a branch**.
- Folder: `/ (root)`.
- Tệp `index.html` phải nằm ngay thư mục gốc.

Mỗi lần sửa code và push lên `main`, GitHub Pages sẽ xuất bản lại.

## 2. Cloudflare Pages - tạo thêm một bản chạy online

- Vào **Workers & Pages → Create application → Pages**.
- Chọn **Import an existing Git repository**.
- Kết nối repository GitHub.
- Framework preset: `None`.
- Build command: để trống.
- Build output directory: `/` hoặc để theo lựa chọn mặc định cho site tĩnh.
- Bấm deploy.

Cloudflare sẽ tự triển khai lại sau mỗi lần push.

## 3. Netlify Drop - nhanh nhất để xem thử

- Giải nén dự án.
- Mở trang Netlify Drop.
- Kéo cả thư mục có `index.html` vào vùng upload.
- Netlify cấp ngay tên miền `*.netlify.app`.

Cách này phù hợp để xem thử; muốn cập nhật tự động thì nên kết nối repository GitHub.

## 4. Vercel

- Chọn **Add New → Project**.
- Import repository GitHub.
- Framework preset: `Other`.
- Không cần build command.
- Output directory: để trống.
- Deploy.

## Gợi ý SEO tự nhiên

- Giữ một liên kết ngữ cảnh trong phần nội dung sang `https://lichmatdien.net/`.
- Dùng anchor thương hiệu hoặc mô tả đúng nhu cầu, không lặp từ khóa chính xác nhiều lần.
- Không tạo hàng loạt bản sao y hệt trên nhiều tên miền rồi index tất cả. Nên chọn GitHub Pages làm bản chính; các nền tảng khác chỉ dùng để demo hoặc thử nghiệm.
- Khi đã có URL chính thức, có thể thêm thẻ canonical vào `index.html` để tránh trùng lặp nếu vẫn duy trì nhiều bản công khai.
