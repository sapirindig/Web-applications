import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
<<<<<<< HEAD
=======
import logoutIcon from "./Images/logout.png";
import backIcon from "./Images/back.png";
>>>>>>> cd18f9bf4dbef941d1294ebc7621b02cc475593c
import { fetchPosts, Post } from "./api";
import CreatePostModal from "./CreatePostModal";
import axios from "axios";

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
<<<<<<< HEAD
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
=======

  useEffect(() => {
    loadPosts();
>>>>>>> cd18f9bf4dbef941d1294ebc7621b02cc475593c
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
<<<<<<< HEAD
    owner: any;
    title: string;
    content: string;
    image?: File;
  }) => {
=======
      owner: any; title: string; content: string; image?: File 
}) => {
>>>>>>> cd18f9bf4dbef941d1294ebc7621b02cc475593c
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        alert("User is not logged in");
        return;
      }

<<<<<<< HEAD
=======
      // צור אובייקט עם כל השדות הנדרשים
>>>>>>> cd18f9bf4dbef941d1294ebc7621b02cc475593c
      const postDataToSend = {
        title: postData.title,
        content: postData.content,
        owner: postData.owner,
        image: postData.image,
<<<<<<< HEAD
=======
        
>>>>>>> cd18f9bf4dbef941d1294ebc7621b02cc475593c
      };

      console.log("Post data being sent:", postDataToSend);

      const response = await axios.post("http://localhost:3000/posts", postDataToSend, {
        headers: {
<<<<<<< HEAD
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
=======
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
>>>>>>> cd18f9bf4dbef941d1294ebc7621b02cc475593c
        },
      });

      console.log("Server response:", response.data);
<<<<<<< HEAD

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
=======
      
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
>>>>>>> cd18f9bf4dbef941d1294ebc7621b02cc475593c
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
<<<<<<< HEAD
  
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
=======

>>>>>>> cd18f9bf4dbef941d1294ebc7621b02cc475593c
      {/* New Post Button */}
      <button className={styles.createPostButton} onClick={() => setIsModalOpen(true)}>
        +
      </button>
<<<<<<< HEAD
  
=======

>>>>>>> cd18f9bf4dbef941d1294ebc7621b02cc475593c
      {/* Modal for Creating a Post */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreatePost}
      />
    </div>
  );
<<<<<<< HEAD
}
=======
};

>>>>>>> cd18f9bf4dbef941d1294ebc7621b02cc475593c
export default Home;