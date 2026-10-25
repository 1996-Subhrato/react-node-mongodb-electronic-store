import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import './AIAssistant.css';
import { Send, Sparkles, BrainCircuit, Laptop, Headphones, Smartphone, Watch, Zap, User, ArrowLeft, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AIAssistant = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'ai',
            text: "Hello! I'm your TechZone AI Product Advisor. I have real-time context on all our products — smartphones, laptops, headphones, smartwatches, and accessories. Ask me anything to find the perfect gadget for your needs and budget!",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const scrollContainerRef = useRef(null);

    const scrollToBottom = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (queryText) => {
        if (!queryText || loading) return;

        const userMsg = {
            id: Date.now(),
            type: 'user',
            text: queryText,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setLoading(true);

        try {
            const data = await api.post('/ai/ask-general', { question: queryText });
            
            const aiMsg = {
                id: Date.now() + 1,
                type: 'ai',
                text: data.answer,
                timestamp: new Date()
            };
            
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            console.error('AI Error:', err);
            setMessages(prev => [...prev, {
                id: Date.now() + 2,
                type: 'ai',
                text: "I apologize, but I'm having trouble connecting to my knowledge base right now. Please try again in a moment.",
                timestamp: new Date()
            }]);
        } finally {
            setLoading(false);
        }
    };

    const quickTopics = [
        { icon: <Laptop size={18} />, label: "Best for Coding", query: "Which laptop is best for coding and software development?" },
        { icon: <Smartphone size={18} />, label: "Under ₹15,000", query: "Best smartphones under ₹15,000?" },
        { icon: <Zap size={18} />, label: "Best Battery", query: "Which phone has the best battery life in your store?" },
        { icon: <Headphones size={18} />, label: "Top Headphones", query: "Best headphones under ₹5,000?" },
        { icon: <Watch size={18} />, label: "Smart Watches", query: "Which smartwatch is best for fitness tracking?" }
    ];

    return (
        <div className="ai-assistant-page animate-fade">
            <div className="container assistant-layout">
                {/* Sidebar */}
                <aside className="assistant-sidebar">
                    <Link to="/" className="back-btn">
                        <ArrowLeft size={18} /> Back to Store
                    </Link>
                    
                    <div className="sidebar-group">
                        <h3>Our Expertise</h3>
                        <div className="ai-stats-card glass">
                            <div className="stat-item">
                                <span className="label">Focus</span>
                                <span className="value">Electronics &amp; Gadgets</span>
                            </div>
                            <div className="stat-item">
                                <span className="label">Database</span>
                                <span className="value">Verified Store Inventory</span>
                            </div>
                        </div>
                    </div>

                    <button className="clear-chat" onClick={() => setMessages([messages[0]])}>
                        <Trash2 size={16} /> Clear Conversation
                    </button>
                </aside>

                {/* Main Chat Area */}
                <main className="chat-container glass">
                    <header className="chat-header">
                        <div className="ai-profile">
                            <div className="ai-avatar">
                                <BrainCircuit size={24} />
                            </div>
                            <div>
                                <h2>AI Product Advisor</h2>
                                <span className="online-status">Online and ready to help</span>
                            </div>
                        </div>
                    </header>

                    <div className="messages-flow" ref={scrollContainerRef}>
                        {messages.map((msg) => (
                            <div key={msg.id} className={`message-wrapper ${msg.type}`}>
                                {msg.type === 'ai' && (
                                    <div className="msg-avatar ai">
                                        <Sparkles size={14} />
                                    </div>
                                )}
                                <div className="message-bubble">
                                    <p>{msg.text}</p>
                                    <span className="msg-time">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                {msg.type === 'user' && (
                                    <div className="msg-avatar user">
                                        <User size={14} />
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && (
                            <div className="message-wrapper ai">
                                <div className="msg-avatar ai">
                                    <Sparkles size={14} />
                                </div>
                                <div className="message-bubble typing">
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="options-footer glass">
                        <p className="options-title">Select a topic to explore:</p>
                        <div className="options-grid">
                            {quickTopics.map((topic, i) => (
                                <button 
                                    key={i} 
                                    className="option-chip"
                                    onClick={() => handleSend(topic.query)}
                                    disabled={loading}
                                >
                                    {topic.icon}
                                    <span>{topic.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AIAssistant;
