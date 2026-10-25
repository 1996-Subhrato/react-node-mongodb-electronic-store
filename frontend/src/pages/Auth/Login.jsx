import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, Mail, Lock, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import './Auth.css';

const Login = () => {
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    try {
        await loginUser(data.email, data.password);
        navigate(from, { replace: true });
    } catch (err) {
        setServerError(err.response?.data?.message || 'Invalid email or password');
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
                <h2>Welcome to the <br />Future of Tech</h2>
                <p>Join our community of 50,000+ technology enthusiasts and discover the most innovative gadgets in the market.</p>
            </div>

            <div className="auth-features-list">
                <div className="auth-feature-item">
                    <div className="icon-box"><Sparkles size={20} /></div>
                    <span>Next-Gen Technology Access</span>
                </div>
                <div className="auth-feature-item">
                    <div className="icon-box"><Zap size={20} /></div>
                    <span>24/7 Premium Technical Support</span>
                </div>
                <div className="auth-feature-item">
                    <div className="icon-box"><ShieldCheck size={20} /></div>
                    <span>Secured Global Payments</span>
                </div>
            </div>
        </div>

        {/* Right Side: Form */}
        <div className="auth-form-section">
            <div className="auth-header">
                <h2>Sign In</h2>
                <p>Enter your credentials to access your account</p>
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
                    Password 
                    {errors.password && <span className="error-text-small">{errors.password.message || 'Required'}</span>}
                </label>
                <div className="input-container">
                    <Lock size={18} />
                    <input 
                        type="password" 
                        placeholder="Enter your password" 
                        {...register('password', { required: 'Password is required' })}
                    />
                </div>
            </div>

            <button className="btn btn-primary auth-submit-btn" type="submit" disabled={loading}>
                {loading ? 'Verifying...' : 'Sign In'}
            </button>
            </form>

            <div className="auth-footer">
            <p>Don't have an account? <Link to="/register">Create one <ArrowRight size={14} /></Link></p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
