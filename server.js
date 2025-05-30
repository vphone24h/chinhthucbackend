// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const reportRoutes = require('./routes/report');
const branchRoutes = require('./routes/branch');
const categoryRoutes = require('./routes/category');
const congNoRoutes = require('./routes/congno');

const app = express();

// Danh sách domain frontend được phép truy cập backend
const allowedOrigins = [
  'http://localhost:5174',
  'https://vphone-pw2zoudi6-vphone24hs-projects.vercel.app',
  'https://iphone-inventory-frontend.vercel.app',
  'https://chinhthuc-jade.vercel.app',  // Thêm domain này
];

// Cấu hình CORS
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // cho Postman hoặc mobile apps
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS bị chặn: ' + origin));
    }
  },
  credentials: true, // Cho phép gửi cookie, header Authorization
}));

// Xử lý preflight request
app.options('*', cors());

// Xử lý body json
app.use(express.json());

// Đăng ký các route API
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cong-no', congNoRoutes);

// Test API gốc
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

// Chạy server trên port 4000 hoặc biến môi trường PORT
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
