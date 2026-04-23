import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
import './SignUpPage.css'

const SignUpPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
             if(password!=confirmPassword)
             {
               throw new Error("Passwords do not match");
             }
            const response = await axios.post(`${API_BASE_URL}users/signup/`, {
                username,
                password,
            });
            console.log(response);
            localStorage.setItem("token", response.data.access);
            navigate(`/updateprofile`); // Go to feed
        } catch (error) {
            alert(`Sign up failed! ${error.message}`);
            console.error(error);
        }
    };

    return (
    <div className="signup-page">
        <div className="signup-container">
            <h2>SignUp</h2>
            <form onSubmit={handleSignUp} className="signup-form">
                <input
                    type="text"
                    placeholder="Username"
                    id="user_name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    id = "password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    id = "confirm_password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

{/*                 <input */}
{/*                     type="file" */}
{/*                     onChange={(e) => setPassword(e.target.value)} */}
{/*                     required */}
{/*                 /> */}
                <button type="submit">Sign Up</button>
            </form>
        </div>
      </div>
    );
};

export default SignUpPage;
