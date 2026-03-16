require('dotenv').config(); // Bắt buộc phải nằm trên cùng
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const app = express();
app.use(express.json());
app.use(cors());

// Thay vì fix cứng: const JWT_SECRET = '...';
const JWT_SECRET = process.env.JWT_SECRET;

// Thay vì fix cứng: const GOOGLE_CLIENT_ID = '...';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// Cấu hình Database cũng lấy từ .env cho an toàn
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// API 1: ĐĂNG KÝ (REGISTER)
app.post('/api/register', async (req, res) => {
    const { email, password, name } = req.body; // ✅ thêm name

    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
    }

    if (!email.endsWith('@eiu.edu.vn')) {
        return res.status(400).json({ error: 'Chỉ chấp nhận email sinh viên @eiu.edu.vn' });
    }

    const role = (email === 'tai.au.cit23@eiu.edu.vn') ? 'ADMIN' : 'CLIENT';

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            'INSERT INTO users (email, password_hash, role, name) VALUES (?, ?, ?, ?)', // ✅ thêm name
            [email, hashedPassword, role, name] // ✅ thêm name
        );
        res.status(201).json({ message: 'Đăng ký thành công!', role: role });
    } catch (error) {
        console.error("LỖI ĐĂNG KÝ:", error.message);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Email này đã được đăng ký!' });
        }
        res.status(500).json({ error: error.message });
    }
});

// API 2: ĐĂNG NHẬP (LOGIN)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Tìm user trong DB
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Sai email hoặc mật khẩu' });
        }

        const user = rows[0];

        // So sánh Password Hash
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Sai email hoặc mật khẩu' });
        }

        // Tạo JWT Token chứa thông tin user (để frontend dùng điều hướng)
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Đăng nhập thành công', token, role: user.role });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server' });
    }
});
// API 3: ĐĂNG NHẬP / ĐĂNG KÝ BẰNG GOOGLE (Luồng access_token)
app.post('/api/google-auth', async (req, res) => {
    const { access_token } = req.body;

    try {
        // 1. Cầm access_token chạy lên server Google để xin thông tin User (Dùng fetch mặc định của Node)
        const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        const payload = await googleRes.json();

        // Trích xuất email từ Google trả về
        const email = payload.email;

        if (!email) {
            return res.status(400).json({ error: 'Không lấy được email từ Google' });
        }

        // 2. RULE 1: Chặn đứng nếu không phải mail trường
        if (!email.endsWith('@eiu.edu.vn')) {
            return res.status(403).json({ error: 'Chỉ chấp nhận email sinh viên @eiu.edu.vn' });
        }

        // 3. RULE 2: Gán quyền
        const role = (email === 'tai.au.cit23@eiu.edu.vn') ? 'ADMIN' : 'CLIENT';

        // 4. Kiểm tra xem user này đã có trong Database chưa?
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        let userId;

        if (rows.length === 0) {
            // NẾU CHƯA CÓ: Tự động Đăng ký (Register)
            const [result] = await pool.query(
                'INSERT INTO users (email, password_hash, role, credits_earned) VALUES (?, ?, ?, ?)',
                [email, 'GOOGLE_AUTH_NO_PASSWORD', role, 2] // ✅ mặc định 2 credits
            );
            userId = result.insertId;
        } else {
            // NẾU CÓ RỒI: Lấy ID ra để Đăng nhập
            userId = rows[0].id;
        }

        // 5. Cấp thẻ vào cửa (JWT) của hệ thống UniSwap
        const token = jwt.sign(
            { id: userId, email: email, role: role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Google Auth thành công', token, role });
    } catch (error) {
        console.error("Lỗi Google Auth:", error);
        res.status(500).json({ error: 'Lỗi server khi xác thực Google!' });
    }
});
// // API 4: gui du lieu cho front end (fletch)
// app.get('/api/services', async (req, res) => {
//     try {
//         const [rows] = await pool.query(`
//       SELECT s.*, u.name as provider_name, u.avatar as provider_avatar, u.rating as provider_rating
//       FROM services s
//       JOIN users u ON s.user_id = u.id
//     `);
//         res.json(rows);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
//API 5
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Không có token' });
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Token không hợp lệ' });
        req.user = decoded;
        next();
    });
};

//API 6 Lấy thông tin user hiện tại
app.get('/api/me', verifyToken, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    res.json(rows[0]);
});

