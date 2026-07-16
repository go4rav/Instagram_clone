import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import { useNavigate } from "react-router-dom";
import { isTokenInvalid } from "../utils/tokenUtils";

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const navigate  = useNavigate();

    useEffect(() => {
         const token = localStorage.getItem("token");
        // If already logged in → go home
        if (!token || isTokenInvalid(token)) {
            navigate("/login");
        }
        
        axios.get(`${API_BASE_URL}posts/`,{
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }})
            .then(response => { console.log(response.data); setPosts(response.data);})
            .catch(error => console.error("Error fetching posts:", error));
    }, []);

    return (
        posts.length === 0 ? (
        <div className="bg-black w-full h-screen"></div>) : 
        (<div>
            {posts.map(post => (
            <div class="bg-black rounded-lg">
            <div class="mb-4">
            <div class="flex flex-row items-center text-center gap-2">
                <div class="w-11 h-11 rounded-full p-0.5 bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500">
                <div class="h-10 w-10 rounded-full bg-white wrapper overflow-hidden border-2 border-black">
                    <img class="w-full h-full object-contain" src={post.display_profile}  alt="Post" />
                </div>
                </div>
                <p class="text-white text-sm font-semibold pb-2 pt-1">{post.author}</p>
            </div>
            <div></div>
            </div>
            <div>
            <div>
                <img class="w-[100%]" src={post.image} alt="Post" />
            </div>
            </div>
            <div>
            <div class="pt-3 pb-2">
                <ul class="text-white text-xl flex space-x-8">
                <li>
                    <i class="fa-regular fa-heart cursor-pointer hover:text-gray-300"></i>
                </li>
                <li>
                    <i class="fa-regular fa-comments cursor-pointer hover:text-gray-300"></i>
                </li>
                <li>
                    <i class="fa-regular fa-paper-plane cursor-pointer hover:text-gray-300"></i>
                </li>
                <li>
                    <i class="fa-regular fa-bookmark  cursor-pointer hover:text-gray-300"></i>
                </li>
                </ul>
            </div>
            </div>
            <div class=" pt-1 pb-2 space-y-1 text-sm">
            <div>
                <p class="font-semibold text-white cursor-pointer">37,103 likes</p>
            </div>
            <div>
                <p class="text-white cursor-pointer">Life has no meaning :)</p>
            </div>
            <div>
                <p class="text-gray-500 cursor-pointer">View all 400 comments</p>
            </div>
            </div>
            <div class="flex flex-row justify-between py-3 space-x-3">
            <div class="">
                <p class="text-gray-400 text-sm">Add a comment...</p>
            </div>
            </div>
        </div>))}
      </div>
        // <div>
        //     <h2>📸 Instagram Feed</h2>
        //     {posts.map(post => (
        //         <div key={post.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
        //             <h4>{post.author}</h4>
        //             <img src={post.image} alt="Post" width="300" />
        //             <p>{post.caption}</p>
        //             <small>{new Date(post.created_at).toLocaleString()}</small>
        //         </div>
        //     ))}
        // </div>
    ));
};

export default PostList;
