import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import logoutIcon from "./Images/logout.png";
import backIcon from "./Images/back.png";
import { fetchPosts, Post } from "./api";
import CreatePostModal from "./CreatePostModal";
import axios from "axios";

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await fetchPosts();
      if (data) {
        const processedPosts = data.map((post: Post) => ({
          ...post,
          likes: post.likes || 0,
          liked: false,
          comments: post.comments || [],
        }));
        setPosts(processedPosts);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  };

  const handleCreatePost = async (postData: {
      owner: any; title: string; content: string; image?: File 
}) => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        alert("User is not logged in");
        return;
      }

      // צור אובייקט עם כל השדות הנדרשים
      const postDataToSend = {
        title: postData.title,
        content: postData.content,
        owner: postData.owner,
        image: postData.image,
        
      };

      console.log("Post data being sent:", postDataToSend);

      const response = await axios.post("http://localhost:3000/posts", postDataToSend, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      });

      console.log("Server response:", response.data);
      
      const newPost: Post = response.data;
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error creating post:", error.response?.data || error);
      alert(`Failed to create post: ${error.response?.data?.message || 'Unknown error'}`);
    }
};

  return (
    <div className={styles.homeContainer}>
      {/* Back Button */}
      <div className={styles.backButton}>
        <Link to="/userprofile">
          <img src={backIcon} alt="Back" className={styles.icon} />
        </Link>
      </div>

      <h1>Home</h1>

      {/* Log Out Button */}
      <div className={styles.logoutButton}>
        <Link to="/login">
          <img src={logoutIcon} alt="Log Out" className={styles.icon} />
        </Link>
      </div>

      {/* Display Posts */}
      <div className={styles.postsContainer}>
        {posts.map((post) => (
          <div key={post._id} className={styles.post}>
            <img
              src={post.image || "./Images/sample.png"}
              alt="Post"
              className={styles.postImage}
              onClick={() => setSelectedPost(post)}
            />
            <div className={styles.postActions}>
              <span>{post.likes} ❤</span>
              <span>{post.comments?.length || 0}</span>
            </div>
          </div>
        ))}
      </div>

      {/* New Post Button */}
      <button className={styles.createPostButton} onClick={() => setIsModalOpen(true)}>
        +
      </button>

      {/* Modal for Creating a Post */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreatePost}
      />
    </div>
  );
};

export default Home;