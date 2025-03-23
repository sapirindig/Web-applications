import { Request, Response } from "express";
import userModel from "../models/user_model";
import postModel from "../models/post_model";

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;

        const user = await userModel.findById(userId).select("-password"); // Remove password from response
        if (!user) {
            return res.status(404).send("User not found");
        }

        const posts = await postModel.find({ owner: userId });

        res.status(200).send({ user, posts });
    } catch (err) {
        res.status(400).send(err);
    }
};

export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const { username, profileImage } = req.body;

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { username, profileImage },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send("User not found");
        }

        res.status(200).send(updatedUser);
    } catch (err) {
        res.status(400).send(err);
    }
};

export const getUserPosts = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;

        const posts = await postModel.find({ owner: userId });

        if (!posts || posts.length === 0) {
            return res.status(404).send("Posts not found for this user");
        }

        res.status(200).send(posts);
    } catch (err) {
        res.status(500).send(err);
    }
};