import React, { useState, useEffect } from "react";
import styles from "./UserProfile.module.css";
import userImage from "./Images/user.png";
import { Link, useNavigate } from "react-router-dom";
import homeIcon from "./Images/home.png";
import axios from "axios";

interface Post {
    _id: string;
    title: string;
    content: string;
    image?: string;
    owner: string;
    likesCount: number;
    likedBy: string[];
    comments: any[];
}

const UserProfile: React.FC = () => {
    const [userName, setUserName] = useState<string>("שם משתמש");
    const [userEmail, setUserEmail] = useState<string>("דואר אלקטרוני");
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [showPostsModal, setShowPostsModal] = useState<boolean>(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        loadUserPosts();
    }, []);

    const loadUserPosts = async () => {
        try {
            const userId = localStorage.getItem("userId");
            console.log("User ID from localStorage:", localStorage.getItem("userId"));
            if (!userId) {
                console.error("User ID not found");
                return;
            }

            const response = await axios.get(`http://localhost:3000/posts/user/${userId}`);
            const processedPosts = response.data.map((post: any) => ({
                ...post,
                likesCount: post.likesCount || 0,
                likedBy: post.likedBy || [],
                comments: post.comments || [],
            }));
            setUserPosts(processedPosts as Post[]);
        } catch (error) {
            console.error("Error loading user posts:", error);
        }
    };

    const handleShowPosts = async () => {
        await loadUserPosts();
        setShowPostsModal(true);
    };

    const handleClosePostsModal = () => {
        setShowPostsModal(false);
        setSelectedPost(null);
    };

    const handlePostClick = async (post: Post) => {
        try {
            const postResponse = await axios.get(`http://localhost:3000/posts/${post._id}`);
            const postData = postResponse.data;

            const commentsUrl = `http://localhost:3000/comments/post/${post._id}`;
            const commentsResponse = await axios.get(commentsUrl);
            const commentsData = commentsResponse.data;

            if (postData._id) {
                setSelectedPost({
                    ...postData,
                    comments: commentsData.map((comment: any) => ({
                        comment: comment.comment,
                        postId: comment.postId,
                        owner: comment.owner,
                    })),
                    likesCount: postData.likesCount,
                    _id: postData._id,
                });
            } else {
                console.error("Post ID is undefined");
                setSelectedPost(post);
            }
        } catch (error) {
            console.error("Error fetching post details or comments:", error);
            setSelectedPost(post);
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

            <h1>פרופיל משתמש</h1>

            <div className={styles.profileCard}>
                <div className={styles.userInfo}>
                    <div className={styles.profileImageContainer}>
                        <img src={userImage} alt="User Profile" className={styles.profileImage} />
                    </div>

                    {/* פרטי משתמש (ללא רווח בין השם לאימייל) */}
                    <div className={styles.userDetails}>
                        <p className={styles.userDetail}>name: {userName}</p>
                        <p className={styles.userDetail}>e-mail: {userEmail}</p>
                    </div>

                    {/* כפתורים עם מרווח שווה */}
                    <div className={styles.profileButtons}>
                        <button className={styles.profileButton}>edit profile</button>
                        <button className={styles.profileButton} onClick={handleShowPosts}>my posts</button>
                    </div>
                </div>
            </div>

            {/* מודאל הפוסטים */}
            {showPostsModal && (
                <div className={styles.modalOverlay} onClick={handleClosePostsModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2>הפוסטים שלי</h2>
                        <div className={styles.modalBody}>
                            {/* הצגת כל הפוסטים של המשתמש */}
                            {userPosts.map((post) => (
                                <div key={post._id} className={styles.post} onClick={() => handlePostClick(post)}>
                                    <img
                                        src={post.image || "./Images/sample.png"}
                                        alt="Post"
                                        className={styles.postImage}
                                    />
                                    <div className={styles.postActions}>
                                        <span>{post.likesCount} ❤</span>
                                        <span>{post.comments?.length || 0}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleClosePostsModal}>סגור</button>
                    </div>
                </div>
            )}

            {selectedPost && (
                <div className={styles.modalOverlay} onClick={handleClosePostsModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <button onClick={handleClosePostsModal}>X</button>
                        </div>
                        <div className={styles.modalBody}>
                            {/* הצגת פרטי הפוסט הנבחר */}
                            {selectedPost.image && (
                                <img
                                    src={selectedPost.image}
                                    alt="Post"
                                    className={styles.postImage}
                                />
                            )}
                            <h3>{selectedPost.title}</h3>
                            <p>{selectedPost.content}</p>
                            <div className={styles.postActions}>
                                <span>{selectedPost.likesCount} ❤</span>
                                <span>{selectedPost.comments?.length || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;