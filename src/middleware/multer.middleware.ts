import multer from 'multer';
import path from 'path';

<<<<<<< HEAD
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads'); // נתיב לתיקיית העלאה
        console.log(`Multer: Setting destination to ${uploadPath}`);
        cb(null, uploadPath);
=======
// הגדרת אחסון של קבצים
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/'; // תיקיית העלאה
        console.log(`Multer: Setting destination to ${uploadPath}`);
        cb(null, uploadPath); // הגדרת הנתיב לתיקיית העלאה
>>>>>>> 4e5674c3c84b3889990a5ac461458e260b773264
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
        console.log(`Multer: Generating filename ${filename}`);
<<<<<<< HEAD
        cb(null, filename);
    }
});

const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // אפשר רק תמונות
    } else {
        cb(new Error('Not an image!'), false);
    }
};

=======
        cb(null, filename); // יצירת שם קובץ ייחודי
    }
});

// הגדרת הסינון של הקבצים
const fileFilter = (req: any, file: any, cb: any) => {
    console.log(`Multer: Checking file type: ${file.mimetype}`);
    // מאפשר כל סוג קובץ
    cb(null, true); 
};

// הגדרת מגבלות קבצים (10MB)
>>>>>>> 4e5674c3c84b3889990a5ac461458e260b773264
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});

<<<<<<< HEAD
console.log("Multer configuration loaded.");
=======
console.log("Multer configuration loaded.");
>>>>>>> 4e5674c3c84b3889990a5ac461458e260b773264
