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
      const image = req.file ? `/uploads/${req.file.filename}` : undefined;

      if (!title || !content || !owner) {
        res.status(400).json({ message: "Missing required fields." });
        return;
      }

      const post = await postModel.create({ title, content, owner, image });
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).json({ message: error.message });
        return;
      }
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  async likePost(req: Request, res: Response): Promise<void> {
    try {
        const postId = req.params.id;
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const userId = (req.user as { _id: string })._id;

        console.log(`Processing like request for postId: ${postId}, userId: ${userId}`);

        const post = await postModel.findById(postId);

        if (!post) {
            console.log(`Post not found for postId: ${postId}`);
            res.status(404).json({ message: "Post not found" });
            return;
        }

        console.log(`Found post: ${JSON.stringify(post)}`); // הוסף לוג כדי לראות את הפוסט שנמצא

        const userLiked = post.likedBy && post.likedBy.includes(userId);

        if (userLiked) {
            post.likedBy = post.likedBy.filter((id) => id !== userId);
            post.likesCount = Math.max(0, post.likesCount - 1); // ודא ש-likesCount לא שלילי
            console.log(`User ${userId} unliked post ${postId}. New likesCount: ${post.likesCount}`);
        } else {
            if (!post.likedBy) {
                post.likedBy = [];
            }
            post.likedBy.push(userId);
            post.likesCount++;
            console.log(`User ${userId} liked post ${postId}. New likesCount: ${post.likesCount}`);
        }

        await post.save(); // שמירת השינויים במסד הנתונים

        console.log(`Post ${postId} updated successfully. New post data: ${JSON.stringify(post)}`); // הוסף לוג כדי לראות את הפוסט לאחר העדכון

        // ודא שאתה שולח את likedBy כראוי
        res.json({ likesCount: post.likesCount, likedBy: post.likedBy || [] });
        console.log(`Post ${postId} updated successfully. Response sent: ${JSON.stringify({ likesCount: post.likesCount, likedBy: post.likedBy || [] })}`); // הוסף לוג כדי לראות את התגובה שנשלחה

    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error liking post: ${error.message}`);
            res.status(500).json({ message: error.message });
        } else {
            console.error(`Error liking post: ${String(error)}`);
            res.status(500).json({ message: "An unknown error occurred." });
        }
    }
}
}

export default new PostsController();