import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="not-found-container" style={containerStyle}>
            <div className="not-found-content" style={contentStyle}>
                <div className="tailor-animation" style={animationStyle}>
                    <div className="fabric"></div>
                    <div className="machine">
                        <div className="needle-arm"></div>
                        <div className="needle-base"></div>
                    </div>
                </div>
                <h1 className="spectral-text" style={{ fontSize: '7rem', margin: '0', color: '#d4af37', opacity: 0.9 }}>404</h1>
                <h2 style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '20px', fontWeight: '300', letterSpacing: '1px' }}>Precision Lost in the Fold</h2>
                <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0 auto 40px auto', lineHeight: '1.7', fontSize: '1.1rem' }}>
                    Even the most expert hands can lose their way. The pattern you seek is currently unavailable.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="btn-main"
                    style={{ padding: '16px 45px', fontSize: '1.1rem', borderRadius: '50px', boxShadow: '0 10px 30px rgba(212,175,55,0.2)' }}
                >
                    Return to the Atelier
                </button>
            </div>
            <style>{`
                .tailor-animation {
                    position: relative;
                    width: 200px;
                    height: 150px;
                    margin: 0 auto 30px auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .fabric {
                    position: absolute;
                    width: 140px;
                    height: 80px;
                    background: #1e293b;
                    border: 2px dashed #d4af37;
                    border-radius: 5px;
                    animation: moveFabric 4s linear infinite;
                }

                .machine {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    z-index: 2;
                }

                .needle-arm {
                    position: absolute;
                    top: 20px;
                    left: 45px;
                    width: 10px;
                    height: 40px;
                    background: #94a3b8;
                    border-radius: 5px;
                    animation: stitch 0.2s linear infinite;
                }

                .needle-base {
                    position: absolute;
                    top: 0;
                    left: 20px;
                    width: 60px;
                    height: 25px;
                    background: #d4af37;
                    border-radius: 10px 10px 0 0;
                }

                @keyframes stitch {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(15px); }
                }

                @keyframes moveFabric {
                    0% { transform: translateX(-20px); opacity: 0; }
                    20% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { transform: translateX(20px); opacity: 0; }
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }

                .not-found-container::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: url('/images/Custom_Tailoring/image5.jpeg') center/cover no-repeat;
                    filter: brightness(0.15) grayscale(1);
                    z-index: -1;
                }

                @media (max-width: 768px) {
                    .not-found-content h1 { font-size: 5rem !important; }
                    .not-found-content h2 { font-size: 1.5rem !important; }
                    .not-found-content p { font-size: 0.95rem !important; padding: 0 20px; }
                    .tailor-animation { transform: scale(0.8); margin-bottom: 10px auto; }
                }
            `}</style>
        </div>
    );
};

const containerStyle = {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0f172a',
    position: 'relative',
    overflow: 'hidden',
    textAlign: 'center'
};

const contentStyle = {
    padding: '40px',
    zIndex: 1,
    animation: 'fadeIn 1s ease-out'
};

const animationStyle = {
    marginBottom: '20px'
};

export default NotFound;
