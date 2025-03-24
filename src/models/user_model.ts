import mongoose from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password?: string; // סיסמה אופציונלית
  _id?: string;
  refreshToken?: string[];
  googleId?: string;
  profilePicture?: string;
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false, // סיסמה אופציונלית
  },
  refreshToken: {
    type: [String],
    default: [],
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  profilePicture: {
    type: String,
  },
});

const userModel = mongoose.model<IUser>("Users", userSchema);

export default userModel;