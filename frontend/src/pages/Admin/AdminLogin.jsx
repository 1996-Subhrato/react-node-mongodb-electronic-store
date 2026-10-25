import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail } from 'lucide-react';
import './AdminLogin.css';

const AdminLogin = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { loginAdmin, admin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (admin) {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [admin, navigate]);

    const from = location.state?.from?.pathname || "/admin/dashboard";

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        try {
            await loginAdmin(data.email, data.password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid admin credentials');
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-split">
            {/* Left Side - Visuals */}
            <div className="admin-login-left">
                <div className="admin-left-content animate-fade">
                    {/* <img src="https://images.unsplash.com/photo-1596501048549-0648f95c808f?auto=format&fit=crop&q=80&w=1200" alt="Premium Quality" className="admin-login-bg" /> */}
                    <div className="admin-left-overlay">
                        <div className="overlay-text">
                            <h2>TechZone</h2>
                            <h1>Premium Control Panel</h1>
                            <p>Manage products, track orders, and analyze inventory with our AI-powered intelligent dashboard.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="admin-login-right">
                <div className="admin-login-card animate-fade">
                    <div className="login-header">
                        <h1>Staff Portal</h1>
                        <p>Enter your administrative credentials to access the TechZone management system.</p>
                    </div>

                    {error && <div className="error-alert">{error}</div>}

                    <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                        <div className="input-group">
                            <label>Staff Email</label>
                            <div className="input-wrapper">
                                <Mail size={18} />
                                <input
                                    type="text"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address format"
                                        }
                                    })}
                                />
                            </div>
                            {errors.email && <span className="validation-error">{errors.email.message}</span>}
                        </div>

                        <div className="input-group">
                            <label>Security Password</label>
                            <div className="input-wrapper">
                                <Lock size={18} />
                                <input
                                    type="password"
                                    {...register("password", {
                                        required: "Password is required",
                                        // minLength: {
                                        //     value: 6,
                                        //     message: "Password must be at least 6 characters"
                                        // }
                                    })}
                                />
                            </div>
                            {errors.password && <span className="validation-error">{errors.password.message}</span>}
                        </div>

                        <button className="btn btn-primary login-btn" disabled={loading}>
                            {loading ? 'Verifying...' : 'Login'}
                        </button>
                    </form>

                    {/* <div className="login-footer">
                        <p>Protected by AI-Powered Security. Unauthorized access attempts are monitored.</p>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
