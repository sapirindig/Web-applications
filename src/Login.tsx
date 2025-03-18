import React, { useState } from "react";
import styles from './Login.module.css';
import logo from './Images/Logo.png';
import { Link, useNavigate } from 'react-router-dom'; // הוספנו useNavigate
import GoogleLoginButton from "./components/GoogleLoginButton";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login Attempt:", { email, password });
  };

  return (
    <div className={styles.loginContainer}>
      {/* הצגת הלוגו */}
      <img src={logo} alt="EcoShare Logo" className={styles.logo} />

      {/* טקסט ברוכים הבאים */}
      <p className={styles.loginSubtitle}>
        Welcome to EcoShare – share what you don’t need, help those who need, and connect with your community!
      </p>

      <div className={styles.loginCard}>
        {/* טופס התחברות עם מייל וסיסמה */}
        <form onSubmit={handleLogin}>
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

          {/* כפתור התחברות עם מייל */}
          <button type="submit" className={styles.loginButton}>
            Continue with email
          </button>
        </form>

        {/* כפתור התחברות עם גוגל */}
        <div className={styles.googleLoginButton}>
          <GoogleLoginButton />
        </div>
      </div>

      {/* כפתור שחזור סיסמה */}
      <button className={styles.Forgotpassword}>Forgot password?</button>

      {/* כפתור הרשמה */}
      <button className={styles.signupButton}>
        <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>Sign Up</Link>
      </button>
    </div>
  );
};

export default Login;
