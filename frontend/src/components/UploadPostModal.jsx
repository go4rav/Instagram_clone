import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import "./UploadPostModal.css";

const UploadPostModal = ({ isOpen, onClose, onPostCreated }) => {
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState(null);
    const token = localStorage.getItem("token");

    if (!isOpen) return null; // Don’t render if modal is closed

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) {
            alert("Please select an image");
            return;
        }

        const formData = new FormData();
        formData.append("caption", caption);
        formData.append("image", image);

        try {
            await axios.post(`${API_BASE_URL}posts/`, formData, {
                headers: {
                   "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
            });
             window.location.reload();  // Refresh feed after posting
            setCaption("");
            setImage(null);
            onPostCreated(); // Refresh posts in parent
            onClose();       // Close modal
        } catch (error) {
            console.error(error);
            alert("Failed to upload post");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <button className="modal-close" onClick = {onClose}>x
                </button>
                <h2 className="modal-title">Create New Post</h2>
                <form onSubmit={handleSubmit} className="modal-form">
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} required />
{/*              <input type="text" placeholder="Enter caption" value={caption} onChange={(e) => setCaption(e.target.value)} /> */}
            <button type="submit">Upload</button>
                </form>
            </div>
        </div>
    );
};

export default UploadPostModal;
