# Log Lỗi & Giải Pháp (loi.md) - SpendWise

## Lỗi #1: Prisma Init xung đột thư mục
- **Mô tả**: `npx prisma init` báo lỗi `A folder called prisma already exists in your project`.
- **Nguyên nhân**: File `prisma/schema.prisma` đã được tạo sẵn trước khi chạy lệnh init.
- **Cách khắc phục**: Bỏ qua lệnh init, giữ nguyên `schema.prisma` và `.env` chuẩn. Chạy trực tiếp `npx prisma generate` và `npx prisma db push`.

---

## Lỗi #2: Lỗi biên dịch TypeScript backend
- **Mô tả**: `tsc --noEmit` gặp lỗi `verbatimModuleSyntax`, thiếu `@prisma/client`, và type casting `req.params`.
- **Nguyên nhân**: Thiếu dependencies build và cấu hình TypeScript quá nghiêm ngặt.
- **Cách khắc phục**: Tắt `verbatimModuleSyntax` trong `tsconfig.json`, generate `@prisma/client`, thêm type casting `id as string` cho `req.params.id`.

---

## Lỗi #3: Chỉnh sửa hạn mức ngân sách không lưu (Budget Not Persisting)
- **Mô tả**: Người dùng bấm nút "Sửa" hạn mức tại tab "Ngân sách", nhập số tiền mới và lưu nhưng khi F5 tải lại trang hoặc mở lại trình duyệt thì dữ liệu bị mất, trở về giá trị mặc định ban đầu.
- **Nguyên nhân**:
  1. Biến state `budgets` trong `App.jsx` chỉ lưu trong bộ nhớ tạm React (RAM), chưa được serialize và ghi xuống `localStorage` hoặc Database.
  2. Tại `BudgetPage.jsx`, người dùng gõ số tiền và bấm phím `Enter` không kích hoạt lưu form do thiếu handler `onKeyDown`.
  3. Thiếu nút "Hủy" và không có thông báo (Toast) xác nhận thành công khiến người dùng không biết thao tác đã thực hiện hay chưa.
- **Cách khắc phục**:
  1. Trong `App.jsx`: Thêm hàm `loadBudgetsFromStorage(user)` và logic lưu tự động vào `localStorage` theo key `spendwise_budgets_${user.id}` mỗi khi gọi `updateBudget`. Tự động load lại khi user đăng nhập.
  2. Trong `BudgetPage.jsx`:
     - Bổ sung `onKeyDown`: Nhấn `Enter` để lưu ngay, `Escape` để hủy bỏ.
     - Bổ sung cụm nút `💾 Lưu` và `✕ Hủy` ngay cạnh ô nhập số tiền.
     - Bổ sung dòng xem trước giá trị VND realtime khi đang gõ.
     - Hiển thị Toast thông báo màu xanh `✅ Đã cập nhật hạn mức ngân sách thành công!`.
  3. Rebuild frontend bằng `npm run build` trên VPS và restart PM2 `chitieu`.

---

## Lỗi #4: Số liệu chi tiêu bị ghim cứng tháng cũ và tính dồn toàn bộ lịch sử khi sang tháng mới
- **Mô tả**: Khi người dùng chuyển sang tháng mới, giao diện Dashboard vẫn ghim cứng tiêu đề 'Tháng 08/2026' và toàn bộ số dư, tổng chi, biểu đồ và ngân sách tính gộp toàn bộ lịch sử thay vì tách riêng theo từng tháng.
- **Nguyên nhân**: Frontend thiếu bộ lọc thời gian động (MonthPicker) và các hàm tính toán số liệu (\stats\, \expenseByCategory\, \udgetData\, \weeklyData\) duyệt qua toàn bộ mảng \	ransactions\ mà không phân loại theo \month\ và \year\.
- **Cách khắc phục**:
  1. Xây dựng component \MonthPicker\ cho phép chọn nhanh tháng trước/tháng sau hoặc chọn bất kỳ tháng nào.
  2. Bổ sung state \selectedPeriod\ trong \App.jsx\ và lọc giao dịch theo đúng tháng/năm trước khi tính toán các chỉ số trên Dashboard, Danh sách giao dịch và Ngân sách.
  3. Bổ sung chế độ lọc theo khoảng ngày tuỳ chọn (Start Date - End Date) trong Danh sách giao dịch.
  4. Đóng gói và biên dịch lại frontend bằng Vite trên VPS.

---

## Lỗi #5: Menu chọn tháng (MonthPicker popover) bị các thẻ bên dưới che khuất
- **Mô tả**: Khi bấm mở dropdown chọn tháng trên thanh Header, menu hiển thị chìm dưới các thẻ thống kê (\summary-card\).
- **Nguyên nhân**: Header và container thiếu \position: relative\ với \z-index\ cao để tạo stacking context vượt lên trên các thẻ có CSS animation (\nimate-fade-in-up\).
- **Cách khắc phục**:
  1. Tăng \z-index\ của \.dashboard-header\ lên 1000 và \.month-picker-container\ lên 500.
  2. Gán \z-index: 9999\ và chuyển sang nền tối đặc \#101026\ cho \.month-picker-dropdown\. Căn lề \ight: 0\ để dropdown mở gọn gàng hướng vào trong màn hình.
  3. Rebuild và deploy live trên production.
