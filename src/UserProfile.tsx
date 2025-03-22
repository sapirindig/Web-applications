import React, { useState, useEffect } from "react";
import styles from "./UserProfile.module.css";
import userImage from "./Images/user.png";
import { Link, useNavigate } from "react-router-dom";
import homeIcon from "./Images/home.png";
import axios from "axios";
import EditPostModal from "./EditPostModel";

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
    const [editPost, setEditPost] = useState<Post | null>(null);

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

    const handleDeletePost = async (postId: string) => {
        try {
            console.log("handleDeletePost called for postId:", postId);
            console.log("localStorage:", localStorage);
            const token = localStorage.getItem("authToken");
            console.log("Token from localStorage:", token);

            if (!token) {
                console.error("Token not found");
                return;
            }

            console.log("Token found, sending delete request");

            await axios.delete(`http://localhost:3000/posts/${postId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUserPosts(userPosts.filter((post) => post._id !== postId));
            console.log("Post deleted successfully");
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const handleEditPost = (post: Post) => {
        setEditPost(post);
    };

    const handlePostUpdated = (updatedPost: Post) => {
        setUserPosts(userPosts.map(post => post._id === updatedPost._id ? updatedPost : post));
        setEditPost(null);
    };

    const handleEditProfile = () => {
        // כאן אתה יכול להוסיף את הלוגיקה לעריכת פרופיל המשתמש
        console.log("Edit profile clicked");
    };

    return (
        <div className={styles.profileContainer}>
            <div className={styles.homeButton}>
                <Link to="/Home">
                    <img src={homeIcon} alt="Home" className={styles.homeIcon} />
                </Link>
            </div>

            <h1 className={showPostsModal ? styles.hidden : ""}>user profile</h1>

            <div className={styles.profileCard}>
                <div className={styles.userInfo}>
                    <div className={styles.profileImageContainer}>
                        <img src={userImage} alt="User Profile" className={styles.profileImage} />
                    </div>
                    <div className={styles.userDetails}>
                        <p className={styles.userDetail}>name: {userName}</p>
                        <p className={styles.userDetail}>e-mail: {userEmail}</p>
                    </div>
                    <div className={styles.profileButtons}>
                        <button className={styles.profileButton} onClick={handleShowPosts}>My posts</button>
                        <button className={styles.profileButton} onClick={handleEditProfile}>Edit profile</button>
                    </div>
                </div>
            </div>

            {showPostsModal && (
                <div className={styles.modalOverlay} onClick={handleClosePostsModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2 className={styles.modalTitle}>my posts</h2>
                        <div className={styles.modalBody}>
                            {userPosts.map((post) => (
                                <div key={post._id} className={styles.post}>
                                    <img src={post.image || "./Images/sample.png"} alt="Post" className={styles.postImage} />
                                    <div className={styles.postActions}>
                                        <span>{post.likesCount} ❤</span>
                                        <span>{post.comments?.length || 0}</span>
                                        <button className={styles.editButton} onClick={() => handleEditPost(post)}>edit</button>
                                        <button className={styles.deleteButton} onClick={() => handleDeletePost(post._id)}>delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className={styles.closeButton} onClick={handleClosePostsModal}>close</button>
                    </div>
                </div>
            )}

            {editPost && (
                <EditPostModal
                    post={editPost}
                    onClose={() => setEditPost(null)}
                    onPostUpdated={handlePostUpdated}
                />
            )}
        </div>
    );
};

export default UserProfile;