const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Đường dẫn đến model User của bạn

const router = express.Router();

// ===== Đăng ký tài khoản user =====
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: '❌ Email và mật khẩu là bắt buộc' });
    }

    // Kiểm tra email đã tồn tại chưa
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: '❌ Email đã tồn tại' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    await User.create({
      email,
      password: hashedPassword,
      role: 'user', // hoặc 'admin' nếu bạn có phân quyền
    });

    res.status(201).json({ message: '✅ Tạo tài khoản thành công' });
  } catch (error) {
    res.status(500).json({ message: '❌ Lỗi server', error: error.message });
  }
});

// ===== Đăng nhập user =====
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: '❌ Email không tồn tại' });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '❌ Mật khẩu sai' });
    }

    // Tạo token JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'vphone_secret_key',
      { expiresIn: '7d' }
    );

    res.status(200).json({ message: '✅ Đăng nhập thành công', token });
  } catch (error) {
    res.status(500).json({ message: '❌ Lỗi server', error: error.message });
  }
});

module.exports = router;
