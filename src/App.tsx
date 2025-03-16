import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import UserProfile from "./UserProfile"; // דף פרופיל המשתמש
import Home from "./Home"; //   ייבוא של דף הבית

const App: React.FC = () => {
  return (
    <Router>
      <div style={{ height: "100vh", width: "100vw", margin: 0, padding: 0 }}>
        <Routes>
          <Route path="/" element={<Login />} /> {/* דף הכניסה */}
          <Route path="/signup" element={<SignUp />} /> {/* דף ההרשמה */}
          <Route path="/userprofile" element={<UserProfile />} /> {/* דף פרופיל המשתמש */}
          <Route path="/home" element={<Home />} /> {/* ✅ דף הבית הראשי */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
