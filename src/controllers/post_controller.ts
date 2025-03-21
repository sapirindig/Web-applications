import postModel, { IPost } from "../models/post_model";
import { Request, Response } from "express";
import BaseController from "./base_controller";
import mongoose from "mongoose";

class PostsController extends BaseController<IPost> {
    constructor() {
        super(postModel);
    }

    async create(req: Request, res: Response) {
        try {
            const { title, content, owner } = req.body;
            const image = req.file?`/uploads/${req.file.filename}`: undefined;

            if (!title || !content || !owner) {
                res.status(400).json({ message: "Missing required fields." });
                return;
            }

            const post = await postModel.create({ title, content, owner, image });
            res.status(201).json(post);
            // במתודת create
console.log("Creating post, received data:", req.body);
console.log("User ID from token:", req.user);

        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                res.status(400).json({ message: error.message });
                return;
            }
            console.error("Error creating post:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    }
}

export default new PostsController();