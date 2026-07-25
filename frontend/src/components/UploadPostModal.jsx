import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import validateRefreshToken from "../utils/tokenUtils";
import API_BASE_URL from "../config";
import './UploadPostModal.css'

const UploadPostModal= () => {
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState("");
    const navigate = useNavigate();

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("caption", caption);
            formData.append("image", image);
            const response = await axios.post(`${API_BASE_URL}/posts/`,
                formData,{
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }});
            console.log("New post added.")
            console.log(response);
            navigate("/");  // Go to feed
        } catch (error) {
//             alert("Profile Update failed!");
            console.log(error);
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


    }, [navigate]);

    return (
    <div className="add_post-page">
        <div className="add_post-container">
            <h2>Create New Post</h2>
            <br/>
            <form onSubmit={handleProfileUpdate} className="add_post-form">
                <input
                    type="text"
                    placeholder="Enter Caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    required
                />

                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                />
                <button type="submit">Update</button>
            </form>
        </div>
      </div>
    );
};

export default UploadPostModal;
