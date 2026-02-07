import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { API_URL, SERVER_URL } from '../config';

const Gallery = () => {
    const [filter, setFilter] = useState('all');
    const [items, setItems] = useState([]);
    const [lightbox, setLightbox] = useState({ open: false, src: '', title: '' });

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await axios.get(`${API_URL}/items`);
                setItems(res.data);
            } catch (err) {
                console.error("Error fetching gallery items:", err);
            }
        };
        fetchItems();
    }, []);

    const categories = [
        { id: 'all', name: 'All' },
        { id: 'readymade', name: 'Readymade' },
        { id: 'cloth', name: 'Custom Tailoring' },
        { id: 'material', name: 'Materials' },
        { id: 'coming-soon', name: 'Coming Soon' },
    ];

    const filteredItems = filter === 'all' ? items : items.filter(item => item.category === filter);

    return (
        <section id="gallery" className="section dark-bg">
            <div className="container" style={{ padding: '0 5%' }}>
                <h2 className="section-title reveal-bottom active-reveal spectral-text">Our Collection</h2>

                <div className="gallery-filter reveal-bottom active-reveal">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            className={`filter-btn ${filter === cat.id ? 'active' : ''}`}
                            onClick={() => setFilter(cat.id)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                <div className="gallery-grid">
                    {filteredItems.map((item, i) => {
                        if (item.category === 'coming-soon') {
                            return (
                                <div key={i} className="gallery-item coming-soon-card reveal-bottom active-reveal">
                                    <div className="coming-soon-content">
                                        <div className="coming-soon-badge">Coming Soon</div>
                                        {item.src ? (
                                            <img
                                                src={item.src.startsWith('http') || item.src.startsWith('/images') ? item.src : `${SERVER_URL}${item.src}`}
                                                alt={item.title}
                                                className="coming-soon-img"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="coming-soon-placeholder">
                                                <i className="fas fa-hourglass-half pulse-icon"></i>
                                            </div>
                                        )}
                                        <div className="coming-soon-overlay-permanent">
                                            <span className="spectral-text">Coming Soon</span>
                                            <h3>{item.title}</h3>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        return item.type === 'card' ? (
                            <div key={i} className="gallery-item reveal-bottom active-reveal material-card">
                                <div className="material-text">
                                    <i className={item.icon}></i>
                                    <h3>{item.title}</h3>
                                    <p>{item.desc}</p>
                                    <div className="material-tags">
                                        {item.tags?.map(tag => <span key={tag}>{tag}</span>)}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div
                                key={i}
                                className="gallery-item reveal-mask reveal-bottom active-reveal"
                                onClick={() => {
                                    if (item.src) {
                                        setLightbox({
                                            open: true,
                                            src: item.src.startsWith('http') || item.src.startsWith('/images') ? item.src : `${SERVER_URL}${item.src}`,
                                            title: item.title
                                        });
                                    }
                                }}
                            >
                                {item.src && (
                                    <img src={item.src.startsWith('http') || item.src.startsWith('/images') ? item.src : `${SERVER_URL}${item.src}`} alt={item.title} loading="lazy" />
                                )}
                                <div className="gallery-overlay">
                                    <h3>{item.title}</h3>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {lightbox.open && (
                <div id="lightbox" className="lightbox" style={{ display: 'block' }}>
                    <div className="lightbox-frame">
                        <span className="close-lightbox show-btn" onClick={() => setLightbox({ ...lightbox, open: false })}>&times;</span>
                        <img className="lightbox-content" src={lightbox.src} alt={lightbox.title} />
                        <div id="caption">{lightbox.title}</div>
                    </div>
                </div>
            )}

            <style>{`
                .coming-soon-card {
                    position: relative;
                    overflow: hidden;
                    border-radius: 4px;
                    cursor: default;
                }
                
                .coming-soon-content {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    background: #1a1a1a;
                }

                .coming-soon-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    opacity: 0.4;
                    filter: grayscale(100%) blur(2px);
                    transition: transform 0.8s ease;
                }

                .coming-soon-card:hover .coming-soon-img {
                    transform: scale(1.05);
                    opacity: 0.5;
                }

                .coming-soon-placeholder {
                    width: 100%;
                    height: 300px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                }

                .pulse-icon {
                    font-size: 3rem;
                    color: #d4af37;
                    animation: pulse 2s infinite;
                }

                .coming-soon-badge {
                    position: absolute;
                    top: 20px;
                    right: -35px;
                    background: #d4af37;
                    color: #000;
                    padding: 5px 40px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    transform: rotate(45deg);
                    z-index: 10;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                }

                .coming-soon-overlay-permanent {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    z-index: 5;
                    border: 1px solid rgba(212, 175, 55, 0.3);
                    margin: 15px;
                }

                .coming-soon-overlay-permanent span {
                    color: #d4af37;
                    font-size: 1.2rem;
                    margin-bottom: 10px;
                    font-style: italic;
                    letter-spacing: 2px;
                }

                .coming-soon-overlay-permanent h3 {
                    color: #fff;
                    font-size: 1.5rem;
                    text-transform: uppercase;
                    letter-spacing: 3px;
                    text-align: center;
                    text-shadow: 0 5px 15px rgba(0,0,0,0.5);
                }

                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.7; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </section>
    );
};

export default Gallery;
