import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import { API_URL } from '../config';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [attemptsLeft, setAttemptsLeft] = useState(3);

    const navigate = useNavigate();

    // Handle password login
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post(`${API_URL}/login`, { username, password });

            if (res.data.success) {
                toast.success(res.data.message);
                sessionStorage.setItem('adminToken', res.data.token);
                setTimeout(() => navigate('/private'), 500);
            }
        } catch (err) {
            const errorData = err.response?.data;
            if (errorData) {
                toast.error(errorData.message);
                setAttemptsLeft(errorData.attemptsLeft || 0);
            } else {
                toast.error('Network error. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#fff',
                        color: '#1e293b',
                        padding: '16px',
                        borderRadius: '12px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        fontWeight: '600',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />

            <div className="bg-gradient-light"></div>

            <div className="login-card">
                <div className="brand-header">
                    <div className="logo-icon">
                        <i className="fas fa-fingerprint"></i>
                    </div>
                    <h1 className="spectral-text">Pithadiya</h1>
                    <p className="sub-tag">Master Atelier Access</p>
                </div>

                <form onSubmit={handlePasswordSubmit}>
                    <div className="input-group">
                        <label>Identity</label>
                        <div className="input-wrapper">
                            <i className="fas fa-user-tie"></i>
                            <input
                                type="text"
                                placeholder="Master Username / Email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Secret Key</label>
                        <div className="input-wrapper">
                            <i className="fas fa-lock"></i>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {attemptsLeft < 3 && attemptsLeft > 0 && (
                        <div className="attempts-warning">
                            <i className="fas fa-exclamation-triangle"></i>
                            <span>{attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining</span>
                        </div>
                    )}

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                <span>Authenticating...</span>
                            </>
                        ) : (
                            <>
                                <span>Authenticate Access</span>
                                <i className="fas fa-arrow-right"></i>
                            </>
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Protected by Master's Security Protocol</p>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,700;1,400&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

                .login-page {
                    height: 100vh;
                    background: #fdfbf7;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    overflow: hidden;
                    font-family: 'Inter', sans-serif;
                }

                .bg-gradient-light {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.03) 0%, transparent 50%),
                    radial-gradient(circle at 80% 70%, rgba(212, 175, 55, 0.05) 0%, transparent 50%);
                }

                .login-card {
                    background: #ffffff;
                    width: 100%;
                    max-width: 450px;
                    padding: 60px 45px;
                    border-radius: 40px;
                    border: 1px solid rgba(212, 175, 55, 0.15);
                    box-shadow: 0 30px 60px -15px rgba(212, 175, 55, 0.08);
                    position: relative;
                    z-index: 10;
                    text-align: center;
                    animation: cardFadeIn 1s cubic-bezier(0.23, 1, 0.32, 1);
                }

                @keyframes cardFadeIn {
                    from { opacity: 0; transform: translateY(30px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }

                .logo-icon {
                    width: 60px;
                    height: 60px;
                    background: #fdfbf7;
                    border: 1px solid #d4af37;
                    color: #d4af37;
                    border-radius: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                    font-size: 1.5rem;
                    box-shadow: 0 10px 20px rgba(212, 175, 55, 0.1);
                }

                .brand-header h1 {
                    font-family: 'Spectral', serif;
                    font-size: 2.5rem;
                    color: #1e293b;
                    margin: 0;
                    letter-spacing: -1px;
                }

                .sub-tag {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 3px;
                    color: #d4af37;
                    margin-top: 5px;
                    margin-bottom: 40px;
                    font-weight: 600;
                }

                .input-group {
                    text-align: left;
                    margin-bottom: 25px;
                }

                .input-group label {
                    display: block;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 8px;
                    margin-left: 5px;
                }

                .input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .input-wrapper i {
                    position: absolute;
                    left: 18px;
                    color: #94a3b8;
                    font-size: 0.9rem;
                    transition: 0.3s;
                }

                .input-wrapper input {
                    width: 100%;
                    padding: 15px 15px 15px 48px;
                    background: #fdfbf7;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    color: #1e293b;
                    font-size: 0.95rem;
                    outline: none;
                    transition: 0.3s;
                }

                .input-wrapper input:focus {
                    border-color: #d4af37;
                    background: #fff;
                    box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.05);
                }

                .input-wrapper input:focus + i {
                    color: #d4af37;
                }

                .attempts-warning {
                    background: rgba(239, 68, 68, 0.05);
                    color: #ef4444;
                    padding: 12px;
                    border-radius: 10px;
                    font-size: 0.85rem;
                    margin-bottom: 20px;
                    border: 1px solid rgba(239, 68, 68, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    font-weight: 600;
                }

                .login-btn {
                    width: 100%;
                    padding: 16px;
                    background: linear-gradient(135deg, #d4af37, #b8860b);
                    color: #fff;
                    border: none;
                    border-radius: 12px;
                    font-size: 0.95rem;
                    font-weight: 700;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    transition: 0.4s;
                    margin-top: 10px;
                }

                .login-btn:hover:not(:disabled) {
                    box-shadow: 0 15px 30px rgba(212, 175, 55, 0.2);
                    transform: translateY(-2px);
                }

                .login-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .login-footer {
                    margin-top: 40px;
                    font-size: 0.7rem;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                @media (max-width: 480px) {
                    .login-card {
                        padding: 40px 30px;
                        border-radius: 0;
                        height: 100vh;
                        max-width: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                    }
                }
            `}</style>
        </div>
    );
};

export default Login;
