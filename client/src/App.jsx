import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import Chatbot from './components/Chatbot';
import Hero from './sections/Hero';
import { About, Journey, Services } from './sections/AboutJourneyServices';
import { Process, WhyChooseUs, Reviews, Contact, Footer } from './sections/OtherSections';
import Gallery from './sections/Gallery';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem('adminToken');
  return token ? children : <Navigate to="/login/private" replace />;
};

const LandingPage = ({ loading, setLoading }) => (
  <>
    {loading && <Preloader onComplete={() => setLoading(false)} />}
    {!loading && (
      <Layout>
        <CustomCursor />
        <Navbar />
        <Chatbot />
        <Hero />
        <div className="measure-divider"></div>
        <About />
        <div className="measure-divider"></div>
        <Journey />
        <div className="measure-divider"></div>
        <Services />
        <div className="measure-divider"></div>
        <Process />
        <div className="measure-divider"></div>
        <Gallery />
        <div className="measure-divider"></div>
        <WhyChooseUs />
        <div className="measure-divider"></div>
        <Reviews />
        <div className="measure-divider"></div>
        <Contact />
        <Footer />
      </Layout>
    )}
  </>
);

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage loading={loading} setLoading={setLoading} />} />
          <Route path="/login/private" element={<Login />} />
          <Route
            path="/private"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          {/* Catch-all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
