
cd /var/www/chitieu
sudo -u postgres createdb chitieu_db || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE chitieu_db TO erp;"
echo "DATABASE_URL=postgresql://erp:erp_dev_2026@localhost:5432/chitieu_db" > .env
echo "JWT_SECRET=supersecret123" >> .env
npm install
npx prisma generate
npx prisma db push --accept-data-loss || true
npx prisma db seed || true
npm run build
pm2 delete chitieu || true
pm2 start dist/index.js --name chitieu

