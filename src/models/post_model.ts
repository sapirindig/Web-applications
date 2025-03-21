import mongoose from "mongoose";

export interface IPost {
  title: string;
  content: string;
  owner: string;
  image?: string; // הוספת שדה עבור שם הקובץ של התמונה
}

const postSchema = new mongoose.Schema<IPost>({
  title: {
    type: String,
    required: true,
  },
  content: String,
  owner: {
    type: String,
    required: true,
  },
  image: { // הוספת שדה עבור שם הקובץ של התמונה לסכמה
    type: String,
    default: "",
  },
});

const postModel = mongoose.model<IPost>("Posts", postSchema);

export default postModel;