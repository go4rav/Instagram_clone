import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
import './SignUpPage.css'

const UpdateProfile= () => {
    const [bio, setBio] = useState("");
    const [fullname, setFullname] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const navigate = useNavigate();

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }
            const formData = new FormData();
            formData.append("user_name", fullname);
            formData.append("bio", bio);
            formData.append("display_profile", profilePicture);
            const response = await axios.post(`${API_BASE_URL}profile/update/`,
                formData,{
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }});
            console.log("Profile updated")
            console.log(response);
            navigate("/login");  // Go to feed
        } catch (error) {
//             alert("Profile Update failed!");
            console.error(error);
        }
    };

    return (
    <div className="signup-page">
        <div className="signup-container">
            <h2>Add Profile info</h2>
            <form onSubmit={handleProfileUpdate} className="signup-form">
                <input
                    type="text"
                    placeholder="Full Name"
                    id="full_name"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="Write a few words about yourself"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    required
                />

                <input
                    type="file"
                    onChange={(e) => setProfilePicture(e.target.value)}
                    required
                />
                <button type="submit">Update</button>
            </form>
        </div>
      </div>
    );
};

export default UpdateProfile;
