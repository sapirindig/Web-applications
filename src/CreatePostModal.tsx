import React, { useState } from 'react';
import styles from './CreatePostModal.module.css';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (postData: { title: string; content: string; image?: File; }) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onCreate }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedImage = e.target.files[0];
            setImage(selectedImage);
            setImagePreview(URL.createObjectURL(selectedImage));
        }
    };

    const handleCreate = () => {
        onCreate({ title, content, image: image || undefined });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2>יצירת פוסט חדש</h2>
                <input
                    type="text"
                    placeholder="כותרת"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="תוכן"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                {imagePreview && (
                    <img src={imagePreview} alt="תצוגה מקדימה" className={styles.imagePreview} />
                )}
                <button onClick={handleCreate}>צור פוסט</button>
                <button onClick={onClose}>סגור</button>
            </div>
        </div>
    );
};

export default CreatePostModal;