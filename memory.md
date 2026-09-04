# SpendWise - Project Memory & Architecture

## 📌 Thông tin dự án
- **Tên dự án**: SpendWise - Quản lý chi tiêu & Ngân sách cá nhân
- **Domain Production**: `https://qlchitieu.nextapp.vn`
- **Thư mục VPS**: `/var/www/chitieu`
- **Frontend Path**: `/var/www/chitieu/frontend`
- **Backend Path**: `/var/www/chitieu/src`
- **Database**: PostgreSQL (`chitieu_db`, user `erp`, port 5432)
- **Process Manager**: PM2 (`chitieu`, port 3000, script `dist/index.js`)
- **Web Server**: Nginx SSL (`/etc/nginx/sites-enabled/qlchitieu.nextapp.vn`)

---

## 🛠️ Công nghệ & Kiến trúc (Tech Stack)
- **Frontend**: React 18, Vite 5, Vanilla CSS Design System (Glassmorphism, Dark Purple Theme `#0a0a1a`, Inter Font)
- **State Management**: React Hooks + Hash Routing (`#login`, `#dashboard`, `#transactions`, `#add`, `#budget`)
- **Storage Strategy**:
  - Auth token & User info: `localStorage.getItem('token')`, `localStorage.getItem('user')`
  - Budget limits persistence: `localStorage` theo key `spendwise_budgets_${userId}` và fallback `spendwise_budgets`
- **Charts & Visualization**:
  - `DonutChart`: CSS conic-gradient thuần
  - `BarChart` & `Sparkline`: HTML5 Canvas với gradient stroke
  - `ProgressBar`: CSS animated bars
  - `BudgetRing`: SVG dynamic stroke-dasharray

---

## 📁 Cấu trúc thư mục
```
/var/www/chitieu/
├── .env                  # DATABASE_URL, JWT_SECRET, PORT=3000
├── package.json          # Express, Prisma, TypeScript
├── tsconfig.json         # TypeScript backend config
├── deploy.sh             # Script deploy tự động
├── loi.md                # Nhật ký lỗi và giải pháp
├── memory.md             # Tài liệu kiến trúc và tiến độ
├── prisma/
│   └── schema.prisma     # User, Category, Transaction, Budget models
├── src/
│   ├── index.ts          # Express server entry point
│   ├── middleware/
│   │   └── auth.ts       # JWT verify middleware
│   └── routes/
│       ├── auth.ts       # Register, Login endpoints
│       ├── categories.ts # Category CRUD
│       ├── transactions.ts # Transaction CRUD
│       ├── budgets.ts    # Budget API
│       └── reports.ts   # Report data
└── frontend/
    ├── package.json      # React 18 + Vite 5
    ├── vite.config.js    # Vite build config (proxy /api -> :3000)
    ├── dist/             # Production build output
    └── src/
        ├── App.jsx       # Global router, user auth state, budget local persistence
        ├── index.css     # Design tokens, dark theme, glass cards, toast styles
        ├── components/
        │   ├── Navbar.jsx / Navbar.css
        │   ├── TransactionCard.jsx / TransactionCard.css
        │   └── Chart.jsx / Chart.css
        └── pages/
            ├── LoginPage.jsx / LoginPage.css
            ├── Dashboard.jsx / Dashboard.css
            ├── TransactionList.jsx / TransactionList.css
            ├── AddTransaction.jsx / AddTransaction.css
            └── BudgetPage.jsx / BudgetPage.css
```

---

## 🕒 Lịch sử cập nhật & Quyết định thiết kế
### Ngày 21/08/2026:
- **Sửa lỗi lưu hạn mức ngân sách**:
  - Thêm cơ chế đồng bộ và nạp hạn mức ngân sách từ `localStorage` (`loadBudgetsFromStorage` và `saveBudgets`) theo từng tài khoản `user.id`.
  - Cải tiến UX form nhập liệu trên `BudgetPage.jsx`: hỗ trợ phím `Enter` để lưu, phím `Escape` để hủy, xem trước số tiền VND realtime.
  - Thêm nút `💾 Lưu` và `✕ Hủy` trực quan, hiển thị Toast xanh thông báo khi cập nhật hạn mức thành công.
  - Rebuild Vite frontend và restart PM2 `chitieu` trên production server `qlchitieu.nextapp.vn`.

### Ngày 04/09/2026:
- **Tính năng Lọc & Xem lại Chi tiêu theo Thời gian (Tháng/Năm & Khoảng ngày)**:
  - Tạo mới component \MonthPicker\ (\MonthPicker.jsx\ & \MonthPicker.css\) với giao diện Glassmorphic tím thẫm đồng bộ, hỗ trợ nút bấm chuyển nhanh tháng trước/tháng sau (\‹\ và \›\), nút quay về tháng hiện tại (\Tháng này\), và dropdown chọn tháng (1 - 12), năm (2024 - 2027) hoặc xem \Tất cả thời gian\.
  - Cập nhật \Dashboard.jsx\: Bỏ tiêu đề ghim cứng tháng cũ (\Tháng 08/2026\), chuyển sang hiển thị động theo tháng được chọn. Tính toán toàn bộ số liệu thống kê, biểu đồ Donut danh mục, biểu đồ tuần và ngân sách theo đúng giao dịch của tháng đó.
  - Cập nhật \TransactionList.jsx\: Bổ sung bộ lọc Thời gian (chế độ lọc theo Tháng/Năm và chế độ lọc theo Khoảng ngày từ ngày - đến ngày), thống kê tổng thu chi theo đúng mốc thời gian lọc.
  - Cập nhật \BudgetPage.jsx\: Tích hợp \MonthPicker\ giúp người dùng theo dõi hạn mức và số tiền đã chi riêng biệt theo từng tháng (sang tháng mới bắt đầu tính lại từ 0đ).
  - Cập nhật \App.jsx\: Quản lý state \selectedPeriod\ dùng chung cho các màn hình. Rebuild Vite frontend và deploy live trên \https://qlchitieu.nextapp.vn\.

- **Bổ sung danh mục 'Chi tiêu khác' (other) và 'Nhà ở' (rent) vào Quản lý Ngân sách**:
  - Thêm \Chi tiêu khác\ (\📦\) và \Nhà ở\ (\🏠\) vào \DEFAULT_BUDGETS\ trong \App.jsx\.
  - Cập nhật logic tính toán ngân sách (\BudgetPage.jsx\ & \Dashboard.jsx\): Gom toàn bộ các giao dịch phân loại 'Khác', 'Khác (Chi)' hoặc chi tiêu chưa gán danh mục vào mục 'Chi tiêu khác' để tổng tiền khớp chính xác 100% với tổng chi tiêu thực tế.
  - Hỗ trợ xem, chỉnh sửa hạn mức và theo dõi tiến độ chi tiêu của mục 'Chi tiêu khác'.