// API 7: Lấy tất cả services (ẩn service đã có người confirm/complete)
app.get('/api/services', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.*, 
        u.name as provider_name, u.avatar as provider_avatar,
        u.rating as provider_rating, u.total_reviews as provider_total_reviews,
        u.status as provider_status, u.is_verified as provider_verified,
        u.credits_earned as provider_credits_earned
      FROM services s JOIN users u ON s.user_id = u.id
      WHERE s.id NOT IN (
        SELECT service_id FROM bookings 
        WHERE status IN ('confirmed', 'completed')
      )
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//API 8 Lấy 1 service theo id
app.get('/api/services/:id', verifyToken, async (req, res) => {
    const [rows] = await pool.query(`
    SELECT s.*, 
      u.name as provider_name, u.avatar as provider_avatar,
      u.rating as provider_rating, u.total_reviews as provider_total_reviews,
      u.status as provider_status, u.is_verified as provider_verified,
      u.credits_earned as provider_credits_earned
    FROM services s JOIN users u ON s.user_id = u.id
    WHERE s.id = ?
  `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Service not found' });
    res.json(rows[0]);
});

//API 9 Reviews của 1 service
app.get('/api/services/:id/reviews', verifyToken, async (req, res) => {
    const [rows] = await pool.query(`
    SELECT r.*, u.name as reviewer_name, u.avatar as reviewer_avatar
    FROM reviews r
    JOIN bookings b ON r.booking_id = b.id
    JOIN users u ON r.reviewer_id = u.id
    WHERE b.service_id = ?
  `, [req.params.id]);
    res.json(rows);
});

//API 10 Services của current user
app.get('/api/my-services', verifyToken, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM services WHERE user_id = ?', [req.user.id]);
    res.json(rows);
});

//API 11 Reviews nhận được của current user
app.get('/api/my-reviews', verifyToken, async (req, res) => {
    const [rows] = await pool.query(`
    SELECT r.*, u.name as reviewer_name, u.avatar as reviewer_avatar
    FROM reviews r JOIN users u ON r.reviewer_id = u.id
    WHERE r.reviewed_user_id = ?
  `, [req.user.id]);
    res.json(rows);
});

//API 12 Post service mới
app.post('/api/services', verifyToken, async (req, res) => {
    const { title, description, category, duration, credits_per_hour, total_credits } = req.body;
    const [result] = await pool.query(
        'INSERT INTO services (user_id, title, description, category, duration, credits_per_hour, total_credits) VALUES (?,?,?,?,?,?,?)',
        [req.user.id, title, description, category, duration, credits_per_hour, total_credits]
    );
    res.status(201).json({ id: result.insertId });
});

//API 13 Bookings của current user (với role requester)
app.get('/api/bookings/my-requests', verifyToken, async (req, res) => {
  const [rows] = await pool.query(`
    SELECT b.*, 
      s.title as service_title, s.image as service_image, s.category as service_category,
      u.name as other_user_name, u.avatar as other_user_avatar,
      IF(r.id IS NOT NULL, 1, 0) as has_reviewed  -- ✅ check đã review chưa
    FROM bookings b
    JOIN services s ON b.service_id = s.id
    JOIN users u ON b.provider_id = u.id
    LEFT JOIN reviews r ON r.booking_id = b.id AND r.reviewer_id = ?  -- ✅
    WHERE b.requester_id = ?
    ORDER BY b.created_at DESC
  `, [req.user.id, req.user.id]);
  res.json(rows);
});

//API 14 Bookings của current user (với role provider)
app.get('/api/bookings/my-offers', verifyToken, async (req, res) => {
  const [rows] = await pool.query(`
    SELECT b.*, 
      s.title as service_title, s.image as service_image, s.category as service_category,
      u.name as other_user_name, u.avatar as other_user_avatar,
      IF(r.id IS NOT NULL, 1, 0) as has_reviewed
    FROM bookings b
    JOIN services s ON b.service_id = s.id
    JOIN users u ON b.requester_id = u.id
    LEFT JOIN reviews r ON r.booking_id = b.id AND r.reviewer_id = ?
    WHERE b.provider_id = ?
    ORDER BY b.created_at DESC
  `, [req.user.id, req.user.id]);
  res.json(rows);
});

//API 15 Tạo booking mới
app.post('/api/bookings', verifyToken, async (req, res) => {
    const { service_id, provider_id, scheduled_date, message, credits_amount } = req.body;
    const [result] = await pool.query(
        'INSERT INTO bookings (service_id, provider_id, requester_id, scheduled_date, message, credits_amount) VALUES (?,?,?,?,?,?)',
        [service_id, provider_id, req.user.id, scheduled_date, message, credits_amount]
    );
    res.status(201).json({ id: result.insertId });
});
// API 16: Cập nhật trạng thái booking + ESCROW LOGIC
app.patch('/api/bookings/:id/:action', verifyToken, async (req, res) => {
  const statusMap = { confirm: 'confirmed', cancel: 'cancelled', complete: 'completed' };
  const status = statusMap[req.params.action];
  if (!status) return res.status(400).json({ error: 'Invalid action' });

  try {
    // Lấy booking TRƯỚC khi update (để biết status cũ)
    const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    const booking = rows[0];
    const oldStatus = booking.status;

    // Update status
    await pool.query('UPDATE bookings SET status = ? WHERE id = ?', [status, req.params.id]);

    // ESCROW 1: Khi confirm → GIỮ credits của requester (trừ vào credits_spent tạm)
    if (status === 'confirmed' && oldStatus === 'pending') {
      await pool.query(
        'UPDATE users SET credits_spent = credits_spent + ? WHERE id = ?',
        [booking.credits_amount, booking.requester_id]
      );
    }

    // ESCROW 2: Khi complete → CỘNG credits cho provider
    if (status === 'completed' && oldStatus === 'confirmed') {
      // await pool.query(
      //   'UPDATE users SET credits_earned = credits_earned + ? WHERE id = ?',
      //   [booking.credits_amount, booking.provider_id]
      // );
    }

    // ESCROW 3: Khi cancel sau confirmed → HOÀN credits cho requester
    if (status === 'cancelled' && oldStatus === 'confirmed') {
      await pool.query(
        'UPDATE users SET credits_spent = credits_spent - ? WHERE id = ?',
        [booking.credits_amount, booking.requester_id]
      );
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//API 17 Lấy thông tin 1 user bất kỳ
app.get('/api/users/:id', verifyToken, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
});

//API 18 Services của 1 user bất kỳ
app.get('/api/users/:id/services', verifyToken, async (req, res) => {
    const [rows] = await pool.query(`
    SELECT s.*, u.name as provider_name, u.avatar as provider_avatar,
      u.rating as provider_rating, u.total_reviews as provider_total_reviews
    FROM services s JOIN users u ON s.user_id = u.id
    WHERE s.user_id = ?
  `, [req.params.id]);
    res.json(rows);
});

//API 19 Reviews của 1 user bất kỳ
app.get('/api/users/:id/reviews', verifyToken, async (req, res) => {
    const [rows] = await pool.query(`
    SELECT r.*, u.name as reviewer_name, u.avatar as reviewer_avatar
    FROM reviews r JOIN users u ON r.reviewer_id = u.id
    WHERE r.reviewed_user_id = ?
  `, [req.params.id]);
    res.json(rows);
});
//API 20  Cập nhật thông tin profile
app.patch('/api/me', verifyToken, async (req, res) => {
    const { name, age, status, bio, avatar, skills_offered, skills_needed } = req.body;
    try {
        await pool.query(
            `UPDATE users SET name=?, age=?, status=?, bio=?, avatar=?, skills_offered=?, skills_needed=? WHERE id=?`,
            [name, age, status, bio, avatar,
                JSON.stringify(skills_offered),
                JSON.stringify(skills_needed),
                req.user.id]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//API 21 Đổi mật khẩu
app.patch('/api/me/password', verifyToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
        const user = rows[0];

        // Google auth user không có password
        if (user.password_hash === 'GOOGLE_AUTH_NO_PASSWORD') {
            return res.status(400).json({ error: 'Tài khoản Google không thể đổi mật khẩu' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) return res.status(400).json({ error: 'Mật khẩu hiện tại không đúng' });

        const hashed = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password_hash=? WHERE id=?', [hashed, req.user.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//API 22 Upload avatar (base64)
app.patch('/api/me/avatar', verifyToken, async (req, res) => {
    const { avatar } = req.body;
    try {
        await pool.query('UPDATE users SET avatar=? WHERE id=?', [avatar, req.user.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// //API 23
// app.patch('/api/bookings/:id/:action', verifyToken, async (req, res) => {
//   const statusMap = { confirm: 'confirmed', cancel: 'cancelled', complete: 'completed' };
//   const status = statusMap[req.params.action];
//   if (!status) return res.status(400).json({ error: 'Invalid action' });

//   try {
//     await pool.query('UPDATE bookings SET status = ? WHERE id = ?', [status, req.params.id]);

//     // ✅ ESCROW: Khi complete → chuyển credits từ requester sang provider
//     if (status === 'completed') {
//       const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
//       const booking = rows[0];

//       // Trừ credits của requester
//       await pool.query(
//         'UPDATE users SET credits_spent = credits_spent + ? WHERE id = ?',
//         [booking.credits_amount, booking.requester_id]
//       );

//       // Cộng credits cho provider
//       await pool.query(
//         'UPDATE users SET credits_earned = credits_earned + ? WHERE id = ?',
//         [booking.credits_amount, booking.provider_id]
//       );
//     }

//     // ✅ Khi cancel → hoàn credits cho requester (nếu đã confirmed)
//     if (status === 'cancelled') {
//       const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
//       const booking = rows[0];
//       if (booking.status === 'confirmed') {
//         await pool.query(
//           'UPDATE users SET credits_spent = credits_spent - ? WHERE id = ?',
//           [booking.credits_amount, booking.requester_id]
//         );
//       }
//     }

//     res.json({ success: true });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
//APi 24
app.post('/api/reviews', verifyToken, async (req, res) => {
  const { booking_id, reviewed_user_id, rating, comment } = req.body;
  try {
    const [existing] = await pool.query(
      'SELECT id FROM reviews WHERE booking_id = ? AND reviewer_id = ?',
      [booking_id, req.user.id]
    );
    if (existing.length > 0) return res.status(400).json({ error: 'Đã đánh giá rồi' });

    await pool.query(
      'INSERT INTO reviews (booking_id, reviewer_id, reviewed_user_id, rating, comment) VALUES (?,?,?,?,?)',
      [booking_id, req.user.id, reviewed_user_id, rating, comment]
    );

    const [reviews] = await pool.query(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as total FROM reviews WHERE reviewed_user_id = ?',
      [reviewed_user_id]
    );
    await pool.query(
      'UPDATE users SET rating = ?, total_reviews = ? WHERE id = ?',
      [Number(reviews[0].avg_rating).toFixed(2), reviews[0].total, reviewed_user_id]
    );

    // ===== DEBUG =====
    const [booking] = await pool.query('SELECT * FROM bookings WHERE id = ?', [booking_id]);
    const b = booking[0];
    console.log('📦 Booking:', b);

    const [allReviews] = await pool.query(
      'SELECT reviewer_id FROM reviews WHERE booking_id = ?',
      [booking_id]
    );
    const reviewerIds = allReviews.map(r => Number(r.reviewer_id));
    console.log('📝 Reviewer IDs đã review:', reviewerIds);
    console.log('👤 requester_id:', b.requester_id, typeof b.requester_id);
    console.log('👤 provider_id:', b.provider_id, typeof b.provider_id);
    console.log('✅ bothReviewed:', 
      reviewerIds.includes(Number(b.requester_id)), 
      reviewerIds.includes(Number(b.provider_id))
    );
    // ===== END DEBUG =====

    const bothReviewed = 
      reviewerIds.includes(Number(b.requester_id)) && 
      reviewerIds.includes(Number(b.provider_id));

    if (bothReviewed) {
      console.log('💰 Đang cộng credits cho provider:', b.provider_id, '+', b.credits_amount);
      await pool.query(
        'UPDATE users SET credits_earned = credits_earned + ? WHERE id = ?',
        [b.credits_amount, b.provider_id]
      );
      await pool.query(
        'UPDATE bookings SET credits_settled = 1 WHERE id = ?',
        [booking_id]
      );
      console.log('✅ Credits đã cộng xong!');
    }

    res.status(201).json({ success: true, bothReviewed, message: bothReviewed 
      ? 'Credits đã cập nhật!' 
      : 'Đang chờ đối phương đánh giá...' 
    });
  } catch (error) {
    console.error('❌ Lỗi:', error);
    res.status(500).json({ error: error.message });
  }
});
app.listen(5000, () => console.log('Backend đang chạy tại http://localhost:5000'));