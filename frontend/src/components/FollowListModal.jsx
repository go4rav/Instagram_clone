import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import './FollowListModal.css'

const FollowersModal = ({
    isOpen,
    onClose,
    username,
    type
}) => {

    const [users, setUsers] = useState([]);

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

        fetchUsers();

    }, [isOpen, username, type]);

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
                    {type === "followers"
                        ? "Followers"
                        : "Following"}
                </h2>

                {
                    users.map((user) => (

                        <div
                            key={user.id}
                            className="user-row"
                        >
                            {user.username}
                        </div>
                    ))
                }

            </div>

        </div>
    );
};

export default FollowersModal;