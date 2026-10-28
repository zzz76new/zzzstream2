'use client';

import { useState, useEffect } from 'react';
import { VIP_USERS } from '@/lib/vipUsers';


export default function VipAuthModal() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [username, setUsername] = useState('');
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const auth = localStorage.getItem('vip_user_logged');
    if (!auth) {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = VIP_USERS.find(
      (u) => u.id.toLowerCase() === username.trim().toLowerCase() && u.passcode === passcode.trim()
    );

    if (user) {
      localStorage.setItem('vip_user_logged', JSON.stringify(user));
      setIsAuthenticated(true);
      setErrorMsg('');
      window.location.reload(); // Tải lại để cập nhật tên tài khoản VIP lên Sidebar & Header
    } else {
      setErrorMsg('Thông tin không chính xác, vui lòng nhập lại!');
      setPasscode('');
    }
  };

  if (isAuthenticated) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#0e0e0e]/95 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-[#1c1b1b] border border-[#353534] p-6 rounded-2xl max-w-sm w-full space-y-5 text-[#e5e2e1] shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-full bg-[#e10111]/20 flex items-center justify-center mx-auto mb-2">
            <span className="material-symbols-outlined text-[#ffb4aa] text-[24px]">lock</span>
          </div>
          <h2 className="text-xl font-bold text-white">Xác Nhận Quyền Truy Cập</h2>
          <p className="text-xs text-[#c6c6cf]">Nhập ID và Passcode để xem phim</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-[#c6c6cf] font-medium">ID Tài khoản</label>
            <input
              type="text"
              placeholder="VD: vantin hoặc vip01"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1.5 px-3.5 py-2.5 bg-[#131313] border border-[#353534] rounded-xl text-sm text-white focus:outline-none focus:border-[#e10111] transition"
              required
            />
          </div>

          <div>
            <label className="text-xs text-[#c6c6cf] font-medium">Passcode (6 số)</label>
            <input
              type="password"
              maxLength={6}
              placeholder="123456"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full mt-1.5 px-3.5 py-2.5 bg-[#131313] border border-[#353534] rounded-xl text-base text-white focus:outline-none focus:border-[#e10111] tracking-widest text-center font-bold transition"
              required
            />
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-[#e10111]/15 border border-[#e10111]/30 text-center">
              <p className="text-xs text-[#ffb4aa] font-semibold">{errorMsg}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#e10111] hover:bg-red-700 font-bold rounded-xl text-sm text-white transition shadow-[0_0_16px_rgba(225,1,17,0.4)] active:scale-95"
          >
            Vào Web
          </button>
        </form>
      </div>
    </div>
  );
}