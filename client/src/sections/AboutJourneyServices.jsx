import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export const About = () => (
    <section id="about" className="section adaptive-light">
        <div className="chalk-annotation" style={{ top: '15%', right: '10%' }}>"Measure twice, cut once"</div>
        <div className="container two-col">
            <div id="heritage-image-wrapper" className="image-wrapper fade-in-up active-reveal">
                <img src="/images/Custom_Tailoring/image5.jpeg" alt="Master tailor at work" />
            </div>
            <div className="text-content reveal-right active-reveal">
                <h2 className="spectral-text">Our Heritage</h2>
                <div className="divider"></div>
                <p className="reveal-bottom active-reveal delay-100">At Pithadiya Tailor, we believe that every stitch tells a story of heritage and precision. For over three decades, we have been crafting confidence.</p>
                <p className="reveal-bottom active-reveal delay-200">Precision, elegance, and perfect fits are the hallmarks of our brand. We preserve the art of traditional tailoring while embracing modern silhouettes.</p>
            </div>
        </div>
    </section>
);

export const Journey = () => {
    const [milestones, setMilestones] = useState([]);

    useEffect(() => {
        axios.get(`${API_URL}/journey`)
            .then(res => setMilestones(res.data))
            .catch(err => console.error("Journey fetch error:", err));
    }, []);

    return (
        <section id="journey" className="section dark-bg">
            <div className="container">
                <h2 className="section-title reveal-bottom active-reveal spectral-text" style={{ textAlign: 'center' }}>Our Journey</h2>
                <div className="timeline">
                    {milestones.map((item, i) => (
                        <div key={i} className={`timeline-item ${i % 2 === 0 ? 'reveal-left' : 'reveal-right'} active-reveal`}>
                            <div className="timeline-dot"></div>
                            <div className="timeline-date">{item.year}</div>
                            <div className="timeline-content">
                                <h3><i className={item.icon}></i> {item.title}</h3>
                                <p>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export const Services = () => {
    const [services, setServices] = useState([]);

    useEffect(() => {
        axios.get(`${API_URL}/services`)
            .then(res => setServices(res.data))
            .catch(err => console.error("Services fetch error:", err));
    }, []);

    return (
        <section id="services" className="section dark-bg">
            <div className="container">
                <h2 className="section-title reveal-bottom active-reveal spectral-text" style={{ textAlign: 'center' }}>Our Services</h2>
                <div className="services-grid reveal-bottom active-reveal">
                    {services.map((s, i) => (
                        <div key={i} className="service-card">
                            <div className="service-icon"><i className={s.icon}></i></div>
                            <h3>{s.title}</h3>
                            <p className="service-short-desc">{s.desc}</p>
                            <div className="service-details">
                                <div className="details-divider"></div>
                                <ul className="details-list">
                                    <li><i className="fas fa-check"></i> Custom Fit Guarantee</li>
                                    <li><i className="fas fa-check"></i> Premium Fabric</li>
                                    <li><i className="fas fa-check"></i> Handcraft Finish</li>
                                    <li><i className="fas fa-check"></i> Timely Delivery</li>
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
