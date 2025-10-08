import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [registerAttempts, setRegisterAttempts] = useState(0);
  const navigate = useNavigate();

  // Auto-hide error message
  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false);
        setErrorMessage('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 12.5;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 12.5;
    setPasswordStrength(Math.min(strength, 100));
  }, [password]);

  const getStrengthColor = () => {
    if (passwordStrength < 30) return 'bg-red-500';
    if (passwordStrength < 60) return 'bg-yellow-500';
    if (passwordStrength < 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthLabel = () => {
    if (passwordStrength < 30) return 'WEAK';
    if (passwordStrength < 60) return 'MEDIUM';
    if (passwordStrength < 80) return 'STRONG';
    return 'SECURE';
  };

  const triggerError = (message) => {
    setErrorMessage(message);
    setShowError(true);
    setRegisterAttempts(prev => prev + 1);
    
    // Clear fields
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirm('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!username || !email || !password) {
      triggerError('ERROR: ALL FIELDS REQUIRED');
      return;
    }
    
    if (password !== confirm) {
      triggerError('ERROR: PASSWORDS DO NOT MATCH');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      
      if (!res.ok) {
        setIsLoading(false);
        triggerError(data.error || 'ERROR: REGISTRATION FAILED');
        return;
      }
      
      // Success - show success message and redirect
      setErrorMessage('');
      setShowError(false);
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (err) {
      console.error('Registration failed:', err);
      setIsLoading(false);
      triggerError('ERROR: SERVER CONNECTION FAILED');
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
        {[...Array(25)].map((_, i) => (
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
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-transparent"></div>

      {/* Error notification */}
      {showError && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
          <div className="bg-red-900/90 backdrop-blur-xl border-2 border-red-500 rounded-lg px-6 py-4 shadow-lg"
            style={{
              boxShadow: '0 0 30px rgba(255, 0, 0, 0.8), inset 0 0 20px rgba(255, 0, 0, 0.2)',
              animation: 'error-pulse 0.5s ease-in-out'
            }}
          >
            <div className="flex items-center gap-3">
              <div className="text-red-400 text-2xl font-bold">⚠</div>
              <div>
                <div className="text-red-400 font-mono font-bold text-sm">REGISTRATION DENIED</div>
                <div className="text-red-300 font-mono text-xs mt-1">{errorMessage}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main register container */}
      <div className="relative z-10 w-full max-w-md px-6">
        <form
          onSubmit={handleRegister}
          className={`relative bg-black/80 backdrop-blur-xl p-8 rounded-lg border-2 transition-all duration-300 ${
            showError ? 'border-red-500 animate-shake' : 'border-cyan-500'
          }`}
          style={{
            boxShadow: showError 
              ? '0 0 40px rgba(255, 0, 0, 0.8), inset 0 0 20px rgba(255, 0, 0, 0.2)'
              : '0 0 40px rgba(0, 255, 255, 0.6), inset 0 0 20px rgba(0, 255, 255, 0.1)'
          }}
        >
          {/* Corner decorations */}
          <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 transition-colors ${
            showError ? 'border-red-400' : 'border-cyan-400'
          }`}></div>
          <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 transition-colors ${
            showError ? 'border-red-400' : 'border-cyan-400'
          }`}></div>
          <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 transition-colors ${
            showError ? 'border-red-400' : 'border-cyan-400'
          }`}></div>
          <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 transition-colors ${
            showError ? 'border-red-400' : 'border-cyan-400'
          }`}></div>

          {/* Corner accent dots */}
          <div className={`absolute top-1 left-1 w-1 h-1 rounded-full transition-colors ${
            showError ? 'bg-red-400' : 'bg-cyan-400'
          }`} style={{ boxShadow: showError ? '0 0 4px rgba(255, 0, 0, 0.8)' : '0 0 4px rgba(0, 255, 255, 0.8)' }}></div>
          <div className={`absolute top-1 right-1 w-1 h-1 rounded-full transition-colors ${
            showError ? 'bg-red-400' : 'bg-cyan-400'
          }`} style={{ boxShadow: showError ? '0 0 4px rgba(255, 0, 0, 0.8)' : '0 0 4px rgba(0, 255, 255, 0.8)' }}></div>
          <div className={`absolute bottom-1 left-1 w-1 h-1 rounded-full transition-colors ${
            showError ? 'bg-red-400' : 'bg-cyan-400'
          }`} style={{ boxShadow: showError ? '0 0 4px rgba(255, 0, 0, 0.8)' : '0 0 4px rgba(0, 255, 255, 0.8)' }}></div>
          <div className={`absolute bottom-1 right-1 w-1 h-1 rounded-full transition-colors ${
            showError ? 'bg-red-400' : 'bg-cyan-400'
          }`} style={{ boxShadow: showError ? '0 0 4px rgba(255, 0, 0, 0.8)' : '0 0 4px rgba(0, 255, 255, 0.8)' }}></div>

          {/* Animated scan line */}
          <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
            <div 
              className={`absolute w-full h-1 bg-gradient-to-r from-transparent to-transparent opacity-50 ${
                showError ? 'via-red-400' : 'via-cyan-400'
              }`}
              style={{ animation: 'scan 4s linear infinite' }}
            ></div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className={`text-3xl font-mono font-bold text-center mb-2 transition-all ${
              showError ? 'text-red-500' : 'text-cyan-400'
            }`} style={{
              textShadow: showError 
                ? '0 0 10px rgba(255, 0, 0, 1), 0 0 20px rgba(255, 0, 0, 0.8)'
                : '0 0 10px rgba(0, 255, 255, 1), 0 0 20px rgba(0, 255, 255, 0.8)'
            }}>
              {showError ? 'REGISTRATION_DENIED.exe' : 'REGISTER_PORTAL.exe'}
            </h1>
            
            {/* System status indicators */}
            <div className="flex items-center justify-center gap-3 text-xs font-mono mb-4">
              <div className="flex items-center gap-1.5">
                <span className={showError ? 'text-red-400' : 'text-green-400'}>●</span>
                <span className="text-gray-400">{showError ? 'SECURITY.ALERT' : 'NEW_USER.INIT'}</span>
              </div>
            </div>

            {/* Additional info bar */}
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-gray-600 border-t border-b border-cyan-900/30 py-2">
              <span>v2.077</span>
              <span>•</span>
              <span>SSL:ENABLED</span>
              <span>•</span>
              <span>ATTEMPTS:{registerAttempts}</span>
            </div>
          </div>

          {/* Username input */}
          <div className="mb-4 relative group">
            <label className={`block text-xs font-mono mb-2 uppercase tracking-wider transition-colors flex items-center justify-between ${
              showError ? 'text-red-400' : 'text-cyan-400'
            }`}>
              <span>▸ Username</span>
              <span className="text-gray-600 text-xs">[REQUIRED]</span>
            </label>
            <input
              type="text"
              placeholder="Enter callsign"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-4 py-3 bg-black/50 border rounded font-mono text-sm focus:outline-none focus:bg-black/70 transition-all placeholder-cyan-800 ${
                showError 
                  ? 'border-red-600 text-red-300 focus:border-red-400'
                  : 'border-cyan-600 text-cyan-300 focus:border-cyan-400'
              }`}
              style={{
                boxShadow: showError 
                  ? '0 0 10px rgba(255, 0, 0, 0.2)'
                  : '0 0 10px rgba(0, 255, 255, 0.1)'
              }}
            />
            <div className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 group-focus-within:w-full w-0 ${
              showError ? 'bg-red-400' : 'bg-cyan-400'
            }`}></div>
          </div>

          {/* Email input */}
          <div className="mb-4 relative group">
            <label className={`block text-xs font-mono mb-2 uppercase tracking-wider transition-colors flex items-center justify-between ${
              showError ? 'text-red-400' : 'text-cyan-400'
            }`}>
              <span>▸ Email Address</span>
              <span className="text-gray-600 text-xs">[REQUIRED]</span>
            </label>
            <input
              type="email"
              placeholder="user@notecore.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 bg-black/50 border rounded font-mono text-sm focus:outline-none focus:bg-black/70 transition-all placeholder-cyan-800 ${
                showError 
                  ? 'border-red-600 text-red-300 focus:border-red-400'
                  : 'border-cyan-600 text-cyan-300 focus:border-cyan-400'
              }`}
              style={{
                boxShadow: showError 
                  ? '0 0 10px rgba(255, 0, 0, 0.2)'
                  : '0 0 10px rgba(0, 255, 255, 0.1)'
              }}
            />
            <div className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 group-focus-within:w-full w-0 ${
              showError ? 'bg-red-400' : 'bg-cyan-400'
            }`}></div>
          </div>

          {/* Password input with strength meter */}
          <div className="mb-4 relative group">
            <label className={`block text-xs font-mono mb-2 uppercase tracking-wider transition-colors flex items-center justify-between ${
              showError ? 'text-red-400' : 'text-cyan-400'
            }`}>
              <span>▸ Access Code</span>
              <span className="text-gray-600 text-xs">[ENCRYPTED]</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 bg-black/50 border rounded font-mono text-sm focus:outline-none focus:bg-black/70 transition-all placeholder-cyan-800 ${
                showError 
                  ? 'border-red-600 text-red-300 focus:border-red-400'
                  : 'border-cyan-600 text-cyan-300 focus:border-cyan-400'
              }`}
              style={{
                boxShadow: showError 
                  ? '0 0 10px rgba(255, 0, 0, 0.2)'
                  : '0 0 10px rgba(0, 255, 255, 0.1)'
              }}
            />
            <div className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 group-focus-within:w-full w-0 ${
              showError ? 'bg-red-400' : 'bg-cyan-400'
            }`}></div>
            
            {/* Password strength indicator */}
            {password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-gray-500">STRENGTH:</span>
                  <span className={`text-xs font-mono font-bold ${
                    passwordStrength < 30 ? 'text-red-500' :
                    passwordStrength < 60 ? 'text-yellow-500' :
                    passwordStrength < 80 ? 'text-blue-500' : 'text-green-500'
                  }`}>{getStrengthLabel()}</span>
                </div>
                <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                    style={{ 
                      width: `${passwordStrength}%`,
                      boxShadow: `0 0 10px ${
                        passwordStrength < 30 ? 'rgba(255, 0, 0, 0.5)' :
                        passwordStrength < 60 ? 'rgba(255, 255, 0, 0.5)' :
                        passwordStrength < 80 ? 'rgba(0, 100, 255, 0.5)' : 'rgba(0, 255, 0, 0.5)'
                      }`
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm password input */}
          <div className="mb-6 relative group">
            <label className={`block text-xs font-mono mb-2 uppercase tracking-wider transition-colors flex items-center justify-between ${
              showError ? 'text-red-400' : 'text-cyan-400'
            }`}>
              <span>▸ Confirm Code</span>
              <span className="text-gray-600 text-xs">[VERIFY]</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={`w-full px-4 py-3 bg-black/50 border rounded font-mono text-sm focus:outline-none focus:bg-black/70 transition-all placeholder-cyan-800 ${
                showError 
                  ? 'border-red-600 text-red-300 focus:border-red-400'
                  : 'border-cyan-600 text-cyan-300 focus:border-cyan-400'
              }`}
              style={{
                boxShadow: showError 
                  ? '0 0 10px rgba(255, 0, 0, 0.2)'
                  : '0 0 10px rgba(0, 255, 255, 0.1)'
              }}
            />
            <div className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 group-focus-within:w-full w-0 ${
              showError ? 'bg-red-400' : 'bg-cyan-400'
            }`}></div>
            
            {/* Password match indicator */}
            {confirm && (
              <div className="mt-2 flex items-center gap-2">
                {password === confirm ? (
                  <>
                    <span className="text-green-400 text-xs">✓</span>
                    <span className="text-xs font-mono text-green-400">CODES MATCH</span>
                  </>
                ) : (
                  <>
                    <span className="text-red-400 text-xs">✗</span>
                    <span className="text-xs font-mono text-red-400">CODES DO NOT MATCH</span>
                  </>
                )}
              </div>
            )}
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
              {isLoading ? 'CREATING USER...' : '▸ INITIALIZE REGISTRATION'}
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
              <span className="text-gray-600">ALREADY REGISTERED?</span>{' '}
              <span
                onClick={() => navigate('/')}
                className="text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors relative group"
                style={{ textShadow: '0 0 5px rgba(0, 255, 255, 0.5)' }}
              >
                [ACCESS_LOGIN]
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </span>
            </p>
          </div>

          {/* Status indicator */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full opacity-50 ${
                  showError ? 'bg-red-400' : 'bg-cyan-400'
                }`}
                style={{
                  animation: `pulse 1.5s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`
                }}
              ></div>
            ))}
          </div>

          {/* Timestamp */}
          <div className="mt-3 text-center text-xs font-mono text-gray-700">
            {new Date().toLocaleTimeString('en-US', { hour12: false })} UTC
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

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        @keyframes slide-down {
          0% { transform: translate(-50%, -100%); opacity: 0; }
          100% { transform: translate(-50%, 0); opacity: 1; }
        }

        @keyframes error-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
