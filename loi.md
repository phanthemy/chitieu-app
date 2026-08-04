# Log Lỗi

- **Lỗi**: `npx prisma init` thất bại với thông báo `A folder called prisma already exists in your project. Please try again in a project that is not yet using Prisma.`
- **Nguyên nhân**: Do file `prisma/schema.prisma` đã được tạo tự động bằng agent trước khi lệnh `npx prisma init` trong background task kịp chạy.
- **Cách khắc phục**: Bỏ qua vì file `schema.prisma` và `.env` đã được chủ động tạo đúng cấu trúc yêu cầu. Không ảnh hưởng đến dự án.

- **Lỗi**: Backend tsc --noEmit thất bại với các lỗi liên quan đến tsconfig (verbatimModuleSyntax), thiếu @prisma/client, và type casting.
- **Nguyên nhân**: Chưa generate prisma client, cấu hình tsconfig.json khắt khe (verbatimModuleSyntax), và xử lý req.params chưa an toàn, thiếu type cho biến t trong filter.
- **Cách khắc phục**: Tắt `verbatimModuleSyntax` trong tsconfig.json, cài đặt và generate `@prisma/client`, thêm type casting `id as string` cho `req.params.id`, và khai báo `t: any` trong route reports.

- **Lỗi**: `vite build` thất bại: `"Chrome" is not exported by "lucide-react"` trong LoginPage.jsx
- **Nguyên nhân**: Sub-agent dùng `Chrome` icon từ lucide-react nhưng icon này không tồn tại trong thư viện. Lucide dùng tên icon khác.
- **Cách khắc phục**: Thay `Chrome` bằng `Globe` icon từ lucide-react cho nút "Tiếp tục với Google".

- **[2026-08-04 22:02] [QA]** Lỗi: Site trắng tinh trên production - JS/CSS không load được
- **Nguyên nhân**: Folder `assets/` trên VPS có permission `drwx------` (700) → Nginx worker chạy user `www-data` không đọc được file. Do `scp` tạo folder với umask restrictive.
- **Cách khắc phục**: `chmod -R 755 /var/www/chitieu/frontend/dist/` + restart nginx. Thêm Cloudflare cache cần purge vì đã cache response lỗi.
- **Bài học**: QA cần verify VISUAL trên production (chụp screenshot), không chỉ check build pass.
