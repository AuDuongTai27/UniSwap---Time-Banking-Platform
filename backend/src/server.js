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
    const { email, password } = req.body;

    // RULE 1: Chỉ cho phép mail @eiu.edu.vn
    if (!email.endsWith('@eiu.edu.vn')) {
        return res.status(400).json({ error: 'Chỉ chấp nhận email sinh viên @eiu.edu.vn' });
    }

    // RULE 2: Gán quyền Admin cho Âu Dương Tài
    const role = (email === 'tai.au.cit23@eiu.edu.vn') ? 'ADMIN' : 'CLIENT';

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Lưu vào DB
        const [result] = await pool.query(
            'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
            [email, hashedPassword, role]
        );
        res.status(201).json({ message: 'Đăng ký thành công!', role: role });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Email này đã được đăng ký!' });
        }
        res.status(500).json({ error: 'Lỗi server' });
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
                'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
                [email, 'GOOGLE_AUTH_NO_PASSWORD', role]
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
app.listen(5000, () => console.log('Backend đang chạy tại http://localhost:5000'));