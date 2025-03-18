import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import logoutIcon from "./Images/logout.png";
import backIcon from "./Images/back.png";
import { fetchPosts, Post } from "./Api";
import CreatePostModal from "./CreatePostModal";
import axios from 'axios';

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
                const processedPosts = data.map((post) => ({
                    ...post,
                    likes: post.likes || 0,
                    liked: false,
                    comments: post.comments || [],
                }));
                setPosts(processedPosts);
            }
        } catch (error) {
            console.error('Error loading posts:', error);
        }
    };

    const handleCreatePost = async (postData: { title: string; content: string; image?: File; }) => {
      try {
          const authToken = localStorage.getItem('authToken');
          const userId = localStorage.getItem('userId');
  
          if (!authToken || !userId) {
              console.error('user not found');
              alert('user is not logged in');
              return;
          }
  
          const formData = new FormData();
          formData.append('title', postData.title);
          formData.append('content', postData.content);
          formData.append('owner', userId);
          if (postData.image) {
              formData.append('image', postData.image);
          }
  
          const response = await axios.post('/api/posts', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
                  'Authorization': `Bearer ${authToken}`,
              },
          });
  
          const newPost: Post = response.data;
          setPosts([newPost, ...posts]);
          setIsModalOpen(false);
  
      } catch (error) {
          console.error('שגיאה ביצירת פוסט:', error);
          alert('יצירת הפוסט נכשלה. אנא נסה שוב.');
      }
  };

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
                            <span> {post.comments?.length || 0}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* כפתור פוסט חדש */}
            <button className={styles.createPostButton} onClick={() => setIsModalOpen(true)}>+</button>

            {/* רכיב ה-Modal */}
            <CreatePostModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreatePost}
            />
        </div>
    );
};

export default Home;