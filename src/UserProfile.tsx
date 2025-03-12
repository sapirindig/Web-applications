import React from "react";
import styles from './UserProfile.module.css';
import userImage from './Images/user.png';
import postImage from './Images/image.png';
import pencilIcon from './Images/pencil.png';

const UserProfile: React.FC = () => {
  return (
    <div className={styles.profileContainer}>
      <h1>User Profile</h1>
      
      <div className={styles.profileCard}>
        <div className={styles.userInfo}>
          <div className={styles.profileImageContainer}>
            <img src={userImage} alt="User Profile" className={styles.profileImage} />
          </div>

          <div className={styles.userDetails}>
            <div className={styles.userDetail}>
              <strong>Full Name:</strong> John Doe 
              <img src={pencilIcon} alt="Edit" className={styles.editIcon} />
            </div>
            <div className={styles.userDetail}>
              <strong>Email:</strong> john@example.com
              <img src={pencilIcon} alt="Edit" className={styles.editIcon} />
            </div>
            <div className={styles.userDetail}>
              <strong>Password:</strong> ********
              <img src={pencilIcon} alt="Edit" className={styles.editIcon} />
            </div>
          </div>
        </div>

        <h2>My Posts</h2>
        <div className={styles.postsContainer}>
          <img src={postImage} alt="Post 1" className={styles.postImage} />
          <img src={postImage} alt="Post 2" className={styles.postImage} />
          <img src={postImage} alt="Post 3" className={styles.postImage} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
