import React, { useState } from "react";
import styles from "./UserProfile.module.css";
import userImage from "./Images/user.png";
import { Link } from "react-router-dom";
import homeIcon from "./Images/home.png";

const UserProfile: React.FC = () => {
  // רשימת הפוסטים של המשתמש
  const [posts, setPosts] = useState([
    { id: 1, image: "/Images/sample1.png", text: "טיול מדהים בטבע!" },
    { id: 2, image: "/Images/sample2.png", text: "אוכל טעים במסעדה 😍" },
    { id: 3, image: "/Images/sample3.png", text: "איזה יום יפה היום! 🌞" },
  ]);

  // ניהול מודאל העריכה
  const [editPost, setEditPost] = useState<{ id: number; text: string; image: string } | null>(null);
  const [newImage, setNewImage] = useState<string | null>(null); // תצוגת התמונה החדשה שנבחרה

  // עדכון טקסט ותמונה של פוסט
  const updatePost = () => {
    if (!editPost) return;

    setPosts(posts.map(post =>
      post.id === editPost.id
        ? { ...post, text: editPost.text, image: newImage || post.image } // עדכון טקסט ותמונה
        : post
    ));

    setEditPost(null);
    setNewImage(null); // איפוס התמונה לאחר השמירה
  };

  // בחירת תמונה חדשה להצגה מקדימה
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const imageURL = URL.createObjectURL(event.target.files[0]);
      setNewImage(imageURL);
    }
  };

  return (
    <div className={styles.profileContainer}>
      {/* כפתור הבית בצד ימין למעלה */}
      <div className={styles.homeButton}>
        <Link to="/Home">
          <img src={homeIcon} alt="Home" className={styles.homeIcon} />
        </Link>
      </div>

      <h1>User Profile</h1>

      <div className={styles.profileCard}>
        <div className={styles.userInfo}>
          <div className={styles.profileImageContainer}>
            <img src={userImage} alt="User Profile" className={styles.profileImage} />
          </div>

          <h2>My Posts</h2>
          <div className={styles.postsContainer}>
            {posts.map((post) => (
              <div key={post.id} className={styles.post}>
                {/* תמונת הפוסט */}
                <img src={post.image} alt="Post" className={styles.postImage} />
                {/* מלל הפוסט */}
                <p>{post.text}</p>

                {/* כפתור עריכה */}
                <button onClick={() => { setEditPost(post); setNewImage(null); }} className={styles.editButton}>📝 ערוך</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* חלון קופץ לעריכת פוסט (תמונה וטקסט) */}
      {editPost && (
        <div className={styles.modalOverlay} onClick={() => setEditPost(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setEditPost(null)}>✖</button>
            <h3>עריכת פוסט</h3>

            {/* תצוגה מקדימה של תמונה חדשה (אם נבחרה) */}
            <img src={newImage || editPost.image} alt="Preview" className={styles.editImagePreview} />

            {/* העלאת תמונה חדשה */}
            <input type="file" accept="image/*" onChange={handleImageChange} className={styles.uploadInput} />

            {/* שדה לעריכת הטקסט */}
            <textarea
              className={styles.editTextArea}
              value={editPost.text}
              onChange={(e) => setEditPost({ ...editPost, text: e.target.value })}
            />

            {/* כפתור שמירה */}
            <button className={styles.saveButton} onClick={updatePost}>💾 שמור</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
