import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import { fetchPosts, Post } from "./api";
import CreatePostModal from "./CreatePostModal";
import axios from "axios";

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();
    // קבלת שם משתמש מ-localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
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
    owner: any;
    title: string;
    content: string;
    image?: File;
  }) => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        alert("User is not logged in");
        return;
      }

      const postDataToSend = {
        title: postData.title,
        content: postData.content,
        owner: postData.owner,
        image: postData.image,
      };

      console.log("Post data being sent:", postDataToSend);

      const response = await axios.post("http://localhost:3000/posts", postDataToSend, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
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

  const handlePostClick = async (post: Post) => {
    try {
        const url = `http://localhost:3000/comments/${post._id}`;
        console.log("Fetching comments from:", url);
        console.log("Fetching comments from:", url); // הוסף console.log
        const response = await axios.get(url);
      

      setSelectedPost({
        ...post,
        comments: response.data.comments.map((comment: { comment: string }) => comment.comment),
      });
    } catch (error) {
      console.error("Error fetching comments:", error);
      setSelectedPost(post);
    }
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleAddComment = async () => {
    if (newComment.trim() && selectedPost) {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          alert("User is not logged in");
          return;
        }

        const response = await axios.post(
          "http://localhost:3000/comments", // עדכן את ה-URL של ה-endpoint שלך
          {
            comment: newComment,
            postId: selectedPost._id,
            owner: localStorage.getItem("userId"), // הנחתי שאתה שומר את ה-userId ב-localStorage
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        // עדכן את ה-state של הפוסט עם התגובה החדשה
        setSelectedPost({
          ...selectedPost,
          comments: [...(selectedPost.comments || []), newComment],
        });

        setNewComment("");
      } catch (error) {
        console.error("Error adding comment:", error);
        alert("Failed to add comment");
      }
    }
  };

  return (
    <div className={styles.homeContainer}>
      {/* סרגל ניווט */}
      <div className={styles.navbar}>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Log Out
        </button>
        <Link to="/userprofile" className={styles.profileButton}>
          Profile
        </Link>
        <span className={styles.username}>
          {username ? `Hello, ${username}` : "Guest"}
        </span>
      </div>
  
      {!selectedPost && <h1>Home</h1>} {/* הצגת כותרת רק כאשר לא נבחר פוסט */}
  
      {/* Display Posts */}
      <div className={styles.postsContainer}>
        {posts.map((post) => (
          <div  key={post._id} className={styles.post} onClick={() => handlePostClick(post)}>
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
  
      {/* Modal for Post Details */}
      {selectedPost && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <button onClick={handleCloseModal}>X</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalImageContainer}>
                <img src={selectedPost.image || "./Images/sample.png"} alt="Post" className={styles.modalImage} />
                <div className={styles.likes}>
                  <span>{selectedPost.likes} ❤</span>
                </div>
              </div>
              <div className={styles.commentsSection}>
                <h3>{selectedPost.owner}</h3>
                <ul className={styles.commentsList}>
                  {selectedPost.comments?.map((comment, index) => (
                    <li key={index}>{comment}</li>
                  ))}
                </ul>
                <div className={styles.commentInputContainer}>
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                  />
                  <button onClick={handleAddComment}>Send</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
}
export default Home;