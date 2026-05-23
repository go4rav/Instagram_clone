import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FeedPage from "./pages/FeedPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import UploadPostModal from "./components/UploadPostModal"
import ProfilePage from "./pages/ProfilePage";
import UpdateProfile from "./pages/UpdateProfile";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<FeedPage />} />
                <Route path="/upload" element={<UploadPostModal />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/updateprofile" element={<UpdateProfile />} />
                <Route path="/profile/:username" element={<ProfilePage />} />
            </Routes>
        </Router>
    );
}

export default App;
