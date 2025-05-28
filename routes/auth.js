// ===== Đăng nhập user (Test luôn thành công) =====
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Nếu không tìm thấy user, tạo tạm user mới để test luôn đăng nhập thành công
      const newUser = await User.create({
        email,
        password: await bcrypt.hash(password, 10),
        role: 'user',
      });
      const token = jwt.sign(
        {
          id: newUser._id,
          email: newUser.email,
          role: newUser.role,
        },
        process.env.JWT_SECRET || 'vphone_secret_key',
        { expiresIn: '7d' }
      );
      return res.status(200).json({ message: '✅ Đăng nhập thành công (Test)', token });
    }

    // Bỏ qua kiểm tra mật khẩu để test luôn thành công
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'vphone_secret_key',
      { expiresIn: '7d' }
    );

    res.status(200).json({ message: '✅ Đăng nhập thành công (Test)', token });
  } catch (err) {
    res.status(500).json({ message: '❌ Lỗi server', error: err.message });
  }
});
