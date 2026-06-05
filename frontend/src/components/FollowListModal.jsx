import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import './FollowListModal.css'
import { useNavigate } from "react-router-dom";

const FollowersModal = ({
    isOpen,
    onClose,
    render,
    loggedUser,
    username,
    type
}) => {

    const [users, setUsers] = useState([]);
    const [flag, setFlag] = useState([]);
    const [change, setChange] = useState(true);
    const navigate  = useNavigate();
    const navigateProfilePage = async (user_name) =>{
        onClose();
        console.log(user_name);
        // await sleep(1);
        navigate(`/profile/${user_name}/`);
    };

    const followUser = async (user_name) => {
    try {
       const token = localStorage.getItem("token");
            await axios.post(`${API_BASE_URL}profile/follow/${user_name}/`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setChange(!change);

    } catch (err) {
        console.error(err);
    }
};

const unfollowUser = async (user_name) => {
    try {
        
       const token = localStorage.getItem("token");
            await axios.post(`${API_BASE_URL}profile/unfollow/${user_name}/`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        if(loggedUser==username){
            render();
        }
        
        setChange(!change);
    } catch (err) {
        console.error(err);
    }
};

const removeUser = async (user_name) => {
    try {
        
       const token = localStorage.getItem("token");
            await axios.post(`${API_BASE_URL}profile/remove/${user_name}/`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

        if(loggedUser==username){
            render();
        }
        setChange(!change);
    } catch (err) {
        console.error(err);
    }
};


// const removeUser = async (username) => {
//     try {
//        const token = localStorage.getItem("token");
//             await axios.post(`${API_BASE_URL}profile/remove/${username}/`, {}, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//         render();
//     } catch (err) {
//         console.error(err);
//     }
// };

      

    useEffect(() => {

        if (!isOpen) return;



        const fetchUsers = async () => {

            try {

                const token =
                    localStorage.getItem("token");

                const response = await axios.get(
                    `${API_BASE_URL}profile/${type}/${username}/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                console.log(response);
                setUsers(response.data);

            } catch (error) {

                console.error(error);
            }
        };

        setFlag(type === "followers"? "follower": "following");
        console.log(type)
        console.log(username)
        fetchUsers();

    }, [isOpen, username, type, change]);

    if (!isOpen) return null;

    return (

        <div className="modal-overlay">

            <div className="modal-content">

                <button
                    className="close-btn"
                    onClick={onClose}
                >
                    ✖
                </button>

                <h2>
                    {flag}
                </h2>

                {
                    users.map((user) => (

                        // <div
                        //     key={user.id}
                        //     className="user-row"
                        // >
                        //     {user.username}
                        // </div>

                        // <div class="space-y-2">
                         <div key={user.id} class="flex items-center w-full user-row">
                          <img class="w-[30px] h-[30px] rounded-full mt-2" src={user.display_profile} alt="" />
                          <div onClick={()=>navigateProfilePage(user.username)} class="">
                           <p class="text-white cursor-pointer">{user.username}</p>
                           <p class="text-xs w-max text-gray-500">
                           {user.full_name}</p>
                          </div>
                          <div className= "ml-auto">
                            {
                            loggedUser !== user.username &&
                            (loggedUser !== username) &&
                             (user[`is_${flag}`] ?
                                <button onClick={() => unfollowUser(user.username)} className="bg-gray-500  text-white px-2 rounded">
                                    Unfollow
                                </button> :
                                <button onClick={() => followUser(user.username)} className="bg-blue-500 text-white px-2 rounded">
                                    Follow
                                </button>)} 
                          </div>
                          <div className= "ml-auto">
                            {
                            loggedUser !== user.username &&
                            loggedUser == username &&
                             (flag=='follower' ? 
                                <button  onClick={() => removeUser(user.username)}  className="bg-gray-500  text-white px-2 rounded">
                                    Remove
                                </button> :
                                <button  onClick={() => unfollowUser(user.username)}  className="bg-gray-500  text-white px-2 rounded">
                                    Unfollow
                                </button>)} 
                          </div>
                         </div> 
                    ))
                }

            </div>

        </div>
    );
};

export default FollowersModal;