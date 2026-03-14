import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import './style/style.css';

import { Root } from './app/pages/root';
import { Home } from './app/pages/home';
import { ServiceDetail } from './app/pages/service-detail';
import { Profile } from './app/pages/profile';
import { UserProfile } from './app/pages/user-profile';
import { MyActivity } from './app/pages/my-activity';
import { PostService } from './app/pages/post-service';
import { HowItWorks } from './app/pages/how-it-works';
import { NotFound } from './app/pages/not-found';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

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

  // ✅ SỬA: thêm name vào body khi đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'http://localhost:5000/api/login' : 'http://localhost:5000/api/register';
    
    try {
      const body = isLogin ? { email, password } : { email, password, name };
      const response = await axios.post(endpoint, body);
      
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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 p-4 font-sans">
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
        
        <div className="hidden md:flex p-12 flex-col justify-center text-white">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg tracking-tight">UniSwap.</h1>
          <p className="text-lg font-light opacity-90 mb-8 leading-relaxed">
            Nền tảng Trao đổi Kỹ năng & Thời gian (Time Banking) dành riêng cho sinh viên. Đảm bảo giao dịch an toàn với cơ chế Ký quỹ (Escrow).
          </p>
          
          <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/10">
            <h3 className="text-xl font-semibold border-b border-white/30 pb-3 mb-4">Đội ngũ phát triển</h3>
            <ul className="space-y-2 opacity-90">
              <li>👨‍💻 <strong>Âu Dương Tài</strong> - Tech Lead / Backend</li>
              <li>👨‍💼 <strong>Huỳnh Khánh Duy</strong> - Business Analyst</li>
              <li>👩‍💻 <strong>Nguyễn Thị Diễm My</strong> - Product Owner</li>
              <li>🎨 <strong>Hoàng Quốc Việt</strong> - UI/UX Designer</li>
              <li>💻 <strong>Nguyễn Minh Mẫn</strong> - Frontend Developer</li>
              <li>👩‍💻 <strong>Trần Mạnh Tuấn</strong> - Scrum Master</li>
            </ul>
            
            <a href="#" className="inline-flex items-center gap-2 mt-6 bg-white/20 hover:bg-white/30 transition px-4 py-2 rounded-lg font-medium">
              <svg height="20" width="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
              GitHub Repo
            </a>
          </div>
        </div>

        <div className="bg-white p-10 md:p-14 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {isLogin ? 'Chào mừng trở lại! 👋' : 'Tạo tài khoản mới 🚀'}
          </h2>
          <p className="text-gray-500 mb-8">
            {isLogin ? 'Vui lòng đăng nhập để tiếp tục.' : 'Đăng ký bằng email sinh viên EIU.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                placeholder="example@eiu.edu.vn" 
                required
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
              />
            </div>

            {/* ✅ THÊM: Field Họ và tên, chỉ hiện khi đăng ký */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input 
                  type="text" 
                  placeholder="Nguyễn Văn A" 
                  required
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                required
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
              />
            </div>

            {message && (
              <p className={`text-sm font-medium ${message.includes('thành công') ? 'text-green-600' : 'text-red-500'}`}>
                {message}
              </p>
            )}

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition transform hover:scale-[1.02] shadow-md">
              {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
            </button>
          </form>

          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">HOẶC</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <button 
            type="button" 
            onClick={() => loginWithGoogle()} 
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-xl transition shadow-sm"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            </svg>
            Tiếp tục với Google
          </button>

          <p className="text-center mt-8 text-gray-600">
            {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
            <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-semibold hover:underline cursor-pointer">
              {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  return children;
};

export default function App() {
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/" element={<ProtectedRoute><Root /></ProtectedRoute>}>
            <Route index element={<Home />} />
            <Route path="service/:id" element={<ServiceDetail />} />
            <Route path="profile" element={<Profile />} />
            <Route path="user/:id" element={<UserProfile />} />
            <Route path="my-activity" element={<MyActivity />} />
            <Route path="post-service" element={<PostService />} />
            <Route path="how-it-works" element={<HowItWorks />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}