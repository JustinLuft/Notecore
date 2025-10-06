import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) return alert('Enter email and password!');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // optional for cookies
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(data.error || 'Invalid credentials');
      }

      // Save user info
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('username', data.username);

      // Optional: set a global fetch header for all requests
      // This can also be done per request in Dashboard.jsx
      window.userId = data.userId;

      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      alert('Server error, try again later');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-cyan-400">
      <form
        onSubmit={handleLogin}
        className="bg-gray-900 p-10 rounded-lg border-2 border-cyan-500 shadow-lg w-96"
      >
        <h1 className="text-2xl font-mono font-bold text-center mb-6">
          LOGIN_PORTAL.exe
        </h1>
        <input
          type="email"
          placeholder="user@notecore.io"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-3 bg-black border border-cyan-600 text-cyan-300 rounded focus:ring-1 focus:ring-cyan-400"
        />
        <input
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-3 bg-black border border-cyan-600 text-cyan-300 rounded focus:ring-1 focus:ring-cyan-400"
        />
        <button
          type="submit"
          className="w-full py-3 bg-cyan-500 text-black font-mono font-bold rounded hover:bg-cyan-400 transition-all"
        >
          LOGIN
        </button>
        <p className="mt-4 text-xs text-gray-500 text-center">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/register')}
            className="text-cyan-400 underline cursor-pointer"
          >
            REGISTER
          </span>
        </p>
      </form>
    </div>
  );
}
