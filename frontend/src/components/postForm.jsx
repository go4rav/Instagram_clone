import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

const PostForm = () => {
    const [image, setImage] = useState(null);
    const [caption, setCaption] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", image);
        formData.append("caption", caption);

        try {
            await axios.post(`${API_BASE_URL}/posts/`, formData
            , {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }}
                );
            window.location.reload();  // Refresh feed after posting
        } catch (error) {
            console.error("Error uploading post:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} required />
            <input type="text" placeholder="Enter caption" value={caption} onChange={(e) => setCaption(e.target.value)} required />
            <button type="submit">Upload</button>
        </form>
    );
};

export default PostForm;
