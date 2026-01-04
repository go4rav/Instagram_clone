import React from "react";
import PostList from "../components/PostList";
import PostForm from "../components/PostForm";

const FeedPage = () => {
    return (
        <div>
            <h1>📷 Instagram Clone</h1>
            <PostForm />
            <PostList />
        </div>
    );
};

export default FeedPage;
