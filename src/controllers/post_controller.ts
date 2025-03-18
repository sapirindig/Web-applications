import postModel, { IPost } from "../models/post_model";
import { Request, Response } from "express";
import BaseController from "./base_controller";

class PostsController extends BaseController<IPost> {
    constructor() {
        super(postModel);
    }

    // post_controller.ts
    async create(req: Request, res: Response) {
    const userId = req.params.userId;
    const post = {
        ...req.body,
        owner: userId,
        image: req.file ? req.file.path : undefined // הוספת שדה תמונה
    };
    req.body = post;
    super.create(req, res);
    };
}


export default new PostsController();