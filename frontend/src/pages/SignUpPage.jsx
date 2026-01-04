import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
import './SignUpPage.css'

const SignUpPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}users/signup/`, {
                username,
                password,
            });
            console.log(response);
            navigate("/login");  // Go to feed
        } catch (error) {
            alert("Sign up failed!");
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
                    placeholder="Name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
