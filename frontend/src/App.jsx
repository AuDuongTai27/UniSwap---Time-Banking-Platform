import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './style.css'; // MỚI: Nhúng file CSS vào đây!
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
// const GOOGLE_CLIENT_ID = 'ĐIỀN_LẠI_CÁI_CLIENT_ID_Ở_TRÊN_VÀO_ĐÂY';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
// --- COMPONENT: TRANG ĐĂNG NHẬP / ĐĂNG KÝ (SPLIT-SCREEN + FROST EFFECT) ---
const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // 1. LUỒNG GOOGLE: Phải khai báo ở ngoài cùng của Component
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.post('http://localhost:5000/api/google-auth', {
          access_token: tokenResponse.access_token,
        });
        localStorage.setItem('token', res.data.token);
        navigate('/');
      } catch (error) {
        setMessage(error.response?.data?.error || 'Xác thực Google thất bại từ Server!');
      }
    },
    onError: () => setMessage('Đăng nhập Google bị hủy.'),
  });

  // 2. LUỒNG EMAIL/PASS BÌNH THƯỜNG: Đã được khôi phục lại logic axios
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'http://localhost:5000/api/login' : 'http://localhost:5000/api/register';
    
    try {
      const response = await axios.post(endpoint, { email, password });
      
      if (isLogin) {
        localStorage.setItem('token', response.data.token);
        navigate('/'); 
      } else {
        setMessage('Đăng ký thành công! Vui lòng đăng nhập.');
        setIsLogin(true); 
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Có lỗi xảy ra!');
    }
  };  
  return (
    <div className="auth-container">
      {/* CỘT TRÁI: THÔNG TIN DỰ ÁN & TEAM */}
      <div className="left-column">
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '10px' }}>UniSwap.</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '40px', lineHeight: '1.6' }}>
            Nền tảng Trao đổi Kỹ năng & Thời gian (Time Banking) dành riêng cho sinh viên. Đảm bảo giao dịch an toàn với cơ chế Ký quỹ (Escrow).
          </p>
          
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '10px', marginBottom: '15px' }}>Đội ngũ phát triển</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '2' }}>
              <li>👨‍💻 <strong>Âu Dương Tài</strong> - Tech Lead / Backend</li>
              <li>👨‍💼 <strong>Huỳnh Khánh Duy</strong> - Business Analyst</li>
              <li>👩‍💻 <strong>Nguyễn Thị Diễm My</strong> - Product Owner</li>
              <li>🎨 <strong>Hoàng Quốc Việt</strong> - UI/UX Designer</li>
              <li>💻 <strong>Nguyễn Minh Mẫn</strong> - Frontend Developer</li>
              <li>👩‍💻 <strong>Trần Mạnh Tuấn</strong> - Scrum Master</li>
            </ul>
            
            <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
              <a href="#" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <svg height="24" width="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
                GitHub Repo
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: FORM ĐĂNG NHẬP / ĐĂNG KÝ */}
      <div className="right-column">
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
            {isLogin ? 'Chào mừng trở lại! 👋' : 'Tạo tài khoản mới 🚀'}
          </h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>
            {isLogin ? 'Vui lòng đăng nhập để tiếp tục.' : 'Đăng ký bằng email sinh viên EIU.'}
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label>Email</label>
              <input 
                type="email" placeholder="example@eiu.edu.vn" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
              />
            </div>
            
            <div className="input-group">
              <label>Mật khẩu</label>
              <input 
                type="password" placeholder="••••••••" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
              />
            </div>

            {message && <p style={{ color: message.includes('thành công') ? 'green' : '#e74c3c', margin: 0, fontSize: '14px', fontWeight: '500' }}>{message}</p>}

            <button type="submit" className="submit-button">
              {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
            </button>
          </form>

          <div className="divider">
            <hr />
            <span>HOẶC</span>
            <hr />
          </div>

          {/* Nút Đăng nhập Google */}
          <button 
            type="button" 
            onClick={() => loginWithGoogle()} 
            className="google-button"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            </svg>
            Tiếp tục với Google
          </button>

          <p style={{ textAlign: 'center', marginTop: '25px', color: '#666' }}>
            {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
            <span onClick={() => setIsLogin(!isLogin)} className="auth-link">
              {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: TRANG INDEX ---
const IndexPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/login" />;

  let user;
  try {
    user = jwtDecode(token);
  } catch {
    localStorage.removeItem('token');
    return <Navigate to="/login" />;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: '"Segoe UI", sans-serif' }}>
      <h1>{user.role === 'ADMIN' ? '🛠️ ADMIN DASHBOARD' : '🎓 STUDENT MARKETPLACE'}</h1>
      <p>Xin chào, <strong>{user.email}</strong>!</p>
      <p>Bạn đang đăng nhập với quyền: <strong>{user.role}</strong></p>
      <button onClick={handleLogout} style={{ padding: '10px 20px', marginTop: '20px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Đăng Xuất
      </button>
    </div>
  );
};

// --- ROUTER CHÍNH ---
export default function App() {
  return (
    // Bọc toàn bộ App bằng Provider của Google
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/" element={<IndexPage />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}