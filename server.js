const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Inventory = require('./models/Inventory');
const authRoutes = require('./routes/auth');           // Đường dẫn đúng tới file auth.js
const userRoutes = require('./routes/user');
const reportRoutes = require('./routes/report');
const branchRoutes = require('./routes/branch');
const categoryRoutes = require('./routes/category');
const congNoRoutes = require('./routes/congno');
const adminRoutes = require('./routes/admin');

const app = express();

// Danh sách origin frontend được phép truy cập API backend
const allowedOrigins = [
  'http://localhost:5174',
  'https://chinhthuc-jade.vercel.app',
  'https://chinhthuc-git-main-vphone24hs-projects.vercel.app',
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // Cho phép Postman, Mobile apps ko có origin
    if (!allowedOrigins.includes(origin)) {
      const msg = '❌ CORS bị chặn: ' + origin;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.options('*', cors());
app.use(express.json()); // parse application/json

// Đăng ký các route API
app.use('/api/auth', authRoutes);      // Bắt buộc phải có để API login, register hoạt động
app.use('/api/user', userRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cong-no', congNoRoutes);
app.use('/api', adminRoutes);

// Bạn có thể thêm API nhập/xuất hàng ở đây nếu muốn, hoặc để trong routes khác

// Route test server
app.get('/', (req, res) => {
  res.send('🎉 Backend đang chạy!');
});

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Kết nối MongoDB thành công'))
.catch(err => console.error('❌ Kết nối MongoDB lỗi:', err));

// Khởi chạy server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
