import React, { useState } from "react";
import styles from './Login.module.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login Attempt:", { email, password });
  };

  return (
    <div className={styles.loginContainer}>
      <h1>social.ai</h1>
      <p className={styles.loginSubtitle}>
        Effortlessly schedule, manage, and optimize your social media posts with
        the power of AI
      </p>

      <div className={styles.loginCard}>
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

          <button type="submit" className={styles.loginButton}>
            Continue with email
          </button>
        </form>
      </div>

      <button className={styles.signupButton}>Forgot password?</button>
    </div>
  );
};

export default Login;