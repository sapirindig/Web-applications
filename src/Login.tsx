import React, { useState } from "react";
import styles from './Login.module.css';
import logo from './Images/Logo.png';
import { Link, useNavigate } from 'react-router-dom';
import GoogleLoginButton from "./components/GoogleLoginButton";
import axios from 'axios';


const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/login', { email, password });

            if (response.status === 200) { // בדיקה שהבקשה הצליחה
                localStorage.setItem('authToken', response.data.accessToken);
                localStorage.setItem('userId', response.data._id);
                navigate('/home');
            } else {
                setError('שגיאה בהתחברות. אנא נסה שוב.',);
            }
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data);
            } else {
                setError('שגיאה בהתחברות. אנא נסה שוב.');
            }
        }
    };

    const handleGoogleLoginSuccess = () => {
        navigate('/home');
    };

    return (
        <div className={styles.loginContainer}>
            <img src={logo} alt="EcoShare Logo" className={styles.logo} />
            <p className={styles.loginSubtitle}>
                Welcome to EcoShare – share what you don’t need, help those who need, and connect with your community!
            </p>
            <div className={styles.loginCard}>
                <form onSubmit={handleLogin}>
                    {error && <p className={styles.errorMessage}>{error}</p>}
                    <div className={styles.inputGroup}>
                        <span className={styles.inputIcon}>
                            <i className="fas fa-user"></i>
                        </span>
                        <input
                            type="email"
                            className={styles.loginInput}
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <span className={styles.inputIcon}>
                            <i className="fas fa-lock"></i>
                        </span>
                        <input
                            type="password"
                            className={styles.loginInput}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className={styles.loginButton}>
                        Continue with email
                    </button>
                </form>
                <div className={styles.googleLoginButton}>
                    <GoogleLoginButton onSuccess={handleGoogleLoginSuccess} />
                </div>
            </div>
            <button className={styles.Forgotpassword}>Forgot password?</button>
            <button className={styles.signupButton}>
                <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>Sign Up</Link>
            </button>
        </div>
    );
};

export default Login;