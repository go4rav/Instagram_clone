import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import { useNavigate } from "react-router-dom";

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const navigate  = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        var invalid = false;
        if (!token) {
            invalid = true;
        }
        else
        {

            const payload = JSON.parse(atob(token.split(".")[1]));
            const currentTime = Date.now() / 1000; // seconds

             if(payload.exp < currentTime) {invalid = true;}


        }
        if(invalid) navigate("/login");
        axios.get(`${API_BASE_URL}posts/`,{
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }})
            .then(response => setPosts(response.data))
            .catch(error => console.error("Error fetching posts:", error));
    }, []);

    return (
        <div>
            <h2>📸 Instagram Feed</h2>
            {posts.map(post => (
                <div key={post.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
                    <h4>{post.author}</h4>
                    <img src={post.image} alt="Post" width="300" />
                    <p>{post.caption}</p>
                    <small>{new Date(post.created_at).toLocaleString()}</small>
                </div>
            ))}
        </div>
    );
};

export default PostList;
