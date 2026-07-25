import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import validateRefreshToken from "../utils/tokenUtils";
import API_BASE_URL from "../config";
import './SignUpPage.css'

const UpdateProfile= () => {
    const [bio, setBio] = useState("");
    const [fullname, setFullName] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const navigate = useNavigate();

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("user_name", fullname);
            formData.append("bio", bio);
            formData.append("display_profile", profilePicture);
            const response = await axios.post(`${API_BASE_URL}/profile/update/`,
                formData,{
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }});
            console.log("Profile updated")
            console.log(response);
            navigate("/");  // Go to feed
        } catch (error) {
//             alert("Profile Update failed!");
            console.error(error);
        }
    };

    useEffect(() => {

        const checkToken = async () => {
            const accesstoken = localStorage.getItem("token");
            const refreshtoken = localStorage.getItem("refresh");

            // If already logged in → go home
            const isValid = await validateRefreshToken(accesstoken, refreshtoken, navigate);
            if (!isValid) {
                navigate("/login");
            }
        }

        checkToken();

        axios.get(`${API_BASE_URL}/profile/getProfileSummary`, {headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`}}).then(response =>
          { 
            setFullName(response.data.full_name);
            setBio(response.data.bio);
            setProfilePicture(response.data.display_profile);})
             
          .catch(error=> console.error("Error fetch user summary details", error));


    }, [navigate]);

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
                    onChange={(e) => setFullName(e.target.value)}
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
                    onChange={(e) => setProfilePicture(e.target.files[0])}
                />
                <button type="submit">Update</button>
            </form>
        </div>
      </div>
    );
};

export default UpdateProfile;
