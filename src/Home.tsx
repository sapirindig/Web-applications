import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import logoutIcon from "./Images/logout.png";
import backIcon from "./Images/back.png";

const Home: React.FC = () => {
  // רשימת פוסטים זמניים (בינתיים)
  const [posts, setPosts] = useState([
    { id: 1, image: "/Images/sample1.png", likes: 5, comments: ["תמונה יפה!", "איזה צילום מדהים!"], liked: false },
    { id: 2, image: "/Images/sample2.png", likes: 3, comments: ["יפה מאוד!"], liked: false },
    { id: 3, image: "/Images/sample3.png", likes: 8, comments: ["מדהים!", "אהבתי מאוד!"], liked: false },
  ]);

  // שליטה במודאל (חלון קופץ)
  const [selectedPost, setSelectedPost] = useState<{ id: number; image: string; comments: string[] } | null>(null);
  const [newComment, setNewComment] = useState(""); // שדה הקלט לתגובה החדשה

  // פונקציה להוספת והסרת לייק
  const toggleLike = (postId: number) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, likes: post.liked ? post.likes - 1 : post.likes + 1, liked: !post.liked }
        : post
    ));
  };

  // הוספת תגובה חדשה + עדכון התגובות במודאל
  const addComment = () => {
    if (!selectedPost || newComment.trim() === "") return;

    const updatedPosts = posts.map(post =>
      post.id === selectedPost.id
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    );

    setPosts(updatedPosts); // עדכון רשימת הפוסטים עם התגובה החדשה

    // עדכון המודאל שיראה גם את התגובה החדשה מיד
    setSelectedPost({
      ...selectedPost,
      comments: [...selectedPost.comments, newComment],
    });

    setNewComment(""); // איפוס השדה לאחר שליחת התגובה
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
          <div key={post.id} className={styles.post}>
            {/* לחיצה על תמונה תפתח את המודאל */}
            <img src={post.image} alt="Post" className={styles.postImage} onClick={() => setSelectedPost(post)} />
            <div className={styles.postActions}>
              <span onClick={() => toggleLike(post.id)} style={{ cursor: "pointer" }}>
                {post.liked ? "❤️" : "🤍"} {post.likes}
              </span>
              <span>💬 {post.comments.length}</span>
            </div>
          </div>
        ))}
      </div>

      {/* מודאל (חלון קופץ) לתצוגת תמונה ותגובות בצד */}
      {selectedPost && (
        <div className={styles.modalOverlay} onClick={() => setSelectedPost(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setSelectedPost(null)}>✖</button>

            <div className={styles.modalBody}>
              {/* תמונה בצד שמאל */}
              <img src={selectedPost.image} alt="Post" className={styles.modalImage} />

              {/* תגובות בצד ימין */}
              <div className={styles.commentsSection}>
                <h3>תגובות</h3>
                <div className={styles.commentsList}>
                  {selectedPost.comments.map((comment, index) => (
                    <p key={index}>🗨️ {comment}</p>
                  ))}
                </div>

                {/* שדה להוספת תגובה */}
                <div className={styles.commentInputContainer}>
                  <input
                    type="text"
                    placeholder="הוסף תגובה..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className={styles.commentInput}
                  />
                  <button onClick={addComment} className={styles.commentButton}>שלח</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
