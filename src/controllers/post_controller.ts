import postModel, { IPost } from "../models/post_model";
import { Request, Response } from "express";
import BaseController from "./base_controller";
import multer from 'multer';
import path from 'path';

// הגדרת Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // תיקייה לשמירת תמונות
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // שם ייחודי לקובץ
  },
});

const upload = multer({ storage: storage });

class PostsController extends BaseController<IPost> {
    constructor() {
        super(postModel);
    }

    // post_controller.ts
    async create(req: Request, res: Response) {
        upload.single('image')(req, res, async (err) => { // הוספת upload.single כאן
            if (err) {
                return res.status(500).json({ message: 'Error uploading image', error: err });
            }

            try {
                const userId = req.params.userId;
                const imagePath = req.file ? req.file.path : undefined; // קבלת נתיב התמונה מ-req.file

                const post = {
                    ...req.body,
                    owner: userId,
                    image: imagePath
                };

                req.body = post;
                super.create(req, res);
            } catch (error) {
                res.status(500).json({ message: 'Server error', error: (error as any).message });
            }
        });
    }
}

export default new PostsController();