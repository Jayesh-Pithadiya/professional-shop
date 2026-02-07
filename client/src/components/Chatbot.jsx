import { useState, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Hello! Welcome to Pithadiya Tailor 👋. How can I help you today?',
      buttons: ['Material Options', 'Tailor Name', 'Pricing', 'Location', 'Working Hours', 'Custom Orders']
    }
  ]);

  useEffect(() => {
    if (!hasAutoOpened) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasAutoOpened(true);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [hasAutoOpened]);

  const responses = {
    'Material Options': {
      text: 'We offer a variety of premium fabrics. Which one interests you?',
      buttons: ['Silk', 'Cotton', 'Linen', 'Blends', 'Back']
    },
    'Silk': { text: 'Our silk collection includes premium quality fabrics perfect for traditional and formal wear. Would you like to know pricing or place a custom order?', buttons: ['Pricing', 'Custom Orders', 'Back'] },
    'Cotton': { text: 'We offer breathable, high-quality cotton fabrics ideal for everyday comfort and casual wear.', buttons: ['Pricing', 'Custom Orders', 'Back'] },
    'Linen': { text: 'Our linen collection features lightweight, elegant fabrics perfect for summer and formal occasions.', buttons: ['Pricing', 'Custom Orders', 'Back'] },
    'Blends': { text: 'Our blend fabrics combine the best properties of multiple materials for durability and style.', buttons: ['Pricing', 'Custom Orders', 'Back'] },
    'Tailor Name': { text: 'Pithadiya Tailor is led by Master Tailor Tushar Pithadiya, with years of expertise in bespoke tailoring.', buttons: ['Location', 'Working Hours', 'Back'] },
    'Pricing': { text: 'Our pricing varies based on fabric and design complexity. For accurate quotes, please contact us at +919925739282 or visit our store.', buttons: ['Location', 'Custom Orders', 'Back'] },
    'Location': { text: 'Shop -2, Harikrishna Complex, Main Rd, nr. Madhuram Gate, Timbavadi, Junagadh, Gujarat 362015', buttons: ['Get Directions', 'Working Hours', 'Back'] },
    'Working Hours': { text: 'We are open Monday to Saturday, 10:00 AM - 8:00 PM. Closed on Sundays.', buttons: ['Location', 'Custom Orders', 'Back'] },
    'Custom Orders': { text: 'We specialize in custom tailoring! Contact us at +919925739282 (WhatsApp available) or visit our store to discuss your requirements.', buttons: ['Location', 'Material Options', 'Back'] },
    'Get Directions': { text: 'Opening Google Maps...', link: 'https://maps.app.goo.gl/eJJdrjBRRBrSMmjN7', buttons: ['Back'] },
    'Back': {
      text: 'How else can I help you?',
      buttons: ['Material Options', 'Tailor Name', 'Pricing', 'Location', 'Working Hours', 'Custom Orders']
    }
  };

  const handleButtonClick = (option) => {
    setMessages(prev => [...prev, { type: 'user', text: option }]);
    
    const response = responses[option];
    if (response) {
      if (response.link) window.open(response.link, '_blank');
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'bot', text: response.text, buttons: response.buttons }]);
      }, 500);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className="chatbot-toggle" onClick={toggleChat}>
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h3>Pithadiya Tailor Assistant</h3>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.type}`}>
                <div className="message-text">{msg.text}</div>
                {msg.buttons && (
                  <div className="message-buttons">
                    {msg.buttons.map((btn, i) => (
                      <button key={i} onClick={() => handleButtonClick(btn)}>{btn}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
