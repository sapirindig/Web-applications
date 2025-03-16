import mongoose, { Schema } from "mongoose";

export interface iComment {
    comment: string; // שינוי שם השדה
    postID: Schema.Types.ObjectId; // שינוי סוג השדה
    owner: Schema.Types.ObjectId; // שינוי סוג השדה
}

const commentsSchema = new mongoose.Schema<iComment>({
    comment: { // שינוי שם השדה
        type: String,
        required: true,
    },
    postID: {
        type: Schema.Types.ObjectId, // שינוי סוג השדה
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId, // שינוי סוג השדה
        required: true,
    },
});

const commentsModel = mongoose.model<iComment>("comments", commentsSchema);

export default commentsModel;