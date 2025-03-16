import { Request, Response } from "express";
    import userModel from "../models/user_model";
    import postModel from "../models/post_model"; // הנחה שיש לך מודל post

    export const getUserProfile = async (req: Request, res: Response) => {
        try {
            const userId = req.params.id; // קבלת id המשתמש מפרמטרים
            const user = await userModel.findById(userId);
            if (!user) {
                return res.status(404).send("User not found");
            }
            const posts = await postModel.find({ owner: userId }); // קבלת פוסטים של המשתמש
            res.status(200).send({ user, posts });
        } catch (err) {
            res.status(400).send(err);
        }
    };

    export const updateUserProfile = async (req: Request, res: Response) => {
        try {
            const userId = req.params.id;
            const { username, profileImage } = req.body;
    
            console.log("updateUserProfile called");
            console.log("userId:", userId);
            console.log("req.body:", req.body);
    
            const updatedUser = await userModel.findByIdAndUpdate(
                userId,
                { username, profileImage },
                { new: true }
            );
    
            if (!updatedUser) {
                console.log("User not found");
                return res.status(404).send("User not found");
            }
    
            console.log("User updated successfully:", updatedUser);
            res.status(200).send(updatedUser);
        } catch (err) {
            console.error("Error updating user:", err);
            res.status(400).send(err);
        }
    };