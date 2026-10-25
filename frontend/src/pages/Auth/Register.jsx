import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { AlertCircle, User, Mail, Phone, Lock, ArrowRight, Gift, Zap, ShieldCheck } from 'lucide-react';
import './Auth.css';

const Register = () => {
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: ''
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    try {
        await api.post('/auth/register', data);
        navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err) {
        setServerError(err.response?.data?.message || 'Registration failed');
        setLoading(false);
    }
  };

  return (
    <div className="auth-page animate-fade">
      <div className="auth-split-container">
        {/* Left Side: Brand Content */}
        <div className="auth-side-panel">
            <div className="auth-side-content">
                <span className="auth-side-logo">TechZone</span>
                <h2>Join the Elite <br />Tech Community Today</h2>
                <p>Create an account today and unlock a world of exclusive benefits and cutting-edge electronic gadgets.</p>
            </div>

            <div className="auth-features-list">
                <div className="auth-feature-item">
                    <div className="icon-box"><Gift size={20} /></div>
                    <span>Exclusive Member-Only Deals</span>
                </div>
                <div className="auth-feature-item">
                    <div className="icon-box"><Zap size={20} /></div>
                    <span>Early Access to New Tech Launches</span>
                </div>
                <div className="auth-feature-item">
                    <div className="icon-box"><ShieldCheck size={20} /></div>
                    <span>AI-Powered Product Recommendations</span>
                </div>
            </div>
        </div>

        {/* Right Side: Form */}
        <div className="auth-form-section">
            <div className="auth-header">
                <h2>Create Account</h2>
                <p>Join TechZone and explore the latest electronics</p>
            </div>

            {serverError && (
            <div className="error-alert">
                <AlertCircle size={18} />
                <span>{serverError}</span>
            </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="field-group">
                <label>
                    Full Name 
                    {errors.name && <span className="error-text-small">{errors.name.message || 'Required'}</span>}
                </label>
                <div className="input-container">
                    <User size={18} />
                    <input 
                        type="text" 
                        placeholder="e.g. John Doe" 
                        {...register('name', { required: 'Name is required' })}
                    />
                </div>
            </div>

            <div className="field-group">
                <label>
                    Email Address 
                    {errors.email && <span className="error-text-small">{errors.email.message || 'Required'}</span>}
                </label>
                <div className="input-container">
                    <Mail size={18} />
                    <input 
                        type="email" 
                        placeholder="name@example.com" 
                        {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                        }
                        })}
                    />
                </div>
            </div>

            <div className="field-group">
                <label>
                    Phone Number 
                    {errors.phone && <span className="error-text-small">{errors.phone.message || 'Required'}</span>}
                </label>
                <div className="input-container">
                    <Phone size={18} />
                    <input 
                        type="text" 
                        placeholder="10-digit mobile number" 
                        {...register('phone', { 
                        required: 'Phone is required',
                        pattern: {
                            value: /^[0-9]{10}$/,
                            message: 'Enter a valid 10-digit number'
                        }
                        })}
                    />
                </div>
            </div>

            <div className="field-group">
                <label>
                    Password 
                    {errors.password && <span className="error-text-small">{errors.password.message || 'Required'}</span>}
                </label>
                <div className="input-container">
                    <Lock size={18} />
                    <input 
                        type="password" 
                        placeholder="At least 6 characters" 
                        {...register('password', { 
                        required: 'Password is required',
                        minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters'
                        }
                        })}
                    />
                </div>
            </div>

            <button className="btn btn-primary auth-submit-btn" type="submit" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            </form>

            <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Login here <ArrowRight size={14} /></Link></p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
