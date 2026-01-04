import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import './ProfilePage.css'
import logo from "../assets/logo.png"
import { jwtDecode } from "jwt-decode";

const ProfilePage = () => {

    const [posts, setPosts] = useState([]);
    const [countPosts, setCountPosts] = useState(0)
    const [countFollowers, setCountFollowers] = useState(0)
    const [countFollowing, setCountFollowing] = useState(0)
    const navigate  = useNavigate();
    const { id } = useParams()

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log(token)
        if (!token) {
            navigate("/login");
            return;
        }
        const access_token = localStorage.getItem("token");
        const decoded = jwtDecode(access_token);
        console.log(decoded);

        axios.get(`${API_BASE_URL}profile/${id}`,{
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }})
            .then(response => {
                               setPosts(response.data.posts);
                               setCountPosts(response.data.total_posts);
                               setCountFollowers(response.data.countFollowers);
                               setCountFollowing(response.data.countFollowing);})
            .catch(error => console.error("Error fetching posts:", error));
    }, []);


  return (
      <><nav className="bg-black w-screen h-[50px] border-b border-[hsl(0,0%,86%)] fixed z-1">
      <div className="mock"></div>
      <div className="fixed">
        <div className="nav-content ml-40">
          <img className="h-[45px]" alt="logo" src={logo} />
        </div>
      </div>
    </nav><div className="flex flex-col justify-center items-center bg-black">
        <div className="w-2/3 h-2/5 font-sans flex flex-col justify-center items-center bg-black border-l border-[hsl(0,0%,86%)] border-r border-[hsl(0,0%,86%)]">
          {/* Profile picture + bio */}
          <div className="bg-black w-full flex justify-center items-center mt-20 mb-20">
            {/* Profile picture */}
            <div className="bg-black w-2/5 flex justify-end items-center mr-10">
              <div className="bg-white rounded-full w-[170px] h-[170px] overflow-hidden border-2 border-black"></div>
            </div>

            {/* Bio */}
            <div className="text-white bg-black w-3/5 flex flex-col justify-center ml-4">
              <div className="flex items-center space-x-6 mt-4">
                <span>
                  <p className="font-sans text-[16px]">Username</p>
                </span>
                <button className="bg-blue-500 text-white px-2 rounded">
                  Follow
                </button>
              </div>

              <div className="flex space-x-4 mt-4">
                <div><span>{countPosts} posts</span></div>
                <div><span>{countFollowers} followers</span></div>
                <div><span>{countFollowing} following</span></div>
              </div>

              <div className="flex mt-4">
                <span>
                  <p className="font-sans text-[16px]">Name</p>
                </span>
              </div>

              <div className="flex mt-4">
                <span>
                  <p className="font-sans text-[16px]">Bio</p>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="w-2/3 h-3/5 grid grid-cols-3 border-t border-[hsl(0,0%,86%)]">
          {posts.map((post, i) => (
            <div
              key={i}
              className="border border-black bg-gray-200 h-[200px]"
            ><img src={logo} alt="post" className="img-fit" /></div>
          ))}
          {posts.length<4 && Array.from({length: 4-posts.length}).map((_, j)=>(
            <div key={`placeholder-${j}`}
              className="bg-black-200 h-[200px]"
                ></div>
          ))}
        </div>
      </div></>

  );
}

export default ProfilePage