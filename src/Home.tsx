import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import logoutIcon from "./Images/logout.png";
import backIcon from "./Images/back.png";
import { fetchPosts, Post } from "./Api"; // ייבוא הפונקציה מה-API

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const loadPosts = async () => {
      const data = await fetchPosts();
      if (data) {
        const processedPosts = data.map((post) => ({
          ...post,
          likes: post.likes || 0,
          liked: false,
          comments: post.comments || [],
        }));
        setPosts(processedPosts);
      }
    };
    loadPosts();
  }, []);

  return (
    <div className={styles.homeContainer}>
      {/* כפתור חזרה */}
      <div className={styles.backButton}>
        <Link to="/userprofile">
          <img src={backIcon} alt="Back" className={styles.icon} />
        </Link>
      </div>

      <h1>Home</h1>

      {/* כפתור LOG OUT */}
      <div className={styles.logoutButton}>
        <Link to="/login">
          <img src={logoutIcon} alt="Log Out" className={styles.icon} />
        </Link>
      </div>

      {/* הצגת הפוסטים */}
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
              <span>{post.likes} ❤️</span>
              <span>💬 {post.comments?.length || 0}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
