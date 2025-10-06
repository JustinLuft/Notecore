import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) return alert('Enter all fields!');
    if (password !== confirm) return alert('Passwords do not match!');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }) // matches server register
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(data.error || 'Registration failed');
      }

      alert('Registration successful! You can now login.');
      navigate('/'); // go to login page
    } catch (err) {
      console.error('Registration failed:', err);
      alert('Server error, try again later');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-cyan-400">
      <form
        onSubmit={handleRegister}
        className="bg-gray-900 p-10 rounded-lg border-2 border-cyan-500 shadow-lg w-96"
      >
        <h1 className="text-2xl font-mono font-bold text-center mb-6">
          REGISTER_PORTAL.exe
        </h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-3 bg-black border border-cyan-600 text-cyan-300 rounded focus:ring-1 focus:ring-cyan-400"
        />
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
          className="w-full mb-4 px-4 py-3 bg-black border border-cyan-600 text-cyan-300 rounded focus:ring-1 focus:ring-cyan-400"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full mb-6 px-4 py-3 bg-black border border-cyan-600 text-cyan-300 rounded focus:ring-1 focus:ring-cyan-400"
        />
        <button
          type="submit"
          className="w-full py-3 bg-cyan-500 text-black font-mono font-bold rounded hover:bg-cyan-400 transition-all"
        >
          REGISTER
        </button>
        <p className="mt-4 text-xs text-gray-500 text-center">
          Already registered?{' '}
          <span
            onClick={() => navigate('/')}
            className="text-cyan-400 underline cursor-pointer"
          >
            LOGIN
          </span>
        </p>
      </form>
    </div>
  );
}