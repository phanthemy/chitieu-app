# SpendWise - Frontend Memory

## Thông tin dự án
- **Tên**: SpendWise - Quản lý chi tiêu cá nhân
- **Stack**: React 18 + Vite 5 + Vanilla CSS
- **Thư mục**: `C:\Users\it\.gemini\antigravity\scratch\chitieu-app\frontend`
- **API Base URL**: `http://localhost:3001/api`
- **Dev server**: `http://localhost:5173`

## Cấu trúc thư mục
```
frontend/
├── index.html          # Entry HTML với Inter font, SEO meta
├── package.json        # React 18, Vite 5
├── vite.config.js      # Dev server config
└── src/
    ├── main.jsx        # React DOM entry
    ├── index.css       # Global design system (dark theme, glassmorphism, animations)
    ├── App.jsx         # Main app + hash router + state management
    ├── App.css         # App wrapper styles
    ├── components/
    │   ├── Navbar.jsx/css        # Top bar (desktop) + bottom bar (mobile)
    │   ├── TransactionCard.jsx/css # Card giao dịch + CategoryBadge
    │   └── Chart.jsx/css         # DonutChart, BarChart, ProgressBar, Sparkline
    └── pages/
        ├── LoginPage.jsx/css     # Đăng nhập/đăng ký
        ├── Dashboard.jsx/css     # Tổng quan tài chính
        ├── TransactionList.jsx/css # Danh sách giao dịch + filter
        ├── AddTransaction.jsx/css  # Form thêm giao dịch
        └── BudgetPage.jsx/css     # Quản lý ngân sách
```

## Design Decisions (Premium Fintech UI Update)
- **Màu sắc**: Dark theme với background #0B0D17 (deep navy), card #131627
- **Glassmorphism**: blur 12px cho cards và navbar
- **Gradient accents**: linear-gradient(135deg, #667EEA, #764BA2)
- **Typography**: Outfit cho headings, Inter cho body, Space Mono cho số tiền
- **Icons**: Sử dụng lucide-react thay cho emoji
- **Micro-animations**: fadeIn, translateY cho hover effects mượt mà
- **Responsive**: Vertical sidebar bên trái (desktop), fixed bottom bar (mobile)
- **Hash-based routing**: không cần react-router, đơn giản
- **Demo data**: 10 giao dịch mẫu + 6 budget categories
- **VND currency**: Intl.NumberFormat('vi-VN')

## Công nghệ biểu đồ (All SVG)
- **DonutChart**: SVG `<circle>` với stroke-dasharray animation mượt mà
- **BarChart**: SVG `<rect>` với gradient fills và rounded corners
- **Sparkline**: SVG `<polygon>` và `<polyline>`
- **ProgressBar**: SVG/CSS progress bars
- **Gauge**: SVG nửa vòng tròn cho overview ngân sách

## Ngày tạo
- 2026-08-04

## Lỗi đã gặp
- Vite 8.x không tương thích Node 20.17.0 → downgrade Vite 5.4 + React 18
- useState dùng sai cho side effects → fix useEffect

## QA Phase
- Hoàn tất kiểm tra Frontend Redesign.
- Kết quả: PASS.
- Không tìm thấy lỗi syntax, không còn emoji. Biến CSS và Lucide icons đã chính xác.
