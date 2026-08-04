# Error Log (Lỗi và cách xử lý)

- **Lỗi SSH với sed (04/08/2026)**: Khi chạy `sed` trực tiếp qua SSH từ powershell, dấu ngoặc kép bị escape sai dẫn đến `unterminated s command`. 
  - **Cách sửa**: Chỉnh sửa trực tiếp file `dist/index.html` cục bộ bằng node script hoặc thay thế chuỗi (dùng `multi_replace_file_content`), sau đó SCP đè file `index.html` đã được sửa lên VPS.
- **Lỗi script Puppeteer (04/08/2026)**: Chạy script Puppeteer báo lỗi thiếu package `puppeteer`. Đã bỏ qua chụp ảnh do không phải là core function của app.
