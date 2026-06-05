
import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import './ProfilePage.css'
import logo from "../assets/logo.png"
import { jwtDecode } from "jwt-decode";
import FollowersModal from "../components/FollowlistModal.jsx"

const ProfilePage = () => {

    const [posts, setPosts] = useState([]);
    const [bio, setBio] = useState([]);
    const [name, setName] = useState([]);
    const [countPosts, setCountPosts] = useState(0)
    const [countFollowers, setCountFollowers] = useState(0)
    const [countFollowing, setCountFollowing] = useState(0)
    const navigate  = useNavigate();
    const { username } = useParams();
    const [isFollowing, setIsFollowing] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [isFollowListOpen, setIsFollowListOpen] = useState(false);
    const [modalType, setModalType] = useState('followers');
    const [loggedUser, setLoggedUser] = useState('');
    const [render, setRender] = useState(false);

//  When there is a change in the isFollowing state variable,
// 1. Re-run component function ✅
// 2. Compare UI (Virtual DOM) ✅
// 3. Update changed parts (button) ✅
// 4. Decide whether to run useEffect ❗useEffect is not run, hence posts are not fetched dynamically from database.
    const handleFollowToggle = async () => {
    try {
       const token = localStorage.getItem("token");
        if (isFollowing) {
            await axios.post(`${API_BASE_URL}profile/unfollow/${username}/`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsFollowing(false);
            setCountFollowers(prev => prev - 1);
        } else {
            await axios.post(`${API_BASE_URL}profile/follow/${username}/`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsFollowing(true);
            setCountFollowers(prev => prev + 1);
        }
    } catch (err) {
        console.error(err);
    }
};

      
    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get(`${API_BASE_URL}users/getusername/`,{headers: {"Authorization":
    `Bearer ${localStorage.getItem("token")}`}}).then(response => {
      console.log(response);
      setLoggedUser(response.data.username)}).
    catch(error => console.error("Error fetching username:", error));
        console.log(token)
        if (!token) {
            navigate("/login");
            return;
        }
        const access_token = localStorage.getItem("token");
        const decoded = jwtDecode(access_token);
        console.log(decoded);

        axios.get(`${API_BASE_URL}profile/view/${username}`,{
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }})
            .then(response => {
                               console.log(response);
                               setPosts(response.data.posts);
                               setBio(response.data.bio);
                               setName(response.data.user_name);
                               setCountPosts(response.data.total_posts);
                               setCountFollowers(response.data.count_followers);
                               setCountFollowing(response.data.count_following);
                               setIsOwner(response.data.is_owner)})
            .catch(error => console.error("Error fetching posts:", error));

        if(render){
          axios.get(`${API_BASE_URL}profile/isfollowing/${username}`, {
       headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }}).then(response => { console.log(response); setIsFollowing(response.data.is_following);});
        setRender(false);
        }
        
    }, [username, render]);


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
                  <p className="font-sans text-[16px]"></p>
                </span>
                {/* React passes the latest state value into your function */}
                 {/* Render the modal when isOnwer is true  */}
                  {!isOwner && (isFollowing ?
                      <button onClick={handleFollowToggle} className="bg-gray-500 text-white px-2 rounded">
                        Unfollow
                      </button> :
                      <button onClick={handleFollowToggle} className="bg-blue-500 text-white px-2 rounded">
                        Follow
                      </button>)}
              </div>

              <div className="flex space-x-4 mt-4">
                <div><span>{countPosts}  posts</span></div>
                <div><span>{countFollowers}{" "} 
                   <button onClick={()=>{setIsFollowListOpen(true);
                                    setModalType('followers');}}>
                    Followers
                   </button>

                  </span></div>
                <div><span>{countFollowing}{" "}
                  <button onClick={()=>{setIsFollowListOpen(true);
                                  setModalType('following');}}>
                    Following
                   </button>
                  </span></div>
                </div>

                <FollowersModal
                    isOpen={isFollowListOpen}
                    onClose={() => setIsFollowListOpen(false)}
                    render = {() => setRender(true)}
                    username={username}
                    loggedUser={loggedUser}
                    type={modalType}
                />

              <div className="flex mt-4">
                <span>
                  <p className="font-sans text-[16px]">{name}</p>
                </span>
              </div>

              <div className="flex mt-4">
                <span>
                  <p className="font-sans text-[16px]">{bio}</p>
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