import React, { useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export const Process = () => (
    <section id="measurements" className="section adaptive-light">
        <div className="chalk-annotation" style={{ bottom: '10%', left: '5%' }}>"The perfect fit is a mathematical certainty"</div>
        <div className="container">
            <h2 className="section-title reveal-bottom active-reveal spectral-text">The Bespoke Process</h2>
            <div className="process-steps">
                {[
                    { icon: 'fas fa-calendar-check', title: '1. Consultation', desc: 'Meet with our stylists to discuss fabric, style, and fit.' },
                    { icon: 'fas fa-tape', title: '2. Measurement', desc: 'Precise body measurements ensuring a flawless fit.' },
                    { icon: 'fas fa-pencil-ruler', title: '3. Crafting', desc: 'Our master tailors cut and sew your garment with care.' },
                    { icon: 'fas fa-check-circle', title: '4. Final Fitting', desc: 'Review and final adjustments for perfection.' }
                ].map((step, i) => (
                    <div key={i} className="step reveal-bottom active-reveal" style={{ animationDelay: `${i * 0.2}s` }}>
                        <div className="step-icon"><i className={step.icon}></i></div>
                        <h4>{step.title}</h4>
                        <p>{step.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export const WhyChooseUs = () => (
    <section id="why-choose-us" class="section">
        <div class="container">
            <h2 class="section-title reveal-bottom active-reveal spectral-text">Why Choose Us</h2>
            <div class="services-grid">
                {[
                    { icon: 'fas fa-check-double', title: 'Perfect Fitting', desc: 'We ensure every stitch aligns with your body for that flawless look.' },
                    { icon: 'fas fa-star', title: 'Quality Stitching', desc: 'High-quality threads and expert craftsmanship for durability.' },
                    { icon: 'fas fa-wallet', title: 'Affordable Price', desc: 'Premium bespoke tailoring at prices that fit your budget.' },
                    { icon: 'fas fa-clock', title: 'On-time Delivery', desc: 'We respect your time. Guaranteed delivery on the promised date.' }
                ].map((item, i) => (
                    <div key={i} className="service-card reveal-bottom active-reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                        <i className={item.icon}></i>
                        <h3>{item.title}</h3>
                        <p>{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export const Reviews = () => {
    const [index, setIndex] = React.useState(0);
    const [reviews, setReviews] = React.useState([]);
    const [pairs, setPairs] = React.useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get(`${API_URL}/reviews`);
                setReviews(res.data);
            } catch (err) {
                console.error("Error fetching reviews:", err);
            }
        };
        fetchReviews();
    }, []);

    useEffect(() => {
        const grouped = [];
        for (let i = 0; i < reviews.length; i += 2) {
            grouped.push(reviews.slice(i, i + 2));
        }
        setPairs(grouped);
    }, [reviews]);

    React.useEffect(() => {
        if (pairs.length === 0) return;
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % pairs.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [pairs.length]);

    return (
        <section id="reviews" className="section" style={{ backgroundColor: '#f1f5f9', padding: '80px 0' }}>
            <div className="container">
                <h2 className="section-title reveal-bottom active-reveal spectral-text" style={{ textAlign: 'center', marginBottom: '60px' }}>What Our Customers Say</h2>

                <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto' }}>
                    {pairs.map((pair, i) => (
                        <div
                            key={i}
                            style={{
                                display: i === index ? 'flex' : 'none',
                                gap: '30px',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                animation: 'fadeIn 0.8s ease-out'
                            }}
                        >
                            {pair.map((review, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        flex: '1',
                                        minWidth: '300px',
                                        maxWidth: '550px',
                                        background: '#ffffff',
                                        padding: '40px',
                                        borderRadius: '20px',
                                        boxShadow: '0 15px 35px rgba(0,0,0,0.05)',
                                        border: '1px solid rgba(0,0,0,0.03)',
                                        textAlign: 'center',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div style={{ marginBottom: '20px', display: 'flex', gap: '5px' }}>
                                        {[...Array(5)].map((_, s) => (
                                            <i
                                                key={s}
                                                className="fas fa-star"
                                                style={{ color: s < review.stars ? '#d4af37' : '#e2e8f0', fontSize: '1.2rem' }}
                                            ></i>
                                        ))}
                                    </div>
                                    <p style={{ fontSize: '1.15rem', fontStyle: 'italic', margin: '0 0 25px 0', color: '#1e293b', lineHeight: '1.7', flexGrow: 1 }}>{review.text}</p>
                                    <div>
                                        <h4 style={{ fontWeight: '700', color: '#000000', margin: '0', fontSize: '1.2rem', fontFamily: 'var(--font-heading)' }}>- {review.name}</h4>
                                        <p style={{ fontSize: '0.95rem', color: '#64748b', marginTop: '6px' }}>{review.shop}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '50px' }}>
                    {pairs.map((_, i) => (
                        <span
                            key={i}
                            onClick={() => setIndex(i)}
                            style={{
                                width: i === index ? '30px' : '12px',
                                height: '12px',
                                borderRadius: '6px',
                                background: i === index ? '#d4af37' : '#cbd5e1',
                                cursor: 'pointer',
                                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                            }}
                        ></span>
                    ))}
                </div>
            </div>
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </section>
    );
};

export const Contact = () => {
    const [contact, setContact] = React.useState({});

    React.useEffect(() => {
        axios.get(`${API_URL}/contact`)
            .then(res => setContact(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <section id="contact" className="section adaptive-light">
            <div className="container contact-wrapper">
                <div className="contact-info reveal-left active-reveal">
                    <h2 className="spectral-text">Visit Us</h2>
                    <div className="info-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <p><a href={contact.mapUrl} target="_blank" className="phone-link">{contact.address}</a></p>
                    </div>
                    <div className="info-item">
                        <i className="fas fa-phone"></i>
                        <p><a href={`https://wa.me/${contact.whatsapp}`} target="_blank" className="phone-link">{contact.phone}</a></p>
                    </div>
                    <div className="info-item">
                        <i className="fas fa-envelope"></i>
                        <p>{contact.email}</p>
                    </div>
                </div>
                <div className="working-hours reveal-right active-reveal">
                    <h2>Working Hours</h2>
                    <ul className="hours-list">
                        <li><span>Mon - Fri:</span> 8:00 AM - 9:00 PM</li>
                        <li><span>Saturday:</span> 8:30 AM - 9:00 PM</li>
                        <li><span>Sunday:</span> 9:00 AM - 6:00 PM</li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export const Footer = () => {
    const [contact, setContact] = React.useState({});

    React.useEffect(() => {
        axios.get(`${API_URL}/contact`)
            .then(res => setContact(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <footer className="footer" style={{ background: '#0f172a', padding: '40px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                <div className="footer-left" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    Design & Developed by: <span className="fire-text" style={{ color: '#d4af37', fontWeight: 'bold' }}>Jayesh Pithadiya</span>
                </div>
                <div className="footer-right" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    &copy; {new Date().getFullYear()} All rights reserved by <u style={{ color: '#d4af37' }}>Pithadiya Tailor</u>
                </div>
            </div>
        </footer>
    );
};
