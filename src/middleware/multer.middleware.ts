import multer from 'multer';
import path from 'path';

// הגדרת אחסון של קבצים
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/'; // תיקיית העלאה
        console.log(`Multer: Setting destination to ${uploadPath}`);
        cb(null, uploadPath); // הגדרת הנתיב לתיקיית העלאה
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
        console.log(`Multer: Generating filename ${filename}`);
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
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});

console.log("Multer configuration loaded.");
