# Nhật ký phát triển (Memory)

## Thay đổi thiết kế (04/08/2026)
- **Mục tiêu**: Redesign app SpendWise theo phong cách Light Theme, hiện đại, clean (Apple/Stripe/Revolut vibe).
- **Phông chữ**: Sử dụng `Plus Jakarta Sans` cho tiêu đề và `Inter` cho phần còn lại.
- **Màu sắc**: Chuyển sang Light Theme mặc định (`#F8FAFC`), màu xanh dương (`#2563EB`) là màu chủ đạo. Bỏ hoàn toàn giao diện dark cyberpunk.
- **Thành phần UI**:
  - Navbar: Desktop là sidebar thu gọn mở rộng khi hover; Mobile là bottom nav.
  - FAB (Floating Action Button): Được thiết kế lại to, rõ, nằm góc dưới.
  - Giao dịch: Icon mềm mại, clean rows thay vì cards rời rạc.
  - Biểu đồ: Thay thế toàn bộ bằng SVG AreaChart và PieChart tùy chỉnh không dùng thư viện ngoài, có hiệu ứng vẽ (draw) khi mount.
  - ProgressBars và MiniCharts được tích hợp vào thẻ tổng quan và ngân sách.
- **Kết quả**:
  - Build thành công
  - Deploy lên VPS `149.118.62.155` thành công (`/var/www/chitieu/frontend/dist/`).
  - Cache Cloudflare đã được xử lý bằng cách thêm `?v=3` vào tên file build trong `index.html`.
