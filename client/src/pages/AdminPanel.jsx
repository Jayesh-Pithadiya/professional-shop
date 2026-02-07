import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { API_URL, SERVER_URL } from '../config';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('gallery');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [services, setServices] = useState([]);
    const [journey, setJourney] = useState([]);
    const [contact, setContact] = useState({});

    const [newItem, setNewItem] = useState({ title: '', category: 'readymade' });
    const [newReview, setNewReview] = useState({ text: '', name: '', shop: '', stars: 5 });
    const [newService, setNewService] = useState({ title: '', desc: '', icon: 'fas fa-star' });
    const [newJourney, setNewJourney] = useState({ year: '', title: '', desc: '', icon: 'fas fa-pen' });
    const [selectedFile, setSelectedFile] = useState(null);



    const navigate = useNavigate();
    const API_BASE = API_URL;

    const token = sessionStorage.getItem('adminToken');

    const authHeader = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [it, rv, sv, jr, co] = await Promise.all([
                axios.get(`${API_BASE}/items`),
                axios.get(`${API_BASE}/reviews`),
                axios.get(`${API_BASE}/services`),
                axios.get(`${API_BASE}/journey`),
                axios.get(`${API_BASE}/contact`)
            ]);
            setItems(it.data);
            setReviews(rv.data);
            setServices(sv.data);
            setJourney(jr.data);
            setContact(co.data);
        } catch (err) {
            console.error("Data fetch error:", err);
            if (err.response?.status === 401) navigate('/login');
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('adminToken');
        toast.success("Logged out successfully");
        navigate('/');
    };

    // Generic Add Handlers
    const addItem = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', newItem.title);
        formData.append('category', newItem.category);
        if (selectedFile) formData.append('image', selectedFile);
        await axios.post(`${API_BASE}/items`, formData, authHeader);
        fetchData();
        setNewItem({ title: '', category: 'readymade' });
        setSelectedFile(null);
    };

    const addReview = async (e) => {
        e.preventDefault();
        await axios.post(`${API_BASE}/reviews`, newReview, authHeader);
        fetchData();
        setNewReview({ text: '', name: '', shop: '', stars: 5 });
    };

    const addService = async (e) => {
        e.preventDefault();
        await axios.post(`${API_BASE}/services`, newService, authHeader);
        fetchData();
        setNewService({ title: '', desc: '', icon: 'fas fa-star' });
    };

    const addJourney = async (e) => {
        e.preventDefault();
        await axios.post(`${API_BASE}/journey`, newJourney, authHeader);
        fetchData();
        setNewJourney({ year: '', title: '', desc: '', icon: 'fas fa-pen' });
    };

    const updateContact = async (e) => {
        e.preventDefault();
        await axios.post(`${API_BASE}/contact`, contact, authHeader);
        alert('Contact updated!');
    };

    // Delete Handlers
    const deleteItem = async (i) => { await axios.delete(`${API_BASE}/items/${i}`, authHeader); fetchData(); };
    const deleteReview = async (i) => { await axios.delete(`${API_BASE}/reviews/${i}`, authHeader); fetchData(); };
    const deleteService = async (i) => { await axios.delete(`${API_BASE}/services/${i}`, authHeader); fetchData(); };
    const deleteJourney = async (i) => { await axios.delete(`${API_BASE}/journey/${i}`, authHeader); fetchData(); };

    return (
        <div className="admin-dashboard">
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#fff',
                        color: '#1e293b',
                        padding: '16px',
                        borderRadius: '12px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        fontWeight: '600',
                    },
                }}
            />
            {/* Mobile Nav Header */}
            <div className="admin-mobile-nav">
                <div className="mobile-logo">
                    <i className="fas fa-fingerprint gold-accent"></i>
                    <h2 className="spectral-text">Master Panel</h2>
                </div>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="sidebar-toggle">
                    <i className={isSidebarOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo-icon-box">
                        <i className="fas fa-fingerprint"></i>
                    </div>
                    <h2 className="spectral-text gold-text">Tailor Atelier</h2>
                    <p className="brand-sub">Master Management</p>
                    <div className="header-line"></div>
                </div>

                <nav className="admin-nav">
                    {[
                        { id: 'gallery', icon: 'fas fa-gem', label: 'Curation' },
                        { id: 'reviews', icon: 'fas fa-star-half-alt', label: 'Testimonials' },
                        { id: 'services', icon: 'fas fa-cut', label: 'Craftsmanship' },
                        { id: 'journey', icon: 'fas fa-history', label: 'Legacy' },
                        { id: 'contact', icon: 'fas fa-map-marker-alt', label: 'Presence' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }}
                            className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                        >
                            <span className="nav-icon-box"><i className={tab.icon}></i></span>
                            <span className="nav-label">{tab.label}</span>
                            {activeTab === tab.id && <div className="active-indicator"></div>}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <i className="fas fa-power-off"></i>
                        <span>Secure Exit</span>
                    </button>
                </div>
            </aside>

            {/* Backdrop for mobile */}
            {isSidebarOpen && <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)}></div>}

            {/* Main Content Area */}
            <main className="admin-main">
                <header className="admin-header">
                    <div className="header-title-section">
                        <span className="breadcrumb">Atelier / Master / {activeTab}</span>
                        <h1>{activeTab === 'gallery' ? 'Collection Curation' : `Manage ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}</h1>
                    </div>
                    <div className="header-actions">
                        <a href="/" target="_blank" className="view-site-link">
                            <span>Open Atelier</span>
                            <i className="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                </header>

                <div className="tab-container">
                    <div className="content-wrapper" key={activeTab}>
                        {activeTab === 'gallery' && (
                            <section className="fade-in-section">
                                <div className="admin-card luxe-card">
                                    <div className="card-header">
                                        <h3><i className="fas fa-plus-circle"></i> Add New Masterpiece</h3>
                                    </div>
                                    <form onSubmit={addItem} className="form-grid-3">
                                        <div className="input-group">
                                            <label>Piece Title</label>
                                            <input type="text" placeholder="e.g. Royal Gold Sherwani" value={newItem.title} onChange={e => setNewItem({ ...newItem, title: e.target.value })} required />
                                        </div>
                                        <div className="input-group">
                                            <label>Category</label>
                                            <select value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}>
                                                <option value="readymade">Readymade</option>
                                                <option value="cloth">Custom Tailoring</option>
                                                <option value="material">Materials</option>
                                                <option value="coming-soon">Coming Soon</option>
                                            </select>
                                        </div>
                                        <div className="input-group file-group">
                                            <label>Visual Asset</label>
                                            <div className="custom-file-input">
                                                <input type="file" id="file-upload" onChange={e => setSelectedFile(e.target.files[0])} required />
                                                <label htmlFor="file-upload" className="file-label">
                                                    <i className="fas fa-cloud-upload-alt"></i>
                                                    <span>{selectedFile ? selectedFile.name : 'Choose Image'}</span>
                                                </label>
                                            </div>
                                        </div>
                                        <button type="submit" className="master-btn gold-btn full-width">
                                            <span>Inject Into Collection</span>
                                            <i className="fas fa-bolt"></i>
                                        </button>
                                    </form>
                                </div>
                                <div className="items-list-header">
                                    <h3>Existing Assets ({items.length})</h3>
                                </div>
                                <div className="data-grid">
                                    {items.map((item, i) => (
                                        <div key={i} className="data-row luxe-row">
                                            <div className="row-preview">
                                                {item.src ? (
                                                    <img src={item.src.startsWith('/') ? `${SERVER_URL}${item.src}` : item.src} alt="" />
                                                ) : (
                                                    <div className="icon-placeholder"><i className={item.icon || 'fas fa-box'}></i></div>
                                                )}
                                            </div>
                                            <div className="row-info">
                                                <div className="row-title">{item.title}</div>
                                                <div className="row-meta">{item.category}</div>
                                            </div>
                                            <div className="row-actions">
                                                <button onClick={() => deleteItem(i)} className="delete-icon-btn">
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeTab === 'reviews' && (
                            <section className="fade-in-section">
                                <div className="admin-card luxe-card">
                                    <div className="card-header">
                                        <h3><i className="fas fa-feather-alt"></i> Chronicle New Testimonial</h3>
                                    </div>
                                    <form onSubmit={addReview} className="form-stack">
                                        <div className="form-row-flex">
                                            <div className="input-group flex-2">
                                                <label>Author Identity</label>
                                                <input type="text" placeholder="Client Name" value={newReview.name} onChange={e => setNewReview({ ...newReview, name: e.target.value })} required />
                                            </div>
                                            <div className="input-group flex-1">
                                                <label>Rating</label>
                                                <input type="number" min="1" max="5" value={newReview.stars} onChange={e => setNewReview({ ...newReview, stars: parseInt(e.target.value) })} />
                                            </div>
                                        </div>
                                        <div className="input-group">
                                            <label>Experience</label>
                                            <textarea placeholder="Write the words of the client..." value={newReview.text} onChange={e => setNewReview({ ...newReview, text: e.target.value })} required />
                                        </div>
                                        <button type="submit" className="master-btn gold-btn">
                                            <span>Chronicle Review</span>
                                            <i className="fas fa-pen-fancy"></i>
                                        </button>
                                    </form>
                                </div>
                                <div className="data-grid">
                                    {reviews.map((rev, i) => (
                                        <div key={i} className="data-row luxe-row review-row">
                                            <div className="row-info">
                                                <div className="row-title">
                                                    {rev.name}
                                                    <span className="stars-box">{Array(rev.stars).fill('★').join('')}</span>
                                                </div>
                                                <div className="row-meta italic-text">"{rev.text}"</div>
                                            </div>
                                            <div className="row-actions">
                                                <button onClick={() => deleteReview(i)} className="delete-icon-btn">
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeTab === 'services' && (
                            <section className="fade-in-section">
                                <div className="admin-card luxe-card">
                                    <div className="card-header">
                                        <h3><i className="fas fa-tools"></i> Forge New Craftsmanship</h3>
                                    </div>
                                    <form onSubmit={addService} className="form-stack">
                                        <div className="form-row-flex">
                                            <div className="input-group flex-3">
                                                <label>Service Essence</label>
                                                <input type="text" placeholder="Bespoke Suit Tailoring" value={newService.title} onChange={e => setNewService({ ...newService, title: e.target.value })} required />
                                            </div>
                                            <div className="input-group flex-1">
                                                <label>Symbol</label>
                                                <input type="text" placeholder="fas fa-cut" value={newService.icon} onChange={e => setNewService({ ...newService, icon: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="input-group">
                                            <label>Description</label>
                                            <textarea placeholder="The master's touch..." value={newService.desc} onChange={e => setNewService({ ...newService, desc: e.target.value })} required />
                                        </div>
                                        <button type="submit" className="master-btn gold-btn">
                                            <span>Forge Service</span>
                                            <i className="fas fa-hammer"></i>
                                        </button>
                                    </form>
                                </div>
                                <div className="data-grid">
                                    {services.map((sv, i) => (
                                        <div key={i} className="data-row luxe-row">
                                            <div className="service-icon-preview">
                                                <i className={sv.icon}></i>
                                            </div>
                                            <div className="row-info">
                                                <div className="row-title">{sv.title}</div>
                                                <div className="row-meta">{sv.desc}</div>
                                            </div>
                                            <div className="row-actions">
                                                <button onClick={() => deleteService(i)} className="delete-icon-btn">
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeTab === 'journey' && (
                            <section className="fade-in-section">
                                <div className="admin-card luxe-card">
                                    <div className="card-header">
                                        <h3><i className="fas fa-map"></i> Mark Legacy Milestone</h3>
                                    </div>
                                    <form onSubmit={addJourney} className="form-stack">
                                        <div className="form-row-flex">
                                            <div className="input-group flex-1">
                                                <label>Era / Year</label>
                                                <input type="text" placeholder="1995" value={newJourney.year} onChange={e => setNewJourney({ ...newJourney, year: e.target.value })} required />
                                            </div>
                                            <div className="input-group flex-2">
                                                <label>Title</label>
                                                <input type="text" placeholder="Title" value={newJourney.title} onChange={e => setNewJourney({ ...newJourney, title: e.target.value })} required />
                                            </div>
                                        </div>
                                        <div className="input-group">
                                            <label>Story</label>
                                            <textarea placeholder="Story..." value={newJourney.desc} onChange={e => setNewJourney({ ...newJourney, desc: e.target.value })} required />
                                        </div>
                                        <button type="submit" className="master-btn gold-btn">
                                            <span>Mark Milestone</span>
                                            <i className="fas fa-history"></i>
                                        </button>
                                    </form>
                                </div>
                                <div className="data-grid">
                                    {journey.map((jr, i) => (
                                        <div key={i} className="data-row luxe-row legacy-row">
                                            <div className="era-badge">{jr.year}</div>
                                            <div className="row-info">
                                                <div className="row-title">{jr.title}</div>
                                                <div className="row-meta">{jr.desc}</div>
                                            </div>
                                            <div className="row-actions">
                                                <button onClick={() => deleteJourney(i)} className="delete-icon-btn">
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeTab === 'contact' && (
                            <section className="fade-in-section">
                                <div className="admin-card luxe-card master-presence">
                                    <div className="card-header centered">
                                        <i className="fas fa-globe-asia gold-accent"></i>
                                        <h3>Presence Synchronization</h3>
                                        <p>Global Atelier Reach Management</p>
                                    </div>
                                    <form onSubmit={updateContact} className="presence-grid">
                                        <div className="presence-input-box">
                                            <i className="fas fa-phone"></i>
                                            <div className="input-wrap">
                                                <label>Phone</label>
                                                <input type="text" value={contact.phone || ''} onChange={e => setContact({ ...contact, phone: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="presence-input-box">
                                            <i className="fab fa-whatsapp"></i>
                                            <div className="input-wrap">
                                                <label>WhatsApp</label>
                                                <input type="text" value={contact.whatsapp || ''} onChange={e => setContact({ ...contact, whatsapp: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="presence-input-box">
                                            <i className="fas fa-envelope"></i>
                                            <div className="input-wrap">
                                                <label>Email</label>
                                                <input type="email" value={contact.email || ''} onChange={e => setContact({ ...contact, email: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="presence-input-box full-width">
                                            <i className="fas fa-map-marked-alt"></i>
                                            <div className="input-wrap">
                                                <label>Address</label>
                                                <textarea value={contact.address || ''} onChange={e => setContact({ ...contact, address: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="presence-input-box full-width">
                                            <i className="fas fa-location-arrow"></i>
                                            <div className="input-wrap">
                                                <label>Map Link (Google Maps URL)</label>
                                                <input type="text" value={contact.mapUrl || ''} onChange={e => setContact({ ...contact, mapUrl: e.target.value })} placeholder="https://maps.google.com/..." />
                                            </div>
                                        </div>
                                        <button type="submit" className="master-btn gold-btn full-width ultimate-sync">
                                            <i className="fas fa-sync-alt"></i>
                                            <span>Synchronize Reach</span>
                                        </button>
                                    </form>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </main>

            <style>{`
                /* Cinematic Admin Panel - Premium Glassmorphism Design */
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');

                :root {
                    --bg-main: linear-gradient(135deg, #f8fafc 0%, #e8f0f7 100%);
                    --bg-sidebar: rgba(255, 255, 255, 0.7);
                    --gold: #d4af37;
                    --gold-dark: #b8860b;
                    --gold-glow: rgba(212, 175, 55, 0.4);
                    --text-main: #1e293b;
                    --text-muted: #64748b;
                    --glass: rgba(255, 255, 255, 0.6);
                    --glass-border: rgba(255, 255, 255, 0.8);
                    --shadow-cinematic: 0 20px 60px -15px rgba(0, 0, 0, 0.15);
                    --shadow-float: 0 30px 80px -20px rgba(0, 0, 0, 0.2);
                }

                * { box-sizing: border-box; }

                .admin-dashboard {
                    display: flex;
                    min-height: 100vh;
                    background: var(--bg-main);
                    color: var(--text-main);
                    font-family: 'Inter', sans-serif;
                    position: relative;
                    overflow-x: hidden;
                }

                .admin-dashboard::before {
                    content: '';
                    position: fixed;
                    inset: 0;
                    background: 
                        radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, rgba(212, 175, 55, 0.06) 0%, transparent 50%);
                    pointer-events: none;
                    z-index: 0;
                }

                /* Cinematic Glassmorphic Sidebar */
                .admin-sidebar {
                    width: 300px;
                    background: var(--bg-sidebar);
                    backdrop-filter: blur(20px) saturate(180%);
                    -webkit-backdrop-filter: blur(20px) saturate(180%);
                    border-right: 1px solid var(--glass-border);
                    display: flex;
                    flex-direction: column;
                    padding: 40px 0;
                    position: fixed;
                    height: 100vh;
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    z-index: 1000;
                    box-shadow: var(--shadow-float);
                    animation: slideInLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow-y: auto;
                }

                /* Custom Scrollbar for Sidebar */
                .admin-sidebar::-webkit-scrollbar {
                    width: 6px;
                }

                .admin-sidebar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.02);
                }

                .admin-sidebar::-webkit-scrollbar-thumb {
                    background: rgba(212, 175, 55, 0.3);
                    border-radius: 10px;
                }

                .admin-sidebar::-webkit-scrollbar-thumb:hover {
                    background: rgba(212, 175, 55, 0.5);
                }

                @keyframes slideInLeft {
                    from { transform: translateX(-100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }

                .sidebar-header { 
                    padding: 0 30px; 
                    margin-bottom: 50px; 
                    text-align: center;
                    animation: fadeInDown 1s cubic-bezier(0.4, 0, 0.2, 1) 0.3s backwards;
                }

                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .logo-icon-box {
                    width: 60px; 
                    height: 60px; 
                    background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05));
                    border: 2px solid var(--gold);
                    border-radius: 16px; 
                    margin: 0 auto 20px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    color: var(--gold); 
                    font-size: 1.8rem; 
                    box-shadow: 0 10px 30px rgba(212, 175, 55, 0.2), 0 0 0 4px rgba(212, 175, 55, 0.05);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }

                .logo-icon-box::before {
                    content: '';
                    position: absolute;
                    inset: -4px;
                    background: linear-gradient(135deg, var(--gold), var(--gold-dark));
                    border-radius: 18px;
                    opacity: 0;
                    transition: opacity 0.4s;
                    z-index: -1;
                    filter: blur(10px);
                }

                .logo-icon-box:hover::before { opacity: 0.3; }
                .logo-icon-box:hover { transform: scale(1.05) rotate(5deg); }

                .sidebar-header h2 { 
                    font-family: 'Playfair Display', serif;
                    font-size: 1.8rem; 
                    color: var(--text-main); 
                    margin: 0; 
                    font-weight: 900;
                    letter-spacing: -0.5px;
                    background: linear-gradient(135deg, #1e293b, #475569);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .brand-sub { 
                    font-size: 0.65rem; 
                    color: var(--gold); 
                    text-transform: uppercase; 
                    letter-spacing: 3px; 
                    margin-top: 8px; 
                    font-weight: 700;
                    opacity: 0.9;
                }

                .header-line { 
                    width: 50px; 
                    height: 3px; 
                    background: linear-gradient(90deg, transparent, var(--gold), transparent);
                    margin: 25px auto 0;
                    box-shadow: 0 0 10px var(--gold-glow);
                }

                .admin-nav { 
                    flex: 1; 
                    padding: 0 20px;
                    animation: fadeIn 1s cubic-bezier(0.4, 0, 0.2, 1) 0.5s backwards;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .nav-btn {
                    width: 100%; 
                    background: transparent; 
                    border: none; 
                    padding: 16px 20px; 
                    color: var(--text-muted);
                    display: flex; 
                    align-items: center; 
                    gap: 15px; 
                    cursor: pointer; 
                    border-radius: 14px;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    margin-bottom: 10px; 
                    position: relative; 
                    font-weight: 600;
                    overflow: hidden;
                }

                .nav-btn::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05));
                    opacity: 0;
                    transition: opacity 0.4s;
                    border-radius: 14px;
                }

                .nav-btn:hover::before { opacity: 1; }
                .nav-btn:hover { 
                    color: var(--text-main); 
                    transform: translateX(5px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
                }

                .nav-btn.active {
                    background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.08));
                    color: var(--gold);
                    box-shadow: 0 8px 20px rgba(212, 175, 55, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5);
                }

                .nav-icon-box {
                    font-size: 1.1rem;
                    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .nav-btn:hover .nav-icon-box { transform: scale(1.15); }
                .nav-btn.active .nav-icon-box { transform: scale(1.2); }

                .active-indicator { 
                    position: absolute; 
                    left: 0; 
                    top: 20%; 
                    height: 60%; 
                    width: 4px; 
                    background: linear-gradient(180deg, var(--gold), var(--gold-dark));
                    border-radius: 0 4px 4px 0;
                    box-shadow: 0 0 15px var(--gold-glow);
                    animation: slideInIndicator 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                @keyframes slideInIndicator {
                    from { transform: scaleY(0); }
                    to { transform: scaleY(1); }
                }

                .sidebar-footer { 
                    padding: 30px 20px 0; 
                    border-top: 1px solid rgba(0, 0, 0, 0.06);
                    animation: fadeIn 1s cubic-bezier(0.4, 0, 0.2, 1) 0.7s backwards;
                }

                .logout-btn {
                    width: 100%; 
                    padding: 16px; 
                    background: linear-gradient(135deg, #fff1f2, #ffe4e6);
                    border: 1px solid #fecdd3; 
                    color: #e11d48;
                    border-radius: 14px; 
                    cursor: pointer; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    gap: 10px; 
                    font-weight: 700; 
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .logout-btn::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, #e11d48, #be123c);
                    opacity: 0;
                    transition: opacity 0.4s;
                }

                .logout-btn:hover::before { opacity: 1; }
                .logout-btn:hover { 
                    color: #fff; 
                    transform: translateY(-3px);
                    box-shadow: 0 10px 25px rgba(225, 29, 72, 0.3);
                }

                .logout-btn span { position: relative; z-index: 1; }
                .logout-btn i { position: relative; z-index: 1; }

                /* Cinematic Main Content */
                .admin-main { 
                    flex: 1; 
                    margin-left: 300px; 
                    padding: 60px; 
                    min-height: 100vh; 
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    z-index: 1;
                }

                .admin-header { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: flex-end; 
                    margin-bottom: 50px;
                    animation: fadeInDown 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s backwards;
                }

                .breadcrumb { 
                    font-size: 0.7rem; 
                    color: var(--gold); 
                    text-transform: uppercase; 
                    letter-spacing: 3px; 
                    font-weight: 800; 
                    margin-bottom: 12px; 
                    display: block;
                    opacity: 0.9;
                    animation: fadeIn 1s cubic-bezier(0.4, 0, 0.2, 1) 0.4s backwards;
                }

                .admin-header h1 { 
                    font-family: 'Playfair Display', serif;
                    font-size: 2.8rem; 
                    margin: 0; 
                    font-weight: 900; 
                    color: #1e293b; 
                    letter-spacing: -1.5px;
                    background: linear-gradient(135deg, #1e293b, #475569);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                }

                .view-site-link {
                    padding: 14px 24px; 
                    background: var(--glass);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid var(--glass-border); 
                    color: var(--text-main);
                    text-decoration: none; 
                    border-radius: 14px; 
                    font-size: 0.85rem; 
                    display: flex; 
                    align-items: center; 
                    gap: 10px;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
                    font-weight: 600;
                    position: relative;
                    overflow: hidden;
                }

                .view-site-link::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, var(--gold), var(--gold-dark));
                    opacity: 0;
                    transition: opacity 0.4s;
                }

                .view-site-link:hover::before { opacity: 0.1; }
                .view-site-link:hover { 
                    border-color: var(--gold); 
                    color: var(--gold); 
                    transform: translateY(-4px);
                    box-shadow: 0 15px 35px rgba(212, 175, 55, 0.2);
                }

                .view-site-link span, .view-site-link i { position: relative; z-index: 1; }

                /* Premium Glassmorphic Cards */
                .luxe-card { 
                    background: var(--glass);
                    backdrop-filter: blur(20px) saturate(180%);
                    -webkit-backdrop-filter: blur(20px) saturate(180%);
                    border: 1px solid var(--glass-border); 
                    border-radius: 28px; 
                    padding: 45px; 
                    margin-bottom: 40px; 
                    box-shadow: var(--shadow-cinematic);
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .luxe-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent);
                }

                .luxe-card:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--shadow-float);
                }

                .card-header { 
                    margin-bottom: 35px; 
                    display: flex; 
                    align-items: center; 
                    gap: 15px;
                }

                .card-header h3 { 
                    font-size: 1.4rem; 
                    margin: 0; 
                    color: #1e293b; 
                    font-weight: 800;
                    letter-spacing: -0.5px;
                }

                .card-header i { 
                    color: var(--gold);
                    font-size: 1.3rem;
                    filter: drop-shadow(0 2px 4px rgba(212, 175, 55, 0.3));
                }

                .form-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px; }
                .form-stack { display: grid; gap: 22px; }
                .form-row-flex { display: flex; gap: 22px; }
                .flex-1 { flex: 1; } .flex-2 { flex: 2; } .flex-3 { flex: 3; }

                .input-group { position: relative; }
                .input-group label { 
                    display: block; 
                    font-size: 0.7rem; 
                    color: var(--text-muted); 
                    margin-bottom: 10px; 
                    font-weight: 700; 
                    text-transform: uppercase; 
                    letter-spacing: 1.5px;
                    transition: color 0.3s;
                }

                .input-group input, .input-group select, .input-group textarea {
                    width: 100%; 
                    padding: 16px 20px; 
                    background: rgba(255, 255, 255, 0.5);
                    backdrop-filter: blur(10px);
                    border: 1.5px solid rgba(0, 0, 0, 0.08);
                    border-radius: 14px; 
                    color: var(--text-main); 
                    outline: none; 
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    font-size: 0.95rem; 
                    font-family: inherit;
                    font-weight: 500;
                }

                .input-group input:focus, .input-group select:focus, .input-group textarea:focus { 
                    border-color: var(--gold); 
                    background: rgba(255, 255, 255, 0.8);
                    box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1), 0 8px 20px rgba(212, 175, 55, 0.15);
                    transform: translateY(-2px);
                }

                .input-group input:focus + label,
                .input-group select:focus + label,
                .input-group textarea:focus + label {
                    color: var(--gold);
                }

                /* Custom File Input */
                .file-label {
                    display: flex; 
                    align-items: center; 
                    gap: 12px; 
                    padding: 16px 20px; 
                    background: rgba(255, 255, 255, 0.5);
                    backdrop-filter: blur(10px);
                    border: 2px dashed var(--gold); 
                    border-radius: 14px; 
                    cursor: pointer; 
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    color: var(--gold); 
                    font-weight: 700;
                }

                .file-label:hover { 
                    background: rgba(212, 175, 55, 0.1);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(212, 175, 55, 0.15);
                }

                .custom-file-input input { display: none; }

                /* Cinematic Buttons */
                .master-btn {
                    padding: 18px 28px; 
                    border-radius: 14px; 
                    font-weight: 800; 
                    cursor: pointer; 
                    border: none;
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    gap: 12px; 
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-size: 0.85rem;
                }

                .master-btn::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
                    opacity: 0;
                    transition: opacity 0.4s;
                }

                .master-btn:hover::before { opacity: 1; }

                .gold-btn { 
                    background: linear-gradient(135deg, var(--gold), var(--gold-dark));
                    color: #fff; 
                    box-shadow: 0 10px 25px rgba(212, 175, 55, 0.25);
                }

                .gold-btn:hover { 
                    transform: translateY(-4px) scale(1.02);
                    box-shadow: 0 15px 40px rgba(212, 175, 55, 0.35);
                    filter: brightness(1.1);
                }

                .gold-btn:active {
                    transform: translateY(-2px) scale(1);
                }

                .full-width { grid-column: 1 / -1; width: 100%; }

                /* Cinematic Data Rows */
                .items-list-header {
                    margin: 50px 0 25px;
                    padding-bottom: 15px;
                    border-bottom: 2px solid rgba(212, 175, 55, 0.2);
                }

                .items-list-header h3 {
                    font-size: 1.2rem;
                    font-weight: 800;
                    color: var(--text-main);
                    letter-spacing: -0.5px;
                }

                .data-grid { 
                    display: grid; 
                    gap: 18px;
                }

                .luxe-row {
                    background: var(--glass);
                    backdrop-filter: blur(15px) saturate(180%);
                    -webkit-backdrop-filter: blur(15px) saturate(180%);
                    border: 1px solid var(--glass-border); 
                    padding: 18px 28px; 
                    border-radius: 20px;
                    display: flex; 
                    align-items: center; 
                    gap: 20px; 
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
                    animation: slideInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) backwards;
                    position: relative;
                }

                @keyframes slideInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .luxe-row:nth-child(1) { animation-delay: 0.05s; }
                .luxe-row:nth-child(2) { animation-delay: 0.1s; }
                .luxe-row:nth-child(3) { animation-delay: 0.15s; }
                .luxe-row:nth-child(4) { animation-delay: 0.2s; }
                .luxe-row:nth-child(5) { animation-delay: 0.25s; }

                .luxe-row::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: 20px;
                    background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), transparent);
                    opacity: 0;
                    transition: opacity 0.4s;
                }

                .luxe-row:hover::before { opacity: 1; }
                .luxe-row:hover { 
                    border-color: rgba(212, 175, 55, 0.4);
                    transform: translateY(-4px) translateX(4px);
                    box-shadow: 0 15px 35px rgba(212, 175, 55, 0.15);
                }

                .row-preview { 
                    width: 60px; 
                    height: 60px; 
                    border-radius: 14px; 
                    overflow: hidden; 
                    background: rgba(241, 245, 249, 0.8);
                    border: 2px solid rgba(0, 0, 0, 0.05);
                    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
                }

                .luxe-row:hover .row-preview {
                    transform: scale(1.1) rotate(3deg);
                }

                .row-preview img { 
                    width: 100%; 
                    height: 100%; 
                    object-fit: cover;
                    transition: transform 0.4s;
                }

                .luxe-row:hover .row-preview img {
                    transform: scale(1.1);
                }

                .icon-placeholder {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--gold);
                    font-size: 1.5rem;
                }

                .row-info { flex: 1; position: relative; z-index: 1; }
                .row-title { 
                    font-weight: 800; 
                    font-size: 1.1rem; 
                    color: #1e293b;
                    margin-bottom: 4px;
                    letter-spacing: -0.3px;
                }

                .row-meta { 
                    font-size: 0.8rem; 
                    color: var(--text-muted); 
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .stars-box {
                    margin-left: 12px;
                    color: var(--gold);
                    font-size: 0.85rem;
                    letter-spacing: 2px;
                    filter: drop-shadow(0 2px 4px rgba(212, 175, 55, 0.3));
                }

                .italic-text {
                    font-style: italic;
                    opacity: 0.85;
                    line-height: 1.6;
                }

                .service-icon-preview {
                    font-size: 1.6rem;
                    color: var(--gold);
                    width: 60px;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05));
                    border-radius: 14px;
                    border: 2px solid rgba(212, 175, 55, 0.2);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .luxe-row:hover .service-icon-preview {
                    transform: scale(1.1) rotate(5deg);
                    box-shadow: 0 8px 20px rgba(212, 175, 55, 0.2);
                }

                .era-badge {
                    font-weight: 900;
                    color: var(--gold);
                    font-size: 1.2rem;
                    width: 70px;
                    text-align: center;
                    font-family: 'Playfair Display', serif;
                    letter-spacing: -0.5px;
                }

                .delete-icon-btn {
                    width: 42px; 
                    height: 42px; 
                    background: linear-gradient(135deg, #fff5f5, #ffe4e6);
                    color: #ef4444; 
                    border: 1.5px solid #fecdd3;
                    border-radius: 12px; 
                    cursor: pointer; 
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                }

                .delete-icon-btn::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    opacity: 0;
                    transition: opacity 0.4s;
                }

                .delete-icon-btn:hover::before { opacity: 1; }
                .delete-icon-btn:hover { 
                    color: #fff; 
                    transform: rotate(10deg) scale(1.1);
                    box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
                }

                .delete-icon-btn i { position: relative; z-index: 1; }

                /* Presence Section */
                .master-presence {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.5));
                }

                .card-header.centered {
                    flex-direction: column;
                    text-align: center;
                    gap: 10px;
                }

                .card-header.centered i {
                    font-size: 2.5rem;
                    margin-bottom: 10px;
                }

                .card-header.centered p {
                    color: var(--text-muted);
                    font-size: 0.9rem;
                    margin: 5px 0 0 0;
                }

                .presence-grid { 
                    display: grid; 
                    grid-template-columns: 1fr 1fr 1fr; 
                    gap: 22px;
                }

                .presence-input-box {
                    background: rgba(255, 255, 255, 0.6);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.8); 
                    padding: 22px; 
                    border-radius: 18px;
                    display: flex; 
                    gap: 15px; 
                    align-items: flex-start;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .presence-input-box:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 30px rgba(212, 175, 55, 0.1);
                }

                .presence-input-box i { 
                    color: var(--gold); 
                    font-size: 1.3rem; 
                    margin-top: 5px;
                    filter: drop-shadow(0 2px 4px rgba(212, 175, 55, 0.3));
                }

                .input-wrap { flex: 1; }

                .ultimate-sync { 
                    background: linear-gradient(135deg, #1e293b, #0f172a);
                    margin-top: 15px;
                }

                .ultimate-sync:hover {
                    background: linear-gradient(135deg, #0f172a, #020617);
                }

                /* Cinematic Animations */
                .fade-in-section { 
                    animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                }

                @keyframes fadeInUp { 
                    from { opacity: 0; transform: translateY(30px); } 
                    to { opacity: 1; transform: translateY(0); } 
                }

                /* Mobile Responsive */
                .admin-mobile-nav { display: none; }

                @media (max-width: 1200px) {
                    .admin-sidebar { width: 280px; }
                    .admin-main { margin-left: 280px; padding: 45px; }
                    .form-grid-3, .presence-grid { grid-template-columns: 1fr 1fr; }
                    .admin-header h1 { font-size: 2.4rem; }
                }

                @media (max-width: 900px) {
                    .admin-sidebar { 
                        left: -300px; 
                        position: fixed;
                        animation: none;
                    }
                    .admin-sidebar.open { 
                        left: 0;
                        animation: slideInLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    .admin-main { 
                        margin-left: 0; 
                        padding: 25px; 
                        padding-top: 100px;
                    }
                    .admin-mobile-nav {
                        display: flex; 
                        justify-content: space-between; 
                        align-items: center; 
                        padding: 18px 25px;
                        background: var(--glass);
                        backdrop-filter: blur(20px) saturate(180%);
                        -webkit-backdrop-filter: blur(20px) saturate(180%);
                        border-bottom: 1px solid var(--glass-border);
                        position: fixed; 
                        top: 0; 
                        width: 100%; 
                        z-index: 1001;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    }
                    .mobile-logo {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    }
                    .mobile-logo h2 {
                        margin: 0;
                        font-size: 1.3rem;
                        font-family: 'Playfair Display', serif;
                        font-weight: 900;
                    }
                    .mobile-logo i {
                        color: var(--gold);
                        font-size: 1.5rem;
                    }
                    .sidebar-toggle { 
                        background: transparent; 
                        border: none; 
                        color: var(--text-main); 
                        font-size: 1.6rem;
                        cursor: pointer;
                        transition: transform 0.3s;
                    }
                    .sidebar-toggle:active {
                        transform: scale(0.9);
                    }
                    .sidebar-backdrop { 
                        position: fixed; 
                        inset: 0; 
                        background: rgba(0, 0, 0, 0.3);
                        backdrop-filter: blur(8px);
                        -webkit-backdrop-filter: blur(8px);
                        z-index: 999;
                        animation: fadeIn 0.3s;
                    }
                    .form-grid-3, .presence-grid, .form-row-flex { 
                        grid-template-columns: 1fr; 
                        flex-direction: column;
                    }
                    .admin-header h1 { font-size: 2rem; }
                    .luxe-card { padding: 30px; }
                }

                @media (max-width: 480px) {
                    .admin-main { padding: 20px; padding-top: 90px; }
                    .admin-header h1 { font-size: 1.8rem; }
                    .luxe-card { padding: 25px; border-radius: 20px; }
                    .row-preview { width: 50px; height: 50px; }
                }
            `}</style>
        </div>
    );

};

export default AdminPanel;
