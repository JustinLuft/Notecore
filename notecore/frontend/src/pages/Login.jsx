import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const navigate = useNavigate();

  // Random glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 200);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert('Enter email and password!');
    
    setIsLoading(true);
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      const data = await res.json();
      
      if (!res.ok) {
        setIsLoading(false);
        return alert(data.error || 'Invalid credentials');
      }
      
      // Store user data in memory
      window.userId = data.userId;
      window.username = data.username;
      
      // Simulate access granted animation
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      console.error('Login failed:', err);
      setIsLoading(false);
      alert('Server error, try again later');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-scroll 20s linear infinite'
        }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>

      {/* Radial gradient glow */}
      <div className="absolute inset-0 bg-gradient-radial from-cyan-900/20 via-transparent to-transparent"></div>

      {/* Main login container */}
      <div className="relative z-10 w-full max-w-md px-6">
        <form
          onSubmit={handleLogin}
          className={`relative bg-black/80 backdrop-blur-xl p-8 rounded-lg border-2 transition-all duration-300 ${
            glitchActive ? 'border-red-500 translate-x-1' : 'border-cyan-500'
          }`}
          style={{
            boxShadow: glitchActive 
              ? '0 0 40px rgba(255, 0, 0, 0.8), inset 0 0 20px rgba(255, 0, 0, 0.2)'
              : '0 0 40px rgba(0, 255, 255, 0.6), inset 0 0 20px rgba(0, 255, 255, 0.1)'
          }}
        >
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>

          {/* Animated scan line */}
          <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
            <div 
              className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"
              style={{ animation: 'scan 3s linear infinite' }}
            ></div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className={`text-3xl font-mono font-bold text-center mb-2 transition-all ${
              glitchActive ? 'text-red-500' : 'text-cyan-400'
            }`} style={{
              textShadow: glitchActive 
                ? '0 0 10px rgba(255, 0, 0, 1), 0 0 20px rgba(255, 0, 0, 0.8)'
                : '0 0 10px rgba(0, 255, 255, 1), 0 0 20px rgba(0, 255, 255, 0.8)'
            }}>
              {glitchActive ? 'L0G1N_P0RT@L.exe' : 'LOGIN_PORTAL.exe'}
            </h1>
            <div className="flex items-center justify-center gap-2 text-xs font-mono">
              <span className="text-green-400">●</span>
              <span className="text-gray-400">SYSTEM.ONLINE</span>
              <span className="text-gray-600">|</span>
              <span className="text-gray-400">v2.077</span>
            </div>
          </div>

          {/* Email input */}
          <div className="mb-4 relative group">
            <label className="block text-xs font-mono text-cyan-400 mb-2 uppercase tracking-wider">
              ▸ User ID
            </label>
            <input
              type="email"
              placeholder="user@notecore.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-cyan-600 text-cyan-300 rounded font-mono text-sm focus:outline-none focus:border-cyan-400 focus:bg-black/70 transition-all placeholder-cyan-800"
              style={{
                boxShadow: '0 0 10px rgba(0, 255, 255, 0.1)'
              }}
            />
            <div className="absolute bottom-0 left-0 h-0.5 bg-cyan-400 transition-all duration-300 group-focus-within:w-full w-0"></div>
          </div>

          {/* Password input */}
          <div className="mb-6 relative group">
            <label className="block text-xs font-mono text-cyan-400 mb-2 uppercase tracking-wider">
              ▸ Access Code
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-cyan-600 text-cyan-300 rounded font-mono text-sm focus:outline-none focus:border-cyan-400 focus:bg-black/70 transition-all placeholder-cyan-800"
              style={{
                boxShadow: '0 0 10px rgba(0, 255, 255, 0.1)'
              }}
            />
            <div className="absolute bottom-0 left-0 h-0.5 bg-cyan-400 transition-all duration-300 group-focus-within:w-full w-0"></div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="relative w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-mono font-bold rounded overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{
              boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)'
            }}
          >
            <span className="relative z-10">
              {isLoading ? 'ACCESSING...' : '▸ INITIALIZE LOGIN'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </button>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-cyan-900/50">
            <p className="text-xs text-gray-500 text-center font-mono">
              <span className="text-gray-600">NO ACCESS CODE?</span>{' '}
              <span
                onClick={() => navigate('/register')}
                className="text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors relative group"
                style={{ textShadow: '0 0 5px rgba(0, 255, 255, 0.5)' }}
              >
                [REGISTER_NEW_USER]
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </span>
            </p>
          </div>

          {/* Status indicator */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-cyan-400 rounded-full opacity-50"
                style={{
                  animation: `pulse 1.5s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`
                }}
              ></div>
            ))}
          </div>
        </form>
      </div>

      <style>{`
        @keyframes grid-scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
        }
        
        @keyframes scan {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
